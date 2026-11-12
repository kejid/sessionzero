registerSystem("changeling-the-lost", {
  "groups": {
    "default": { "key": "narrative", "order": 76 },
    "family": { "key": "standalone", "order": 79 },
    "genre": { "key": "horror", "order": 24 }
  },
  "name": "Changeling: The Lost",
  "publisher": "Onyx Path Publishing",
  "dice": "d10 pool",
  "players": "3–5",
  "complexity": 3,
  "free": false,
  "edition": "2nd Edition",
  "foundryStatus": "Community",
  "heroImage": "https://sessionzero.games/images/heroes/changeling-the-lost.jpg",
  "playstyleTags": ["horror", "narrative", "social"],
  "settingTags": ["modern", "urban-fantasy"],
  "gallery": [
    { "src": "https://sessionzero.games/images/systems/changeling-the-lost-g1.jpg" },
    { "src": "https://sessionzero.games/images/systems/changeling-the-lost-g2.jpg" },
    { "src": "https://sessionzero.games/images/systems/changeling-the-lost-g3.jpg" },
    { "src": "https://sessionzero.games/images/systems/changeling-the-lost-g4.jpg" }
  ],
  "resources": [
    { "type": "link", "url": "https://theonyxpath.com/category/worlds/changelingthelost/", "fmt": "Web" },
    { "type": "link", "url": "https://theonyxpath.com/changeling-the-lost-the-hedge/", "fmt": "Web" },
    { "type": "link", "url": "https://foundryvtt.com/packages/mta", "fmt": "Foundry" }
  ],
  "mechanics": [
    { "icon": "dices" },
    { "icon": "brain" },
    { "icon": "scroll-text" },
    { "icon": "leaf" }
  ],
  "quotes": [
    // VERIFIED-AT: https://cannibalhalflinggaming.com/2019/04/01/changeling-the-lost-second-edition/
    {
      "text": "The Seasonal Courts is one of the best written pieces of meta in games in my opinion.",
      "author": "Aki, Cannibal Halfling Gaming"
    },
    // VERIFIED-AT: https://cannibalhalflinggaming.com/2019/04/01/changeling-the-lost-second-edition/
    {
      "text": "If you love the concept, but felt pushed away by the design in 1st Edition, I wholeheartedly suggest that you take a look.",
      "author": "Aki, Cannibal Halfling Gaming"
    }
  ],
  "ru": {
    "tagShort": "Хоррор о беглецах из страны фей на пулах d10",
    "tagline": "«Тебя похитили феи. Ты сбежал. Но домой вернулся кто-то другой».",
    "description": "Changeling: The Lost — хоррор-сказка из линейки Chronicles of Darkness от Onyx Path. Вы играете подменышами: людьми, которых Истинные Феи утащили в Аркадию, переделали в слуг, игрушки и чудовищ, — и которые сумели сбежать. Вторая редакция (2019) работает на системе Storytelling: пулы d10, успех на 8+. Ясность заменяет рассудок, Контракты — магию фей, а клятвы буквально обязывают. Это игра о выживших после насилия, поэтому обсудить границы до игры особенно важно. «The Hedge» (2024) Onyx Path назвала последним запланированным проектом линейки.",
    "pickIf": [
      "хотите мрачный сказочный хоррор о том, как выжить и вырваться из насилия",
      "группе интересны придворные интриги, нерушимые клятвы и сделки с фейри",
      "игроки хотят глубоких личных историй о возвращении украденной жизни"
    ],
    "skipIf": [
      "за столом не готовы к тяжёлой теме травмы даже с правилами безопасности",
      "хотите лёгкое, сказочно-шутливое приключение с феями",
      "мастер хочет обходиться малой подготовкой, а хроника требует серьёзной"
    ],
    "setting": "Наш мир, за изнанкой которого растёт Изгородь — колючий лабиринт снов и шипов между реальностью и Аркадией. Вернувшись, подменыш видит, что его место занял Двойник — фальшивая копия, оставленная Хранителем. Беглецы прячут свою нечеловеческую суть под Маской и собираются во Дворы Весны, Лета, Осени и Зимы, у каждого из которых свой способ справиться с пережитым. А по следу идут Охотники Хранителей.",
    "vignette": "Ты бежишь сквозь Изгородь, а за спиной трубит рог Охотника. Рассказчик требует Ловкость 3 + Атлетика 2: пять кубов — 3, 8, 10, 6, 9. Десятка перебрасывается — 4. Три успеха, ты проскальзываешь в Лощину. Но в мутном пруду отражается лицо твоего Хранителя, и это переломный момент. Ты отмечаешь урон Ясности — и вспоминаешь о Привязке, своей сестре, которая до сих пор живёт с твоим Двойником.",
    "prep": "~60 мин",
    "mechanics": [
      { "title": "Пулы d10 (Storytelling)", "text": "Атрибут + Навык в d10, каждая 8 и выше — успех, десятки перебрасываются, пять успехов — исключительный успех. Та же основа, что в Chronicles of Darkness." },
      { "title": "Ясность", "text": "Шкала как здоровье, только для рассудка: её максимум — Смекалка + Самообладание. Травма, магия фей и встречи с Хранителем наносят урон Ясности, а Привязки к прошлой жизни держат вас на плаву." },
      { "title": "Клятвы и Контракты", "text": "Подменыши заключают клятвы, которые работают буквально: нарушителя настигает кара. Контракты — сила договоров фей, от Королевских и Обычных до опасных гоблинских сделок, оплачиваемых Гламуром." },
      { "title": "Обличья и Дворы", "text": "Шесть Обличий (Seemings) — Зверь, Тёмный, Стихийный, Прекраснейший, Огр, Иссохший — описывают, во что вас превратили. Дворы времён года задают политику и способ жить с травмой." }
    ],
    "gallery": [
      { "cap": "Подменыш и волшебный конь, превью-арт второй редакции" },
      { "cap": "Подменыши разных Обличий" },
      { "cap": "Лицо в зеркале, превью-арт второй редакции" },
      { "cap": "Обложка The Hedge (2024)" }
    ],
    "resources": [
      { "name": "Changeling: The Lost на сайте Onyx Path" },
      { "name": "The Hedge — книга об Изгороди" },
      { "name": "Фанатская система для Foundry VTT (Chronicles of Darkness 2e)" }
    ],
    "quotes": [
      { "text": "Сезонные Дворы, на мой взгляд, — один из лучше всего написанных элементов игрового мира, что я встречал." },
      { "text": "Если вам нравится сама идея, но дизайн первой редакции вас оттолкнул, я от всей души советую взглянуть на вторую." }
    ]
  },
  "en": {
    "tagShort": "Fairy-tale horror about escapees from Faerie on a d10 pool",
    "tagline": "\"The Fae took you. You escaped. But someone else came home.\"",
    "description": "Changeling: The Lost is fairy-tale horror from Onyx Path's Chronicles of Darkness line. You play changelings: people stolen by the True Fae, dragged to Arcadia and remade into servants, toys and monsters — who managed to escape. The second edition (2019) runs on the Storytelling System: d10 pools, success on 8+. Clarity stands in for sanity, Contracts for fae magic, and oaths bind for real. It is a game about surviving abuse, so a session zero on boundaries matters here. Onyx Path called The Hedge (2024) the line's final scheduled project.",
    "pickIf": [
      "you want dark fairy-tale horror about surviving and escaping abuse",
      "your group enjoys courtly politics, binding oaths and fae bargains",
      "players want deep personal stories about reclaiming a stolen life"
    ],
    "skipIf": [
      "your table is not ready for heavy trauma themes, even with safety tools",
      "you want light, whimsical faerie adventure",
      "you want a GM with little prep; a chronicle takes real setup"
    ],
    "setting": "Our world, with the Hedge growing behind it — a thorny maze of dreams and briars between reality and Arcadia. Coming home, a changeling finds their place taken by a Fetch, a fake copy left by their Keeper. The escaped hide their inhuman nature behind the Mask and gather into the Courts of Spring, Summer, Autumn and Winter, each with its own way of living with what happened. And the Keepers' Huntsmen are on their trail.",
    "vignette": "You run through the Hedge while a Huntsman's horn sounds behind you. The Storyteller calls for Dexterity 3 + Athletics 2: five dice — 3, 8, 10, 6, 9. The 10 rolls again — 4. Three successes, and you slip into a Hollow. But in a murky pool you glimpse your Keeper's face, and it's a breaking point. You mark Clarity damage — and think of your Touchstone, your sister, who still lives with your Fetch.",
    "prep": "~60 min",
    "mechanics": [
      { "title": "d10 pools (Storytelling)", "text": "Roll Attribute + Skill in d10s; every 8+ is a success, 10s roll again, and five successes make an exceptional success. The same base as Chronicles of Darkness." },
      { "title": "Clarity", "text": "A track like Health, but for your grip on reality, with a maximum of Wits + Composure. Trauma, fae magic and brushes with your Keeper deal Clarity damage, while Touchstones to your old life keep you anchored." },
      { "title": "Pledges and Contracts", "text": "Changelings swear pledges that work literally: break one and the Wyrd punishes you. Contracts are the power of fae bargains — Royal, Common and risky Goblin Contracts — fuelled by Glamour." },
      { "title": "Seemings and Courts", "text": "Six Seemings — Beast, Darkling, Elemental, Fairest, Ogre, Wizened — describe what you were made into. The seasonal Courts set your politics and your way of living with trauma." }
    ],
    "gallery": [
      { "cap": "A changeling and a fae steed, second edition preview art" },
      { "cap": "Changelings of different Seemings" },
      { "cap": "A face in the mirror, second edition preview art" },
      { "cap": "Cover of The Hedge (2024)" }
    ],
    "resources": [
      { "name": "Changeling: The Lost at Onyx Path" },
      { "name": "The Hedge — sourcebook on the Hedge" },
      { "name": "Community Foundry VTT system (Chronicles of Darkness 2e)" }
    ]
  }
});
