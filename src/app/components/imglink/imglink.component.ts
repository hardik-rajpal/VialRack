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
    if (this.prefersReducedMotion()) {
      this.router.navigate([this.link]);
    } else if (this.kind === 'book') {
      this.openIntoPage();
    } else if (this.kind === 'records') {
      this.spillRecords();
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

  /** Send the record box to the top-left, navigate, then let the records
      tumble out of it and land exactly onto the records-page tiles (matched
      clones, so size / position / letter all line up). */
  private spillRecords() {
    const crateEl = this.host.nativeElement.querySelector('.crate') as HTMLElement | null;
    if (!crateEl) {
      this.router.navigate([this.link]);
      return;
    }
    const boxRect = crateEl.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // hide the destination tiles from their very first paint (CSS, so there's
    // no flash of the finished shelf before the records tumble in)
    document.body.classList.add('records-arriving');

    const overlay = document.createElement('div');
    overlay.className = 'book-open-overlay';

    const boxClone = crateEl.cloneNode(true) as HTMLElement;
    Object.assign(boxClone.style, {
      position: 'fixed', margin: '0', zIndex: '30',
      left: boxRect.left + 'px', top: boxRect.top + 'px',
      width: boxRect.width + 'px', height: boxRect.height + 'px',
      transformOrigin: 'center bottom',
    });
    overlay.appendChild(boxClone);
    document.body.appendChild(overlay);

    // the box is a fixed clone, so scrolling the page up underneath it doesn't
    // move it — but it brings the (top-of-page) records into view to land on
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Phase A — the box travels up to the top-left, then tilts to pour
    const stageX = Math.max(vw * 0.08, 48);
    const stageY = Math.max(vh * 0.14, 60);
    const dx = stageX - boxRect.left;
    const dy = stageY - boxRect.top;
    const boxTravel = boxClone.animate(
      [
        { transform: 'translate(0,0) rotate(0deg)' },
        { transform: `translate(${dx}px, ${dy}px) rotate(0deg)`, offset: 0.75, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
        { transform: `translate(${dx}px, ${dy}px) rotate(20deg)` },
      ],
      { duration: 640, easing: 'linear', fill: 'forwards' }
    );

    // where the records pour from (the tipped box's mouth)
    const mouthX = stageX + boxRect.width * 0.55;
    const mouthY = stageY + boxRect.height * 0.30;

    const cleanup = () => {
      document.body.classList.remove('records-arriving');
      overlay.remove();
    };

    this.router.navigate([this.link]).then(async () => {
      window.scrollTo(0, 0);   // records crate sits at the top — land them there
      const tiles = await this.waitForArtistTiles(1600);
      const visible = tiles.filter((t) => {
        const r = t.getBoundingClientRect();
        return r.width > 4 && r.right > 0 && r.left < vw && r.bottom > 0 && r.top < vh;
      }).slice(0, 16);

      if (!visible.length) {
        overlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' }).onfinish = cleanup;
        return;
      }

      // tiles are already hidden by the body class; just remember their rects
      const targets = visible.map((tile) => ({ tile, rect: tile.getBoundingClientRect() }));

      await boxTravel.finished.catch(() => {});

      const recDuration = 680;
      const recStagger = 85;
      targets.forEach(({ tile, rect }, i) => {
        const clone = tile.cloneNode(true) as HTMLElement;
        Object.assign(clone.style, {
          position: 'fixed', margin: '0', visibility: 'visible', zIndex: String(20 + i),
          left: rect.left + 'px', top: rect.top + 'px',
          width: rect.width + 'px', height: rect.height + 'px',
        });
        overlay.appendChild(clone);

        // start at the box mouth (small), arc up, tumble, land on the real tile
        const sx = mouthX - (rect.left + rect.width / 2);
        const sy = mouthY - (rect.top + rect.height / 2);
        const spin = (i % 2 ? 1 : -1) * (200 + i * 28);
        clone.animate(
          [
            { transform: `translate(${sx}px, ${sy}px) scale(0.4) rotate(0deg)`, offset: 0, easing: 'cubic-bezier(0.2, 0.6, 0.4, 1)' },
            { transform: `translate(${sx * 0.34}px, ${sy * 0.4 - 46}px) scale(0.72) rotate(${spin * 0.6}deg)`, offset: 0.45, easing: 'cubic-bezier(0.5, 0, 0.6, 0.5)' },
            { transform: 'translate(0,0) scale(1) rotate(0deg)', offset: 1 },
          ],
          { duration: recDuration, delay: i * recStagger, easing: 'linear', fill: 'both' }
        ).onfinish = () => {
          tile.style.visibility = 'visible';   // reveal the real tile (overrides the body-class rule)
          clone.remove();
        };
      });

      const total = (targets.length - 1) * recStagger + recDuration;
      boxClone.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 280, delay: Math.max(0, total - 420), fill: 'forwards' });
      window.setTimeout(() => {
        targets.forEach(({ tile }) => (tile.style.visibility = ''));
        cleanup();
      }, total + 150);
    }).catch(cleanup);
  }

  /** Poll for the records-page artist tiles to be rendered and laid out. */
  private waitForArtistTiles(maxMs: number): Promise<HTMLElement[]> {
    return new Promise((resolve) => {
      const start = performance.now();
      const tick = () => {
        const tiles = Array.from(
          document.querySelectorAll('.crate__bin .artist .artist__sleeve')
        ) as HTMLElement[];
        const ready = tiles.filter((t) => t.getBoundingClientRect().width > 4);
        if (ready.length) { resolve(ready); return; }
        if (performance.now() - start > maxMs) { resolve([]); return; }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }
}
