// Plain-text audit dump of system content for human review.
// Prints tagline / description / setting / vignette / mechanics / quotes (EN+RU)
// for each requested system.

const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'data', 'systems');
const requested = process.argv.slice(2);
if (!requested.length) {
  console.error('usage: node text-audit.js <id1> <id2> ...');
  process.exit(1);
}

global.registerSystem = function (id, data) {
  if (!requested.includes(id)) return;
  const en = data.en || {};
  const ru = data.ru || {};

  console.log('\n' + '='.repeat(80));
  console.log('# ' + (data.name || id));
  console.log('='.repeat(80));
  console.log(`publisher:     ${data.publisher || '—'}`);
  console.log(`dice:          ${data.dice || '—'}`);
  console.log(`players:       ${data.players || '—'}`);
  console.log(`complexity:    ${data.complexity ?? '—'}`);
  console.log(`foundryStatus: ${data.foundryStatus || '—'}`);
  console.log(`heroImage:     ${data.heroImage || '—'}`);

  for (const lang of ['en', 'ru']) {
    const L = lang === 'en' ? en : ru;
    if (!L) continue;
    console.log('\n--- ' + lang.toUpperCase() + ' ---');
    if (L.tagShort) console.log(`tagShort:    ${L.tagShort}`);
    if (L.tagline)  console.log(`tagline:     ${L.tagline}`);
    if (L.description) console.log(`\nDESCRIPTION:\n${L.description}`);
    if (L.setting)     console.log(`\nSETTING:\n${L.setting}`);
    if (L.vignette)    console.log(`\nVIGNETTE:\n${L.vignette}`);
    if (L.prep)        console.log(`\nprep: ${L.prep}`);
    if (L.mechanics) {
      console.log('\nMECHANICS:');
      L.mechanics.forEach((m, i) => {
        const icon = (data.mechanics || [])[i]?.icon || '?';
        console.log(`  [${icon}] ${m.title}`);
        console.log(`    ${m.text}`);
      });
    }
  }

  // Quotes — top-level EN + ru.quotes
  const qs = data.quotes || [];
  const ruq = (ru.quotes) || [];
  if (qs.length) {
    console.log('\nQUOTES:');
    qs.forEach((q, i) => {
      console.log(`  [${i}] ${q.author}`);
      console.log(`      EN: "${q.text}"`);
      if (ruq[i]) console.log(`      RU: "${ruq[i].text}"`);
    });
  }
};

const files = fs.readdirSync(dir).filter(f => f.endsWith('.js') && !f.startsWith('_'));
for (const f of files) {
  eval(fs.readFileSync(path.join(dir, f), 'utf8'));
}
