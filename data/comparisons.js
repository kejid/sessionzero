// ============================================================================
// "X vs Y" comparison pages
// ----------------------------------------------------------------------------
// Each registerComparison(a, b, config) renders two static pages:
//   /compare/<a>-vs-<b>.html  and  /ru/compare/<a>-vs-<b>.html
// They target "X vs Y" search queries and end in a two-game group vote
// (/#list=a,b). The side-by-side table and both game summaries come from the
// system cards, so a pair needs no text of its own.
//
// config fields (all optional):
//   intro / intro_ru   HAND-WRITTEN prose shown above the table: who should
//                      pick which game. Leave empty until the author writes it;
//                      do not auto-generate it.
// ============================================================================

registerComparison('dnd-5e', 'pathfinder');
registerComparison('dnd-5e', 'daggerheart');
registerComparison('dnd-5e', 'tales-of-the-valiant');
registerComparison('shadowdark', 'ose');
registerComparison('mork-borg', 'shadowdark');
registerComparison('knave', 'cairn');
registerComparison('call-of-cthulhu', 'delta-green');
registerComparison('mothership', 'alien');
registerComparison('blades', 'scum-and-villainy');
registerComparison('cyberpunk-red', 'shadowrun');
registerComparison('shadow-of-the-demon-lord', 'shadow-of-the-weird-wizard');
