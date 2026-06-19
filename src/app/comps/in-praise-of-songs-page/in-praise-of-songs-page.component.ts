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

@Component({
  selector: 'app-in-praise-of-songs-page',
  templateUrl: './in-praise-of-songs-page.component.html',
  styleUrls: ['./in-praise-of-songs-page.component.css']
})
export class InPraiseOfSongsPageComponent implements OnDestroy {
  data: songDataSpec | null = null;
  topPicks: songSpec[] = [];
  /** index into data.groups, or null for the collection overview */
  selectedArtist: number | null = null;

  /** album-sleeve colours, cycled by artist index */
  private readonly covers = ['#6F7E5F', '#A8693E', '#5E7385', '#8C4A3C', '#B08A3C', '#4E5D6B', '#7A5A6B'];

  /** auto-scroll for the Top picks carousel */
  private autoTimer: ReturnType<typeof setInterval> | null = null;
  picksPaused = false;
  private readonly autoDelayMs = 3500;

  allPlaylists: Playlist[] = [];

  @ViewChild('pickTrack') pickTrack?: ElementRef<HTMLElement>;

  constructor(
    private gitdb: GitdbService,
    private route: ActivatedRoute,
    private playlistsSvc: PlaylistsService
  ) {}

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

    this.playlistsSvc.getAll().subscribe((pls) => (this.allPlaylists = pls));

    this.gitdb.getVialRackSongs().subscribe((data: any) => {
      const jsondata = this.base64ToText(data['content']);
      const tempData: songDataSpec = JSON.parse(jsondata);
      for (const song of tempData.songs) {
        const parts = song.link.split('/');
        const identifier = parts[parts.length - 1];
        song.link = `https://www.youtube.com/embed/${identifier}`;
      }
      this.data = tempData;
      this.buildTopPicks();
      this.startAutoScroll();
    });
  }

  ngOnDestroy() {
    this.stopAutoScroll();
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

  get currentArtist(): groupSpec | null {
    if (this.data && this.selectedArtist !== null) {
      return this.data.groups[this.selectedArtist] ?? null;
    }
    return null;
  }

  artistSongs(group: groupSpec): songSpec[] {
    if (!this.data) return [];
    return group.songs.map((i) => this.data!.songs[i]).filter(Boolean);
  }

  coverFor(index: number): string {
    return this.covers[index % this.covers.length];
  }

  /** playlists collecting the currently-viewed artist */
  get artistPlaylists(): Playlist[] {
    const artist = this.currentArtist;
    if (!artist) return [];
    const name = artist.title.trim().toLowerCase();
    return this.allPlaylists.filter((p) =>
      p.artists.some((a) => a.trim().toLowerCase() === name)
    );
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
