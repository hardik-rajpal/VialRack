import { Component, Input } from '@angular/core';
import { songSpec } from 'src/data/records';

@Component({
  selector: 'app-songbox',
  templateUrl: './songbox.component.html',
  styleUrls: ['./songbox.component.css']
})
export class SongboxComponent {
  @Input() song!:songSpec;
}
