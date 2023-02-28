import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-plaque',
  templateUrl: './plaque.component.html',
  styleUrls: ['./plaque.component.css']
})
export class PlaqueComponent {
  @Input() plaqueType=1;
  @Input() label:string = '';
}
