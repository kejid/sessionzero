# TTRPG Showcase

Interactive presentation of 27 tabletop RPG systems. Explore, compare, and vote with your group on what to play next.

**[Live Demo](#)** | **[Screenshot](#)**

## Features

- **27 systems** — OSR, Free League, narrative, tactical — with full bilingual content (RU/EN)
- **Player voting** — set up players, vote on favorites, see ranked results
- **Browse mode** — skip voting and just explore the catalog as card grid or list
- **Presentation mode** — fullscreen slides with keyboard navigation (`F` to toggle, arrows to navigate)
- **Custom systems** — add your own games via built-in editor, saved locally
- **System selector** — GM picks which systems to show the group
- **Bilingual** — switch between Russian and English with one click
- **Mobile-friendly** — responsive design with hamburger menu
- **Per system:**
  - Hero art banner
  - Setting & mechanics overview
  - "What it looks like at the table" gameplay vignettes
  - Community quotes
  - Complexity, dice, player count, prep time, Foundry VTT status
  - Art gallery with lightbox
  - Free resources (character sheets, quickstarts, maps, official sites)

## Systems

| Group | Systems |
|-------|---------|
| **The Odd & OSR** | Into the Odd, Electric Bastionland, Mythic Bastionland, Cairn, Mork Borg, Shadowdark |
| **Free League (YZE)** | ALIEN RPG, Blade Runner, Vaesen, Forbidden Lands, Twilight: 2000, Tales from the Loop, Dragonbane, Coriolis |
| **Narrative & Surreal** | Heart, Triangle Agency, Mothership, Blades in the Dark, The Wildsea, Delta Green, UVG, Microscope, The One Ring, Outgunned, Legend of the Five Rings |
| **Tactical & Modern** | Draw Steel, Nimble |

## Tech

Zero dependencies. No build step. Plain HTML + CSS + JS.

```
index.html          ~220 lines   (shell + overlays)
app.js              ~880 lines   (logic, rendering)
style.css          ~1300 lines   (styles + animations + responsive)
i18n.js             ~290 lines   (RU/EN translations)
data/systems.json   ~970 lines   (all system content)
data/systems.js                  (JS wrapper for systems.json)
```

Fonts: [Unbounded](https://fonts.google.com/specimen/Unbounded) + [Manrope](https://fonts.google.com/specimen/Manrope) via Google Fonts.
Icons: [Lucide](https://lucide.dev/) via CDN.

## Quick Start

```bash
# Just open it
open index.html

# Or serve locally
npx serve .
```

## Deploy

Static files — works anywhere:

```bash
# GitHub Pages
git push  # enable Pages in repo settings

# Netlify
# drag & drop the folder at netlify.com/drop

# Any server
cp -r . /var/www/html/
```

## Make Your Own

1. **Fork** this repo
2. **Edit `data/systems.json`** — add/remove/modify systems. Each system has: name, publisher, tagline, description, setting, vignette, mechanics, quotes, gallery, resources
3. **Add `_en` fields** for English translations (optional)
4. **Update `app.js`** — add your system ID to `SYSTEM_GROUPS`
5. **Regenerate** `data/systems.js`: `echo "const SYSTEMS_JSON = $(cat data/systems.json);" > data/systems.js`
6. **Deploy**

You can also add systems directly in the app via the built-in editor (saved to localStorage).

## License

MIT. See [LICENSE](LICENSE).

Game art belongs to respective publishers. Used under fair use for non-commercial fan purposes.
