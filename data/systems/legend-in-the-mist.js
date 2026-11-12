registerSystem("legend-in-the-mist", {
  "groups": {
    "default": { "key": "narrative", "order": 84 },
    "family": { "key": "pbta-fitd", "order": 45 },
    "genre": { "key": "adventure", "order": 53 },
    "solo": { "key": "solo-compatible", "order": 22 }
  },
  "name": "Legend in the Mist",
  "publisher": "Son of Oak Game Studio",
  "dice": "2d6 + Power",
  "players": "3–5",
  "complexity": 3,
  "foundryStatus": "Community", // CHECK: package titled "Official" but maintained by a community developer (MrTheBino); Daggerheart precedent
  // CHECK: foundryvtt.com/packages/mist-engine-fvtt is titled "Legend In The Mist - Official" (dev: MrTheBino); Son of Oak sells official Foundry VTT core book / Hearts of Ravensdale modules on sonofoak.com
  "heroImage": "https://sessionzero.games/images/heroes/legend-in-the-mist.jpg",
  "playstyleTags": [
    "narrative",
    "explore",
    "social"
  ],
  "settingTags": ["fantasy"],
  "gallery": [
    {
      "src": "https://sessionzero.games/images/systems/legend-in-the-mist-g1.jpg"
    },
    {
      "src": "https://sessionzero.games/images/systems/legend-in-the-mist-g2.jpg"
    },
    {
      "src": "https://sessionzero.games/images/systems/legend-in-the-mist-g3.jpg"
    },
    {
      "src": "https://sessionzero.games/images/systems/legend-in-the-mist-g4.jpg"
    }
  ],
  "resources": [
    {
      "type": "link",
      "url": "https://sonofoak.com/pages/legend-in-the-mist",
      "fmt": "Web"
    },
    {
      "type": "quickstart",
      "url": "https://sonofoak.com/products/legend-in-the-mist-free-demo-game-pdf",
      "fmt": "PDF"
    },
    {
      "type": "link",
      "url": "https://sonofoak.com/blogs/news/legend-in-the-mist-in-action",
      "fmt": "Web"
    }
  ],
  "mechanics": [
    {
      "icon": "tags"
    },
    {
      "icon": "zap"
    },
    {
      "icon": "mountain"
    },
    {
      "icon": "milestone"
    }
  ],
  "quotes": [
    // VERIFIED-AT: https://cannibalhalflinggaming.com/2025/12/24/legend-in-the-mist-mist-engine-may-be-fates-forged-in-the-dark/
    {
      "text": "The Mist Engine is the Blades in the Dark to Fate’s Apocalypse World, the hack of Fate that could get it to a whole new audience.",
      "author": "Aaron Marks, Cannibal Halfling Gaming"
    },
    // VERIFIED-AT: https://www.tabletopgaming.co.uk/reviews/legend-in-the-mist-ttrpg-review/
    {
      "text": "If you’re willing to put the time into it, the results can be stunning.",
      "author": "John Dodd, Tabletop Gaming"
    }
  ],
  "ru": {
    "tagShort": "2d6 — «деревенское» фэнтези на тегах",
    "tagline": "«Ты всего лишь сборщик яблок. Пока что».",
    "description": "Legend in the Mist (2025) — фэнтезийная RPG от Son of Oak Game Studio, создателей City of Mist, на обновлённом Mist Engine. Никаких характеристик: герой собран из тегов, каждый подходящий тег даёт +1 к Силе броска 2d6. Вместо восьми базовых ходов City of Mist — один универсальный бросок, а тактические «эффекты» включаются по желанию. Герои начинают простыми людьми из глухой деревни и дорастают до легенд.",
    "setting": "Жанр, который авторы называют «деревенским фэнтези»: хоббиты, а не паладины, магия редкая, странная и пугающая. Базовая книга не привязана к миру, а сопутствующий сеттинг Hearts of Ravensdale начинается в горных Долинах (the Dales) и деревне Равенхоум после падения древней цивилизации. Для одиночной и кооперативной игры во второй книге есть Оракул.",
    "vignette": "У ячменного поля из колосьев выползает болотный мертвец в ржавых латах. Знахарка хочет понять, что это за тварь. Мастер берёт детальный бросок. Подходят два тега — «повидала всякое» и «сумеречные встречи», Сила 2. 2d6 выпало 11, итог 13: успех без последствий. Знахарка тратит 2 Силы на эффект «узнать» — мастер обязан открыть две ценные детали: в теле сидит злой дух, и обережный знак может его изгнать. Но мертвец уже заносит клинок — в следующем ходу мастер наградит кого-то статусом «порез-3».",
    "prep": "~20 мин",
    "mechanics": [
      {
        "title": "Теги вместо характеристик",
        "text": "Каждый подходящий тег даёт +1 Силы, каждый мешающий — −1. Бросок 2d6 + Сила: 10+ — успех без последствий, 7–9 — успех с последствиями, 6 и меньше — провал с последствиями. Мастер кубов не бросает."
      },
      {
        "title": "Эффекты и статусы",
        "text": "В быстром броске важен только исход. В детальном Силу тратят на эффекты — например, ранить, узнать, исцелить или создать. Урон — это статусы с уровнем от 1 до 6 («порез-3»), а у противников есть пределы: превысил предел — угроза снята."
      },
      {
        "title": "Мощь: Исток, Приключение, Величие",
        "text": "Каждая тема персонажа имеет уровень мощи — Origin, Adventure или Greatness. Разница в одну ступень даёт ±3 ко всем броскам: деревенский парень против древнего зла почти беспомощен, пока не вырастет."
      },
      {
        "title": "Квесты и эволюция тем",
        "text": "Герой — это четыре темы, у каждой свой квест. Предал квест — отмечаешь «Отказ», заполнил трек — тема уходит и сменяется новой. Двигаешь квест — «Веха», и тема эволюционирует. Персонаж может пройти путь от воина до мага."
      }
    ],
    "gallery": [
      { "cap": "Горные долины и олень" },
      { "cap": "Герои в лесу" },
      { "cap": "Обучающий комикс в начале книги" },
      { "cap": "Противник: боггарт" }
    ],
    "resources": [
      { "name": "Официальный сайт Son of Oak" },
      { "name": "Бесплатное демо Tinderbox (правила + приключение)" },
      { "name": "Пример игры от авторов (блог)" }
    ],
    "quotes": [
      { "text": "Mist Engine — это для Fate то же, что Blades in the Dark для Apocalypse World: хак, способный привести Fate к совершенно новой аудитории." },
      { "text": "Если вы готовы вложить в неё время, результат может быть ошеломляющим." }
    ]
  },
  "en": {
    "tagShort": "2d6 tag-based rustic fantasy",
    "tagline": "\"You're just an apple picker. For now.\"",
    "description": "Legend in the Mist (2025) is a fantasy RPG from Son of Oak Game Studio, the makers of City of Mist, built on an updated Mist Engine. There are no stats: a hero is made of tags, and every relevant tag adds +1 Power to a 2d6 roll. City of Mist's eight core moves are merged into a single roll, and the tactical 'Effects' layer is switched on only when you want it. Heroes start as ordinary folk from a remote village and grow into legends.",
    "setting": "What the designers call 'rustic fantasy': hobbits rather than paladins, with rare, strange and frightening magic. The core rules are setting-agnostic; the companion setting, Hearts of Ravensdale, begins in a mountain community called the Dales and the village of Ravenhome, long after a great civilisation fell. The Narrator's book adds an Oracle for solo and co-op play.",
    "vignette": "A bog corpse in rusted armour lurches out of the barley. The Wise One wants to know what this thing is, so the Narrator calls for a detailed roll. Two tags apply — seen a thing or two and twilight encounters — for Power 2. The 2d6 come up 11, total 13: success with no Consequences. She spends 2 Power on the Discover effect, and the Narrator must reveal two valuable details: an evil spirit drives the body, and a ward of protection may expel it. But the corpse is already raising its blade — next turn, someone is taking a slashed-3 status.",
    "prep": "~20 min",
    "mechanics": [
      {
        "title": "Tags, not stats",
        "text": "Each relevant tag adds +1 Power, each hindering tag −1. Roll 2d6 + Power: 10+ succeeds without Consequences, 7–9 succeeds with Consequences, 6 or less fails with Consequences. The Narrator never rolls."
      },
      {
        "title": "Effects and statuses",
        "text": "A quick roll only tells you the outcome. On a detailed roll you spend Power on Effects such as attack, discover, restore or create. Harm takes the form of statuses tiered 1 to 6 ('slashed-3'), and challenges have Limits — push a status past one and the threat is overcome."
      },
      {
        "title": "Might: Origin, Adventure, Greatness",
        "text": "Every theme has a Might level — Origin, Adventure or Greatness. Each step of difference gives ±3 to all rolls, so a village lad facing an ancient evil is nearly helpless until he grows."
      },
      {
        "title": "Quests and evolving themes",
        "text": "A hero is four themes, each with its own Quest. Neglect a Quest and you mark Abandon; fill that track and the theme is replaced by a new one. Push the Quest forward and you mark Milestone, evolving the theme. A character can go from fighter to mage over a campaign."
      }
    ],
    "gallery": [
      { "cap": "Mountain dales and a stag" },
      { "cap": "Heroes in the forest" },
      { "cap": "The tutorial comic that opens the book" },
      { "cap": "Adversary: the Boggart" }
    ],
    "resources": [
      { "name": "Official Son of Oak site" },
      { "name": "Free Tinderbox Demo (rules + adventure)" },
      { "name": "Designers' play example (blog)" }
    ]
  }
});
