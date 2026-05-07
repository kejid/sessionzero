// One-shot: re-rank `order` for the 7 newly added systems within their groups.
// All 7 originally got `order: 99` as a placeholder; this script assigns
// realistic ranks based on the existing population of each group.

const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'data', 'systems');

// id -> { scheme: [key, newOrder] }
const ORDERS = {
  'daggerheart':      { default: ['narrative', 21], family: ['standalone', 16], genre: ['adventure', 11],    solo: ['solo-compatible', 9]  },
  'traveller':        { default: ['tactical', 6],   family: ['standalone', 20], genre: ['sci-fi', 11],       solo: ['solo-compatible', 12] },
  'starfinder-2e':    { default: ['tactical', 5],   family: ['standalone', 19], genre: ['sci-fi', 9],        solo: ['solo-compatible', 13] },
  'runequest':        { default: ['tactical', 4],   family: ['standalone', 18], genre: ['dark-fantasy', 9],  solo: ['solo-compatible', 14] },
  'mutant-year-zero': { default: ['fl', 10],        family: ['year-zero', 10],  genre: ['sci-fi', 6],        solo: ['solo-compatible', 15] },
  'fabula-ultima':    { default: ['narrative', 22], family: ['standalone', 17], genre: ['adventure', 12],    solo: ['solo-compatible', 10] },
  'land-of-eem':      { default: ['narrative', 23], family: ['standalone', 21], genre: ['adventure', 13],    solo: ['solo-compatible', 11] },
};

for (const [id, schemes] of Object.entries(ORDERS)) {
  const fp = path.join(dir, id + '.js');
  let src = fs.readFileSync(fp, 'utf8');
  let changed = 0;
  for (const [scheme, [key, ord]] of Object.entries(schemes)) {
    // Match: "scheme": { "key": "key", "order": <num> }
    const re = new RegExp(
      '("' + scheme + '":\\s*\\{\\s*"key":\\s*"' + key + '",\\s*"order":\\s*)\\d+'
    );
    const before = src;
    src = src.replace(re, '$1' + ord);
    if (src !== before) changed++;
  }
  fs.writeFileSync(fp, src);
  console.log(`${id}: updated ${changed}/4 scheme(s)`);
}
