registerSystem("battletech-rpg", {
  "groups": {
    "default": { "key": "tactical", "order": 16 },
    "family": { "key": "standalone", "order": 78 },
    "genre": { "key": "sci-fi", "order": 21 }
  },
  "name": "MechWarrior: Destiny",
  "publisher": "Catalyst Game Labs",
  "dice": "2d6 + attribute + skill",
  "players": "3–6",
  "complexity": 3,
  "foundryStatus": "None", // CHECK: no MechWarrior: Destiny or A Time of War system found on foundryvtt.com as of 2026-11
  "heroImage": "https://sessionzero.games/images/heroes/battletech-rpg.jpg",
  "playstyleTags": [
    "combat",
    "tactical",
    "narrative"
  ],
  "settingTags": ["space"],
  "gallery": [
    {
      "src": "https://sessionzero.games/images/systems/battletech-rpg-g1.jpg"
    },
    {
      "src": "https://sessionzero.games/images/systems/battletech-rpg-g2.jpg"
    },
    {
      "src": "https://sessionzero.games/images/systems/battletech-rpg-g3.jpg"
    }
  ],
  "resources": [
    {
      "type": "link",
      "url": "https://store.catalystgamelabs.com/products/mechwarrior-destiny",
      "fmt": "Web"
    },
    {
      "type": "sheet",
      "url": "https://battletech.com/wp-content/uploads/sites/6/2025/07/CAT35185RS_MechWarrior%20Destiny%20Character%20Sheet%20Blanks.pdf",
      "fmt": "PDF"
    },
    {
      "type": "quickstart",
      "url": "https://battletech.com/wp-content/uploads/sites/6/2025/07/ATOW%20QSR.pdf",
      "fmt": "PDF"
    },
    {
      "type": "link",
      "url": "https://battletech.com/downloads/",
      "fmt": "Web"
    }
  ],
  "mechanics": [
    {
      "icon": "dice-6"
    },
    {
      "icon": "message-square-quote"
    },
    {
      "icon": "flame"
    },
    {
      "icon": "map"
    }
  ],
  "quotes": [
    // VERIFIED-AT: https://www.enworld.org/threads/a-mechwarrior-destiny-review.690629/
    {
      "text": "The game simplifies the mech combat while keeping the stuff that makes it unique like hit locations, heat and the joy of critical hits.",
      "author": "Rob Wieland, EN World"
    },
    // VERIFIED-AT: https://www.enworld.org/threads/a-mechwarrior-destiny-review.690629/
    {
      "text": "Mechwarrior: Destiny is an excellent game for Battletech fans who want to experience the world without always having to book out a day for hardcore minis gaming.",
      "author": "Rob Wieland, EN World"
    }
  ],
  "ru": {
    "tagShort": "Ролевая игра во вселенной BattleTech",
    "tagline": "«Пристегнись, проверь теплоотвод — и докажи, что твой род достоин этого меха».",
    "description": "Самая новая ролевая игра Catalyst по BattleTech (2020) на нарративной системе Cue. Бросок простой — 2d6 + атрибут + навык против встречного броска, — а поверх него очки сюжета, подсказки для отыгрыша и упрощённый бой мехов с локациями попаданий, перегревом и критами. Героев можно перенести на стол в Total Warfare или Alpha Strike. Для любителей детальной симуляции в продаже остаётся тяжёлая A Time of War.",
    "pickIf": [
      "группа любит BattleTech и хочет сыграть мехвоинов как живых людей",
      "нужны лёгкие правила, но с зонами попадания, перегревом и критами мехов",
      "хотите переносить пилотов между ролевкой и сражениями Total Warfare или Alpha Strike"
    ],
    "skipIf": [
      "хотите подробную симуляцию — для этого есть более тяжёлая A Time of War",
      "никто за столом не знает и не любит Внутреннюю Сферу",
      "вам не нужны бои гигантских роботов в центре игры"
    ],
    "setting": "3025 год, на исходе Третьей войны за наследство. Пять Великих Домов делят Внутреннюю Сферу; ComStar держит межзвёздную связь и свои тайны; наёмники вроде Wolf's Dragoons продают мечи тому, кто платит в C-Bill. Можно быть самураем Дома Курита, дуэлянтом на арене Солярис VII, пилотом аэрокосмического истребителя или агентом разведки. Приложение добавляет эпоху вторжения Кланов (3050).",
    "vignette": "Ваш *Phoenix Hawk* выходит из-за хребта, и в прицеле — вражеский *Wolverine*. Стрельба: 2d6 + атрибут + навык Gunnery против встречного броска пилота противника. Вы выкидываете больше — попадание. Бросок по таблице локаций, 2d6: выпало 12 — голова! Но удар в кабину в Destiny нужно «купить» очком сюжета, и вы его тратите. Пилот врага оглушён, а у вас стрелка нагрева ползёт в жёлтую зону: следующий залп из всех стволов может закончиться отключением реактора.",
    "prep": "~30 мин",
    "mechanics": [
      {
        "title": "Один бросок на всё",
        "text": "2d6 + атрибут + навык против встречного броска мастера. Те же кубики, что и в настольном BattleTech, — ветеранам ничего переучивать не надо."
      },
      {
        "title": "Система Cue",
        "text": "Короткие подсказки на листе персонажа и в сцене задают, что и когда игрок рассказывает. Очки сюжета тратятся на крит, огневую поддержку или спасительное катапультирование."
      },
      {
        "title": "Бой мехов полегче",
        "text": "Без гексов и записей каждого шага, но с главным: группы оружия, локации попаданий, перегрев, критические попадания и катапультирование пилота."
      },
      {
        "title": "Мост к настольной игре",
        "text": "Отдельная глава переносит ваших пилотов в бой по Total Warfare или Alpha Strike и обратно — с последствиями, славой и выплатами по контракту."
      }
    ],
    "gallery": [
      {
        "cap": "A Time of War — тяжёлая RPG по BattleTech"
      },
      {
        "cap": "Ширма мастера A Time of War"
      },
      {
        "cap": "Мехи в бою"
      }
    ],
    "resources": [
      {
        "name": "MechWarrior: Destiny в магазине Catalyst"
      },
      {
        "name": "Официальный лист персонажа"
      },
      {
        "name": "Быстрый старт A Time of War"
      },
      {
        "name": "Бесплатные материалы BattleTech"
      }
    ],
    "quotes": [
      { "text": "Игра упрощает бой мехов, но сохраняет то, что делает его особенным: локации попаданий, перегрев и радость критических попаданий." },
      { "text": "MechWarrior: Destiny — отличная игра для фанатов BattleTech, которые хотят пожить в этом мире, не выделяя каждый раз целый день на хардкорные миниатюры." }
    ]
  },
  "en": {
    "tagShort": "Roleplaying in the BattleTech universe",
    "tagline": "\"Strap in, watch your heat sinks — and prove your bloodline deserves this 'Mech.\"",
    "description": "Catalyst's newest BattleTech roleplaying game (2020), built on the narrative Cue System. The core roll is simple — 2d6 + attribute + skill against an opposed roll — with Plot Points, roleplaying cues and streamlined 'Mech combat with hit locations, heat and criticals layered on top. Characters can jump straight into Total Warfare or Alpha Strike battles. The crunchier A Time of War is still in print for simulation fans.",
    "pickIf": [
      "your group loves BattleTech and wants to play MechWarriors as people",
      "you want light rules with 'Mech hit locations, heat and criticals kept",
      "you want to move pilots between roleplaying and Total Warfare or Alpha Strike"
    ],
    "skipIf": [
      "you want detailed simulation; A Time of War is the crunchier option",
      "nobody at the table knows or cares about the Inner Sphere",
      "you want a game without giant robot combat at its heart"
    ],
    "setting": "The year is 3025, the tail end of the Third Succession War. Five Great Houses carve up the Inner Sphere; ComStar runs interstellar communications and keeps its own secrets; mercenaries like Wolf's Dragoons fight for whoever pays in C-Bills. Play a Kurita samurai, an arena duelist on Solaris VII, an aerospace pilot or an intelligence agent. An appendix covers the Clan Invasion era (3050).",
    "vignette": "Your *Phoenix Hawk* crests the ridge with a *Wolverine* in its sights. Shooting is 2d6 + attribute + Gunnery against the enemy pilot's opposed roll. You beat it — a hit. Roll 2d6 for location: 12, the head! In Destiny a cockpit hit has to be paid for with a Plot Point, and you spend one. The enemy MechWarrior is rattled, but your heat gauge is creeping into the yellow: one more alpha strike and your reactor may shut down.",
    "prep": "~30 min",
    "mechanics": [
      {
        "title": "One roll for everything",
        "text": "2d6 + attribute + skill against the GM's opposed roll. The same dice as tabletop BattleTech, so veterans have nothing to relearn."
      },
      {
        "title": "Cue System",
        "text": "Short prompts on the character sheet and in the scene guide who narrates what. Plot Points buy critical hits, battlefield support or a safe ejection."
      },
      {
        "title": "Lighter 'Mech combat",
        "text": "No hex maps or step-by-step bookkeeping, but it keeps the essentials: weapon groups, hit locations, heat, critical hits and pilot ejection."
      },
      {
        "title": "Bridge to the tabletop",
        "text": "A dedicated chapter moves your pilots into Total Warfare or Alpha Strike battles and back again, with consequences, fame and contract payouts."
      }
    ],
    "gallery": [
      {
        "cap": "A Time of War — the crunchy BattleTech RPG"
      },
      {
        "cap": "A Time of War GM screen"
      },
      {
        "cap": "'Mechs in battle"
      }
    ],
    "resources": [
      {
        "name": "MechWarrior: Destiny at the Catalyst store"
      },
      {
        "name": "Official character sheet"
      },
      {
        "name": "A Time of War quick-start rules"
      },
      {
        "name": "Free BattleTech downloads"
      }
    ]
  }
});
