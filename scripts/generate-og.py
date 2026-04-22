"""Generate branded OG images for each TTRPG system.

Cinematic poster style: hero image as background with dark gradient,
system name + publisher overlaid, "SESSION ZERO" badge in corner.

Output:
  default:           og/<system-id>.jpg  + og/home.jpg   (EN copy)
  --lang=ru:         og/ru/<system-id>.jpg + og/ru/home.jpg  (RU copy)

Positional args (after any --lang=... flag) restrict to specific IDs or "home".
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
OUT_DIR_EN = ROOT / "og"
OUT_DIR_RU = ROOT / "og" / "ru"
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


# Per-language copy. Brand badge "SESSION ZERO" and URL stay English.
COPY = {
    "en": {
        "sub": "Group voting tool · sessionzero.games",
        "home_pretitle": "TTRPG GROUP VOTING TOOL",
        "home_tagline": "Pick what to play with your group →",
    },
    "ru": {
        "sub": "Инструмент группового выбора · sessionzero.games",
        "home_pretitle": "ГРУППОВОЕ ГОЛОСОВАНИЕ TTRPG",
        "home_tagline": "Выберите во что играть всей группой →",
    },
}


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
    """Returns RGBA background ready for overlays."""
    if hero is None:
        bg = Image.new("RGBA", (W, H), BG_DARK + (255,))
        for y in range(H):
            v = int(8 + 18 * (y / H))
            ImageDraw.Draw(bg).line([(0, y), (W, y)], fill=(v, v, v + 4, 255))
        return bg
    bg = fit_cover(hero, W, H).filter(ImageFilter.GaussianBlur(radius=2)).convert("RGBA")
    bg.alpha_composite(vertical_gradient(W, H, top_alpha=70, bottom_alpha=220))
    fade_w = int(W * 0.55)
    side = Image.new("RGBA", (fade_w, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(side)
    for x in range(fade_w):
        sd.line([(x, 0), (x, H)], fill=(0, 0, 0, int(120 * (1 - x / fade_w))))
    bg.alpha_composite(side)
    return bg


def load_font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size)


def fit_font(font_path: Path, text: str, max_size: int, min_size: int,
             max_width: int) -> ImageFont.FreeTypeFont:
    for size in range(max_size, min_size, -4):
        f = load_font(font_path, size)
        if f.getlength(text) <= max_width:
            return f
    return load_font(font_path, min_size)


def text_h(draw: ImageDraw.ImageDraw, text: str,
           font: ImageFont.FreeTypeFont) -> int:
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[3] - bbox[1]


def draw_top(draw: ImageDraw.ImageDraw, x: int, top_y: int, text: str,
             font: ImageFont.FreeTypeFont, fill: tuple, **kw):
    """Draw text aligned so its rendered top edge sits at top_y."""
    bbox = draw.textbbox((0, 0), text, font=font)
    draw.text((x, top_y - bbox[1]), text, font=font, fill=fill, **kw)


def radial_glow(w: int, h: int, color: tuple, cx: int, cy: int,
                max_r: int, max_alpha: int) -> Image.Image:
    """RGBA layer with a radial alpha falloff from (cx, cy)."""
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for r in range(max_r, 0, -8):
        a = int(max_alpha * (1 - r / max_r) ** 1.6)
        d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=color + (a,))
    return layer


def draw_badge(img: Image.Image):
    """img is RGBA."""
    text = "SESSION ZERO"
    f = load_font(FONTS_DIR / "Unbounded-Bold.ttf", 18)
    pad_h, pad_v = 18, 12
    bbox = ImageDraw.Draw(img).textbbox((0, 0), text, font=f)
    box_w = (bbox[2] - bbox[0]) + pad_h * 2
    box_h = (bbox[3] - bbox[1]) + pad_v * 2

    badge = Image.new("RGBA", (box_w, box_h), (0, 0, 0, 0))
    bd = ImageDraw.Draw(badge)
    bd.rounded_rectangle((0, 0, box_w - 1, box_h - 1), radius=6,
                         fill=(0, 0, 0, 175),
                         outline=ACCENT + (220,), width=2)
    draw_top(bd, pad_h, pad_v, text, f, ACCENT)
    img.alpha_composite(badge, (W - BADGE_PAD - box_w, BADGE_PAD))


def draw_text_block(img: Image.Image, name: str, publisher: str, lang: str):
    """img is RGBA."""
    draw = ImageDraw.Draw(img)
    max_w = W - PAD_X * 2

    pub_text = (publisher or "").upper()
    sub_text = COPY[lang]["sub"]
    pub_font = load_font(FONTS_DIR / "Unbounded-Bold.ttf", 20)
    sub_font = load_font(FONTS_DIR / "Unbounded-Bold.ttf", 17)
    name_font = fit_font(FONTS_DIR / "Unbounded-Black.ttf", name,
                         max_size=104, min_size=56, max_width=max_w)

    sub_y = H - PAD_BOTTOM - text_h(draw, sub_text, sub_font)
    name_y = sub_y - text_h(draw, name, name_font) - 16
    pub_y = name_y - text_h(draw, pub_text, pub_font) - 18
    bar_y = pub_y - 18

    draw.rectangle((PAD_X, bar_y, PAD_X + 56, bar_y + 4), fill=ACCENT)
    draw_top(draw, PAD_X, pub_y, pub_text, pub_font, DIM, spacing=2)
    draw_top(draw, PAD_X, name_y, name, name_font, WHITE)
    draw_top(draw, PAD_X, sub_y, sub_text, sub_font, ACCENT, spacing=1)


def make_homepage_og(lang: str) -> Image.Image:
    """Branded homepage OG with no hero — text on dark with accent glow."""
    bg = Image.new("RGBA", (W, H), BG_DARK + (255,))
    bg.alpha_composite(radial_glow(W, H, ACCENT, cx=int(W * 0.78),
                                   cy=int(H * 0.32), max_r=720, max_alpha=34))
    bg.alpha_composite(vertical_gradient(W, H, top_alpha=20, bottom_alpha=120))

    pretitle = COPY[lang]["home_pretitle"]
    name = "SESSION ZERO"
    tagline = COPY[lang]["home_tagline"]
    url = "sessionzero.games"

    max_w = W - PAD_X * 2
    draw = ImageDraw.Draw(bg)
    pretitle_font = load_font(FONTS_DIR / "Unbounded-Bold.ttf", 22)
    name_font = fit_font(FONTS_DIR / "Unbounded-Black.ttf", name,
                         max_size=120, min_size=64, max_width=max_w)
    tag_font = load_font(FONTS_DIR / "Unbounded-Bold.ttf", 26)
    url_font = load_font(FONTS_DIR / "Unbounded-Bold.ttf", 18)

    tag_y = H - PAD_BOTTOM - text_h(draw, tagline, tag_font)
    name_y = tag_y - text_h(draw, name, name_font) - 22
    pt_y = name_y - text_h(draw, pretitle, pretitle_font) - 18
    bar_y = pt_y - 18

    draw.rectangle((PAD_X, bar_y, PAD_X + 56, bar_y + 4), fill=ACCENT)
    draw_top(draw, PAD_X, pt_y, pretitle, pretitle_font, ACCENT, spacing=2)
    draw_top(draw, PAD_X, name_y, name, name_font, WHITE)
    draw_top(draw, PAD_X, tag_y, tagline, tag_font, DIM)

    url_x = W - BADGE_PAD - int(url_font.getlength(url))
    draw_top(draw, url_x, BADGE_PAD, url, url_font, ACCENT)
    return bg


def make_og(system: dict, lang: str) -> Image.Image:
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
                    system.get("publisher", ""), lang)
    return bg


def save_jpeg(img: Image.Image, out: Path):
    img.convert("RGB").save(out, "JPEG", quality=85, optimize=True, progressive=True)
    print(f"   wrote {out.relative_to(ROOT)} ({out.stat().st_size // 1024} KB)")


def main(lang: str, only: list[str] | None = None):
    out_dir = OUT_DIR_RU if lang == "ru" else OUT_DIR_EN
    out_dir.mkdir(parents=True, exist_ok=True)
    CACHE_DIR.mkdir(parents=True, exist_ok=True)

    ok, fail = 0, 0
    if not only or "home" in only:
        print(f"-> home ({lang})")
        try:
            save_jpeg(make_homepage_og(lang), out_dir / "home.jpg")
            ok += 1
        except Exception as e:
            print(f"   FAILED: {e}")
            fail += 1
        if only and set(only) <= {"home"}:
            print(f"\nDone: {ok} ok, {fail} failed")
            return

    files = sorted(p for p in SYSTEMS_DIR.glob("*.js") if not p.name.startswith("_"))
    for path in files:
        sys_data = parse_system(path)
        if not sys_data:
            continue
        sid = sys_data["_id"]
        if only and sid not in only:
            continue
        print(f"-> {sid} ({lang})")
        try:
            save_jpeg(make_og(sys_data, lang), out_dir / f"{sid}.jpg")
            ok += 1
        except Exception as e:
            print(f"   FAILED: {e}")
            fail += 1
    print(f"\nDone: {ok} ok, {fail} failed")


if __name__ == "__main__":
    lang = "en"
    args = []
    for a in sys.argv[1:]:
        if a.startswith("--lang="):
            lang = a.split("=", 1)[1].strip().lower()
            if lang not in COPY:
                print(f"Unknown lang: {lang}. Use en or ru.")
                sys.exit(2)
        elif a in ("--lang", "-l"):
            # Not supported form-split, stay strict.
            print("Use --lang=<en|ru>, not split form.")
            sys.exit(2)
        else:
            args.append(a)
    only = args if args else None
    main(lang, only)
