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
