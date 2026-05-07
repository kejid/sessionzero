// One-shot cleanup: removes quote objects whose author handle is a known-fake Reddit handle.
// Verified-fake list comes from probing every u/handle in data/systems against
// reddit.com/user/<name>/about.json — these returned 404.

const fs = require('fs');
const path = require('path');

const FAKE = new Set([
  'BX_forever','NHP_Cascade','bastioneer_23','blackmetal_dm','carrion_priest_77',
  'case_officer','coldwar_cryptid','colonial_marine','containment_breach','deep_country',
  'deep_scanner','design_dark','doom_dice','doskvol_scoundrel','downspire_ministry',
  'dragon_slayer_se','dungeon_delver_99','fractal_historian','grainfield_delver',
  'heat_death_salvager','hex_mapper','hexcrawl_fan','icon_seeker','inkandbone_gm',
  'ironclad_actual','last_survivor_log','lone_delver','loop_kid','middle_earth_gm',
  'midnight_cartographer','moldvay_revival','narrative_gm','narrative_ironist',
  'nordic_mystery','psychedelic_gm','raven_gm','sandbox_soldier','slot_inventory',
  'spire_citizen','third_horizon','torch_watcher','treetop_sailor','veldonia_survivor',
  'violet_city_trader','void_cartographer','wetwork_wednesday','wildkin_writer',
  'worldbuilder_gm','xenomorph_gm'
]);

function findQuoteSpan(src, authorIdx) {
  // Walk backwards to the opening "{" of this quote object.
  let depth = 0;
  let openIdx = -1;
  for (let i = authorIdx; i >= 0; i--) {
    const c = src[i];
    if (c === '}') depth++;
    else if (c === '{') {
      if (depth === 0) { openIdx = i; break; }
      depth--;
    }
  }
  if (openIdx === -1) return null;
  // Walk forward to the matching closing "}".
  depth = 0;
  let closeIdx = -1;
  for (let i = openIdx; i < src.length; i++) {
    const c = src[i];
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) { closeIdx = i; break; }
    }
  }
  if (closeIdx === -1) return null;
  // Expand left to consume preceding whitespace (keep at most one leading newline if no preceding comma).
  let start = openIdx;
  while (start > 0 && /[ \t]/.test(src[start - 1])) start--;
  // Expand right to consume trailing comma + whitespace, OR (if last item) preceding comma.
  let end = closeIdx + 1;
  let trailing = end;
  while (trailing < src.length && /[ \t\n\r]/.test(src[trailing])) trailing++;
  if (src[trailing] === ',') {
    // Not last item — eat the comma and following newline.
    end = trailing + 1;
    while (end < src.length && src[end] === '\n') { end++; break; }
  } else {
    // Last item — eat preceding comma + whitespace if present.
    let back = start - 1;
    while (back >= 0 && /[ \t\n\r]/.test(src[back])) back--;
    if (src[back] === ',') start = back;
  }
  return [start, end];
}

function process(filePath) {
  let src = fs.readFileSync(filePath, 'utf8');
  const orig = src;
  const re = /"author":\s*"u\/([^,"]+)/g;
  const removals = [];
  let m;
  while ((m = re.exec(src))) {
    if (FAKE.has(m[1])) {
      const span = findQuoteSpan(src, m.index);
      if (span) removals.push({ handle: m[1], span });
    }
  }
  if (!removals.length) return { changed: false, removed: 0 };
  // Apply removals from the end so indices stay valid.
  removals.sort((a, b) => b.span[0] - a.span[0]);
  for (const r of removals) {
    src = src.slice(0, r.span[0]) + src.slice(r.span[1]);
  }
  // Tidy: collapse "[\n  \n]" → "[]" if quotes array became empty.
  src = src.replace(/"quotes":\s*\[\s*\]/g, '"quotes": []');
  if (src !== orig) {
    fs.writeFileSync(filePath, src);
    return { changed: true, removed: removals.length, handles: removals.map(r => r.handle) };
  }
  return { changed: false, removed: 0 };
}

const dir = path.join(__dirname, '..', 'data', 'systems');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js') && !f.startsWith('_'));
let totalRemoved = 0;
let totalFiles = 0;
for (const f of files) {
  const r = process(path.join(dir, f));
  if (r.changed) {
    totalFiles++;
    totalRemoved += r.removed;
    console.log(`  ${f}: removed ${r.removed} (${r.handles.join(', ')})`);
  }
}
console.log(`\nTotal: ${totalRemoved} fake quote objects removed from ${totalFiles} files.`);
