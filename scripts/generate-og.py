"""Generate branded OG images for each TTRPG system.

Cinematic poster style: hero image as background with dark gradient,
system name + publisher overlaid, "SESSION ZERO" badge in corner.

Output: og/<system-id>.png at 1200x630.
"""
import json
import re
import sys
import urllib.request
import hashlib
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SYSTEMS_DIR = ROOT / "data" / "systems"
OUT_DIR = ROOT / "og"
CACHE_DIR = ROOT / ".cache" / "og-source"
FONTS_DIR = ROOT / ".cache" / "fonts"

W, H = 1200, 630

ACCENT = (56, 189, 248)
WHITE = (241, 245, 249)
DIM = (148, 163, 184)
BG_DARK = (5, 5, 5)

UA = "Mozilla/5.0 (compatible; SessionZeroOGBot/1.0; +https://sessionzero.games)"

PAD_X, PAD_BOTTOM = 64, 72
BADGE_PAD = 40


def parse_system(path: Path) -> dict | None:
    text = path.read_text(encoding="utf-8")
    m = re.search(r'registerSystem\(\s*"([^"]+)"\s*,\s*(\{.*\})\s*\)\s*;?\s*$',
                  text, re.DOTALL)
    if not m:
        return None
    system_id, body = m.group(1), m.group(2)
    try:
        data = json.loads(body)
    except json.JSONDecodeError as e:
        print(f"  ! parse error in {path.name}: {e}")
        return None
    data["_id"] = system_id
    return data


def cache_path_for(url: str) -> Path:
    h = hashlib.sha1(url.encode()).hexdigest()[:16]
    suffix = Path(url.split("?")[0]).suffix.lower() or ".img"
    if suffix not in {".jpg", ".jpeg", ".png", ".webp", ".gif"}:
        suffix = ".img"
    return CACHE_DIR / f"{h}{suffix}"


def fetch_image(url: str) -> Image.Image | None:
    if not url:
        return None
    cp = cache_path_for(url)
    if not cp.exists():
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=20) as resp:
                cp.write_bytes(resp.read())
        except Exception as e:
            print(f"  ! download failed: {url} -> {e}")
            return None
    try:
        img = Image.open(cp).convert("RGB")
        return img
    except Exception as e:
        print(f"  ! open failed: {cp.name} -> {e}")
        return None


def fit_cover(src: Image.Image, w: int, h: int) -> Image.Image:
    sw, sh = src.size
    scale = max(w / sw, h / sh)
    nw, nh = int(sw * scale + 0.5), int(sh * scale + 0.5)
    resized = src.resize((nw, nh), Image.LANCZOS)
    x = (nw - w) // 2
    y = (nh - h) // 2
    return resized.crop((x, y, x + w, y + h))


def vertical_gradient(w: int, h: int, top_alpha: int, bottom_alpha: int) -> Image.Image:
    grad = Image.new("L", (1, h), 0)
    for y in range(h):
        t = y / max(h - 1, 1)
        grad.putpixel((0, y), int(top_alpha + (bottom_alpha - top_alpha) * t))
    grad = grad.resize((w, h))
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 255))
    layer.putalpha(grad)
    return layer


def make_background(hero: Image.Image | None) -> Image.Image:
    if hero is None:
        bg = Image.new("RGB", (W, H), BG_DARK)
        for y in range(H):
            v = int(8 + 18 * (y / H))
            ImageDraw.Draw(bg).line([(0, y), (W, y)], fill=(v, v, v + 4))
        return bg
    bg = fit_cover(hero, W, H).filter(ImageFilter.GaussianBlur(radius=2))
    bg = bg.convert("RGBA")
    grad = vertical_gradient(W, H, top_alpha=70, bottom_alpha=220)
    bg.alpha_composite(grad)
    side = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(side)
    for x in range(int(W * 0.55)):
        a = int(120 * (1 - x / (W * 0.55)))
        sd.line([(x, 0), (x, H)], fill=(0, 0, 0, a))
    bg.alpha_composite(side)
    return bg.convert("RGB")


def load_font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size)


def fit_text(draw, text: str, font_path: Path, max_size: int, min_size: int,
             max_width: int) -> tuple[ImageFont.FreeTypeFont, int]:
    size = max_size
    while size > min_size:
        f = load_font(font_path, size)
        bbox = draw.textbbox((0, 0), text, font=f)
        if bbox[2] - bbox[0] <= max_width:
            return f, size
        size -= 4
    return load_font(font_path, min_size), min_size


def draw_badge(img: Image.Image):
    draw = ImageDraw.Draw(img)
    f = load_font(FONTS_DIR / "Unbounded-Bold.ttf", 18)
    text = "SESSION ZERO"
    bbox = draw.textbbox((0, 0), text, font=f, spacing=4)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    pad_h, pad_v = 18, 10
    box_w = tw + pad_h * 2
    box_h = th + pad_v * 2 + 4
    x0 = W - BADGE_PAD - box_w
    y0 = BADGE_PAD
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    od.rounded_rectangle((x0, y0, x0 + box_w, y0 + box_h), radius=6,
                         fill=(56, 189, 248, 38),
                         outline=(56, 189, 248, 200), width=2)
    img.paste(Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB"))
    draw = ImageDraw.Draw(img)
    draw.text((x0 + pad_h, y0 + pad_v - 2), text, font=f, fill=ACCENT, spacing=4)


def draw_text_block(img: Image.Image, name: str, publisher: str):
    draw = ImageDraw.Draw(img)
    max_w = W - PAD_X * 2

    pub_font = load_font(FONTS_DIR / "Unbounded-Bold.ttf", 20)
    pub_text = (publisher or "").upper()
    pub_bbox = draw.textbbox((0, 0), pub_text, font=pub_font)
    pub_h = pub_bbox[3] - pub_bbox[1]

    name_font, name_size = fit_text(draw, name, FONTS_DIR / "Unbounded-Black.ttf",
                                    max_size=104, min_size=56, max_width=max_w)
    name_bbox = draw.textbbox((0, 0), name, font=name_font)
    name_h = name_bbox[3] - name_bbox[1]

    bar_y_offset = 18
    name_y = H - PAD_BOTTOM - name_h
    pub_y = name_y - pub_h - bar_y_offset

    bar_w = 56
    bar_h = 4
    bar_x = PAD_X
    bar_y = pub_y - bar_h - 14
    draw.rectangle((bar_x, bar_y, bar_x + bar_w, bar_y + bar_h), fill=ACCENT)

    draw.text((PAD_X, pub_y - pub_bbox[1]), pub_text, font=pub_font,
              fill=DIM, spacing=2)
    draw.text((PAD_X, name_y - name_bbox[1]), name, font=name_font,
              fill=WHITE)


def make_og(system: dict) -> Image.Image:
    hero_url = system.get("heroImage") or ""
    hero = fetch_image(hero_url) if hero_url else None
    if hero is None:
        gallery = system.get("gallery") or []
        for item in gallery:
            url = item.get("src") if isinstance(item, dict) else None
            if url:
                hero = fetch_image(url)
                if hero is not None:
                    break
    bg = make_background(hero)
    draw_badge(bg)
    draw_text_block(bg, system.get("name", system["_id"]),
                    system.get("publisher", ""))
    return bg


def main(only: list[str] | None = None):
    OUT_DIR.mkdir(exist_ok=True)
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    files = sorted(p for p in SYSTEMS_DIR.glob("*.js") if not p.name.startswith("_"))
    ok, fail = 0, 0
    for path in files:
        sys_data = parse_system(path)
        if not sys_data:
            continue
        sid = sys_data["_id"]
        if only and sid not in only:
            continue
        print(f"-> {sid}")
        try:
            img = make_og(sys_data)
            out = OUT_DIR / f"{sid}.jpg"
            img.save(out, "JPEG", quality=85, optimize=True, progressive=True)
            print(f"   wrote {out.relative_to(ROOT)} ({out.stat().st_size // 1024} KB)")
            ok += 1
        except Exception as e:
            import traceback
            print(f"   FAILED: {e}")
            traceback.print_exc()
            fail += 1
    print(f"\nDone: {ok} ok, {fail} failed")


if __name__ == "__main__":
    only = sys.argv[1:] if len(sys.argv) > 1 else None
    main(only)
