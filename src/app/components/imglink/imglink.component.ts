import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-imglink',
  templateUrl: './imglink.component.html',
  styleUrls: ['./imglink.component.css']
})
export class ImglinkComponent {
  /** destination — internal route or external URL (http...) */
  @Input() link: string = '';
  /** cloth-cover colour for this object */
  @Input() cover: string = '#6F7E5F';
  /** the engraved plaque label */
  @Input() label: string = '';
  /** 1 = standard plaque, 2 = larger uppercase plaque */
  @Input() plaqueType: number = 1;
  /** optional handwritten margin note */
  @Input() note: string = '';
  @Input() newTab: boolean = true;

  get initial(): string {
    return (this.label || '?').trim().charAt(0).toUpperCase();
  }
  get isExternal(): boolean {
    return /^https?:\/\//.test(this.link);
  }
}
