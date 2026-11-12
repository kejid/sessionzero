registerSystem("wfrp", {
  "groups": {
    "default": { "key": "tactical", "order": 9 },
    "family": { "key": "standalone", "order": 28 },
    "genre": { "key": "dark-fantasy", "order": 2.5 }
  },
  "name": "Warhammer Fantasy Roleplay",
  "publisher": "Cubicle 7",
  "dice": "d100",
  "players": "3–5",
  "complexity": 3,
  "free": true,
  "foundryStatus": "Official",
  "heroImage": "https://sessionzero.games/images/heroes/wfrp.jpg",
  "playstyleTags": [
    "combat",
    "explore",
    "narrative"
  ],
  "settingTags": ["fantasy"],
  "gallery": [
    {
      "src": "https://sessionzero.games/images/systems/wfrp-g1.jpg"
    },
    {
      "src": "https://sessionzero.games/images/systems/wfrp-g2.jpg"
    },
    {
      "src": "https://sessionzero.games/images/systems/wfrp-g3.jpg"
    }
  ],
  "resources": [
    {
      "type": "link",
      "url": "https://wfrp.wiki/",
      "fmt": "Web"
    },
    {
      "type": "link",
      "url": "https://cubicle7games.com/en_GB/warhammer-fantasy-roleplay-rulebook-pdf",
      "fmt": "Web"
    },
    {
      "type": "quickstart",
      "url": "https://foundryvtt.com/packages/wfrp4e",
      "fmt": "Web"
    }
  ],
  "mechanics": [
    {
      "icon": "swords"
    },
    {
      "icon": "dices"
    },
    {
      "icon": "book-open"
    },
    {
      "icon": "scroll"
    }
  ],
  "quotes": [
    // VERIFIED-AT: https://sablemage.blogspot.com/2025/08/review-warhammer-fantasy-roleplay-4th.html
    {
      "text": "The Between Adventures chapter is one of the better approaches I've seen to handling downtime. Nicely done.",
      "author": "Andy Slack, Halfway Station"
    },
    // VERIFIED-AT: https://gmshoe.wordpress.com/2019/05/27/review-warhammer-fantasy-roleplay-4th-edition/
    {
      "text": "The full-color artwork throughout the book is both consistent and outstanding. I particularly appreciate the moody landscapes that capture the feel of the Reikland.",
      "author": "The Hardboiled GMshoe"
    }
  ],
  "ru": {
    "tagShort": "Гримдарк-фэнтези на d100",
    "tagline": "«Мрачный, опасный мир — карьеры, криты и безумие магии».",
    "description": "Warhammer Fantasy Roleplay — настольная RPG в жанре гримдарк-фэнтези на системе d100 (процентные кубики), созданная Games Workshop и изданная Cubicle 7 (4-е издание, 2018). 64 карьеры с пошаговым продвижением, попадания по локациям, критические ранения, система преимуществ (Advantage) и опасная магия с таблицами провалов колдовства. Мир Старого Света — готическое средневековье с чернокнижниками, скавенами и культами.",
    "pickIf": ["хотите мрачное приземлённое фэнтези, где герои начинают крестьянами и мелким людом", "группе нравятся рост по карьерам и жёсткий бой с зонами попаданий", "хочется готических расследований культов и скверны в Империи"],
    "skipIf": ["нужно героическое фэнтези с сильными персонажами с первой сессии", "игроки болезненно воспринимают увечья и смерть от одной неудачной критической травмы"],
    "setting": "Старый Мир — Империя, земля, где коррумпированные дворяне, фанатичные охотники на ведьм и простые крестьяне выживают между войнами, чумой и вторжениями скавенов. Каждый город — отдельная история, каждый трактир — начало приключения (или конца).",
    "vignette": "Маг из Коллегий творит заклинание — проверка Языка (Магия) на d100: 33. Успех! Но погодите — дубль. Провал колдовства! Дрожащие руки, зелёные искры. Соседи в ужасе. Охотник на ведьм уже стучит в дверь. А гном-шахтёр просто хочет допить своё пиво и вернуться в шахту. Добро пожаловать в Старый Мир.",
    "prep": "~15 мин",
    "mechanics": [
      {
        "title": "Процентные кубики (d100)",
        "text": "Бросок d100 против навыка: чем меньше результат, тем лучше. Степени успеха (Success Levels) — разница в десятках между навыком и броском. В бою дубль при успехе — критическое попадание, дубль при провале — нелепая неудача."
      },
      {
        "title": "Карьерная система",
        "text": "64 карьеры от слуги до охотника на ведьм. Каждая с 4 рангами продвижения: от ученика до мастера. Продвижение стоит XP и открывает новые навыки, таланты и социальный статус."
      },
      {
        "title": "Попадания по локациям",
        "text": "При попадании бросок по таблице определяет часть тела: голова, рука, нога... Броня защищает каждую часть тела отдельно. Критические ранения — от забитого пальца до мгновенной смерти."
      },
      {
        "title": "Преимущество (Advantage)",
        "text": "Победил во встречной проверке, атаковал с разбега или перехитрил врага — получаешь Преимущество, и оно копится: каждое очко даёт +10 к проверкам в бою. Проиграл встречную проверку или получил рану — всё обнуляется. Бой превращается в борьбу за перевес."
      }
    ],
    "gallery": [
      {
        "cap": "Обложка (Cubicle 7)"
      },
      {
        "cap": "Starter Set — обложка"
      },
      {
        "cap": "Сравнение 1-го и 4-го изданий"
      }
    ],
    "resources": [
      {
        "name": "WFRP Wiki (бесплатный SRD)"
      },
      {
        "name": "Cubicle 7 — PDF правила"
      },
      {
        "name": "Foundry VTT — официальная система"
      }
    ],
    "quotes": [
      { "text": "Глава о межсессиях — один из лучших подходов к обработке даунтайма, которые я видел. Отлично сделано." },
      { "text": "Цветные иллюстрации по всей книге выглядят цельно и великолепно. Особенно впечатляют мрачные пейзажи, передающие атмосферу Рейкланда." }
    ]
  },
  "en": {
    "tagShort": "Grimdark d100 fantasy with careers",
    "tagline": "\"A grim world of perilous adventure — careers, crits, and magic miscasts.\"",
    "description": "Warhammer Fantasy Roleplay is a grimdark fantasy tabletop RPG built on the d100 percentile system, created by Games Workshop and published by Cubicle 7 (4th Edition, 2018). 64 careers with step-by-step advancement, hit locations, critical injuries, the Advantage system, and wild magic with miscast tables. The Old World is gothic medievalism with witches, Skaven, and cults lurking in every shadow.",
    "pickIf": ["you want grim low fantasy where heroes start as peasants and petty careers", "your group likes career progression and brutal combat with hit locations", "you want gothic investigations of cults and corruption in the Empire"],
    "skipIf": ["you want heroic high fantasy with powerful characters from the start", "players hate characters being maimed or killed by one bad critical"],
    "setting": "The Old World — the Empire, a land where corrupt nobles, fanatical Witch Hunters, and simple peasants survive between wars, plague, and Skaven incursions. Every city is its own story, every tavern the start of an adventure (or its end).",
    "vignette": "A College wizard casts a spell — a d100 Language (Magick) test: 33. Success! But wait — doubles. A Miscast! Trembling hands, green sparks. Neighbors in horror. The Witch Hunter is already pounding on the door. And the Dwarf just wants to finish his beer and get back to the mine. Welcome to the Old World.",
    "prep": "~15 min",
    "mechanics": [
      {
        "title": "Percentile Dice (d100)",
        "text": "Roll d100 against your skill: the lower the result, the better. Success Levels count the difference in tens between your skill and the roll. In combat, doubles on a successful roll are a Critical, doubles on a failed roll a Fumble."
      },
      {
        "title": "Career System",
        "text": "64 careers from peasant to Witch Hunter. Each with 4 advancement tiers: from novice to master. Advancement costs XP and unlocks new skills, talents, and social standing."
      },
      {
        "title": "Hit Locations",
        "text": "On a hit, a roll determines the body part: head, arm, leg... Armour protects each location separately. Critical injuries range from a bruised finger to instant death."
      },
      {
        "title": "Advantage",
        "text": "Win an opposed test in combat, charge, or outmanoeuvre a foe and you gain Advantage, which stacks: each point adds +10 to your combat tests. Lose an opposed test or take a wound and it all drops to zero. Combat becomes a fight for momentum."
      }
    ],
    "gallery": [
      {
        "cap": "Core Rulebook (Cubicle 7)"
      },
      {
        "cap": "Starter Set — cover"
      },
      {
        "cap": "1st vs 4th edition cover comparison"
      }
    ],
    "resources": [
      {
        "name": "WFRP Wiki (free SRD)"
      },
      {
        "name": "Cubicle 7 — PDF rulebook"
      },
      {
        "name": "Foundry VTT — official system"
      }
    ],
    "quotes": [
      { "text": "I love the Between Adventures chapter, the acknowledgement that we all have our own take on the setting, and the Small but Vicious Dog still being there." },
      { "text": "The full-color artwork throughout the book is both consistent and outstanding. I particularly appreciate the moody landscapes that capture the feel of the Reikland." }
    ]
  }
});
