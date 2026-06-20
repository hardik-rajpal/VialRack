import { Component, Input } from '@angular/core';
import { Playlist, PlaylistTrack, ytEmbedUrl, ytMusicPlaylistUrl } from 'src/data/playlists';

@Component({
  selector: 'app-playlistbox',
  templateUrl: './playlistbox.component.html',
  styleUrls: ['./playlistbox.component.css']
})
export class PlaylistboxComponent {
  @Input() playlist!: Playlist;
  /** captions keyed by videoId — rendered as sticky notes on matching tracks */
  @Input() captions: { [videoId: string]: string } = {};
  selected: number | null = null;

  select(index: number) {
    this.selected = index;
  }

  get current(): PlaylistTrack | null {
    return this.selected !== null ? this.playlist.tracks[this.selected] ?? null : null;
  }

  embedUrl(): string {
    return this.current ? ytEmbedUrl(this.current.videoId, true) : '';
  }

  get ytmUrl(): string {
    return ytMusicPlaylistUrl(this.playlist);
  }
}
