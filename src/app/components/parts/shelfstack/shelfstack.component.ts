import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shelfstack',
  templateUrl: './shelfstack.component.html',
  styleUrls: ['./shelfstack.component.css']
})
export class ShelfstackComponent {
  @Input() width:number=100;
}
