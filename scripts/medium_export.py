#!/usr/bin/env python3
"""
Export a Medium user's published stories (via the public RSS feed) into a JSON
the VialRack writeups page can fetch — title, link, date, tags, cover image,
a short snippet and an estimated reading time. No auth needed.

Run (from the personal-scripts repo root):
  venv/bin/python scripts/medium_export.py
  venv/bin/python scripts/medium_export.py --user @someone --out /path/to/medium.json
"""

import argparse
import html
import json
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime
from pathlib import Path

DEFAULT_USER = "@hardikraj08"
DEFAULT_OUT = "../VialRack/src/assets/medium.json"
NS = {"content": "http://purl.org/rss/1.0/modules/content/"}

_TAG_RE = re.compile(r"<[^>]+>")
_FIGURE_RE = re.compile(r"<figure.*?</figure>", re.IGNORECASE | re.DOTALL)
_ANCHOR_RE = re.compile(r"<a\b[^>]*>.*?</a>", re.IGNORECASE | re.DOTALL)
_WS_RE = re.compile(r"\s+")


def first_image(content_html):
    m = re.search(r'<img[^>]+src="([^"]+)"', content_html, re.IGNORECASE)
    return m.group(1) if m else ""


def to_text(content_html):
    """Plain prose for the preview: drop figures and links entirely (their
    text/URLs break the column alignment), then strip remaining tags."""
    cleaned = _FIGURE_RE.sub(" ", content_html)
    cleaned = _ANCHOR_RE.sub(" ", cleaned)
    text = _TAG_RE.sub(" ", cleaned)
    return _WS_RE.sub(" ", html.unescape(text)).strip()


def snippet(text, limit=190):
    if len(text) <= limit:
        return text
    cut = text[:limit].rsplit(" ", 1)[0]
    return cut.rstrip(".,;: ") + "…"


def reading_mins(text):
    words = len(text.split())
    return max(1, round(words / 200))


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=25) as r:
        return r.read()


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--user", default=DEFAULT_USER, help="Medium handle, e.g. @hardikraj08")
    ap.add_argument("--out", default=DEFAULT_OUT)
    args = ap.parse_args()

    user = args.user if args.user.startswith("@") else "@" + args.user
    feed_url = f"https://medium.com/feed/{user}"
    root = ET.fromstring(fetch(feed_url))
    channel = root.find("channel")
    if channel is None:
        sys.exit(f"No channel in feed {feed_url}")

    stories = []
    for item in channel.findall("item"):
        content_el = item.find("content:encoded", NS)
        content_html = content_el.text if content_el is not None and content_el.text else ""
        text = to_text(content_html)
        pub = item.findtext("pubDate") or ""
        try:
            dt = parsedate_to_datetime(pub)
            date_iso = dt.date().isoformat()
            date_pretty = dt.strftime("%d %b %Y")
        except (TypeError, ValueError):
            date_iso = date_pretty = ""
        stories.append({
            "title": (item.findtext("title") or "").strip(),
            "link": (item.findtext("link") or "").split("?")[0],
            "date": date_pretty,
            "dateISO": date_iso,
            "tags": [c.text for c in item.findall("category") if c.text],
            "image": first_image(content_html),
            "snippet": snippet(text),
            "readingMins": reading_mins(text),
        })
        print(f"  {date_pretty}  {stories[-1]['title']}")

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(
        {"profile": f"https://medium.com/{user}", "stories": stories},
        indent=2, ensure_ascii=False,
    ))
    print(f"\nWrote {len(stories)} story/stories -> {out_path}")


if __name__ == "__main__":
    main()
