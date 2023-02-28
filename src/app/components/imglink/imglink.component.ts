import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-imglink',
  templateUrl: './imglink.component.html',
  styleUrls: ['./imglink.component.css']
})
export class ImglinkComponent {
  @Input() src:string = '';
  @Input() link:string = '';
  @Input() newTab:boolean = true;
  @Input() external:boolean = false;
  
}
