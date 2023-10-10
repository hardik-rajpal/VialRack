import { Component, Input } from '@angular/core';
import { songSpec } from '../in-praise-of-songs-page/in-praise-of-songs-page.component';

@Component({
  selector: 'app-songbox',
  templateUrl: './songbox.component.html',
  styleUrls: ['./songbox.component.css']
})
export class SongboxComponent {
  @Input() song!:songSpec;
}
