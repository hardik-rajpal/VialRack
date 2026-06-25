#!/usr/bin/env python3
"""
Refresh the track lists for the albums the VialRack site links to.

The album list itself is curated by hand in the site's albums.json — each entry
carries title/artist/link/cover/listId. This script reads that file, looks up
each album on YouTube Music, and fills in (or refreshes) its `tracks` so the
site can render a clickable, playable list — the same shape playlists.json uses
(videoId/title/artists/album/duration/thumbnail). Curated fields are preserved;
only `tracks` is rewritten.

No auth needed: album browsing is public. The album browseId comes from the
entry's `browse/MPRE…` link, or is resolved from its `listId` (OLAK5uy…).

Run (from the personal-scripts repo root):
  venv/bin/python scripts/ytmusic_export_albums.py
  venv/bin/python scripts/ytmusic_export_albums.py --file /path/to/albums.json
"""

import argparse
import json
import re
import sys
from pathlib import Path

try:
    from ytmusicapi import YTMusic
except ImportError:
    sys.exit("ytmusicapi not installed. Run: pip install ytmusicapi")

DEFAULT_FILE = "../VialRack/src/assets/albums.json"


def track_artist_names(track):
    return [a["name"] for a in (track.get("artists") or []) if a.get("name")]


def export_track(t, album_title, album_artist):
    return {
        "videoId": t.get("videoId"),
        "title": t.get("title", ""),
        "artists": ", ".join(track_artist_names(t)) or album_artist,
        "album": album_title,
        "duration": t.get("duration", ""),
        "thumbnail": "",
    }


def browse_id(yt, album):
    """The album's MPRE… browseId, from its link or resolved from its listId."""
    m = re.search(r"/browse/(MPRE[^?&/]+)", album.get("link", ""))
    if m:
        return m.group(1)
    list_id = album.get("listId")
    if not list_id:
        m = re.search(r"[?&]list=([^&]+)", album.get("link", ""))
        list_id = m.group(1) if m else None
    return yt.get_album_browse_id(list_id) if list_id else None


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--file", default=DEFAULT_FILE, help="albums.json to read and rewrite in place")
    args = ap.parse_args()

    path = Path(args.file)
    data = json.loads(path.read_text())
    yt = YTMusic()  # public browsing, no auth

    for album in data.get("albums", []):
        title = album.get("title", "?")
        bid = browse_id(yt, album)
        if not bid:
            print(f"  ! {title}: no browseId (need a browse/MPRE… link or listId) — skipping", file=sys.stderr)
            continue
        info = yt.get_album(bid)
        tracks = [
            export_track(t, title, album.get("artist", ""))
            for t in info.get("tracks", [])
            if t.get("videoId")
        ]
        album["tracks"] = tracks
        print(f"  {title}: {len(tracks)} tracks")

    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    print(f"\nWrote {len(data.get('albums', []))} album(s) -> {path}")


if __name__ == "__main__":
    main()
