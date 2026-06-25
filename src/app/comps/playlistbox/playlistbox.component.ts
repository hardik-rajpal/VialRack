import { Component, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Playlist, PlaylistTrack, ytEmbedUrl, ytMusicPlaylistUrl } from 'src/data/playlists';

@Component({
  selector: 'app-playlistbox',
  templateUrl: './playlistbox.component.html',
  styleUrls: ['./playlistbox.component.css']
})
export class PlaylistboxComponent implements OnChanges {
  @Input() playlist!: Playlist;
  /** captions keyed by videoId — rendered as sticky notes on matching tracks */
  @Input() captions: { [videoId: string]: string } = {};
  /** load the first track's player up front (paused, ready to play) */
  @Input() preselectFirst = false;
  selected: number | null = null;
  /** whether the loaded track should autoplay (true once the visitor picks one) */
  autoplay = false;
  /** live filter over track titles and artist names */
  query = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['playlist']) {
      this.query = '';
      this.autoplay = false;
      this.selected = this.preselectFirst && this.playlist?.tracks?.length ? 0 : null;
    }
  }

  constructor(private host: ElementRef<HTMLElement>) {}

  select(index: number) {
    this.selected = index;
    this.autoplay = true;
  }

  /** play a track by its videoId (e.g. from a clicked phrase) and scroll to it */
  playVideoId(videoId: string) {
    const index = this.playlist.tracks.findIndex((t) => t.videoId === videoId);
    if (index < 0) return;
    this.select(index);
    setTimeout(() =>
      this.host.nativeElement.querySelector('.pbox__player')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    );
  }

  /** tracks matching the search, paired with their original index */
  get visibleTracks(): { track: PlaylistTrack; index: number }[] {
    const all = this.playlist.tracks.map((track, index) => ({ track, index }));
    const q = this.query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(({ track }) =>
      track.title.toLowerCase().includes(q) ||
      (track.artists || '').toLowerCase().includes(q)
    );
  }

  get current(): PlaylistTrack | null {
    return this.selected !== null ? this.playlist.tracks[this.selected] ?? null : null;
  }

  embedUrl(): string {
    return this.current ? ytEmbedUrl(this.current.videoId, this.autoplay) : '';
  }

  get ytmUrl(): string {
    return ytMusicPlaylistUrl(this.playlist);
  }
}
