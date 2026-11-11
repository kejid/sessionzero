registerSystem("dark-heresy", {
  "groups": {
    "default": { "key": "tactical", "order": 41 },
    "family": { "key": "standalone", "order": 77 },
    "genre": { "key": "sci-fi", "order": 22 }
  },
  "name": "Warhammer 40,000: Dark Heresy",
  "publisher": "Fantasy Flight Games",
  "dice": "d100",
  "players": "3–6",
  "complexity": 4,
  // CHECK: unofficial community system (sheets only, no content); see foundryvtt.com/packages/dark-heresy
  "foundryStatus": "Community",
  // Official FFG 2nd edition wallpaper (1920x1080), archived; logos sit in the bottom corners — crop from the top when self-hosting
  "heroImage": "https://sessionzero.games/images/heroes/dark-heresy.jpg",
  "playstyleTags": ["mystery", "combat", "horror"],
  "settingTags": ["space"],
  "gallery": [
    { "src": "https://sessionzero.games/images/systems/dark-heresy-g1.jpg" },
    { "src": "https://sessionzero.games/images/systems/dark-heresy-g2.jpg" },
    { "src": "https://sessionzero.games/images/systems/dark-heresy-g3.jpg" },
    { "src": "https://sessionzero.games/images/systems/dark-heresy-g4.jpg" }
  ],
  "resources": [
    { "type": "link", "url": "https://cubicle7games.com/en_GB/dark-heresy-second-edition-core-rulebook", "fmt": "PDF" },
    { "type": "link", "url": "https://foundryvtt.com/packages/dark-heresy", "fmt": "Foundry" }
  ],
  "mechanics": [
    { "icon": "dices" },
    { "icon": "search" },
    { "icon": "skull" },
    { "icon": "brain" }
  ],
  "quotes": [
    // VERIFIED-AT: https://www.pcgamer.com/warhammer-TTRPGs/
    {
      "text": "I'm particularly fond of its horrific random tables, mostly used to determine exactly how mangled you are by the specific kind of weapon that just critically hit you.",
      "author": "Robin Valentine, PC Gamer"
    }
  ],
  "ru": {
    "tagShort": "Аколиты Инквизиции против ереси",
    "tagline": "«Невинности не бывает. Бывают разные степени вины».",
    "description": "Классическая ролевая игра по Warhammer 40,000: вы — аколиты, расходные агенты Инквизитора, которые выслеживают культы, мутантов и демонов в ульях-городах Империума. Первая редакция вышла в 2008 году (Black Industries, затем Fantasy Flight Games), вторая — у FFG в 2014-м. Движок d100 с бросками под Характеристику, степенями успеха и кровавыми таблицами критов. Линейка больше не издаётся, но PDF до сих пор продаёт Cubicle 7. Это прямой предок Imperium Maledictum: та же процентная основа, но жёстче и сфокусированнее — одна ячейка, одно расследование, одна ересь. В отличие от кубикового Wrath & Glory, здесь вы не герои, а винтики.",
    "setting": "41-е тысячелетие, гниющий Империум. Первая редакция разворачивается в секторе Каликсис, вторая — в секторе Аскеллон, где сама власть Инквизиции шатается. Ульи-города, где миллиарды живут в грязи, ереси под каждой плитой, псайкеры, от которых трещит реальность, — и Инквизиция, которой позволено всё.",
    "vignette": "Ваш аколит, бывший арбитр с Навыком Стрельбы 38, открывает огонь по убегающему культисту. Обычная атака даёт +10 — цель 48. На d100 выпадает 23: попадание с тремя степенями успеха. Переворачиваете цифры — 32, корпус. На кубе урона лазгана d10 выпадает 10: Праведная Ярость, и Мастер тянется к таблице критов энергетического оружия. Культист падает, но весь жилблок видел перестрелку — скрытность ячейки летит вниз, и те, на кого вы охотитесь, теперь знают, что вы идёте.",
    "prep": "~60 мин",
    "mechanics": [
      { "title": "d100 под Характеристику", "text": "Бросок процентников против Навыка Боя, Восприятия, Силы Воли и прочих. Каждый десяток запаса — дополнительная степень успеха или провала. Попадание определяется перевёрнутыми цифрами броска." },
      { "title": "Расследования", "text": "Типичное задание — процедурное: место преступления, допросы, слежка, а потом перестрелка. Во второй редакции ячейка ещё и отслеживает Скрытность: шумные методы тоже имеют цену." },
      { "title": "Кровавые криты", "text": "Ранения бьют по конкретной части тела, а таблицы критов расписаны по типам урона — энергия, взрыв, удар, клинок. Очки Судьбы спасают, но редко надолго." },
      { "title": "Безумие и порча", "text": "Псайкеры рискуют Психическими Феноменами и Бедствиями Варпа, а всё, что вы увидите, копится в очках Безумия и Скверны. Знание — это яд." }
    ],
    "gallery": [
      { "cap": "Enemies Within: враги изнутри" },
      { "cap": "Enemies Without: угроза извне" },
      { "cap": "Enemies Beyond: псайкер и варп" },
      { "cap": "Корабль в огне, Enemies Beyond" }
    ],
    "resources": [
      { "name": "Основная книга 2-й редакции (PDF, Cubicle 7)" },
      { "name": "Неофициальная система для Foundry VTT" }
    ],
    "quotes": [
      { "text": "Особенно я люблю его жуткие случайные таблицы — в основном они нужны, чтобы определить, насколько именно вас изувечило конкретное оружие, только что нанёсшее критический удар." }
    ]
  },
  "en": {
    "tagShort": "Inquisitorial acolytes hunting heresy",
    "tagline": "\"There is no such thing as innocence, only degrees of guilt.\"",
    "description": "The classic Warhammer 40,000 RPG: you are acolytes, expendable agents of an Inquisitor, rooting out cults, mutants and daemons in the Imperium's hive cities. First edition arrived in 2008 (Black Industries, then Fantasy Flight Games); FFG's second edition followed in 2014. A d100 roll-under engine with Degrees of Success and gory critical tables. The line is no longer in print, but Cubicle 7 still sells the PDFs. It is the direct ancestor of Imperium Maledictum: the same percentile core, but harsher and more focused — one cell, one investigation, one heresy. Unlike the dice-pool Wrath & Glory, you are not heroes here, you are cogs.",
    "setting": "The 41st Millennium and its rotting Imperium. First edition is set in the Calixis Sector, second edition in the Askellon Sector, where even the Inquisition's grip is slipping. Hive cities where billions live in filth, heresy under every flagstone, psykers who make reality crack — and an Inquisition that is allowed anything.",
    "vignette": "Your acolyte, an ex-Arbitrator with Ballistic Skill 38, opens fire on a fleeing cultist. A Standard Attack adds +10, so the target is 48. The d100 shows 23: a hit with three Degrees of Success. Reverse the digits — 32, the body. The lasgun's d10 damage die comes up 10: Righteous Fury, and the GM reaches for the energy critical table. The cultist drops, but the whole hab-block saw the firefight — the warband's Subtlety plummets, and the cell you are hunting now knows you are coming.",
    "prep": "~60 min",
    "mechanics": [
      { "title": "d100 roll-under", "text": "Roll percentile dice against Weapon Skill, Perception, Willpower and the rest. Every ten points of margin is another Degree of Success or Failure. Hit location comes from the reversed digits of the attack roll." },
      { "title": "Investigations", "text": "A typical mission is procedural: crime scenes, interrogations, surveillance, then the firefight. Second edition also tracks the warband's Subtlety, so loud methods carry a price." },
      { "title": "Gory criticals", "text": "Damage lands on a specific body part, and the critical tables are split by damage type — energy, explosive, impact, rending. Fate points save you, rarely for long." },
      { "title": "Insanity & Corruption", "text": "Psykers risk Psychic Phenomena and Perils of the Warp, and everything you witness piles up as Insanity and Corruption points. Knowledge is poison." }
    ],
    "gallery": [
      { "cap": "Enemies Within art" },
      { "cap": "Enemies Without art" },
      { "cap": "Enemies Beyond: a psyker and the warp" },
      { "cap": "A voidship in flames, Enemies Beyond" }
    ],
    "resources": [
      { "name": "2nd Edition Core Rulebook (PDF, Cubicle 7)" },
      { "name": "Unofficial Foundry VTT system" }
    ]
  }
});
