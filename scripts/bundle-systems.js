// Cross-platform replacement for the bash one-liner:
//   bash -c 'cat data/systems/_registry.js data/systems/[!_]*.js > data/systems-bundle.js'
//
// On some Windows + npm shell setups the bash redirect silently fails to
// overwrite the output file. Doing the same operation in Node makes the
// pipeline reliable.

const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'data', 'systems');
const OUT = path.join(__dirname, '..', 'data', 'systems-bundle.js');

const registry = path.join(DIR, '_registry.js');
const systemFiles = fs.readdirSync(DIR)
  .filter(f => f.endsWith('.js') && !f.startsWith('_'))
  .sort()
  .map(f => path.join(DIR, f));

const order = [registry, ...systemFiles];
const parts = order.map(f => fs.readFileSync(f, 'utf8'));

fs.writeFileSync(OUT, parts.join(''));
console.log(`[bundle-systems] wrote ${OUT} (${parts.length} files, ${fs.statSync(OUT).size} bytes)`);
