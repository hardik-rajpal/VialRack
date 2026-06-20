import { animate, group, query, style, transition, trigger } from '@angular/animations';

/* On navigation the leaving page slides off to the left while the entering
   page fades in from the right (its own on-load animations — e.g. records
   spilling onto the shelf — play as it arrives). */
export const routeSlide = trigger('routeSlide', [
  transition('* <=> *', [
    query(':enter, :leave', [
      style({ position: 'absolute', top: 0, left: 0, width: '100%' }),
    ], { optional: true }),
    query(':enter', [
      style({ opacity: 0, transform: 'translateX(7%)' }),
    ], { optional: true }),
    group([
      query(':leave', [
        animate('430ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 0, transform: 'translateX(-100%)' })),
      ], { optional: true }),
      query(':enter', [
        animate('500ms 100ms cubic-bezier(0.2, 0.8, 0.3, 1)',
          style({ opacity: 1, transform: 'translateX(0)' })),
      ], { optional: true }),
    ]),
  ]),
]);
