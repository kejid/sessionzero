registerSystem("fellowship", {
  "groups": {
    "default": { "key": "narrative", "order": 86 },
    "family": { "key": "pbta-fitd", "order": 43 },
    "genre": { "key": "adventure", "order": 48 }
  },
  "name": "Fellowship (2nd Edition)",
  "publisher": "Liberi Gothica Games",
  "dice": "2d6 (Hope/Despair: 3d6, keep 2)",
  "players": "3–6",
  "complexity": 2,
  // CHECK: "fellowship-pbta" on foundryvtt.com is an unofficial module by ephson for the PbtA system.
  "foundryStatus": "Community",
  "heroImage": "https://sessionzero.games/images/heroes/fellowship.jpg",
  "playstyleTags": [
    "narrative",
    "worldbuilding",
    "explore"
  ],
  "settingTags": ["fantasy"],
  "gallery": [
    {
      "src": "https://sessionzero.games/images/systems/fellowship-g1.jpg"
    },
    {
      "src": "https://sessionzero.games/images/systems/fellowship-g2.jpg"
    },
    {
      "src": "https://sessionzero.games/images/systems/fellowship-g3.webp"
    },
    {
      "src": "https://sessionzero.games/images/systems/fellowship-g4.jpg"
    }
  ],
  "resources": [
    {
      "type": "link",
      "url": "https://liberigothica.itch.io/fellowship-a-tabletop-adventure-game",
      "fmt": "PDF"
    },
    {
      "type": "link",
      "url": "https://www.kickstarter.com/projects/1552912590/fellowship-2nd-edition",
      "fmt": "Web"
    }
  ],
  "mechanics": [
    {
      "icon": "crown"
    },
    {
      "icon": "link"
    },
    {
      "icon": "swords"
    },
    {
      "icon": "flag"
    }
  ],
  "quotes": [
    // VERIFIED-AT: https://splitparty.substack.com/p/fellowship-2e
    {
      "text": "No two of any playbook will be even close to similar in the hands of focused and interested players",
      "author": "Bradley Haller, Split/Party"
    }
  ],
  "ru": {
    "tagShort": "Братство героев против игрока-Властелина",
    "tagline": "«Один из вас хочет уничтожить мир. Остальные — братство, которое его остановит».",
    "description": "Fellowship — игра на движке Apocalypse World в духе «Властелина колец» и «Невероятных приключений ДжоДжо». Один игрок — Властелин, безумное существо, ставшее Угрозой миру; остальные — братство героев, каждый из которых — защитник своего народа. Сила игры — в узах между героями и в том, что каждый игрок сам решает, каков его народ. Второе издание выпущено Liberi Gothica Games; автор указан как Vel Mini (Kickstarter 2019 года шёл под именем Jacob Randolph).",
    "pickIf": [
      "хотите поход в духе «Властелина колец» против одного великого злодея",
      "кто-то из группы хочет играть Владыку-злодея, а не нейтрального мастера",
      "группе нравится придумывать свои народы и связи между героями"
    ],
    "skipIf": [
      "мастеру ближе роль нейтрального судьи, а не злодея",
      "хотите ходить по подземельям за добычей и тактическими боями",
      "игроки не любят на ходу придумывать культуру и историю своего народа"
    ],
    "setting": "Мир каждый раз собирается заново: играешь Эльфа — и именно ты решаешь, что такое эльфы, во что они верят и как ладят с остальными. Властелин создаёт своего персонажа наравне со всеми, командует силами зла и строит Генеральный план: захватить источник силы, уничтожить общину. Игра — о долгом пути, о встреченных народах и о спасении мира.",
    "vignette": "Генерал Властелина прижат к стене: Гном и Орк, связанные Узами, бьются плечом к плечу — по ходу The Bonds That Bind Us они бросают с Надеждой (3d6, берём два лучших). Орк хочет обратить врага в бегство: Finish Them через Отвагу (+1). Выпало 2, 5 и 6 — берём 5 и 6, итог 12: генерал отступает и не скоро вернётся. Но Властелин делает Мягкий срез: с утёса на Эльфа катятся валуны — «Что делаешь?» Overcome через Кровь, итог 8: частичный успех, и Эльф платит цену — получает урон и отмечает Грацию. Пока стат повреждён, любой бросок по нему идёт с Отчаянием.",
    "prep": "~20 мин",
    "mechanics": [
      {
        "title": "Властелин вместо мастера",
        "text": "Ведущий — тоже персонаж: Властелин с собственными принципами, Срезами (мягкими и жёсткими) и Генеральным планом, который продвигается, пока герои отдыхают. Он злодей, но обязан быть фанатом героев."
      },
      {
        "title": "Узы",
        "text": "Узы — одна фраза о том, что связывает тебя с кем-то; не больше трёх на одного человека. Герои с Узами вместе бросают с Надеждой, без Уз — с Отчаянием. Узы с чужаком делают его Спутником, а ранить союзника значит стереть Уз с ним."
      },
      {
        "title": "Чем добиваешь — тем и бросаешь",
        "text": "Пять характеристик: Кровь, Отвага, Грация, Чутьё, Мудрость. Finish Them требует преимущества, а стат зависит от цели: убить — Кровь, прогнать — Отвага, одолеть хитростью — Грация, обезвредить — Чутьё, переубедить — Мудрость (и обрести с врагом Уз)."
      },
      {
        "title": "Урон — это отмеченный стат",
        "text": "Хитов нет: получая урон, отмечаешь характеристику, и броски по ней идут с Отчаянием. Все статы отмечены и снова урон — герой Выбит из сцены. В конце сессии братство отвечает на три вопроса, и каждое «да» — лечение, восстановление снаряжения или повышение уровня."
      }
    ],
    "gallery": [
      {
        "cap": "Плейбук Орка"
      },
      {
        "cap": "Властелин"
      },
      {
        "cap": "Герои Fellowship"
      },
      {
        "cap": "Три книги линейки"
      }
    ],
    "resources": [
      {
        "name": "PDF на itch.io — Liberi Gothica Games"
      },
      {
        "name": "Kickstarter второго издания"
      }
    ],
    "quotes": [
      { "text": "В руках увлечённых, вдумчивых игроков даже два одинаковых плейбука ни капли не будут похожи друг на друга." }
    ]
  },
  "en": {
    "tagShort": "A fellowship of heroes against a player Overlord",
    "tagline": "\"One of you wants to destroy the world. Everyone else is the fellowship that stops them.\"",
    "description": "Fellowship is an Apocalypse Engine game in the vein of The Lord of the Rings and JoJo's Bizarre Adventure: Stardust Crusaders. One player is the Overlord, a maniacal being who has become a Threat to the World; everyone else is a fellowship of heroes, each a champion of their own people. Its heart is the bonds between heroes and the fact that every player decides who their people are. The second edition comes from Liberi Gothica Games and credits Vel Mini as author (its 2019 Kickstarter ran under the name Jacob Randolph).",
    "pickIf": [
      "you want a Lord of the Rings-style quest against a single great villain",
      "one player would love to be the villainous Overlord instead of a neutral GM",
      "your group likes inventing their own peoples and building bonds between heroes"
    ],
    "skipIf": [
      "your GM prefers to be a neutral referee rather than the villain",
      "you want dungeon crawling for loot with tactical fights",
      "your players dislike making up their people's culture and lore on the spot"
    ],
    "setting": "The world is built fresh each time: play the Elf and you decide what elves are, what they value and how they relate to everyone else. The Overlord creates a character just like everyone else, commands the forces of evil and pursues a Master Plan — seize a source of power, destroy a community. The game is about the journey, the peoples you meet and saving the day.",
    "vignette": "The Overlord's General is cornered: the Dwarf and the Orc, who share Bonds, fight side by side — under The Bonds That Bind Us they roll with Hope (3d6, keep the best two). The Orc wants to drive the enemy off: Finish Them with Courage (+1). You roll 2, 5 and 6 — keep 5 and 6, total 12: the General backs off and won't be back anytime soon. But the Overlord makes a Soft Cut: boulders tumble down toward the Elf — \"So what do you do?\" Overcome with Blood, total 8: a partial success, and the Elf pays the price by taking damage and marking Grace. While a stat is damaged, every roll with it is made in Despair.",
    "prep": "~20 min",
    "mechanics": [
      {
        "title": "An Overlord instead of a GM",
        "text": "The GM is a character too: the Overlord, with their own Principles, Cuts (soft and hard) and a Master Plan that advances while the heroes rest. They're the villain, but they must be a fan of the heroes."
      },
      {
        "title": "Bonds",
        "text": "A Bond is one sentence about what ties you to someone, never more than three per person. Heroes with Bonds roll with Hope when working together; with none, they roll with Despair. Bonding with an outsider makes them a Companion, and harming an ally erases a Bond with them."
      },
      {
        "title": "How you win picks the stat",
        "text": "Five stats: Blood, Courage, Grace, Sense, Wisdom. Finish Them needs an advantage, and the stat depends on your aim: kill — Blood, drive off — Courage, outsmart — Grace, knock out — Sense, show them the error of their ways — Wisdom (and Forge a Bond with them)."
      },
      {
        "title": "Damage marks a stat",
        "text": "No hit points: when you take damage you mark a stat, and rolls with it are made in Despair. Take damage with every stat marked and you're Taken Out. At session's end the fellowship answers three questions, and each \"yes\" buys healing, refreshed gear or a level up."
      }
    ],
    "gallery": [
      {
        "cap": "The Orc playbook"
      },
      {
        "cap": "The Overlord"
      },
      {
        "cap": "Fellowship heroes"
      },
      {
        "cap": "The three books of the line"
      }
    ],
    "resources": [
      {
        "name": "PDF on itch.io — Liberi Gothica Games"
      },
      {
        "name": "Second edition Kickstarter"
      }
    ]
  }
});
