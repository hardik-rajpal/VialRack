import { Component } from '@angular/core';
import { MediumService } from 'src/app/services/medium.service';
import { GitdbService } from 'src/app/services/gitdb.service';
import { PlaylistsService } from 'src/app/services/playlists.service';
import { homeContent, homeShelves } from 'src/data/shelves';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  shelves = homeShelves;
  content = homeContent;

  constructor(
    private medium: MediumService,
    private gitdb: GitdbService,
    private playlists: PlaylistsService,
  ) {
    // warm the feeds so the linked pages open instantly (and so the records
    // page's tiles exist immediately for the spill-and-land transition)
    this.medium.getFeed().subscribe({ error: () => {} });
    this.gitdb.getVialRackSongs().subscribe({ error: () => {} });
    this.playlists.getAll().subscribe({ error: () => {} });
    this.gitdb.getLiterature().subscribe({ error: () => {} });
  }
}
