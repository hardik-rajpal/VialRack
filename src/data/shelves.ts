export interface ShelfItem {
  label: string;
  link: string;       // internal route or external URL
  cover: string;      // cloth-cover colour
  note?: string;      // handwritten margin note
  plaqueType?: number;
  kind?: 'book' | 'records';
}

/** the shelves on the home page, top row to bottom */
export const homeShelves: ShelfItem[][] = [
  [
    { label: 'Quotes I Love', link: 'https://pin.it/tR6kmR6', cover: '#A8693E', note: 'borrowed, lovingly' },
    { label: 'Collected Literary Works', link: 'literature', cover: '#5E7385', note: 'poems & such' },
  ],
  [
    { label: 'Writeups', link: 'blog', cover: '#43403A', note: 'longer thoughts' },
    { label: 'Records', link: 'records', cover: '#B08A3C', note: 'give it a spin', kind: 'records' },
  ],
];

export const homeContent = {
  eyebrow: 'Pull something off the shelf.',
  tag: 'still under construction — mind the sawdust',
};
