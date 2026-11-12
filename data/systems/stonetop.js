registerSystem("stonetop", {
  "groups": {
    "default": { "key": "narrative", "order": 81 },
    "family": { "key": "pbta-fitd", "order": 41 },
    "genre": { "key": "adventure", "order": 46 }
  },
  "name": "Stonetop",
  "publisher": "Lampblack & Brimstone",
  "dice": "2d6 + stat",
  "players": "2–5",
  "complexity": 2,
  // CHECK: unofficial community system by WhackyGator, full content + automation — foundryvtt.com/packages/stonetop
  "foundryStatus": "Community",
  // Lucie Arnoux's village illustration as used by Dicebreaker (1920x1080, upscaled from the ~700px Kickstarter original); black-and-white ink
  "heroImage": "https://sessionzero.games/images/heroes/stonetop.jpg",
  "playstyleTags": ["narrative", "worldbuilding", "explore"],
  "settingTags": ["fantasy"],
  "gallery": [
    { "src": "https://sessionzero.games/images/systems/stonetop-g1.jpg" },
    { "src": "https://sessionzero.games/images/systems/stonetop-g2.jpg" },
    { "src": "https://sessionzero.games/images/systems/stonetop-g3.jpg" },
    { "src": "https://sessionzero.games/images/systems/stonetop-g4.jpg" }
  ],
  "resources": [
    { "type": "link", "url": "https://www.lampblackandbrimstone.com/", "fmt": "Web" },
    { "type": "link", "url": "https://plusoneexp.com/collections/stonetop", "fmt": "PDF / Print" },
    { "type": "sheet", "url": "https://www.dropbox.com/scl/fo/e2o562ewvne9zzva6revi/AOGEv-oNy1ibgWhIfPWF_To?rlkey=p8pteinnfobhrnddz8d7x2oy2&dl=0", "fmt": "PDF" },
    { "type": "link", "url": "https://foundryvtt.com/packages/stonetop", "fmt": "Foundry" }
  ],
  "mechanics": [
    { "icon": "house" },
    { "icon": "users" },
    { "icon": "gem" },
    { "icon": "dices" }
  ],
  "quotes": [
    // VERIFIED-AT: https://www.wargamer.com/stonetop/RPG-kickstarter
    {
      "text": "Stonetop is a traditional pen, paper and dice roleplaying game - except that the eponymous, ring-walled settlement plays as important a role as any of the player characters.",
      "author": "Alex Evans, Wargamer"
    }
  ],
  "ru": {
    "tagShort": "Очаговое фэнтези: защити свою деревню",
    "tagline": "«Вы не наёмники. Вы — те, кто стоит между деревней и тьмой».",
    "description": "«Очаговое фэнтези» Джереми Стрэндберга на движке Powered by the Apocalypse, выросшее из дополнения к Dungeon World. Герои здесь не бродяги за славой, а люди из одной деревни на краю известного мира: они рискуют ради родных, соседей и общего урожая. У самой деревни есть свой лист персонажа, а за её стенами — огромный, странный и опасный мир. Два тома примерно по 600 страниц с иллюстрациями Люси Арну, выпущенные Lampblack & Brimstone в 2026 году после Kickstarter 2021-го. Если Dungeon World — про подземелья, то Stonetop — про дом, в который нужно вернуться.",
    "pickIf": ["хотите героев, защищающих родную деревню, а не бродячих искателей славы", "группе нравится отстраивать дом между вылазками", "любите ходы PbtA и странный опасный мир за стенами"],
    "skipIf": ["хотите вольных походов по подземельям — тогда лучше Dungeon World", "группе неинтересно следить за запасами, обороной деревни и сменой сезонов"],
    "setting": "Железный век, которого не было. Деревня Стонтоп стоит у древнего камня на краю мира: впереди Великий лес, позади обрывы, за ними холмы и пустоши, полные руин прежних цивилизаций, зверья и чужих богов. Сезоны сменяются, зима приходит всегда, и запасов должно хватить на всех.",
    "vignette": "Осень, в Великом лесу пропали двое лесорубов. Ваш *Ranger* идёт по следу через бурелом — это Defy Danger на ЛОВ. Знание леса даёт преимущество: бросаете 3d6 и отбрасываете худший. Выпало 2, 5, 4 — остаётся 9, плюс ЛОВ +1 = 10. Полный успех: вы обходите медвежью яму и выходите к поляне, где лесорубы связаны у чужого костра. Тем временем в деревне Мастер отмечает: нет рабочих рук — Излишек к зиме может не дотянуть.",
    "prep": "~30 мин",
    "mechanics": [
      { "title": "Деревня как персонаж", "text": "У Стонтопа есть свой лист: Размер, Население, Процветание, Оборона, Удача и Излишек. Между приключениями герои строят частокол, мельницы, торговые пути — и смотрят, как деревня растёт или голодает." },
      { "title": "Девять плейбуков", "text": "Каждый класс — роль в общине: *Heavy* защищает, *Judge* хранит летопись и закон, *Lightbearer* несёт свет, *Would-Be Hero* мечтает о большем. Связи с соседями прописаны прямо в листе." },
      { "title": "Аркана", "text": "Магические предметы — аркана — не прилагают инструкций: у каждого свои условия, без которых его сила не откроется. Понять, чего хочет древняя реликвия, и заплатить за это — уже целая сюжетная линия." },
      { "title": "2d6 с преимуществом", "text": "Классика PbtA: 10+ — успех, 7–9 — успех с ценой, 6 и меньше — Мастер делает ход. Сверху — преимущество и помеха: бросаете третий кубик и отбрасываете худший или лучший." }
    ],
    "gallery": [
      { "cap": "Экспедиция у заснеженных утёсов" },
      { "cap": "Герои в древнем зале" },
      { "cap": "Разворот о Великом лесе из Book II" },
      { "cap": "Принты с иллюстрациями Люси Арну" }
    ],
    "resources": [
      { "name": "Издатель Lampblack & Brimstone" },
      { "name": "Купить книги и PDF (Plus One Experience)" },
      { "name": "Бесплатные материалы для кампании" },
      { "name": "Неофициальная система для Foundry VTT" }
    ],
    "quotes": [
      { "text": "Stonetop — это традиционная настольная ролевая игра с ручкой, бумагой и кубиками, за одним исключением: одноимённое поселение за кольцевой стеной играет не менее важную роль, чем любой из персонажей игроков." }
    ]
  },
  "en": {
    "tagShort": "Hearth fantasy: defend your village",
    "tagline": "\"You're not mercenaries. You're what stands between home and the dark.\"",
    "description": "Jeremy Strandberg's \"hearth fantasy\" RPG, Powered by the Apocalypse, grew out of a Dungeon World supplement. The heroes are not rootless glory-seekers but people of one village at the edge of the known world, taking risks for their kin, their neighbours and the harvest. The village itself has a character sheet, and beyond its walls lies a vast, strange, dangerous world. Two books of roughly 600 pages each, illustrated by Lucie Arnoux and published by Lampblack & Brimstone in 2026 after a 2021 Kickstarter. If Dungeon World is about the dungeon, Stonetop is about the home you have to get back to.",
    "pickIf": ["you want heroes defending their own village, not wandering glory-seekers", "your group enjoys building up a home between expeditions", "you like PbtA moves and a strange, dangerous world beyond the walls"],
    "skipIf": ["you want rootless dungeon delving — Dungeon World fits better", "your group dislikes tracking village stores, defenses and seasons"],
    "setting": "An Iron Age that never was. Stonetop village sits around an ancient standing stone at the edge of the world: the Great Wood on one side, the cliffs on the other, and beyond them hills and wastes full of ruined civilisations, strange beasts and older gods. The seasons turn, winter always comes, and the stores have to last.",
    "vignette": "Autumn, and two woodcutters have gone missing in the Great Wood. Your Ranger tracks them through the deadfall — that's Defy Danger with DEX. Knowing these woods gives advantage: roll 3d6 and drop the lowest. You get 2, 5, 4 — keep 9, plus DEX +1 makes 10. A full success: you skirt a pit trap and reach a clearing where the woodcutters sit bound beside a stranger's fire. Back in the village, the GM notes that with hands missing at harvest, the Surplus may not last the winter.",
    "prep": "~30 min",
    "mechanics": [
      { "title": "The village is a character", "text": "Stonetop has its own sheet: Size, Population, Prosperity, Defenses, Fortunes and Surplus. Between adventures the heroes build palisades, mills and trade routes — and watch the village thrive or starve." },
      { "title": "Nine playbooks", "text": "Each class is a role in the community: the Heavy protects, the Judge keeps the chronicle and the law, the Lightbearer carries the light, the Would-Be Hero dreams of more. Ties to neighbours are written into the sheet." },
      { "title": "Arcana", "text": "Magic items, the arcana, don't come with instructions: each has its own requirements before its power unlocks. Working out what an old relic wants, and paying for it, can spin off a whole story arc." },
      { "title": "2d6 with advantage", "text": "PbtA classic: 10+ is a success, 7–9 a success at a cost, 6- hands the GM a move. On top of that, advantage and disadvantage: roll a third die and drop the lowest or the highest." }
    ],
    "gallery": [
      { "cap": "An expedition below snowy crags" },
      { "cap": "Heroes in an ancient hall" },
      { "cap": "The Great Wood spread from Book II" },
      { "cap": "Lucie Arnoux art prints" }
    ],
    "resources": [
      { "name": "Publisher: Lampblack & Brimstone" },
      { "name": "Buy books & PDF (Plus One Experience)" },
      { "name": "Free campaign resources" },
      { "name": "Unofficial Foundry VTT system" }
    ]
  }
});
