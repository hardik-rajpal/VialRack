# Data extraction scripts

Mirrored copies of the scripts that generate the JSON this site fetches. The
**canonical copies live in the separate `personal-scripts` repo** (alongside its
`venv/`, `config/` and git-ignored `creds/`); these are kept here so the data
pipeline is versioned next to the site. Run them from the `personal-scripts`
repo root unless you override the paths.

| Script | Generates | Auth |
| --- | --- | --- |
| `medium_export.py` | `src/assets/medium.json` (writeups) | none — public Medium RSS |
| `ytmusic_export_albums.py` | `src/assets/albums.json` (album tracks) | none — public album browsing |
| `ytmusic_export_playlists.py` | `src/assets/playlists.json` (artist mixes) | YTM auth (`creds/ytmusic_auth.json`) |
| `ytmusic_liked_by_artist.py` | *(not site data)* maintains your "Liked Songs by &lt;Artist&gt;" YTM playlists, and refreshes the auth file | YTM auth (Chrome cookies) |

`ytmusic_liked_by_artist.py` is upstream of the playlist export: it builds the
per-artist playlists that `ytmusic_export_playlists.py` reads, and refreshes
`creds/ytmusic_auth.json` (used by the playlist export when its auth goes stale).

## Running

From the `personal-scripts` repo root:

```sh
venv/bin/python scripts/medium_export.py
venv/bin/python scripts/ytmusic_export_albums.py
venv/bin/python scripts/ytmusic_export_playlists.py   # needs fresh YTM auth
```

Each writes into `../VialRack/src/assets/*.json` by default. Override with
`--out` (or `--file` for the albums script). The albums list is curated by hand
in `albums.json` (title/artist/link/cover/listId); the albums script only fills
in each entry's `tracks`.

Dependencies: `ytmusicapi` (and `browser_cookie3` for the Chrome-cookie auth
path in `ytmusic_liked_by_artist.py`). The medium script is stdlib-only.

> Secrets (`creds/`) are **not** mirrored here and must never be committed.
