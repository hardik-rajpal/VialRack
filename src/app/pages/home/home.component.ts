import { Component } from '@angular/core';

interface ShelfItem {
  label: string;
  link: string;
  cover: string;
  note?: string;
  plaqueType?: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  shelves: ShelfItem[][] = [
    [
      { label: 'Thought Board', link: 'thoughts', cover: '#6F7E5F', note: 'ideas, half-formed' },
      { label: 'Quotes I Love', link: 'https://pin.it/tR6kmR6', cover: '#A8693E', note: 'borrowed, lovingly' },
      { label: 'JSON Viewer', link: 'jsonVisualizer', cover: '#5E7385', note: 'a weekend hack' },
    ],
    [
      {
        label: 'Resumes',
        link: 'https://drive.google.com/drive/folders/1aXa8OeyJdZtKsgvJAJaCou0EZM4E4M2P?usp=share_link',
        cover: '#8C4A3C', note: 'kept current', plaqueType: 2,
      },
      { label: 'Writeups', link: 'blog', cover: '#43403A', note: 'longer thoughts' },
      { label: 'In Praise Of', link: 'inpraiseof/songs', cover: '#B08A3C', note: 'songs, films & co.' },
    ],
  ];
}
