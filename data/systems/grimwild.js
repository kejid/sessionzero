registerSystem("grimwild", {
  "groups": {
    "default": { "key": "narrative", "order": 83 },
    "family": { "key": "pbta-fitd", "order": 42 },
    "genre": { "key": "adventure", "order": 47 }
  },
  "name": "Grimwild",
  "publisher": "Oddity Press",
  "dice": "d6 pool + d8 thorns",
  "players": "3–5",
  "complexity": 2,
  "free": true,
  // Oddity Press released the Free Edition (chapters 1–6) under CC BY 4.0; the 2026 Community Edition is also free
  "foundryStatus": "Community",
  // CHECK: foundryvtt.com/packages/grimwild — community system by Asacolips
  "heroImage": "https://sessionzero.games/images/heroes/grimwild.jpg",
  "playstyleTags": [
    "combat",
    "explore",
    "narrative"
  ],
  "settingTags": ["fantasy"],
  "gallery": [
    {
      "src": "https://sessionzero.games/images/systems/grimwild-g1.jpg"
    },
    {
      "src": "https://sessionzero.games/images/systems/grimwild-g2.jpg"
    },
    {
      "src": "https://sessionzero.games/images/systems/grimwild-g3.jpg"
    },
    {
      "src": "https://sessionzero.games/images/systems/grimwild-g4.jpg"
    }
  ],
  "resources": [
    {
      "type": "link",
      "url": "https://www.backerkit.com/c/projects/OddityPress/grimwild",
      "fmt": "Web"
    },
    {
      "type": "quickstart",
      "url": "https://groov-games.itch.io/grimwild-community-edition",
      "fmt": "PDF"
    }
  ],
  "mechanics": [
    {
      "icon": "dice-6"
    },
    {
      "icon": "flower"
    },
    {
      "icon": "hourglass"
    },
    {
      "icon": "sparkles"
    }
  ],
  "quotes": [
    // VERIFIED-AT: https://cannibalhalflinggaming.com/2025/02/13/is-grimwild-the-next-dungeon-world/
    {
      "text": "It’s not an indie version of D&D, it’s a version of D&D that’s delivering on the playstyle and the tropes of D&D in a distilled and easy to grasp package.",
      "author": "Aaron Marks, Cannibal Halfling Gaming"
    },
    // VERIFIED-AT: https://cannibalhalflinggaming.com/2025/02/13/is-grimwild-the-next-dungeon-world/
    {
      "text": "Clocks are replaced by Diminishing Pools, a mechanic I rather like.",
      "author": "Aaron Marks, Cannibal Halfling Gaming"
    }
  ],
  "ru": {
    "tagShort": "Кинематографичное фэнтези на пуле d6",
    "tagline": "«Хватай самый высокий куб и надейся, что шипы промолчат».",
    "description": "Grimwild (2024) — героическое фэнтези от J. D. Maxwell и Oddity Press: знакомые классы вроде воина, плута и волшебника, но на движке в духе Blades in the Dark. Бросаете пул d6, смотрите на высший куб, мастер добавляет d8-«шипы» за сложность. Бесплатная редакция под CC BY 4.0 взяла золотой ENnie 2025 как лучший бесплатный продукт. Автор пропал со связи в 2025-м, и сообщество выпустило бесплатную Community Edition.",
    "setting": "Без жёсткого сеттинга: классическое приключенческое фэнтези с подземельями, руинами и дикими землями. Карту региона, поселений и даже подземелий партия рисует вместе с мастером по ходу игры — узлами и тропами, как в пойнткроуле. Готовые модули и чужие сеттинги переносятся легко.",
    "vignette": "Плут лезет по стене башни, пока стража не обернулась. Ловкость 2 плюс одна искра — 3d6. Стена мокрая, и мастер добавляет за сложность один шип-d8. Выпало 6, 3, 2 — «идеально»… но на шипе 8, и результат срезается до «грязного». Плут на крыше, а мастер делает ход последствий: черепица с грохотом летит во двор. Мастер бросает пул «Тревога» из 4d6: 1, 5, 2, 6 — две кости ниже четвёрки уходят, в пуле осталось две. Когда опустеет — стража будет здесь.",
    "prep": "~20 мин",
    "mechanics": [
      {
        "title": "Идеально, грязно, мрачно",
        "text": "Пул d6, считается только высший куб: 6 — «идеально» (чистый успех), 4–5 — «грязно» (успех с проблемой), 1–3 — «мрачно» (провал с проблемой). Две шестёрки — критический успех, его уже не срезать."
      },
      {
        "title": "Шипы",
        "text": "Сложность — это не штраф к кубам, а d8-«шипы» в пуле. 7 или 8 на шипе срезает результат на ступень. «Мрачно», срезанное шипом, превращается в катастрофу — зато игрок получает искру."
      },
      {
        "title": "Убывающие пулы",
        "text": "Вместо часов-счётчиков — пулы d6. Когда событие продвигается, мастер бросает пул и убирает каждую кость с 1–3. Пул опустел — что-то случилось: пришла стража, рухнул мост, выдохлась способность."
      },
      {
        "title": "Искра и история",
        "text": "Искра — топливо героя: каждая даёт +1d к броску, копится от катастроф и закрытых сюжетных арок. Дважды за сессию игрок может добавить в сцену деталь о своём персонаже, а карту мира партия расширяет общими жетонами."
      }
    ],
    "gallery": [
      { "cap": "Монстры тоже играют в Grimwild" },
      { "cap": "Партия на утёсе над долиной" },
      { "cap": "Обложка Community Edition" },
      { "cap": "Разворот с базовыми правилами" }
    ],
    "resources": [
      { "name": "Страница проекта Oddity Press (BackerKit)" },
      { "name": "Community Edition — бесплатно (itch.io)" }
    ],
    "quotes": [
      { "text": "Это не инди-версия D&D, а версия D&D, которая выдаёт стиль игры и тропы D&D в концентрированной и лёгкой для освоения упаковке." },
      { "text": "Часы здесь заменены убывающими пулами — механика, которая мне очень нравится." }
    ]
  },
  "en": {
    "tagShort": "Cinematic heroic fantasy on a d6 pool",
    "tagline": "\"Grab the highest die and pray the thorns stay quiet.\"",
    "description": "Grimwild (2024) is a heroic fantasy RPG by J. D. Maxwell and Oddity Press: familiar classes like the fighter, rogue and wizard, run on a Blades in the Dark-style engine. Roll a pool of d6, read the highest die, and let the GM add d8 'thorns' for difficulty. The CC BY 4.0 Free Edition won the 2025 gold ENnie for Best Free Product. The designer went silent in 2025, and the community has since released a free Community Edition.",
    "setting": "No fixed setting: classic adventure fantasy with dungeons, ruins and wild country. The party and GM draw the region, settlements and even dungeons together during play, as nodes and paths in a pointcrawl. Published modules and other settings port in easily.",
    "vignette": "The rogue climbs the tower wall before the guards turn around. Agility 2 plus one spark — 3d6. The stones are slick, so the GM adds one d8 thorn for difficulty. The dice show 6, 3, 2 — perfect… but the thorn lands on 8 and cuts it to messy. The rogue reaches the roof, and the GM makes an impact move: a tile clatters into the courtyard. The GM rolls the 4d6 'Alarm' pool: 1, 5, 2, 6 — the two dice under 4 drop out, two remain. When the pool is empty, the guards arrive.",
    "prep": "~20 min",
    "mechanics": [
      {
        "title": "Perfect, messy, grim",
        "text": "Roll a d6 pool and keep only the highest die: 6 is perfect (clean success), 4–5 is messy (success with trouble), 1–3 is grim (failure with trouble). Two or more 6s is a critical, which can't be cut."
      },
      {
        "title": "Thorns",
        "text": "Difficulty isn't a penalty to your dice — it's d8 thorns added to the pool. A 7 or 8 on a thorn cuts the result one step. A grim result cut by a thorn becomes a disaster, and the player gains spark."
      },
      {
        "title": "Diminishing pools",
        "text": "Clocks are replaced by pools of d6. When an event advances, the GM rolls the pool and removes every die showing 1–3. When the pool is empty, something happens: the guards show up, the bridge collapses, an ability runs dry."
      },
      {
        "title": "Spark and story",
        "text": "Spark is protagonist fuel: each one adds +1d to a roll, earned from disasters and resolved story arcs. Twice per session a player can add a detail about their character to the scene, and the party expands the world map with shared tokens."
      }
    ],
    "gallery": [
      { "cap": "Monsters play Grimwild too" },
      { "cap": "The party on a clifftop above the valley" },
      { "cap": "Community Edition cover" },
      { "cap": "Core rules spread" }
    ],
    "resources": [
      { "name": "Oddity Press project page (BackerKit)" },
      { "name": "Community Edition — free (itch.io)" }
    ]
  }
});
