#!/usr/bin/env python3
"""
Scan your YouTube Music "Liked Songs" and maintain a "Liked Songs by <Artist>"
playlist for a chosen set of artists.

For each artist you select it makes sure a playlist called
"Liked Songs by <Artist>" exists and contains every liked song that artist is
credited on (including features). It is additive and idempotent: re-running
only adds newly-liked songs and never creates duplicates. It does NOT remove
songs you have un-liked.

Artists come from config/ytm.json, a JSON list of entries:
    [{"artists": ["Mohammed Rafi", "Mohd Rafi"], "playlist": "Rafi"}, ...]
Each entry maps one or more artist names (handy for spelling variants or
grouping several artists) to a playlist. "playlist" may be omitted to default
to "Liked Songs by <first artist>". You can pass artist names on the command
line to restrict a run to the entries containing them. Matching is
case-insensitive and matches any credited artist on a track.

It also maintains a "LikedMisc" catch-all: every liked song NOT matched by any
configured artist. When you add a new artist to the config, that artist's songs
are moved out of LikedMisc into the artist playlist on the next full run.
LikedMisc only syncs on a full run (no artist args); disable it with --no-misc.

Auth: by default it reads YouTube cookies straight from your logged-in Chrome
(needs browser_cookie3) and refreshes ./creds/ytmusic_auth.json on every run,
so it never goes stale. Alternatives:
  - --no-chrome : skip Chrome, use the existing ./creds/ytmusic_auth.json as-is.
  - From a copied request: in Chrome on music.youtube.com, DevTools -> Network,
    filter "browse", right-click a POST to /youtubei/v1/browse -> Copy as cURL,
    paste into a file, then build the file and use --no-chrome thereafter:
        python ytmusic_liked_by_artist.py --setup-from-curl ./creds/ytm_curl.txt
        python ytmusic_liked_by_artist.py --no-chrome --apply
  For a longer-lived setup use `ytmusicapi oauth` and --auth with --no-chrome.

Run:
  python ytmusic_liked_by_artist.py                  # dry run, all artists in config
  python ytmusic_liked_by_artist.py --apply          # do it
  python ytmusic_liked_by_artist.py "Tame Impala"    # only this artist (dry run)
  python ytmusic_liked_by_artist.py --list-artists   # show artists in your likes
"""

import argparse
import json
import re
import sys
import time
from collections import Counter
from pathlib import Path

try:
    from ytmusicapi import YTMusic, setup as ytm_setup
    from ytmusicapi.exceptions import YTMusicServerError
except ImportError:
    sys.exit("ytmusicapi not installed. Run: pip install ytmusicapi")

# {artist: playlist name}; null/empty means default "Liked Songs by <Artist>".
CONFIG_FILE = "./config/ytm.json"
AUTH_FILE = "./creds/ytmusic_auth.json"
PLAYLIST_PREFIX = "Liked Songs by "
# Catch-all: liked songs not matched by any configured artist.
MISC_PLAYLIST = "LikedMisc"
# YTM caps add_playlist_items per request; chunk to stay well under it.
ADD_CHUNK = 100


def track_artists(track):
    """Return the raw credited artist names for a track (one per artist object)."""
    return [a["name"] for a in (track.get("artists") or []) if a.get("name")]


# Separators YTM uses inside a single combined "duet" artist string.
_ARTIST_SPLIT = re.compile(
    r"\s*(?:,|&|/|;|·|\+|\bfeat\.?\b|\bft\.?\b|\bfeaturing\b|\bwith\b)\s*",
    re.IGNORECASE,
)


def match_names(track):
    """Set of names to match an artist against, lowercased.

    YTM sometimes credits a duet as one object ("A, B, C") and sometimes as
    separate objects. We include each raw name AND its split components, so an
    exact match still finds the artist inside a combined credit, while keeping
    the full name (covers artists whose real name has a comma/&, e.g. ABBA).
    """
    names = set()
    for raw in track_artists(track):
        raw = raw.strip()
        if not raw:
            continue
        names.add(raw.lower())
        for part in _ARTIST_SPLIT.split(raw):
            part = part.strip()
            if part:
                names.add(part.lower())
    return names


SCHEMA_HINT = ('a JSON list of {"artists": ["Name", ...], "playlist": "Playlist Name"} '
               'objects (multiple artists/spellings can share one playlist; '
               '"playlist" may be omitted to default to "Liked Songs by <first artist>").')


def load_config(path):
    """Load and validate the playlist config (list of {artists, playlist})."""
    try:
        data = json.loads(Path(path).read_text())
    except FileNotFoundError:
        sys.exit(f"Config not found: {path}. Create it as {SCHEMA_HINT}")
    except json.JSONDecodeError as e:
        sys.exit(f"Config {path} is not valid JSON: {e}")
    if not isinstance(data, list):
        sys.exit(f"Config {path} must be {SCHEMA_HINT}")

    entries = []
    for i, e in enumerate(data):
        if not isinstance(e, dict):
            sys.exit(f"Config {path} entry {i} must be an object — {SCHEMA_HINT}")
        artists = e.get("artists")
        if (not isinstance(artists, list) or not artists
                or not all(isinstance(a, str) and a.strip() for a in artists)):
            sys.exit(f'Config {path} entry {i} needs a non-empty "artists" list of strings.')
        playlist = e.get("playlist")
        if playlist is not None and not isinstance(playlist, str):
            sys.exit(f'Config {path} entry {i}: "playlist" must be a string.')
        artists = [a.strip() for a in artists]
        title = (playlist or "").strip() or f"{PLAYLIST_PREFIX}{artists[0]}"
        entries.append({"artists": artists, "playlist": title})
    return entries


def match_entries(liked, entries):
    """Return [(entry, [videoIds])] of liked songs crediting any of each entry's artists.

    Matching is case-insensitive against every credited artist on a track; the
    videoIds are order-preserved and de-duped per entry.
    """
    out = []
    for entry in entries:
        wanted = {a.lower() for a in entry["artists"]}
        seen, vids = set(), []
        for t in liked:
            vid = t["videoId"]
            if vid in seen:
                continue
            if wanted & match_names(t):
                vids.append(vid)
                seen.add(vid)
        out.append((entry, vids))
    return out


def headers_from_curl(curl_text):
    """Pull request headers out of a 'Copy as cURL' command.

    Handles both -H 'name: value' headers and the cookie passed via -b/--cookie.
    The request body (--data*) is ignored so its bytes can't produce false hits.
    """
    head = re.split(r"--data(?:-raw|-binary|-ascii)?\b", curl_text, maxsplit=1)[0]
    headers = {}
    for sq, dq in re.findall(r"-H\s+'([^']*)'|-H\s+\"([^\"]*)\"", head):
        line = sq or dq
        if ":" in line:
            key, _, val = line.partition(":")
            headers[key.strip().lower()] = val.strip()
    m = re.search(r"(?:-b|--cookie)\s+'([^']*)'|(?:-b|--cookie)\s+\"([^\"]*)\"", head)
    if m:
        headers["cookie"] = (m.group(1) or m.group(2)).strip()
    return headers


def write_auth(headers, auth_path):
    """Validate headers, write a ytmusicapi browser-auth file, and load-check it."""
    missing = [h for h in ("cookie", "x-goog-authuser", "authorization") if h not in headers]
    if missing:
        sys.exit(f"missing required header(s): {', '.join(missing)} — are you logged in?")
    if "__Secure-3PAPISID" not in headers["cookie"] and "SAPISID" not in headers["cookie"]:
        sys.exit("cookie has no SAPISID / __Secure-3PAPISID — are you logged in?")

    raw = "\n".join(f"{k}: {v}" for k, v in headers.items())
    Path(auth_path).parent.mkdir(parents=True, exist_ok=True)
    ytm_setup(filepath=auth_path, headers_raw=raw)

    YTMusic(auth_path)  # validate it loads as browser auth
    print(f"Wrote {auth_path}. Auth OK.")


def setup_from_curl(curl_path, auth_path):
    """Convert a saved curl command into a ytmusicapi browser-auth file."""
    headers = headers_from_curl(Path(curl_path).read_text())
    write_auth(headers, auth_path)


def setup_from_chrome(auth_path):
    """Pull YouTube cookies straight from the local Chrome profile.

    Synthesizes the few headers ytmusicapi needs; the real SAPISIDHASH auth is
    recomputed from the cookie on every request, so a placeholder is fine here.
    """
    try:
        import browser_cookie3 as bc
    except ImportError:
        sys.exit("browser_cookie3 not installed. Run: pip install browser_cookie3")

    cj = bc.chrome(domain_name="youtube.com")
    cookie = "; ".join(f"{c.name}={c.value}" for c in cj)
    if not cookie:
        sys.exit("No youtube.com cookies found in Chrome. Are you logged in there?")

    headers = {
        "cookie": cookie,
        "authorization": "SAPISIDHASH",  # placeholder; recomputed per request
        "x-goog-authuser": "0",
        "origin": "https://music.youtube.com",
        "x-origin": "https://music.youtube.com",
        "content-type": "application/json",
        "accept": "*/*",
        "user-agent": ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
                       "(KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36"),
    }
    write_auth(headers, auth_path)


def get_liked(yt):
    """Return liked-song tracks that have a usable videoId and known artist."""
    liked = yt.get_liked_songs(limit=None)
    return [
        t for t in liked.get("tracks", [])
        if t.get("videoId") and track_artists(t)
    ]


def existing_playlists_by_title(yt):
    """Map of playlist title -> playlistId for the current user's library."""
    out = {}
    for pl in yt.get_library_playlists(limit=None):
        title = pl.get("title")
        pid = pl.get("playlistId")
        if title and pid:
            out[title] = pid
    return out


def existing_video_ids(yt, playlist_id):
    """Set of videoIds already in a playlist."""
    pl = yt.get_playlist(playlist_id, limit=None)
    return {t["videoId"] for t in pl.get("tracks", []) if t.get("videoId")}


def with_retry(fn, *args, what="request", retries=5, **kwargs):
    """Call fn, retrying transient YTM errors (409 Conflict, 429, 5xx) with backoff."""
    delay = 2.0
    for attempt in range(1, retries + 1):
        try:
            return fn(*args, **kwargs)
        except YTMusicServerError as e:
            first = str(e).splitlines()[0]
            transient = any(f"HTTP {c}" in first for c in ("409", "429", "500", "502", "503"))
            if not transient or attempt == retries:
                raise
            print(f"    {what}: {first} — retrying in {delay:.0f}s ({attempt}/{retries - 1})")
            time.sleep(delay)
            delay *= 2


def add_in_chunks(yt, playlist_id, video_ids):
    for i in range(0, len(video_ids), ADD_CHUNK):
        chunk = video_ids[i : i + ADD_CHUNK]
        with_retry(yt.add_playlist_items, playlist_id, chunk, what="add", duplicates=False)
        print(f"    added {len(chunk)} songs")


def sync_misc(yt, liked, covered, existing, apply):
    """Maintain MISC_PLAYLIST = liked songs not matched by any configured artist.

    Adds newly-liked uncovered songs, and removes songs that have since become
    covered (i.e. an artist was added to the config, so they moved into that
    artist's playlist). Songs you unlike are left in place (not pruned).
    """
    seen = set()
    desired = []  # liked & uncovered, order-preserved
    for t in liked:
        vid = t["videoId"]
        if vid not in covered and vid not in seen:
            desired.append(vid)
            seen.add(vid)

    pid = existing.get(MISC_PLAYLIST)
    if pid is None:
        print(f"[{MISC_PLAYLIST}] {len(desired)} misc song(s) -> playlist missing")
        if not apply:
            print(f"  [dry-run] would create '{MISC_PLAYLIST}' and add {len(desired)} songs")
            return
        pid = with_retry(yt.create_playlist, MISC_PLAYLIST,
                         "Auto-maintained: liked songs not in any artist playlist.",
                         what="create_playlist")
        time.sleep(2)  # let the new playlist settle before adding items
        print(f"  created '{MISC_PLAYLIST}'")
        add_in_chunks(yt, pid, desired)
        return

    pl = yt.get_playlist(pid, limit=None)
    current = [(t["videoId"], t.get("setVideoId"))
               for t in pl.get("tracks", []) if t.get("videoId")]
    current_ids = {v for v, _ in current}
    to_add = [v for v in desired if v not in current_ids]
    # songs now covered by an artist playlist get moved out of misc
    to_remove = [{"videoId": v, "setVideoId": s}
                 for v, s in current if v in covered and s]

    print(f"[{MISC_PLAYLIST}] {len(desired)} misc song(s); "
          f"{len(to_add)} new, {len(to_remove)} moved out to artist playlists")
    if not apply:
        return
    if to_remove:
        with_retry(yt.remove_playlist_items, pid, to_remove, what="remove")
        print(f"  removed {len(to_remove)} now-covered songs")
    if to_add:
        add_in_chunks(yt, pid, to_add)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("artists", nargs="*", help="restrict to these artists (subset of the config)")
    ap.add_argument("--apply", action="store_true", help="actually run; default is dry run")
    ap.add_argument("--config", default=CONFIG_FILE, help=f"artist config JSON (default {CONFIG_FILE})")
    ap.add_argument("--auth", default=AUTH_FILE, help=f"auth file (default {AUTH_FILE})")
    ap.add_argument("--no-chrome", action="store_true",
                    help="don't refresh auth from Chrome; use the existing --auth file as-is")
    ap.add_argument("--no-misc", action="store_true",
                    help=f"don't maintain the {MISC_PLAYLIST} catch-all playlist")
    ap.add_argument("--setup-from-curl", metavar="CURL_FILE",
                    help="build the auth file from a saved 'Copy as cURL' command, then exit")
    ap.add_argument("--list-artists", action="store_true",
                    help="just list artists found in your liked songs (with counts) and exit")
    args = ap.parse_args()

    if args.setup_from_curl:
        setup_from_curl(args.setup_from_curl, args.auth)
        return

    # Default auth route: pull fresh cookies from Chrome each run.
    if not args.no_chrome:
        setup_from_chrome(args.auth)
    yt = YTMusic(args.auth)
    liked = get_liked(yt)

    if args.list_artists:
        counts = Counter()
        for t in liked:
            for name in track_artists(t):
                counts[name] += 1
        print(f"{len(counts)} artists across {len(liked)} liked songs:\n")
        for name, n in counts.most_common():
            print(f"  {n:4d}  {name}")
        return

    entries = load_config(args.config)
    matches = match_entries(liked, entries)  # full config, used for misc coverage

    proc = matches
    if args.artists:
        req = {a.lower() for a in args.artists}
        proc = [(e, v) for e, v in matches if {a.lower() for a in e["artists"]} & req]
        if not proc:
            sys.exit(f"No config entry matches {args.artists}. "
                     "Use --list-artists to see what's in your likes.")

    mode = "APPLY" if args.apply else "DRY RUN"
    print(f"=== YTMusic: Liked Songs by <Artist> [{mode}] ===")
    print(f"Liked songs with a known artist: {len(liked)}\n")

    existing = existing_playlists_by_title(yt)
    total_added = 0

    for entry, vids in proc:
        title = entry["playlist"]
        label = " / ".join(entry["artists"])
        if not vids:
            print(f"[{label}] no liked songs found — skipping")
            continue

        pid = existing.get(title)

        if pid is None:
            print(f"[{label}] {len(vids)} liked song(s) -> '{title}' missing")
            if not args.apply:
                print(f"  [dry-run] would create '{title}' and add {len(vids)} songs")
                total_added += len(vids)
                continue
            pid = with_retry(yt.create_playlist, title,
                             f"Auto-maintained: liked songs by {label}.",
                             what="create_playlist")
            time.sleep(2)  # let the new playlist settle before adding items
            print(f"  created '{title}'")
            add_in_chunks(yt, pid, vids)
            total_added += len(vids)
        else:
            have = existing_video_ids(yt, pid)
            missing = [v for v in vids if v not in have]
            print(f"[{label}] {len(vids)} liked song(s) -> '{title}', {len(missing)} new")
            if not missing:
                continue
            if not args.apply:
                print(f"  [dry-run] would add {len(missing)} songs to '{title}'")
                total_added += len(missing)
                continue
            add_in_chunks(yt, pid, missing)
            total_added += len(missing)

    if not args.no_misc:
        print()
        if args.artists:
            # covered would only reflect the subset, so misc could be wrong
            print(f"[{MISC_PLAYLIST}] skipped on a subset run; run with no artist args to sync it")
        else:
            covered = set()
            for _, vids in matches:
                covered.update(vids)
            sync_misc(yt, liked, covered, existing, args.apply)

    verb = "added" if args.apply else "would add"
    print(f"\nDone. {verb} {total_added} song(s) to artist playlists.")


if __name__ == "__main__":
    main()
