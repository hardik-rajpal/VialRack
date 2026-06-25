import { Playlist, PlaylistTrack } from "./playlists";

// ---- data shapes for the record collection (songs.json + albums.json) ----

export interface songDataSpec {
  carousel: number[];
  groups: groupSpec[]; // each group = an artist: title => song ids
  songs: songSpec[];
}
export interface groupSpec {
  title: string;
  text: string;
  songs: number[];
}
export interface songSpec {
  id: number;
  link: string;
  title: string;
  text: string;
}

/** A liked album on the shelf — opens its own page with the embedded YTM list. */
export interface Album {
  title: string;
  artist: string;
  link: string;
  cover?: string;   // album-art URL
  listId?: string;  // YouTube "OLAK5uy…" playlist id (the album's YTM link / fallback embed)
  note?: string;
  tracks?: PlaylistTrack[];   // the album's songs, for our own playable list
}

/** An artist on the shelf: songs (from songs.json) and/or playlists (from ytm.json). */
export interface ArtistEntry {
  title: string;
  songs: number[];          // indexes into data.songs (may be empty)
  text?: string;
  playlists: Playlist[];
}

// ---- copy shown on the records page ----

export const recordsContent = {
  title: 'My record collection',
  sub: 'A shelf of songs I keep coming back to.',
  backlink: '← My record collection',
  ytmLink: 'Open in YouTube Music ↗',
  loading: 'Pulling records off the shelf…',
  crateHint: 'flip through →',
  sections: {
    artists: 'Artists',
    albums: 'Albums',
    topPicks: 'Top picks',
  },
};
