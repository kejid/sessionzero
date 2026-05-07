registerSystem("starfinder-2e", {
  "groups": {
    "default": { "key": "tactical", "order": 5 },
    "family": { "key": "standalone", "order": 19 },
    "genre": { "key": "sci-fi", "order": 9 },
    "solo": { "key": "solo-compatible", "order": 13 }
  },
  "name": "Starfinder 2e",
  "publisher": "Paizo",
  "dice": "d20 + mods",
  "players": "3–6",
  "complexity": 4,
  // CHECK: Foundry has an officially partnered, volunteer-developed SF2e module — endorsed by Paizo + Foundry, but not first-party.
  "foundryStatus": "Community",
  "heroImage": "https://cdn.paizo.com/d960ad1b-9967-00f9-1158-72274b18312d/7d90d1d7-fd31-48d5-878b-a2d7ff715e64/PZO260100_SFSS1_Hero.jpg",
  "playstyleTags": [
    "combat",
    "tactical",
    "explore"
  ],
  "settingTags": ["sci-fi"],
  "gallery": [
    {
      "src": "https://cdn.paizo.com/d960ad1b-9967-00f9-1158-72274b18312d/c1f8b24a-7e41-4f95-9c8b-08feaeff5fb7/Starfinder_2ELogo.png"
    },
    {
      "src": "https://cdn.paizo.com/d960ad1b-9967-00f9-1158-72274b18312d/c51a30f9-3626-45b8-b844-ca166a0098a8/PZO22005-HC%20Galactic%20Ancestries%20Cover.jpg"
    },
    {
      "src": "https://cdn.paizo.com/d960ad1b-9967-00f9-1158-72274b18312d/6e110863-ba68-430a-a5d4-e6c862d3abf9/PZO24007_Cover-TalesfromtheVast_1920x1080.jpg"
    },
    {
      "src": "https://cdn.paizo.com/d960ad1b-9967-00f9-1158-72274b18312d/7d90d1d7-fd31-48d5-878b-a2d7ff715e64/PZO260100_SFSS1_Hero.jpg"
    }
  ],
  "resources": [
    {
      "type": "link",
      "url": "https://paizo.com/starfinder",
      "fmt": "Web"
    },
    {
      "type": "sheet",
      "url": "https://downloads.paizo.com/StarfinderSecondEdition_CharacterSheet.pdf",
      "fmt": "PDF"
    },
    {
      "type": "quickstart",
      "url": "https://paizo.com/starfinderplaytest",
      "fmt": "Web"
    },
    {
      "type": "link",
      "url": "https://2e.aonsrd.com/",
      "fmt": "SRD"
    }
  ],
  "mechanics": [
    {
      "icon": "rocket"
    },
    {
      "icon": "swords"
    },
    {
      "icon": "cog"
    },
    {
      "icon": "users"
    }
  ],
  "quotes": [
    // VERIFIED-AT: https://www.enworld.org/threads/starfinder-second-edition-playtest-review.706833/
    {
      "text": "This makes Starfinder and Pathfinder completely compatible, so if you want Gunslingers in space or Envoys on Golorian, you can have them.",
      "author": "Dawn Dalton, EN World"
    },
    // VERIFIED-AT: https://gamingtrend.com/reviews/starfinder-2nd-edition-player-core-review-the-precision-of-pf2e-now-with-plasma-rifles/
    {
      "text": "Each character will feel a bit more unique in the second edition, with each class feeling like it serves more of a unique purpose.",
      "author": "Raven Winters, Gaming Trend"
    }
  ],
  "ru": {
    "tagShort": "Тактическая космоопера на движке PF2e",
    "tagline": "«Pathfinder 2e, но с лазерами, дрифт-двигателями и мистиком в скафандре».",
    "description": "Второе издание Starfinder (август 2025) — полная переработка космической d20-системы Paizo на движке Pathfinder 2e Remastered. Та же 3-экшен-экономика, тот же кранч, но в декорациях далёкого будущего: классы вроде envoy, mystic, soldier, operative, witchwarper, mechanic, solarian, наследия (ancestries) от андроидов до касатхи, и — главное — полная кросс-совместимость с PF2e. Ваш пэйнфайндеровский паладин может зайти на космический корабль, и правила работают.",
    "setting": "Pact Worlds — содружество планет вокруг звёзды-близнеца, удерживаемое мирным договором между разными расами. Космос пересекают на Drift-двигателях — пробивая плазменное подпространство, придуманное богиней Триуной после Gap, столетнего провала в памяти всей галактики. Никто не помнит, что было до Gap, и это — ключевая загадка сеттинга. Технология и магия работают рядом: соларианец с гравитационным мечом сражается рядом с механиком и его дроном-компаньоном.",
    "vignette": "Ваш дредноут-фрегат вынырнул из Drift у астероида с пиратской базой. Пилот-оперативник бросает Piloting на манёвр — три экшена: Манёвр, Огонь, Перезарядка. Соларианец в невесомости переключает форму звезды с фотонной на гравитационную — третий экшен ушёл в Flare. Мистик читает заклинание сквозь стекло шлема — соматический компонент в перчатке скафандра, проверка на Concentrate. Андроид-механик с дрона взламывает турель противника — Computers DC 22, успех. Капитан кричит: «Стрелять!» — и ваш плазменный канон делает критический урон. Pathfinder, но в космосе. Тот же ритм, тот же вкус.",
    "prep": "~30–60 мин",
    "mechanics": [
      {
        "title": "3-экшен экономика",
        "text": "Тот же движок, что в PF2e Remastered: три экшена + реакция за ход. Move-Strike-Strike, или Cast-Aim-Fire, или что-то экзотическое. Решения принимаются быстро."
      },
      {
        "title": "Звездолёт как персонаж",
        "text": "Корабль — отдельный «персонаж» с ролями экипажа: пилот, наводчик, инженер, капитан, учёный. У каждого свой ход, свои броски, свои крит-эффекты. Звёздные бои — мини-игра."
      },
      {
        "title": "Полная совместимость с PF2e",
        "text": "Ancestries, классы, заклинания, фиты — всё работает в обе стороны. Можно водить смешанные кампании: фэнтези-герой попадает в космос, или мистик-соларианец заглядывает в Голарион."
      },
      {
        "title": "Магия + техника",
        "text": "Mystic и witchwarper кастуют заклинания. Mechanic чинит дрона. Solarian черпает силу из звёзд. Operative взламывает терминалы. Все играют рядом — ни одна школа не «лишняя»."
      }
    ],
    "gallery": [
      {
        "cap": "Логотип Starfinder 2e"
      },
      {
        "cap": "Galactic Ancestries"
      },
      {
        "cap": "Tales from the Vast"
      },
      {
        "cap": "Invasion's Edge"
      }
    ],
    "resources": [
      {
        "name": "Официальный сайт"
      },
      {
        "name": "Лист персонажа"
      },
      {
        "name": "Бесплатный Playtest PDF"
      },
      {
        "name": "Archives of Nethys SRD"
      }
    ]
  ,
    "quotes": [
      { "text": "Это делает Starfinder и Pathfinder полностью совместимыми: хотите Стрелков в космосе или Послов на Голарионе — пожалуйста." },
      { "text": "Во втором издании каждый персонаж ощущается чуть более уникальным — у каждого класса появляется собственная, более чётко выраженная роль." }
    ]
  },
  "en": {
    "tagShort": "Tactical space-opera on the PF2e engine",
    "tagline": "\"Pathfinder 2e, but with plasma rifles, drift drives, and a mystic in a spacesuit.\"",
    "description": "Starfinder Second Edition (August 2025) is Paizo's full rebuild of their space d20 system on the Pathfinder 2e Remastered chassis. Same 3-action economy, same tactical crunch, but in a far-future setting: classes like envoy, mystic, soldier, operative, witchwarper, mechanic, and solarian; ancestries from androids to kasatha; and — crucially — full cross-compatibility with PF2e. Your Pathfinder paladin can step onto a starship, and the rules just work.",
    "setting": "The Pact Worlds — a confederation of planets around a binary star, held together by a peace treaty between wildly different species. Ships cross the void via the Drift, a plasma-subspace dimension carved out by the goddess Triune after the Gap — a galaxy-wide century of erased memory. Nobody remembers what came before the Gap, and that mystery is the setting's hook. Tech and magic share the table: a solarian wields a gravity blade beside a mechanic and her drone companion.",
    "vignette": "Your dreadnought-frigate drops out of the Drift near an asteroid pirate base. The pilot-operative rolls Piloting for the maneuver — three actions: Манёвр, Огонь, Перезарядка. The solarian in zero-g flips their star form from photon to graviton — third action burned on a Flare. The mystic casts through their helmet visor — somatic component in a glove, Concentrate check. The android mechanic's drone hacks the enemy turret — Computers DC 22, success. The captain shouts: \"Fire!\" — and your plasma cannon crits. Pathfinder, but in space. Same rhythm, same flavor.",
    "prep": "~30–60 min",
    "mechanics": [
      {
        "title": "3-action economy",
        "text": "Same engine as PF2e Remastered: three actions + a reaction per turn. Move-Strike-Strike, or Cast-Aim-Fire, or something exotic. Decisions land fast."
      },
      {
        "title": "Starship as a character",
        "text": "Your ship is its own \"character\" with crew roles: pilot, gunner, engineer, captain, science officer. Each gets a turn, their own checks, their own crits. Space combat is a tight mini-game."
      },
      {
        "title": "Full PF2e compatibility",
        "text": "Ancestries, classes, spells, feats — they cross over both ways. You can run mixed campaigns: a fantasy hero crash-lands in space, or a solarian peeks into Golarion."
      },
      {
        "title": "Magic meets tech",
        "text": "Mystic and witchwarper cast spells. Mechanic repairs a drone. Solarian draws power from stars. Operative hacks terminals. Every school sits at the same table — none is filler."
      }
    ],
    "gallery": [
      {
        "cap": "Starfinder 2e logo"
      },
      {
        "cap": "Galactic Ancestries"
      },
      {
        "cap": "Tales from the Vast"
      },
      {
        "cap": "Invasion's Edge"
      }
    ],
    "resources": [
      {
        "name": "Official website"
      },
      {
        "name": "Character sheet"
      },
      {
        "name": "Free Playtest PDF"
      },
      {
        "name": "Archives of Nethys SRD"
      }
    ]
  }
});
