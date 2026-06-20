import { Component } from '@angular/core';
import { MediumService } from 'src/app/services/medium.service';
import { GitdbService } from 'src/app/services/gitdb.service';
import { PlaylistsService } from 'src/app/services/playlists.service';

interface ShelfItem {
  label: string;
  link: string;
  cover: string;
  note?: string;
  plaqueType?: number;
  kind?: 'book' | 'records';
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  shelves: ShelfItem[][] = [
    [
      { label: 'Quotes I Love', link: 'https://pin.it/tR6kmR6', cover: '#A8693E', note: 'borrowed, lovingly' },
      { label: 'Collected Literary Works', link: 'literature', cover: '#5E7385', note: 'poems & such' },
    ],
    [
      { label: 'Writeups', link: 'blog', cover: '#43403A', note: 'longer thoughts' },
      { label: 'Records', link: 'records', cover: '#B08A3C', note: 'give it a spin', kind: 'records' },
    ],
  ];

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
