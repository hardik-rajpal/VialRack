import { Component } from '@angular/core';
import { MediumService } from 'src/app/services/medium.service';

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
      { label: 'Literary Works', link: 'literature', cover: '#5E7385', note: 'poems & such' },
    ],
    [
      { label: 'Writeups', link: 'blog', cover: '#43403A', note: 'longer thoughts' },
      { label: 'Records', link: 'inpraiseof/songs', cover: '#B08A3C', note: 'give it a spin', kind: 'records' },
    ],
  ];

  constructor(private medium: MediumService) {
    // warm the writeups feed so opening that page is instant
    this.medium.getFeed().subscribe({ error: () => {} });
  }
}
