import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GitdbService } from 'src/app/services/gitdb.service';
import { PlaylistsService } from 'src/app/services/playlists.service';
import { Playlist, ytMusicPlaylistUrl } from 'src/data/playlists';

export interface songDataSpec {
  carousel: number[];
  groups: groupSpec[]; // each group = an artist: title => song ids
  songs: songSpec[];
}
export interface groupSpec {
  title: string;
  text: string;
  songs: number[];
}
export interface songSpec {
  id: number;
  link: string;
  title: string;
  text: string;
}

/** An artist on the shelf: songs (from songs.json) and/or playlists (from ytm.json). */
export interface ArtistEntry {
  title: string;
  songs: number[];          // indexes into data.songs (may be empty)
  text?: string;
  playlists: Playlist[];
}

@Component({
  selector: 'app-in-praise-of-songs-page',
  templateUrl: './in-praise-of-songs-page.component.html',
  styleUrls: ['./in-praise-of-songs-page.component.css']
})
export class InPraiseOfSongsPageComponent implements OnDestroy {
  data: songDataSpec | null = null;
  topPicks: songSpec[] = [];
  /** every artist with songs and/or a playlist */
  artists: ArtistEntry[] = [];
  /** index into artists, or null for the collection overview */
  selectedArtist: number | null = null;

  /** album-sleeve colours, cycled by artist index */
  private readonly covers = ['#6F7E5F', '#A8693E', '#5E7385', '#8C4A3C', '#B08A3C', '#4E5D6B', '#7A5A6B'];

  /** auto-scroll for the Top picks carousel */
  private autoTimer: ReturnType<typeof setInterval> | null = null;
  picksPaused = false;
  private readonly autoDelayMs = 3500;

  allPlaylists: Playlist[] = [];
  private songsLoaded = false;
  private playlistsLoaded = false;

  @ViewChild('pickTrack') pickTrack?: ElementRef<HTMLElement>;

  constructor(
    private gitdb: GitdbService,
    private route: ActivatedRoute,
    private playlistsSvc: PlaylistsService
  ) {}

  get loaded(): boolean {
    return this.songsLoaded && this.playlistsLoaded;
  }

  base64ToText(base64: string): string {
    const binaryString = atob(base64);
    return new TextDecoder('utf-8').decode(
      new Uint8Array(binaryString.length).map((_, i) => binaryString.charCodeAt(i))
    );
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const a = params['artist'];
      this.selectedArtist = a !== undefined && a !== '' && !isNaN(+a) ? +a : null;
    });

    this.playlistsSvc.getAll().subscribe({
      next: (pls) => {
        this.allPlaylists = pls;
        this.playlistsLoaded = true;
        this.buildArtists();
      },
      error: () => {
        this.playlistsLoaded = true;
        this.buildArtists();
      },
    });

    this.gitdb.getVialRackSongs().subscribe({
      next: (data: any) => {
        const jsondata = this.base64ToText(data['content']);
        const tempData: songDataSpec = JSON.parse(jsondata);
        for (const song of tempData.songs) {
          const parts = song.link.split('/');
          const identifier = parts[parts.length - 1];
          song.link = `https://www.youtube.com/embed/${identifier}`;
        }
        this.data = tempData;
        this.buildTopPicks();
        this.songsLoaded = true;
        this.buildArtists();
        this.startAutoScroll();
      },
      error: () => {
        this.songsLoaded = true;
        this.buildArtists();
      },
    });
  }

  ngOnDestroy() {
    this.stopAutoScroll();
  }

  /** Union of songs.json artists and ytm.json playlist artists, matched by name. */
  private buildArtists() {
    if (!this.loaded) return;
    const byName = new Map<string, ArtistEntry>();
    const order: ArtistEntry[] = [];
    const key = (s: string) => s.trim().toLowerCase();

    if (this.data) {
      for (const g of this.data.groups) {
        const entry: ArtistEntry = { title: g.title, songs: g.songs, text: g.text, playlists: [] };
        byName.set(key(g.title), entry);
        order.push(entry);
      }
    }

    for (const p of this.allPlaylists) {
      // attach to an existing artist if any credited name matches
      let target = p.artists.map(key).map((k) => byName.get(k)).find(Boolean);
      if (!target) {
        const primary = p.name || p.artists[0] || p.playlist;
        target = { title: primary, songs: [], playlists: [] };
        order.push(target);
        // register every credited spelling so later playlists merge here
        for (const name of p.artists) byName.set(key(name), target);
      }
      target.playlists.push(p);
    }

    this.artists = order;
  }

  private prefersReducedMotion(): boolean {
    return typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private startAutoScroll() {
    this.stopAutoScroll();
    if (this.topPicks.length < 2 || this.prefersReducedMotion()) return;
    this.autoTimer = setInterval(() => this.autoAdvance(), this.autoDelayMs);
  }

  private stopAutoScroll() {
    if (this.autoTimer) {
      clearInterval(this.autoTimer);
      this.autoTimer = null;
    }
  }

  private autoAdvance() {
    const el = this.pickTrack?.nativeElement;
    if (!el || this.picksPaused) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (el.scrollLeft >= maxScroll - 4) {
      el.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      this.scrollPicks(1);
    }
  }

  /** pause while the visitor is interacting with the carousel */
  setPicksPaused(paused: boolean) {
    this.picksPaused = paused;
  }

  private buildTopPicks() {
    if (!this.data) return;
    const ids = this.data.carousel && this.data.carousel.length
      ? this.data.carousel
      : this.data.groups.flatMap((g) => g.songs.slice(0, 2));
    this.topPicks = ids.map((i) => this.data!.songs[i]).filter(Boolean);
  }

  get currentArtist(): ArtistEntry | null {
    return this.selectedArtist !== null ? this.artists[this.selectedArtist] ?? null : null;
  }

  artistSongs(artist: ArtistEntry): songSpec[] {
    if (!this.data) return [];
    return artist.songs.map((i) => this.data!.songs[i]).filter(Boolean);
  }

  /** an artist's track count = their playlist size (fall back to songbox songs). */
  trackCount(artist: ArtistEntry): number {
    const inPlaylists = artist.playlists.reduce((sum, p) => sum + p.trackCount, 0);
    return inPlaylists || artist.songs.length;
  }

  private videoId(link: string): string {
    const m = link.match(/embed\/([^?&/]+)/);
    return m ? m[1] : '';
  }

  /** captions I've written, keyed by videoId, for the current artist's songs */
  artistCaptions(artist: ArtistEntry): { [videoId: string]: string } {
    const out: { [videoId: string]: string } = {};
    if (!this.data) return out;
    for (const i of artist.songs) {
      const song = this.data.songs[i];
      if (song && song.text) {
        const id = this.videoId(song.link);
        if (id) out[id] = song.text;
      }
    }
    return out;
  }

  coverFor(index: number): string {
    return this.covers[index % this.covers.length];
  }

  get artistPlaylists(): Playlist[] {
    return this.currentArtist?.playlists ?? [];
  }

  ytmUrl(p: Playlist): string {
    return ytMusicPlaylistUrl(p);
  }

  scrollPicks(direction: number) {
    const el = this.pickTrack?.nativeElement;
    if (el) {
      el.scrollBy({ left: direction * Math.min(el.clientWidth * 0.85, 360), behavior: 'smooth' });
    }
  }
}
