import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routeSlide } from './route-animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [routeSlide],
})
export class AppComponent {
  reduceMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** a per-route key so the slide trigger fires on real route changes
      (not on query-param changes like flipping between artists) */
  prepareRoute(outlet: RouterOutlet): string {
    return outlet?.isActivated ? outlet.activatedRoute.snapshot.url.join('/') : '';
  }
}
