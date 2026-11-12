registerSystem("fallout-2d20", {
  "groups": {
    "default": { "key": "tactical", "order": 43 },
    "family": { "key": "standalone", "order": 82 },
    "genre": { "key": "post-apocalyptic", "order": 2 },
    "solo": { "key": "solo-compatible", "order": 18 }
  },
  "name": "Fallout: The Roleplaying Game",
  "publisher": "Modiphius Entertainment",
  "dice": "2d20 System + Combat Dice",
  "players": "3–5",
  "complexity": 3,
  // CHECK: system by Muttley, published with Modiphius permission (player compendiums included) — community-maintained, not first-party
  "foundryStatus": "Community",
  "heroImage": "https://sessionzero.games/images/heroes/fallout-2d20.jpg",
  "playstyleTags": [
    "survival",
    "explore",
    "combat"
  ],
  "settingTags": ["postapoc"],
  "gallery": [
    {
      "src": "https://sessionzero.games/images/systems/fallout-2d20-g1.jpg"
    },
    {
      "src": "https://sessionzero.games/images/systems/fallout-2d20-g2.jpg"
    },
    {
      "src": "https://sessionzero.games/images/systems/fallout-2d20-g3.jpg"
    },
    {
      "src": "https://sessionzero.games/images/systems/fallout-2d20-g4.jpg"
    }
  ],
  "resources": [
    {
      "type": "link",
      "url": "https://www.modiphius.net/pages/fallout-the-roleplaying-game",
      "fmt": "Web"
    },
    {
      "type": "quickstart",
      "url": "https://modiphius.net/products/fallout-the-roleplaying-game-quickstart-guide-pdf-free",
      "fmt": "PDF"
    },
    {
      "type": "link",
      "url": "https://roll20.net/compendium/fallout/BookIndex",
      "fmt": "Web"
    }
  ],
  "mechanics": [
    {
      "icon": "dices"
    },
    {
      "icon": "zap"
    },
    {
      "icon": "clover"
    },
    {
      "icon": "radiation"
    }
  ],
  "quotes": [
    // VERIFIED-AT: https://www.gameshub.com/news/reviews/fallout-the-roleplaying-game-starter-set-review-33998/
    {
      "text": "It may sound confusing on paper, but in practice, it’s a system that brilliantly rewards players for flexing their characters’ particular skills.",
      "author": "Jam Walker, GamesHub"
    }
  ],
  "ru": {
    "tagShort": "Официальная ролёвка по Fallout на 2d20",
    "tagline": "«Война никогда не меняется. А вот ваш отряд выживших — ещё как».",
    "description": "Официальная настольная RPG по Fallout от Modiphius на движке 2d20. S.P.E.C.I.A.L., перки, Пип-Бой, ядер-кола и силовая броня — всё на месте. Вы собираете отряд из выходца из Убежища, гуля, супермутанта, Паладина Братства или даже робота мистера Помощника и выходите в Пустошь. Бои с картой зон и попаданиями по частям тела, выживание с голодом и радиацией, своё поселение.",
    "pickIf": [
      "группа любит игры Fallout и хочет Убежища, силовую броню и Nuka-Cola",
      "хотите выживание в Пустоши с голодом, радиацией и своим поселением",
      "нравятся пёстрые отряды: гули, супермутанты и роботы рядом с людьми"
    ],
    "skipIf": [
      "нужно лёгкое выживание — пулы AP, кубики урона и локации попаданий требуют учёта",
      "группе нужна мрачная серьёзность без чёрного юмора"
    ],
    "setting": "Ретрофутуристическая Америка через двести лет после ядерной войны 2077 года. Базовая книга — Содружество времён Fallout 4: Даймонд-Сити, Братство Стали, Институт, рейдеры и болотники. Дополнения ведут в Аппалачию, а гайд по Нью-Вегасу — в Мохаве по следам Курьера. Тон — чёрный юмор, ржавый оптимизм пятидесятых и пустоши, где каждый патрон на счету.",
    "vignette": "Рейдер прячется за ржавым «Хайвейменом» на средней дистанции. Ваш житель Убежища стреляет из пистолета: AGI 7 + Лёгкое оружие 3 (отмеченный навык) — целевое число 10. Защита рейдера 1, но пистолет хорош вблизи, а здесь средняя дистанция — сложность 2. Тратите 1 AP из общего пула на третий d20. Выпало 2, 9 и 17: двойка не выше ранга отмеченного навыка — критический успех, он же два успеха; девятка — ещё один; итого 3 при сложности 2, лишний успех возвращается в пул как AP. Бросаете 4 боевых кубика урона: 1, 2, пусто и 1 с символом Эффекта — 4 урона, и рейдер валится в пыль.",
    "prep": "~30 мин",
    "mechanics": [
      {
        "title": "2d20 и отмеченные навыки",
        "text": "Атрибут S.P.E.C.I.A.L. + навык = целевое число. Каждый d20 не выше него — успех. По отмеченному навыку кубик не выше ранга навыка — критический успех за два. Двадцатка — осложнение."
      },
      {
        "title": "Очки действия",
        "text": "Лишние успехи становятся AP в общем пуле отряда: на дополнительные d20, лишнее действие, дополнительный урон в ближнем бою или информацию. У ведущего свой пул AP — он копится, когда вы покупаете кубики в долг."
      },
      {
        "title": "Удача как ресурс",
        "text": "Очки Удачи равны атрибуту LCK. Можно перебросить кубики, «случайно» найти нужную вещь, вклиниться вне очереди инициативы или подставить LCK вместо любого атрибута."
      },
      {
        "title": "Боевые кубики и Пустошь",
        "text": "Урон считают особые d6 с единицами, двойками, пустыми гранями и символом Эффекта. Попадание бьёт по конкретной части тела. Голод, жажда, сон и радиация медленно добивают тех, кого не добили рейдеры."
      }
    ],
    "gallery": [
      {
        "cap": "Мастерская — снаряжение Мохаве"
      },
      {
        "cap": "Добро пожаловать в Мохаве"
      },
      {
        "cap": "Покерный стол Нью-Вегаса"
      },
      {
        "cap": "Кубики d20 и боевые кубики"
      }
    ],
    "resources": [
      {
        "name": "Официальная страница — Modiphius"
      },
      {
        "name": "Бесплатный Quickstart"
      },
      {
        "name": "Бесплатные базовые правила на Roll20"
      }
    ],
    "quotes": [
      { "text": "На бумаге это может звучать запутанно, но на практике система блестяще вознаграждает игроков за то, что они пускают в ход особые навыки своих персонажей." }
    ]
  },
  "en": {
    "tagShort": "The official Fallout RPG on the 2d20 System",
    "tagline": "\"War never changes. Your band of survivors, on the other hand, will.\"",
    "description": "Modiphius's official tabletop Fallout RPG, built on the 2d20 System. S.P.E.C.I.A.L., perks, the Pip-Boy, Nuka-Cola and power armor are all here. You build a party from a Vault Dweller, a Ghoul, a Super Mutant, a Brotherhood Initiate or even a Mister Handy robot and head into the Wasteland. Zone-based combat with hit locations, survival with hunger and radiation, and a settlement of your own.",
    "pickIf": [
      "your group loves the Fallout games and wants Vaults, power armor and Nuka-Cola",
      "you want wasteland survival with hunger, radiation and a settlement to build",
      "you like mixed parties: ghouls, super mutants and robots beside humans"
    ],
    "skipIf": [
      "you want rules-light survival — AP pools, combat dice and hit locations add bookkeeping",
      "your group wants grim seriousness without gallows humor"
    ],
    "setting": "Retro-futuristic America two centuries after the nuclear war of 2077. The core book covers the Commonwealth of Fallout 4: Diamond City, the Brotherhood of Steel, the Institute, raiders and mirelurks. Supplements head to Appalachia, and the New Vegas Setting Guide follows the Courier into the Mojave. The tone is gallows humor, rusted 1950s optimism, and wastelands where every bullet counts.",
    "vignette": "A raider ducks behind a rusted Highwayman at Medium range. Your Vault Dweller fires a pistol: AGI 7 + Small Guns 3 (a Tag skill) gives a target number of 10. The raider's Defense is 1, but a pistol works best up close, so Medium range bumps the difficulty to 2. You spend 1 AP from the group pool for a third d20. You roll 2, 9 and 17: the 2 is at or under your Tag skill rank, a critical worth two successes; the 9 adds one more. Three successes against difficulty 2 — the spare success goes back into the pool as AP. You roll 4 Combat Dice for damage: 1, 2, a blank and a 1 with an Effect symbol — 4 damage, and the raider drops into the dust.",
    "prep": "~30 min",
    "mechanics": [
      {
        "title": "2d20 and Tag skills",
        "text": "S.P.E.C.I.A.L. attribute + skill = target number. Every d20 at or under it is a success. On a Tag skill, any die at or under your skill rank is a critical worth two. A 20 is a complication."
      },
      {
        "title": "Action Points",
        "text": "Extra successes become AP in a shared party pool: spend them on bonus d20s, an extra action, extra melee damage or information. The GM has a pool of their own that grows when you buy dice on credit."
      },
      {
        "title": "Luck as a resource",
        "text": "Your Luck points equal your LCK. Spend them to re-roll dice, conveniently find what you need, jump the initiative order, or use LCK in place of any attribute for a test."
      },
      {
        "title": "Combat Dice and the Wasteland",
        "text": "Damage is rolled on special d6s showing ones, twos, blanks and Effect symbols. Every hit lands on a specific body part. Hunger, thirst, sleep and radiation slowly finish off whoever the raiders missed."
      }
    ],
    "gallery": [
      {
        "cap": "The workshop — Mojave gear"
      },
      {
        "cap": "Welcome to the Mojave"
      },
      {
        "cap": "A New Vegas poker table"
      },
      {
        "cap": "d20s and Combat Dice"
      }
    ],
    "resources": [
      {
        "name": "Official page — Modiphius"
      },
      {
        "name": "Free Quickstart"
      },
      {
        "name": "Free Basic Rules on Roll20"
      }
    ]
  }
});
