import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlaylistsService } from 'src/app/services/playlists.service';
import { Playlist, ytMusicPlaylistUrl } from 'src/data/playlists';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent {
  playlists: Playlist[] = [];
  loaded = false;
  /** index into playlists, or null for the overview grid */
  selected: number | null = null;

  private readonly covers = ['#6F7E5F', '#A8693E', '#5E7385', '#8C4A3C', '#B08A3C', '#4E5D6B', '#7A5A6B'];

  constructor(private svc: PlaylistsService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const v = params['pl'];
      this.selected = v !== undefined && v !== '' && !isNaN(+v) ? +v : null;
    });
    this.svc.getAll().subscribe((pls) => {
      this.playlists = pls;
      this.loaded = true;
    });
  }

  get current(): Playlist | null {
    return this.selected !== null ? this.playlists[this.selected] ?? null : null;
  }

  coverFor(index: number): string {
    return this.covers[index % this.covers.length];
  }

  artistLabel(p: Playlist): string {
    return p.artists.join(', ');
  }

  ytmUrl(p: Playlist): string {
    return ytMusicPlaylistUrl(p);
  }
}
