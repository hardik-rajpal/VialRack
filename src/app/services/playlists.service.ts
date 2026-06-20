import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Playlist } from 'src/data/playlists';
import { GitdbService } from './gitdb.service';

@Injectable({ providedIn: 'root' })
export class PlaylistsService {
  private cache$?: Observable<Playlist[]>;

  constructor(private gitdb: GitdbService) {}

  getAll(): Observable<Playlist[]> {
    if (!this.cache$) {
      this.cache$ = this.gitdb.getPlaylists().pipe(
        map((data: any) => (data?.playlists ?? []) as Playlist[]),
        shareReplay(1)
      );
    }
    return this.cache$;
  }

  /** Playlists collecting any of the given artist names (case-insensitive). */
  getForArtists(names: string[]): Observable<Playlist[]> {
    const wanted = new Set(names.map((n) => n.trim().toLowerCase()).filter(Boolean));
    return this.getAll().pipe(
      map((playlists) =>
        playlists.filter((p) => p.artists.some((a) => wanted.has(a.trim().toLowerCase())))
      )
    );
  }
}
