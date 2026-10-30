"""Download every external heroImage and gallery image into images/ and point
the system data at the local copies, so the site stops depending on publisher
hosts that block the image proxy or remove files.

Output: images/heroes/<id>.jpg and images/systems/<id>-g<n>.jpg (.webp when the
image has transparency). Images that can't be fetched keep their URL and are
listed at the end. Safe to re-run: local URLs are skipped. Rebuild afterwards
with bundle:js, bundle:pages and minify:bundle.
"""
import hashlib
import io
import re
import subprocess
import sys
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SYSTEMS_DIR = ROOT / "data" / "systems"
SITE = "https://sessionzero.games/"
CACHE_DIR = ROOT / ".cache" / "og-source"
MAX_W = 1200
QUALITY = 82
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "Chrome/126 Safari/537.36")
HERO_RE = re.compile(r'("heroImage":\s*")([^"]*)(")')
SRC_RE = re.compile(r'("src":\s*")([^"]*)(")')


def fetch_bytes(url):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=45) as resp:
            return resp.read()
    except Exception:
        # Some hosts answer 404 to urllib but serve curl the same URL.
        return subprocess.run(["curl", "-sSfL", "--max-time", "45", "-A", UA, url],
                              capture_output=True, check=True).stdout


def candidates(url):
    """Direct first; then routes around hosts that refuse scripted requests."""
    yield url
    yield "https://wsrv.nl/?output=png&url=" + urllib.parse.quote(url, safe="")
    parsed = urllib.parse.urlparse(url)
    yield f"https://i0.wp.com/{parsed.netloc}{parsed.path}"


def fetch_image(url):
    last = None
    for candidate in candidates(url):
        try:
            img = Image.open(io.BytesIO(fetch_bytes(candidate)))
            img.load()
            if min(img.size) < 32:
                raise ValueError(f"too small: {img.size}")
            return img
        except Exception as e:
            last = e
    raise last


def has_alpha(img):
    if img.mode == "P" and "transparency" in img.info:
        img = img.convert("RGBA")
    if img.mode not in ("RGBA", "LA"):
        return False
    return img.getchannel("A").getextrema()[0] < 250


def save(img, stem):
    """Save under stem, downscaled to MAX_W. Returns the path relative to ROOT."""
    if img.mode.startswith("I;16"):  # 16-bit grayscale clips to white in a plain convert
        img = img.convert("I").point(lambda v: v * (1 / 256)).convert("L")
    alpha = has_alpha(img)
    img = img.convert("RGBA" if alpha else "RGB")
    if img.width > MAX_W:
        img = img.resize((MAX_W, round(img.height * MAX_W / img.width)), Image.LANCZOS)
    out = ROOT / f"{stem}.{'webp' if alpha else 'jpg'}"
    out.parent.mkdir(parents=True, exist_ok=True)
    if alpha:
        img.save(out, "WEBP", quality=QUALITY, method=6)
    else:
        img.save(out, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    return out.relative_to(ROOT).as_posix()


def is_local(url):
    return not url or url.startswith(SITE)


def process(path):
    sid = path.stem
    text = path.read_text(encoding="utf-8")
    done, failed = {}, []
    hero = HERO_RE.search(text)

    def local(url, stem):
        if url not in done:
            done[url] = SITE + save(fetch_image(url), stem)
        return done[url]

    if hero and not is_local(hero.group(2)):
        try:
            local(hero.group(2), f"images/heroes/{sid}")
        except Exception as e:
            failed.append((sid, "hero", hero.group(2), str(e)[:80]))

    slot = 0
    for m in SRC_RE.finditer(text):
        slot += 1
        if is_local(m.group(2)):
            continue
        try:
            local(m.group(2), f"images/systems/{sid}-g{slot}")
        except Exception as e:
            failed.append((sid, f"g{slot}", m.group(2), str(e)[:80]))

    new = HERO_RE.sub(lambda m: m.group(1) + done.get(m.group(2), m.group(2)) + m.group(3), text)
    new = SRC_RE.sub(lambda m: m.group(1) + done.get(m.group(2), m.group(2)) + m.group(3), new)
    if new != text:
        path.write_text(new, encoding="utf-8", newline="")

    # Keep the OG generator working offline for heroes that aren't deployed yet.
    hero = HERO_RE.search(new)
    if hero and hero.group(2).startswith(SITE):
        url = hero.group(2)
        src = ROOT / url[len(SITE):].split("?")[0]
        if src.exists():
            CACHE_DIR.mkdir(parents=True, exist_ok=True)
            h = hashlib.sha1(url.encode()).hexdigest()[:16]
            (CACHE_DIR / f"{h}{src.suffix}").write_bytes(src.read_bytes())
    return len(done), failed


def main():
    files = sorted(p for p in SYSTEMS_DIR.glob("*.js") if not p.name.startswith("_"))
    total, failures = 0, []
    with ThreadPoolExecutor(8) as ex:
        for n, failed in ex.map(process, files):
            total += n
            failures += failed
    print(f"Saved {total} images, {len(failures)} failed")
    for f in failures:
        print("  FAILED", *f)
    return 0


if __name__ == "__main__":
    sys.exit(main())
