// ============================================================================
// Intent / decision landing pages ("collections")
// ----------------------------------------------------------------------------
// Each registerCollection(slug, config) renders two static pages:
//   /collections/<slug>.html  and  /ru/collections/<slug>.html
// They target decision-stage search queries ("best solo TTRPGs", "OSR games")
// and funnel readers into the voting tool.
//
// The generator assembles the SEO scaffolding (meta, hreflang, JSON-LD) and the
// system list from the catalog. The PROSE below (intro / intro_ru) is meant to
// be HAND-WRITTEN — the short text here is a placeholder starting point; replace
// it with your own. Do not auto-generate descriptions.
//
// config fields:
//   title / title_ru          page title (without "| Session Zero")
//   h1 / h1_ru                 on-page heading (defaults to title)
//   description / _ru          meta description (~155 chars)
//   intro / intro_ru           HTML prose shown above the system list
//   filter                     which systems to list:
//                                { ids: [...] }   — explicit, ordered list
//                                or any mix of these (all must match):
//                                  scheme, key    — grouping `scheme` has that
//                                                   `key` (omit key = any)
//                                  setting        — in settingTags
//                                  playstyle      — in playstyleTags
//                                  complexityMax / complexityMin  (1–5)
//   shortlist                  optional, 3–6 hand-picked ids. Shown as a
//                              "ready-made shortlist" with a button that opens
//                              them as one group vote (/#list=...). Unknown ids
//                              fail the build. Skip it where a group vote makes
//                              no sense (solo games).
// ============================================================================

registerCollection('best-solo-ttrpgs', {
  title: 'Best solo tabletop RPGs',
  title_ru: 'Лучшие соло-настолки (соло-TTRPG)',
  description: 'Tabletop RPGs you can play alone — no group or GM needed. The solo-friendly systems in the Session Zero catalog, from journaling games to full solo adventures.',
  description_ru: 'Настольные ролевые игры, в которые можно играть в одиночку — без группы и ведущего. Соло-системы из каталога Session Zero: от журналинга до полноценных соло-приключений.',
  intro: '<p>Solo tabletop RPGs let you play without a group or a game master — oracles, prompts and journaling drive the story instead. The systems below are tagged solo-friendly in the catalog; open any for a full breakdown.</p>',
  intro_ru: '<p>В соло-TTRPG можно играть без группы и ведущего — историю двигают оракулы, подсказки и журналинг. Системы ниже отмечены как соло-дружелюбные; откройте любую для подробностей.</p>',
  filter: { scheme: 'solo' },
});

registerCollection('osr-tabletop-rpgs', {
  title: 'OSR tabletop RPGs',
  title_ru: 'OSR настольные ролевые игры',
  description: 'OSR (Old-School Renaissance) games: rules-light, deadly, exploration-driven. The OSR systems in the Session Zero catalog, with summaries and free resources.',
  description_ru: 'OSR (Old-School Renaissance): простые правила, смертельность, упор на исследование. OSR-системы из каталога Session Zero с описаниями и бесплатными материалами.',
  intro: '<p>OSR games strip the rules back to fast, deadly, exploration-first play in the spirit of early D&amp;D. The systems below sit in the OSR group of the catalog.</p>',
  intro_ru: '<p>OSR-игры возвращают к быстрым, смертельным правилам с упором на исследование — в духе ранних редакций D&amp;D. Системы ниже входят в OSR-группу каталога.</p>',
  filter: { scheme: 'default', key: 'osr' },
  shortlist: ['shadowdark', 'ose', 'cairn', 'knave', 'dungeon-crawl-classics'],
});

registerCollection('rules-light-ttrpgs', {
  title: 'Rules-light tabletop RPGs',
  title_ru: 'Настольные ролевые игры с простыми правилами',
  description: 'Rules-light TTRPGs you can teach in minutes: short rulebooks, fast character creation, little to look up at the table. From the Session Zero catalog.',
  description_ru: 'Настольные ролевые игры с простыми правилами: объясняются за пару минут, персонаж создаётся быстро, в книгу за столом почти не заглядываешь. Из каталога Session Zero.',
  intro: '<p>These games keep the rules short so the table can get to playing: a page or two of core rules, characters made in minutes, and the GM rules on the rest. Good for new players, one-shots and groups that would rather talk than look things up.</p>',
  intro_ru: '<p>В этих играх правила короткие, чтобы стол быстрее начал играть: страница-две основы, персонаж за несколько минут, остальное решает мастер. Подходят новичкам, ваншотам и группам, которым интереснее говорить, чем листать книгу.</p>',
  filter: { complexityMax: 1 },
  shortlist: ['cairn', 'mausritter', 'mork-borg', 'dungeon-world', 'fiasco'],
});

registerCollection('horror-ttrpgs', {
  title: 'Horror tabletop RPGs',
  title_ru: 'Хоррор настольные ролевые игры',
  description: 'Horror TTRPGs for a tense night or a dread-soaked campaign: cosmic horror, investigation, survival and gothic. Compare them in the Session Zero catalog.',
  description_ru: 'Хоррор-НРИ для напряжённого вечера или мрачной кампании: космический ужас, расследования, выживание и готика. Сравните их в каталоге Session Zero.',
  intro: '<p>Horror games differ a lot in how the fear works: some grind characters down with sanity and stress, some are about investigators piecing together something they should not know, some are one-night tragedies where nobody gets out. The systems below sit in the horror group of the catalog.</p>',
  intro_ru: '<p>Хоррор-системы сильно различаются тем, как устроен страх: где-то персонажей подтачивают рассудок и стресс, где-то сыщики собирают то, чего лучше не знать, а где-то это трагедия на один вечер, из которой никто не выходит. Системы ниже входят в хоррор-группу каталога.</p>',
  filter: { scheme: 'genre', key: 'horror' },
  shortlist: ['call-of-cthulhu', 'delta-green', 'vaesen', 'trophy', 'ten-candles'],
});

registerCollection('sci-fi-ttrpgs', {
  title: 'Sci-fi tabletop RPGs',
  title_ru: 'Научно-фантастические настольные ролевые игры',
  description: 'Science-fiction TTRPGs: space horror, space opera, cyberpunk and hard sci-fi. Compare the sci-fi systems in the Session Zero catalog and vote with your group.',
  description_ru: 'Научно-фантастические НРИ: космический хоррор, космоопера, киберпанк и твёрдая НФ. Сравните sci-fi системы каталога Session Zero и проголосуйте всей группой.',
  intro: '<p>Sci-fi covers very different evenings: a crew of space truckers who will not all come home, smugglers dodging the Empire, street runners in a corporate city, explorers charting a whole sector. The systems below sit in the sci-fi group of the catalog.</p>',
  intro_ru: '<p>Под словом sci-fi скрываются очень разные вечера: экипаж космических дальнобойщиков, который вернётся не весь, контрабандисты, бегущие от Империи, раннеры в корпоративном городе, исследователи целого сектора. Системы ниже входят в sci-fi группу каталога.</p>',
  filter: { scheme: 'genre', key: 'sci-fi' },
  shortlist: ['mothership', 'alien', 'traveller', 'cyberpunk-red', 'scum-and-villainy'],
});

registerCollection('dark-fantasy-ttrpgs', {
  title: 'Dark fantasy tabletop RPGs',
  title_ru: 'Тёмное фэнтези: настольные ролевые игры',
  description: 'Dark fantasy TTRPGs: grim worlds, deadly dungeons, scarce light and hard choices. The dark fantasy systems in the Session Zero catalog.',
  description_ru: 'НРИ в жанре тёмного фэнтези: мрачные миры, смертельные подземелья, мало света и тяжёлые решения. Системы тёмного фэнтези из каталога Session Zero.',
  intro: '<p>Dark fantasy games put the heroes in a world that is not on their side: torches run out, wounds stay, and a win often costs something. The systems below sit in the dark fantasy group of the catalog, from lean OSR dungeon crawls to detailed grim campaigns.</p>',
  intro_ru: '<p>В тёмном фэнтези мир не на стороне героев: факелы кончаются, раны остаются, а победа часто чего-то стоит. Системы ниже входят в группу тёмного фэнтези каталога, от лёгких OSR-подземелий до подробных мрачных кампаний.</p>',
  filter: { scheme: 'genre', key: 'dark-fantasy' },
  shortlist: ['shadowdark', 'mork-borg', 'forbidden-lands', 'wfrp', 'symbaroum'],
});

registerCollection('tactical-combat-ttrpgs', {
  title: 'Tactical combat tabletop RPGs',
  title_ru: 'Настольные ролевые игры с тактическими боями',
  description: 'TTRPGs where combat is a game in itself: positioning, builds, maps and minis. The tactical systems in the Session Zero catalog, from D&D 5e to Lancer.',
  description_ru: 'НРИ, где бой — отдельная игра: позиционирование, билды, карты и миниатюры. Тактические системы каталога Session Zero, от D&D 5e до Lancer.',
  intro: '<p>For groups who enjoy the fight as much as the story: these systems reward positioning, character builds and teamwork on a map. Expect longer combats and more rules to learn, paid back with meaty tactical choices.</p>',
  intro_ru: '<p>Для групп, которым бой нравится не меньше истории: эти системы награждают за позиционирование, билды персонажей и командную игру на карте. Бои длиннее и правил больше, зато тактических решений хватает.</p>',
  filter: { scheme: 'default', key: 'tactical' },
  shortlist: ['dnd-5e', 'pathfinder', 'draw-steel', 'lancer', '13th-age'],
});

registerCollection('mystery-investigation-ttrpgs', {
  title: 'Mystery and investigation tabletop RPGs',
  title_ru: 'Детективные настольные ролевые игры',
  description: 'Mystery and investigation TTRPGs: follow clues, interview witnesses and solve the case. The mystery systems in the Session Zero catalog.',
  description_ru: 'Детективные НРИ и игры-расследования: идите по уликам, допрашивайте свидетелей, раскрывайте дело. Детективные системы каталога Session Zero.',
  intro: '<p>Investigation games are built around finding things out: clues, witnesses, a theory that has to hold together. Some hand clues out so the story never stalls, some let the players decide what the answer is. The systems below are tagged for mystery play in the catalog.</p>',
  intro_ru: '<p>Детективные игры построены вокруг поиска ответов: улики, свидетели, версия, которая должна сойтись. В одних системах улики выдаются так, чтобы история не застревала, в других ответ решают сами игроки. Системы ниже отмечены в каталоге как детективные.</p>',
  filter: { playstyle: 'mystery' },
  shortlist: ['call-of-cthulhu', 'brindlewood-bay', 'blade-runner', 'vaesen', 'tales-loop'],
});

registerCollection('post-apocalyptic-ttrpgs', {
  title: 'Post-apocalyptic tabletop RPGs',
  title_ru: 'Постапокалиптические настольные ролевые игры',
  description: 'Post-apocalyptic TTRPGs: wasteland survival, rebuilding after the fall, and the world that comes next. From the Session Zero catalog.',
  description_ru: 'Постапокалиптические НРИ: выживание в пустошах, восстановление после падения и мир, который приходит следом. Из каталога Session Zero.',
  intro: '<p>After the end there is still a lot to play: scavenging for the next meal, holding a settlement together, or watching a new world grow out of the ruins. The systems below carry the post-apocalyptic tag in the catalog.</p>',
  intro_ru: '<p>После конца света играть есть во что: искать еду на завтра, удерживать поселение или смотреть, как из руин растёт новый мир. Системы ниже отмечены в каталоге как постапокалиптические.</p>',
  filter: { setting: 'postapoc' },
  shortlist: ['mutant-year-zero', 'apocalypse-world', 'twilight', 'mork-borg', 'the-quiet-year'],
});
