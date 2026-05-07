// Resolve 6 pre-existing order collisions by bumping the alphabetically-later
// system to <existing>.5. Minimal disruption — preserves all relative positions
// of every other system.

const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'data', 'systems');

// id -> { scheme: [key, oldOrder, newOrder] }
const FIXES = {
  'koriko':                    { default: ['narrative', 19, 19.5], family: ['standalone', 14, 14.5] },
  'nimble':                    { family: ['standalone', 10, 10.5] },
  'starforged':                { family: ['standalone', 11, 11.5] },
  'the-wretched':              { family: ['standalone', 13, 13.5] },
  'thousand-year-old-vampire': { family: ['standalone', 12, 12.5] },
};

for (const [id, schemes] of Object.entries(FIXES)) {
  const fp = path.join(dir, id + '.js');
  let src = fs.readFileSync(fp, 'utf8');
  let changed = 0;
  for (const [scheme, [key, oldOrd, newOrd]] of Object.entries(schemes)) {
    const re = new RegExp(
      '("' + scheme + '":\\s*\\{\\s*"key":\\s*"' + key + '",\\s*"order":\\s*)' + oldOrd + '(\\s*\\})'
    );
    const before = src;
    src = src.replace(re, '$1' + newOrd + '$2');
    if (src !== before) changed++;
  }
  fs.writeFileSync(fp, src);
  console.log(`${id}: bumped ${changed}/${Object.keys(schemes).length} scheme(s)`);
}
