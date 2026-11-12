registerSystem("cain", {
  "groups": {
    "default": { "key": "narrative", "order": 85 },
    "family": { "key": "standalone", "order": 91 },
    "genre": { "key": "horror", "order": 27 }
  },
  "name": "CAIN",
  "publisher": "CHASM",
  // CHASM is Tom Bloom's solo imprint (logo on the cover); sold directly on tombloom.itch.io
  "dice": "d6 pool + risk die",
  "players": "2–5",
  "complexity": 3,
  "foundryStatus": "Community",
  // CHECK: foundryvtt.com/packages/cain — community system by adamkostandy
  "heroImage": "https://sessionzero.games/images/heroes/cain.jpg",
  "playstyleTags": [
    "horror",
    "mystery",
    "combat"
  ],
  "settingTags": ["modern", "weird"],
  "gallery": [
    {
      "src": "https://sessionzero.games/images/systems/cain-g1.jpg"
    },
    {
      "src": "https://sessionzero.games/images/systems/cain-g2.jpg"
    },
    {
      "src": "https://sessionzero.games/images/systems/cain-g3.jpg"
    },
    {
      "src": "https://sessionzero.games/images/systems/cain-g4.jpg"
    }
  ],
  "resources": [
    {
      "type": "link",
      "url": "https://tombloom.itch.io/cain",
      "fmt": "Web"
    },
    {
      "type": "link",
      "url": "https://tombloom.itch.io/cain/devlog",
      "fmt": "Web"
    }
  ],
  "mechanics": [
    {
      "icon": "search"
    },
    {
      "icon": "dices"
    },
    {
      "icon": "heart-crack"
    },
    {
      "icon": "skull"
    }
  ],
  "quotes": [
    // VERIFIED-AT: https://www.polygon.com/tabletop-games/465511/cain-tom-bloom-rpg-interview-lancer-creator/
    {
      "text": "The end result is that with just a handful of photobashed illustrations and some creative typesetting, Cain has an unmatched visual identity.",
      "author": "Hal Hewlett, Polygon"
    },
    // VERIFIED-AT: https://www.polygon.com/tabletop-games/465511/cain-tom-bloom-rpg-interview-lancer-creator/
    {
      "text": "Proud-worn inspirations, inspired visual choices, and a dice system that refuses to let up the pressure — all of this compounds into the amazing feeling that Cain is a game that actually has quite a lot to say.",
      "author": "Hal Hewlett, Polygon"
    }
  ],
  "ru": {
    "tagShort": "Психики-экзорцисты против грехов",
    "tagline": "«Сотри пятно. Не думай слишком много».",
    "description": "CAIN (2024) — нарративный хоррор от Тома Блума, автора Lancer и Maleghast, изданный его импринтом CHASM. Вы — экзорцисты: психические солдаты на службе теневой сверхгосударственной организации CAIN, которые выслеживают и казнят «грехи» — чудовищ, рождённых из человеческой травмы. Чем сильнее вы становитесь, тем ближе к тому, чтобы самим превратиться в грех. Эстетика «стикеркора»: манга, коллаж, служебные записки и пропуска вместо врезок.",
    "setting": "Человечество проклято: в нём бурлит психическое море, порождённое тёмными уголками души. Когда у чувствительного человека сила вырывается наружу на волне страданий, рождается грех. Организация CAIN держит экзорцистов на служебной земле и платит им служебными купонами: неделя отлучки под надзором стоит 15, казнь греха приносит 5. Отсылки — Chainsaw Man, Евангелион, SCP.",
    "vignette": "Охота третий день идёт плохо: мастер (здесь его зовут Admin) уже убил свидетеля и подослал мелких тварей. Экзорцистка наконец загоняет грех в его логово — заброшенную школу. Она рвётся сквозь стену из волос: пул 3d6, выпало 5, 2, 4 — две кости на 4+, у неё получается. Но Admin бросает отдельный кубик риска, и отдача накрывает её: две зарубки на талисмане казни. Талисман заполнен — следующий удар станет травмой. А уровень греха уже у предела: если в конце сцены он перельётся через край, ей придётся сопротивляться — или стать новым грехом.",
    "prep": "~45 мин",
    "mechanics": [
      {
        "title": "Охота: расследование и казнь",
        "text": "Каждая миссия — охота: вы приезжаете в зону кризиса, собираете улики о носителе греха и его травме, а затем входите в логово на казнь. То, что вы узнали о прошлом носителя, ослабляет грех в финальной схватке."
      },
      {
        "title": "Кубик риска",
        "text": "Пул d6 растёт вместе с навыком, успех — 4+. Но последствия решает отдельный кубик риска, который бросает Admin, — поэтому даже опытный экзорцист никогда не идёт без риска. Чем дольше длится охота, тем жёстче давление: Admin режет свидетелей и посылает тварей."
      },
      {
        "title": "Стресс и травмы",
        "text": "Урон экзорцист принимает зарубками на своём талисмане казни. Если талисман полон, вместо новых зарубок получаете травму: стресс сбрасывается, но максимум стресса падает, пока травма не заживёт. Набрали слишком много травм — на грани смерти."
      },
      {
        "title": "Переполнение греха и Имаго",
        "text": "Психические силы (Blasphemies) копят грех. Превысили предел — в конце сцены переполнение: сопротивляйтесь броском и сохраните контроль ценой отметины греха, или сдайтесь — и ваш персонаж станет Имаго, новым грехом под управлением Admin."
      }
    ],
    "gallery": [
      { "cap": "Разворот: экзорцисты и грехи" },
      { "cap": "Обложка CAIN" },
      { "cap": "Богохульство Ardence" },
      { "cap": "Переполнение греха и правила тела" }
    ],
    "resources": [
      { "name": "CAIN на itch.io (официальная страница)" },
      { "name": "Журнал обновлений правил" }
    ],
    "quotes": [
      { "text": "В итоге горстка фотоколлажей и смелая вёрстка дают Cain ни на что не похожую визуальную идентичность." },
      { "text": "Гордо выставленные напоказ источники вдохновения, смелые визуальные решения и система кубов, которая не ослабляет давление ни на миг, — всё это складывается в потрясающее ощущение, что Cain действительно есть что сказать." }
    ]
  },
  "en": {
    "tagShort": "Psychic exorcists hunt trauma-born sins",
    "tagline": "\"Wipe out the stain. Don't think too much.\"",
    "description": "CAIN (2024) is a narrative horror RPG by Tom Bloom, creator of Lancer and Maleghast, published under his CHASM imprint. You play exorcists: psychic soldiers serving a supranational shadow organisation called CAIN, hunting and executing 'sins' — monsters born of human trauma. The stronger you get, the closer you come to becoming a sin yourself. The look is 'stickercore': manga screentone, collage, memos and ID cards in place of sidebars.",
    "setting": "Humanity is cursed with a roiling psychic sea born from the darkest parts of the soul. When a sensitive host's power bursts free through trauma and suffering, a sin appears. CAIN houses its exorcists on company land and pays them in scrip: a week of supervised absence costs 15, executing a sin earns 5. Think Chainsaw Man, Evangelion and the SCP Foundation.",
    "vignette": "Day three of the hunt is going badly: the Admin has already killed a witness and sent minions after the team. The exorcist finally corners the sin in its lair, an abandoned school. She tears through a wall of hair: a 3d6 pool comes up 5, 2, 4 — two dice at 4+, and she gets through. But the Admin rolls the separate risk die and the backlash lands: two slashes on her execution talisman. The talisman is full — the next hit becomes an injury. And her sin is near its limit: if it overflows at the end of the scene, she must resist — or become a sin herself.",
    "prep": "~45 min",
    "mechanics": [
      {
        "title": "Hunts: investigation, then execution",
        "text": "Every mission is a hunt: enter the crisis zone, piece together the sin's host and their trauma, then go into the lair for the execution. What you learn about the host's past can weaken the sin in the final confrontation."
      },
      {
        "title": "The risk die",
        "text": "Your d6 pool grows with your skill, and 4+ is a success. But consequences are governed by a separate risk die rolled by the Admin, so no matter how much an exorcist improves, a roll is never safe. The longer a hunt drags on, the harder the Admin escalates: dead NPCs, minions, a mutating sin."
      },
      {
        "title": "Stress and injuries",
        "text": "Exorcists take harm as slashes on their execution talisman. When the talisman is full, further harm becomes an injury instead: stress clears, but your maximum stress drops while the injury lasts. Stack up enough injuries and you are on the brink of death."
      },
      {
        "title": "Sin overflow and the Imago",
        "text": "Psychic powers (Blasphemies) build up sin. Exceed your limit and you go into sin overflow at the end of the scene: resist with a roll and keep control at the cost of a sin mark, or give up — and your character becomes an Imago, a new sin run by the Admin."
      }
    ],
    "gallery": [
      { "cap": "Spread: exorcists and sins" },
      { "cap": "CAIN cover" },
      { "cap": "The Ardence blasphemy" },
      { "cap": "Sin overflow and the body rules" }
    ],
    "resources": [
      { "name": "CAIN on itch.io (official page)" },
      { "name": "Rules update devlog" }
    ]
  }
});
