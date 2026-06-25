import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GitdbService } from 'src/app/services/gitdb.service';
import { PlaylistsService } from 'src/app/services/playlists.service';
import { Playlist, ytMusicPlaylistUrl, sleeveColours } from 'src/data/playlists';
import { Album, ArtistEntry, recordsContent, songDataSpec, songSpec } from 'src/data/records';

@Component({
  selector: 'app-records-page',
  templateUrl: './records-page.component.html',
  styleUrls: ['./records-page.component.css']
})
export class RecordsPageComponent implements OnDestroy {
  data: songDataSpec | null = null;
  topPicks: songSpec[] = [];
  /** albums I like, loaded from assets/albums.json */
  albums: Album[] = [];
  /** every artist with songs and/or a playlist */
  artists: ArtistEntry[] = [];
  /** index into artists, or null for the collection overview */
  selectedArtist: number | null = null;

  /** page copy, kept in src/data so content lives outside the component */
  content = recordsContent;

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
    private playlistsSvc: PlaylistsService,
    private router: Router
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

    this.gitdb.getAlbums().subscribe({
      next: (data: any) => {
        this.albums = (data?.albums ?? []) as Album[];
      },
      error: () => {},
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

    // most-stocked records first
    this.artists = order.sort((a, b) => this.trackCount(b) - this.trackCount(a));
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
    return sleeveColours[index % sleeveColours.length];
  }

  /** href fallback for the artist tiles (so middle-click / no-JS still works) */
  artistHref(index: number): string {
    return '?artist=' + index;
  }

  /** an artist record cover: gatefold-open, then open the artist's page. */
  openArtist(event: MouseEvent, index: number, artist: ArtistEntry) {
    if (this.modifiedClick(event)) return;   // let the browser handle new-tab etc.
    event.preventDefault();
    const sleeve = this.sleeveFrom(event);
    const go = () => this.router.navigate([], { relativeTo: this.route, queryParams: { artist: index } });
    if (!sleeve || this.prefersReducedMotion()) { go(); return; }
    const cover = this.buildCover({ color: this.coverFor(index), initial: artist.title.charAt(0) });
    this.openSleeve(sleeve, cover, (overlay) => {
      go().then(() => this.fadeRemove(overlay)).catch(() => overlay.remove());
    });
  }

  /** an album cover: gatefold-open, then open the album (same tab). */
  openAlbum(event: MouseEvent, album: Album, index: number) {
    if (this.modifiedClick(event)) return;   // ctrl / middle click still opens a new tab
    event.preventDefault();
    const sleeve = this.sleeveFrom(event);
    const go = () => { window.location.href = album.link; };
    if (!sleeve || this.prefersReducedMotion()) { go(); return; }
    const cover = album.cover
      ? this.buildCover({ coverUrl: album.cover })
      : this.buildCover({ color: this.coverFor(index), initial: album.title.charAt(0) });
    this.openSleeve(sleeve, cover, () => window.setTimeout(go, 80));
  }

  private modifiedClick(e: MouseEvent): boolean {
    return e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
  }

  private sleeveFrom(event: MouseEvent): HTMLElement | null {
    const host = event.currentTarget as HTMLElement | null;
    return host?.querySelector('.artist__sleeve') as HTMLElement | null;
  }

  /** the swinging front cover — either album art or a coloured sleeve + initial */
  private buildCover(opts: { coverUrl?: string; color?: string; initial?: string }): HTMLElement {
    const el = document.createElement('div');
    el.className = 'album-open-cover';
    if (opts.color) el.style.setProperty('--cover', opts.color);
    if (opts.coverUrl) {
      const img = document.createElement('img');
      img.src = opts.coverUrl;
      img.alt = '';
      el.appendChild(img);
    } else if (opts.initial) {
      const span = document.createElement('span');
      span.className = 'album-open-initial';
      span.textContent = opts.initial;
      el.appendChild(span);
    }
    return el;
  }

  /** Build the open-into overlay over a sleeve: the cover swings open on its
      spine to reveal a spinning vinyl, then the sleeve grows to fill the screen.
      onPeak fires once it's full-screen (caller navigates / opens from there). */
  private openSleeve(sleeveEl: HTMLElement, coverEl: HTMLElement, onPeak: (overlay: HTMLElement) => void) {
    const rect = sleeveEl.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const overlay = document.createElement('div');
    overlay.className = 'book-open-overlay';

    const wrap = document.createElement('div');
    wrap.className = 'album-open-wrap';
    wrap.style.left = rect.left + 'px';
    wrap.style.top = rect.top + 'px';
    wrap.style.width = rect.width + 'px';
    wrap.style.height = rect.height + 'px';

    const inner = document.createElement('div');
    inner.className = 'album-open-inner';
    const disc = document.createElement('div');
    disc.className = 'album-open-disc';
    inner.appendChild(disc);

    wrap.appendChild(inner);
    wrap.appendChild(coverEl);
    overlay.appendChild(wrap);
    document.body.appendChild(overlay);

    const scale = Math.max(vw / rect.width, vh / rect.height) * 1.08;
    const dx = vw / 2 - (rect.left + rect.width / 2);
    const dy = vh / 2 - (rect.top + rect.height / 2);

    coverEl.animate(
      [{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(-118deg)' }],
      { duration: 520, easing: 'cubic-bezier(0.4, 0.05, 0.2, 1)', fill: 'forwards' }
    );
    disc.animate(
      [{ transform: 'rotate(0deg) scale(0.96)' }, { transform: 'rotate(150deg) scale(1)' }],
      { duration: 820, easing: 'cubic-bezier(0.3, 0.5, 0.3, 1)', fill: 'forwards' }
    );
    const grow = wrap.animate(
      [
        { transform: 'translate(0px, 0px) scale(1)' },
        { transform: `translate(${dx}px, ${dy}px) scale(${scale})` },
      ],
      { duration: 700, delay: 140, easing: 'cubic-bezier(0.5, 0, 0.2, 1)', fill: 'forwards' }
    );
    grow.onfinish = () => onPeak(overlay);
  }

  private fadeRemove(overlay: HTMLElement) {
    const fade = overlay.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 320, easing: 'ease', fill: 'forwards' }
    );
    fade.onfinish = () => overlay.remove();
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
