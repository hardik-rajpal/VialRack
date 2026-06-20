import { Component, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';

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
  /** 'book' = clothbound cover, 'records' = a little crate of albums */
  @Input() kind: 'book' | 'records' = 'book';
  /** position on the shelf (kept for ordering; no longer animated on load) */
  @Input() index: number = 0;
  @Input() newTab: boolean = true;

  constructor(private router: Router, private host: ElementRef<HTMLElement>) {}

  get initial(): string {
    return (this.label || '?').trim().charAt(0).toUpperCase();
  }
  get isExternal(): boolean {
    return /^https?:\/\//.test(this.link);
  }
  get href(): string {
    return this.isExternal ? this.link : '/' + this.link.replace(/^\//, '');
  }

  onCardClick(event: MouseEvent) {
    // let the browser handle new-tab / modified clicks
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    if (this.kind === 'book' && !this.prefersReducedMotion()) {
      this.openIntoPage();
    } else {
      this.router.navigate([this.link]);
    }
  }

  private prefersReducedMotion(): boolean {
    return typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /** Open the clicked book and let it grow until its page fills the screen,
      then navigate — so the new page reads as coming from inside the book. */
  private openIntoPage() {
    const coverEl = this.host.nativeElement.querySelector('.card__cover') as HTMLElement | null;
    if (!coverEl) {
      this.router.navigate([this.link]);
      return;
    }
    const rect = coverEl.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const overlay = document.createElement('div');
    overlay.className = 'book-open-overlay';

    const wrap = document.createElement('div');
    wrap.className = 'book-open-wrap';
    wrap.style.left = rect.left + 'px';
    wrap.style.top = rect.top + 'px';
    wrap.style.width = rect.width + 'px';
    wrap.style.height = rect.height + 'px';

    const page = document.createElement('div');
    page.className = 'book-open-page';

    const cover = document.createElement('div');
    cover.className = 'book-open-cover';
    cover.style.setProperty('--cover', this.cover);
    cover.innerHTML = `<span class="book-open-initial">${this.initial}</span>`;

    wrap.appendChild(page);
    wrap.appendChild(cover);
    overlay.appendChild(wrap);
    document.body.appendChild(overlay);

    const scale = Math.max(vw / rect.width, vh / rect.height) * 1.08;
    const dx = vw / 2 - (rect.left + rect.width / 2);
    const dy = vh / 2 - (rect.top + rect.height / 2);

    cover.animate(
      [{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(-122deg)' }],
      { duration: 480, easing: 'cubic-bezier(0.4, 0.05, 0.2, 1)', fill: 'forwards' }
    );

    const grow = wrap.animate(
      [
        { transform: 'translate(0px, 0px) scale(1)' },
        { transform: `translate(${dx}px, ${dy}px) scale(${scale})` },
      ],
      { duration: 720, delay: 90, easing: 'cubic-bezier(0.5, 0, 0.2, 1)', fill: 'forwards' }
    );

    const cleanup = () => overlay.remove();
    grow.onfinish = () => {
      this.router.navigate([this.link]).then(() => {
        const fade = overlay.animate(
          [{ opacity: 1 }, { opacity: 0 }],
          { duration: 320, easing: 'ease', fill: 'forwards' }
        );
        fade.onfinish = cleanup;
      }).catch(cleanup);
    };
  }
}
