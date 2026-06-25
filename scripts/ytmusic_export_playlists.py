#!/usr/bin/env python3
"""
Export the artist playlists named in config/ytm.json (and their tracks) from
YouTube Music into a single JSON the VialRack site can fetch.

For each config entry it finds the user's playlist by title, reads its tracks,
and emits {playlist, artists, playlistId, trackCount, thumbnail, tracks:[...]}.
Each track carries videoId/title/artists/album/duration/thumbnail so the site
can render a track list and embed any track (https://www.youtube.com/embed/<id>).

Auth: uses the existing ./creds/ytmusic_auth.json as-is (no Chrome needed).
Refresh that file first with ytmusic_liked_by_artist.py if it has gone stale.

Run (from the personal-scripts repo root):
  venv/bin/python scripts/ytmusic_export_playlists.py
  venv/bin/python scripts/ytmusic_export_playlists.py --out /path/to/playlists.json
"""

import argparse
import json
import sys
from pathlib import Path

try:
    from ytmusicapi import YTMusic
except ImportError:
    sys.exit("ytmusicapi not installed. Run: pip install ytmusicapi")

CONFIG_FILE = "./config/ytm.json"
AUTH_FILE = "./creds/ytmusic_auth.json"
DEFAULT_OUT = "../VialRack/src/assets/playlists.json"


def pick_thumbnail(thumbs):
    """Return the largest thumbnail URL from a ytmusicapi thumbnails list."""
    if not thumbs:
        return ""
    best = max(thumbs, key=lambda t: (t.get("width", 0) * t.get("height", 0)))
    return best.get("url", "")


def track_artist_names(track):
    return [a["name"] for a in (track.get("artists") or []) if a.get("name")]


def export_track(t):
    return {
        "videoId": t.get("videoId"),
        "title": t.get("title", ""),
        "artists": ", ".join(track_artist_names(t)),
        "album": (t.get("album") or {}).get("name", "") if isinstance(t.get("album"), dict) else "",
        "duration": t.get("duration", ""),
        "thumbnail": pick_thumbnail(t.get("thumbnails")),
    }


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--config", default=CONFIG_FILE)
    ap.add_argument("--auth", default=AUTH_FILE)
    ap.add_argument("--out", default=DEFAULT_OUT)
    args = ap.parse_args()

    config = json.loads(Path(args.config).read_text())
    yt = YTMusic(args.auth)

    # title -> playlistId for everything in the library
    by_title = {}
    for pl in yt.get_library_playlists(limit=None):
        if pl.get("title") and pl.get("playlistId"):
            by_title.setdefault(pl["title"], pl["playlistId"])

    out = []
    for entry in config:
        artists = [a.strip() for a in entry.get("artists", []) if a.strip()]
        title = (entry.get("playlist") or "").strip() or f"Liked Songs by {artists[0]}"
        pid = by_title.get(title)
        if not pid:
            print(f"  ! no playlist titled {title!r} in library — skipping", file=sys.stderr)
            continue

        pl = yt.get_playlist(pid, limit=None)
        tracks = [export_track(t) for t in pl.get("tracks", []) if t.get("videoId")]
        out.append({
            "playlist": title,
            "name": (entry.get("name") or "").strip(),
            "artists": artists,
            "playlistId": pid,
            "trackCount": len(tracks),
            "thumbnail": pick_thumbnail(pl.get("thumbnails")),
            "tracks": tracks,
        })
        print(f"  {title}: {len(tracks)} tracks")

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps({"playlists": out}, indent=2, ensure_ascii=False))
    print(f"\nWrote {len(out)} playlist(s) -> {out_path}")


if __name__ == "__main__":
    main()
