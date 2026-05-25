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
//                                { scheme, key }  — all systems whose grouping
//                                  `scheme` has that `key` (omit key = any)
//                                { ids: [...] }   — explicit, ordered list
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
});
