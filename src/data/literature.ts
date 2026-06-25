export interface LiteraryWork {
  title: string;
  author: string;
  link: string;
  note?: string;
}

export interface LiteratureFeed {
  works: LiteraryWork[];
}
