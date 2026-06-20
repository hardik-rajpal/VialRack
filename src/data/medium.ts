export interface MediumStory {
  title: string;
  link: string;
  date: string;       // pretty, e.g. "01 May 2026"
  dateISO: string;
  tags: string[];
  image: string;      // cover image url ('' if none)
  snippet: string;
  readingMins: number;
}

export interface MediumFeed {
  profile: string;
  stories: MediumStory[];
}
