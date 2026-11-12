registerSystem("ryuutama", {
  "groups": {
    "default": { "key": "narrative", "order": 91 },
    "family": { "key": "standalone", "order": 92 },
    "genre": { "key": "adventure", "order": 54 }
  },
  "name": "Ryuutama",
  "publisher": "Kotodama Heavy Industries",
  "dice": "2 stat dice (d4–d12)",
  "players": "2–6",
  "complexity": 2,
  // CHECK: Foundry system "ryuutama" is by Zhell (community), distributed with Kotodama's explicit permission — not first-party.
  "foundryStatus": "Community",
  "heroImage": "https://sessionzero.games/images/heroes/ryuutama.jpg",
  "playstyleTags": [
    "explore",
    "social",
    "narrative"
  ],
  "settingTags": ["fantasy"],
  "gallery": [
    {
      "src": "https://sessionzero.games/images/systems/ryuutama-g1.jpg"
    },
    {
      "src": "https://sessionzero.games/images/systems/ryuutama-g2.jpg"
    },
    {
      "src": "https://sessionzero.games/images/systems/ryuutama-g3.jpg"
    },
    {
      "src": "https://sessionzero.games/images/systems/ryuutama-g4.jpg"
    }
  ],
  "resources": [
    {
      "type": "link",
      "url": "https://kotohi.com/ryuutama",
      "fmt": "Web"
    },
    {
      "type": "link",
      "url": "https://kotodama.itch.io/ryuutama-natural-fantasy-roleplay",
      "fmt": "PDF"
    }
  ],
  "mechanics": [
    {
      "icon": "footprints"
    },
    {
      "icon": "egg"
    },
    {
      "icon": "dices"
    },
    {
      "icon": "cloud-sun"
    }
  ],
  "quotes": [
    // VERIFIED-AT: https://cannibalhalflinggaming.com/2016/12/05/the-independents-ryuutama/
    {
      "text": "The ability to craft the setting to fit the stories that the group (and Ryuujin) want to create seems a very useful one.",
      "author": "Seamus Conneely, Cannibal Halfling Gaming"
    }
  ],
  "ru": {
    "tagShort": "Уютное фэнтези о дороге и путниках",
    "tagline": "«Пекари, фермеры и менестрели уходят из родной деревни — посмотреть, что там, за холмом».",
    "description": "Японская ролевая игра Ацухиро Окады, которую на Западе прозвали «Орегонской тропой Хаяо Миядзаки». Герои — не воины и маги, а обычные люди из деревни: торговцы, лекари, охотники, ремесленники. Главное здесь — путь: погода, привалы, усталость и чудеса по дороге, а опыт дают за трудные переходы, а не за убитых чудовищ. Английское издание выпустила Kotodama Heavy Industries.",
    "pickIf": ["хотите тёплое путешествие обычных людей, а не воинов и магов", "вашей группе интересны погода, привалы и проверки пути как главное испытание", "нужен добрый тон в духе Миядзаки: дружба и чудеса вместо резни"],
    "skipIf": ["игроки ждут сокровищ и опыта за убитых монстров", "хотите напряжённую тактику или мрачные ставки", "группе скучно каждый игровой день кидать проверки пути и лагеря"],
    "setting": "Светлый мир «природного фэнтези», который группа достраивает сама: игроки вместе придумывают города, через которые пройдут их герои. За путниками незримо приглядывает Рюдзин — полудракон, персонаж ведущего, который собирает истории об их странствии. Тон — тёплое семейное аниме: доброта, дружба и удивление вместо сокровищ и резни.",
    "vignette": "Утро в пути. Сначала проверка Самочувствия: Сила + Дух, у вас d6 и d8 — выпало 4 и 7, итог 11, день начинается бодро. Дальше проверка Перехода, Сила + Ловкость против сложности, которую задают местность и погода: сегодня мокрые холмы, нужно 8. Выпало 3 и 3 — не хватило, и путник теряет половину текущих HP: из 8 остаётся 4. Охотница бросает проверку Направления (Ловкость + Интеллект) — две единицы, провал! Зато каждый за столом получает очко Неудачи, чтобы позже вложить его в Концентрацию. На привале проверка Лагеря (Интеллект + Интеллект) — и Рюдзин тихо записывает этот день в свою книгу.",
    "prep": "~30 мин",
    "mechanics": [
      {
        "title": "Путь важнее боя",
        "text": "Каждый день похода — проверки Самочувствия, Перехода, Направления и Лагеря. Проваленный Переход отнимает половину HP. Опыт растёт прежде всего от трудных путешествий в новые места."
      },
      {
        "title": "Рюдзин — персонаж ведущего",
        "text": "У ведущего свой лист: полудракон Рюдзин, который большую часть времени остаётся за кадром, но опекает героев и даёт им ограниченные чудесные силы. Ведущий создаёт трудности, но и бережёт путников."
      },
      {
        "title": "Кубы вместо цифр",
        "text": "Сила, Ловкость, Интеллект и Дух — это размеры кубиков, от d4 и выше. Любая проверка — два куба по двум характеристикам. Два максимума — критический успех; две единицы — провал, но все за столом получают очко Неудачи."
      },
      {
        "title": "Магия времён года",
        "text": "Весенняя, летняя, осенняя и зимняя магия плюс общие заговоры. Чары — для творческого решения проблем в пути, а не для огненных шаров. Бой простой, на схеме с передней и задней линией, как в консольной JRPG."
      }
    ],
    "gallery": [
      {
        "cap": "Рыночная площадь"
      },
      {
        "cap": "Привал в холмах"
      },
      {
        "cap": "Драконы четырёх сезонов"
      },
      {
        "cap": "Травяные драконы"
      }
    ],
    "resources": [
      {
        "name": "Официальный сайт Ryuutama (Kotodama)"
      },
      {
        "name": "PDF на itch.io"
      }
    ],
    "quotes": [
      { "text": "Возможность подогнать мир под истории, которые хотят рассказать группа (и Рюдзин), кажется очень полезной." }
    ]
  },
  "en": {
    "tagShort": "Cozy fantasy about the road and its travelers",
    "tagline": "\"Bakers, farmers and minstrels leave their village to see what lies over the next hill.\"",
    "description": "Atsuhiro Okada's Japanese RPG, nicknamed \"Hayao Miyazaki's Oregon Trail\". The heroes aren't warriors and wizards but ordinary village folk: merchants, healers, hunters, artisans. The journey is the point — weather, camps, exhaustion and small wonders along the way — and experience comes mainly from hard journeys to new places, not from slain monsters. The English edition is published by Kotodama Heavy Industries.",
    "pickIf": ["you want a gentle travel game about ordinary folk, not warriors and wizards", "your group enjoys weather, camping and road checks as the main challenge", "you want a warm Miyazaki-style tone with kindness over slaughter"],
    "skipIf": ["your players expect treasure and XP for slain monsters", "you want tense tactical combat or dark, grim stakes", "your group finds daily travel and camping checks tedious"],
    "setting": "A gentle world of \"natural fantasy\" that the group builds itself: players help create the towns their travelers pass through. Watching over the party is the Ryuujin, a half-dragon played by the GM, who collects the stories of their journey. The tone is warm family anime: kindness, friendship and wonder instead of treasure and slaughter.",
    "vignette": "Morning on the road. First the Condition check: STR + SPI, you have d6 and d8 — a 4 and a 7, total 11, a good start to the day. Then the Travel check, STR + DEX against a target number set by terrain and weather: wet hills today, you need 8. You roll 3 and 3 — short, and the traveler loses half their current HP, 8 down to 4. The hunter rolls the Direction check (DEX + INT) — double ones, a fumble! But everyone at the table gains a Fumble Point to spend on Concentration later. At camp comes the Camping check (INT + INT), and the Ryuujin quietly writes the day into their book.",
    "prep": "~30 min",
    "mechanics": [
      {
        "title": "The road over the fight",
        "text": "Every day of travel brings Condition, Travel, Direction and Camping checks. A failed Travel check costs half your HP. Experience comes mainly from hard journeys to new places."
      },
      {
        "title": "The Ryuujin, the GM's character",
        "text": "The GM has a sheet too: the half-dragon Ryuujin, who stays offscreen most of the time but watches over the heroes and can lend them limited powers. The GM provides adversity, but also protects the travelers."
      },
      {
        "title": "Dice instead of numbers",
        "text": "Strength, Dexterity, Intelligence and Spirit are die sizes, from d4 up. Every check rolls two dice from two stats. Both dice at max is a critical; double ones is a fumble — but everyone at the table gains a Fumble Point."
      },
      {
        "title": "Seasonal magic",
        "text": "Spring, summer, autumn and winter magic, plus general incantations. Spells are for creative problem-solving on the road, not fireballs. Combat is simple, on a front-line/back-line battle mat like a console JRPG."
      }
    ],
    "gallery": [
      {
        "cap": "Market square"
      },
      {
        "cap": "Lost in the hills"
      },
      {
        "cap": "Dragons of the four seasons"
      },
      {
        "cap": "Grass dragons"
      }
    ],
    "resources": [
      {
        "name": "Official Ryuutama site (Kotodama)"
      },
      {
        "name": "PDF on itch.io"
      }
    ]
  }
});
