# Session Zero

> Help your tabletop RPG group decide what to play next. Browse systems, vote together, get a shortlist.

**[Live Demo](https://sessionzero.games/)** · Bilingual (EN/RU) · Zero dependencies · Forkable

![Session Zero](https://raw.githubusercontent.com/kejid/sessionzero/master/screenshot.png)

## Features

- **44 systems** — OSR, Free League, narrative, tactical, solo — with full bilingual content (RU/EN)
- **Multiple grouping schemes** — browse by default groups, engine family, genre, or solo play
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

44 systems across 4 grouping schemes. Default grouping:

| Group | Systems |
|-------|---------|
| **OSR** | Into the Odd, Electric Bastionland, Mythic Bastionland, Cairn, MORK BORG, CY_BORG, Pirate Borg, Shadowdark, Mausritter, Old-School Essentials, FIST |
| **Free League (YZE)** | ALIEN RPG, Blade Runner, Vaesen, Forbidden Lands, Twilight: 2000, Tales from the Loop, Dragonbane, Coriolis, Death in Space |
| **Narrative** | Heart, Spire, Triangle Agency, Mothership, Blades in the Dark, The Wildsea, Delta Green, UVG, Microscope, The One Ring, Outgunned, L5R 5e, Star Wars RPG (FFG), Call of Cthulhu, Ironsworn, Starforged, Thousand Year Old Vampire, The Wretched, Ker Nethalas, Koriko, Last Tea Shop |
| **Tactical** | Draw Steel, Nimble 2e, Lancer |

Also available: **By Engine** (Year Zero, PbtA/FitD, Into the Odd family, Borg, Resistance, etc.), **By Genre** (sci-fi, horror, dark fantasy, adventure, narrative-weird, tactical), and **Solo** (solo-compatible, solo-adventure, solo-journaling).

## Tech

Zero dependencies. No build step. Plain HTML + CSS + JS.

```
index.html              ~285 lines   (shell + overlays)
app.js                 ~1200 lines   (logic, rendering)
style.css              ~1510 lines   (styles + animations + responsive)
i18n.js                 ~310 lines   (RU/EN translations)
data/systems/*.js         44 files   (one file per system)
data/systems/_registry.js              (system registry + group builder)
```

Fonts: [Unbounded](https://fonts.google.com/specimen/Unbounded) + [Manrope](https://fonts.google.com/specimen/Manrope) via Google Fonts.
Icons: [Lucide](https://lucide.dev/) (bundled locally).

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
2. **Add a file** in `data/systems/` — copy an existing system as a template. Each system calls `registerSystem(id, data)` with: name, publisher, tagline, description, setting, vignette, mechanics, quotes, gallery, resources, groups
3. **Add `_en` fields** for English translations (optional)
4. **Rebuild the bundle**: `npm run bundle`
5. **Deploy**

You can also add systems directly in the app via the built-in editor (saved to localStorage).

## License

MIT. See [LICENSE](LICENSE).

Game art belongs to respective publishers. Used under fair use for non-commercial fan purposes.
