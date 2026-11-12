registerSystem("mutants-and-masterminds", {
  "groups": {
    "default": { "key": "tactical", "order": 15 },
    "family": { "key": "standalone", "order": 86 },
    "genre": { "key": "adventure", "order": 45 }
  },
  "name": "Mutants & Masterminds",
  "publisher": "Green Ronin Publishing",
  "dice": "d20 + bonus vs DC",
  "players": "3–6",
  "complexity": 4,
  "foundryStatus": "Community", // CHECK: community "mutants-and-masterminds-3e" system (Zakarik) on foundryvtt.com; official Green Ronin-licensed module by Immersive Realms in beta since Aug 2026
  "heroImage": "https://sessionzero.games/images/heroes/mutants-and-masterminds.jpg",
  "playstyleTags": [
    "combat",
    "tactical",
    "social"
  ],
  "settingTags": ["modern"],
  "gallery": [
    {
      "src": "https://sessionzero.games/images/systems/mutants-and-masterminds-g1.jpg"
    },
    {
      "src": "https://sessionzero.games/images/systems/mutants-and-masterminds-g2.webp"
    },
    {
      "src": "https://sessionzero.games/images/systems/mutants-and-masterminds-g3.jpg"
    },
    {
      "src": "https://sessionzero.games/images/systems/mutants-and-masterminds-g4.jpg"
    }
  ],
  "resources": [
    {
      "type": "link",
      "url": "https://greenronin.com/mutants-masterminds/",
      "fmt": "Web"
    },
    {
      "type": "link",
      "url": "https://greenroninstore.com/products/mutants-masterminds-deluxe-heros-handbook",
      "fmt": "Web"
    },
    {
      "type": "quickstart",
      "url": "https://greenroninstore.com/products/m-m-match-ups-free-mutants-masterminds-fourth-edition-pdf",
      "fmt": "PDF"
    },
    {
      "type": "link",
      "url": "https://www.d20herosrd.com/",
      "fmt": "Web"
    }
  ],
  "mechanics": [
    {
      "icon": "blocks"
    },
    {
      "icon": "shield"
    },
    {
      "icon": "star"
    },
    {
      "icon": "gauge"
    }
  ],
  "quotes": [
    // VERIFIED-AT: https://gamingtrend.com/reviews/supers-supers-everywhere-atlas-of-earth-prime-review/
    {
      "text": "Its blend of flexible character creation, fast resolution, and modifiable powers has helped to cement it as a game that is both deep and approachable.",
      "author": "John Farrell, Gaming Trend"
    },
    // VERIFIED-AT: https://www.belloflostsouls.net/2021/05/mutants-and-masterminds-lets-anyone-become-a-superhero-rpg-spotlight.html
    {
      "text": "It’s simple enough for a green player to learn on, but still open enough for the most outlandish concepts your GM decides to throw onto the table.",
      "author": "Meaghan Colleran, Bell of Lost Souls"
    }
  ],
  "ru": {
    "tagShort": "Супергеройская RPG на d20",
    "tagline": "«Собери любого героя из комиксов — и спаси город до рекламной паузы».",
    "description": "Самая известная универсальная супергеройская RPG. Движок d20 без классов и хитов: героя собирают из очков силы, а любую способность — от полёта до контроля разума — конструируют из «эффектов» с модификаторами. Уровень силы держит команду в балансе. Сейчас в ходу 3-я редакция (2011); 4-ю Green Ronin собрала на Kickstarter в начале 2026 года, публичный плейтест вышел в 2025-м, а релиз намечен на конец 2026-го.",
    "pickIf": ["хотите собрать любую суперсилу из эффектов и модификаторов", "группе нравится строить героев по очкам и тактические бои", "нужна одна система и для уличных мстителей, и для космических героев"],
    "skipIf": ["игроки хотят начать без долгой генерации", "хотите подростковую драму, а не силы и бои", "нужны готовые герои Marvel, а не собственные"],
    "setting": "Earth-Prime — вселенная комиксов с полувековой историей: Freedom City с его легендарными командами, Emerald City, тайные организации, пришельцы и путешествия во времени. Но сеттинг необязателен: правила одинаково держат и уличных линчевателей, и космических богов, так что можно играть в собственный мир или фанатскую версию любимой серии.",
    "vignette": "Злодей бьёт энергетическим лучом с Уроном 10 — сложность спасброска Стойкости 15 + 10 = 25. У вашей героини Стойкость 10, на d20 выпадает 9: итог 19, провал на 6, то есть на две степени. Она ошеломлена (Dazed) и получает −1 ко всем следующим броскам Стойкости. Мастер тут же включает её осложнение — «Тайная личность»: внизу мелькает репортёр с камерой. Зато за осложнение положено Очко героя. Вы тратите его, чтобы стряхнуть оглушение, и отвечаете: d20 + 12 к атаке против Уклонения злодея (10 + 8 = 18). Выпало 11 — попадание.",
    "prep": "~45 мин",
    "mechanics": [
      {
        "title": "Силы из конструктора",
        "text": "Готовых списков заклинаний нет. Огненный шар — это эффект «Урон» с дальностью и площадью, телепортация — «Перемещение» с нужными модификаторами. Любую идею из комикса можно собрать и оценить в очках."
      },
      {
        "title": "Без хитов",
        "text": "Попадание вызывает спасбросок Стойкости против 15 + ранг урона. Чем сильнее провал, тем хуже состояние: −1 к Стойкости, ошеломлён, шатается, выведен из строя. Бой короткий и кинематографичный."
      },
      {
        "title": "Очки героя и осложнения",
        "text": "Очки героя дают переброс, правку сцены или мгновенное восстановление. Получают их, когда мастер включает осложнения персонажа: тайную личность, обязательства, заклятого врага."
      },
      {
        "title": "Уровень силы",
        "text": "Уровень силы (Power Level) ограничивает атаку, защиту и урон. Летающий кирпич и хрупкий снайпер оказываются в одном весе — команда сбалансирована, но каждый герой уникален."
      }
    ],
    "gallery": [
      {
        "cap": "Обложка плейтеста 4-й редакции"
      },
      {
        "cap": "Hero's Handbook, 4-я редакция"
      },
      {
        "cap": "Hero High: школа юных героев"
      },
      {
        "cap": "Deluxe Hero's Handbook, 3-я редакция"
      }
    ],
    "resources": [
      {
        "name": "Официальная страница Green Ronin"
      },
      {
        "name": "Deluxe Hero's Handbook (3-я редакция)"
      },
      {
        "name": "M&M Match-Ups — бесплатное превью 4-й редакции"
      },
      {
        "name": "Бесплатный SRD 3-й редакции (d20 Hero SRD)"
      }
    ],
    "quotes": [
      { "text": "Сочетание гибкого создания персонажа, быстрых бросков и настраиваемых сил закрепило за ней репутацию игры одновременно глубокой и доступной." },
      { "text": "Она достаточно проста, чтобы на ней учился новичок, и при этом достаточно открыта для самых безумных идей, которые мастер решит выкатить на стол." }
    ]
  },
  "en": {
    "tagShort": "The d20 superhero RPG",
    "tagline": "\"Build any hero from the comics — and save the city before the next panel.\"",
    "description": "The best-known generic superhero RPG. A d20 engine with no classes and no hit points: heroes are built with power points, and every ability, from flight to mind control, is assembled from effects and modifiers. Power Level keeps the team balanced. Third edition (2011) is the current game; Green Ronin crowdfunded fourth edition on Kickstarter in early 2026 after a public playtest in 2025, with release planned for late 2026.",
    "pickIf": ["you want to build any superhero power from effects and modifiers", "your group enjoys point-buy character design and tactical fights", "you want one ruleset for street vigilantes and cosmic heroes alike"],
    "skipIf": ["your players want to jump in without a long character build", "you want teen drama over powers and combat", "you want ready-made Marvel heroes instead of your own"],
    "setting": "Earth-Prime is a comic-book universe with decades of history: Freedom City and its legendary teams, Emerald City, secret societies, alien invasions and time travel. The setting is optional, though. The rules handle street-level vigilantes and cosmic gods equally well, so you can play in your own world or your take on a favorite series.",
    "vignette": "The villain fires an energy blast with Damage 10, so the Toughness resistance DC is 15 + 10 = 25. Your hero has Toughness 10 and rolls a 9 on the d20: total 19, a miss by 6, which is two degrees of failure. She's dazed and takes −1 on further Toughness checks. The GM triggers her Secret Identity complication: a news photographer is filming from the street below. That complication earns a Hero Point, and you spend it to shake off the daze. You strike back: d20 + 12 attack against the villain's Dodge (10 + 8 = 18). You roll 11 — a hit.",
    "prep": "~45 min",
    "mechanics": [
      {
        "title": "Effects-based powers",
        "text": "No spell lists. A fireball is the Damage effect with ranged and area modifiers; teleportation is Movement with the right extras. Any idea from the comics can be built and priced in points."
      },
      {
        "title": "No hit points",
        "text": "A hit forces a Toughness check against 15 + damage rank. The worse you fail, the worse your condition: −1 Toughness, dazed, staggered, incapacitated. Fights stay short and cinematic."
      },
      {
        "title": "Hero Points and complications",
        "text": "Hero Points buy rerolls, scene edits and instant recovery. You earn them when the GM invokes your complications: a secret identity, a responsibility, an arch-enemy."
      },
      {
        "title": "Power Level",
        "text": "Power Level caps attack, defense and damage. The flying brick and the fragile sharpshooter end up in the same weight class: the team is balanced, yet every hero plays differently."
      }
    ],
    "gallery": [
      {
        "cap": "Fourth edition playtest cover"
      },
      {
        "cap": "Hero's Handbook, fourth edition"
      },
      {
        "cap": "Hero High: a school for young heroes"
      },
      {
        "cap": "Deluxe Hero's Handbook, third edition"
      }
    ],
    "resources": [
      {
        "name": "Official Green Ronin page"
      },
      {
        "name": "Deluxe Hero's Handbook (3rd edition)"
      },
      {
        "name": "M&M Match-Ups — free 4th edition preview"
      },
      {
        "name": "Free 3rd edition SRD (d20 Hero SRD)"
      }
    ]
  }
});
