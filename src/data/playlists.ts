export interface PlaylistTrack {
  videoId: string;
  title: string;
  artists: string;
  album: string;
  duration: string;
  thumbnail: string;
}

export interface Playlist {
  playlist: string;       // playlist title on YT Music
  name?: string;          // friendly display name (overrides the artist label)
  artists: string[];      // artist names this playlist collects
  playlistId: string;
  trackCount: number;
  thumbnail: string;
  tracks: PlaylistTrack[];
}

/** music.youtube.com link for a playlist. */
export function ytMusicPlaylistUrl(p: Playlist): string {
  return `https://music.youtube.com/playlist?list=${p.playlistId}`;
}

/** embeddable single-track player URL. */
export function ytEmbedUrl(videoId: string, autoplay = false): string {
  return `https://www.youtube.com/embed/${videoId}${autoplay ? '?autoplay=1' : ''}`;
}

/** album-sleeve colours, cycled by index (shared by the records & playlists pages) */
export const sleeveColours = ['#6F7E5F', '#A8693E', '#5E7385', '#8C4A3C', '#B08A3C', '#4E5D6B', '#7A5A6B'];

/** copy shown on the playlists page */
export const playlistsContent = {
  title: 'Playlists',
  sub: 'Artist mixes I keep on YouTube Music.',
  backlink: '← All playlists',
  ytmLink: 'Open in YouTube Music ↗',
  emptyLoaded: 'No playlists yet.',
  emptyLoading: 'Spinning up the turntable…',
};
