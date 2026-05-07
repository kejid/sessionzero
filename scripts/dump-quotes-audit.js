// Audit dump: list every quote in every system with its VERIFIED-AT source URL.
// Used for human review of the catalog's citation integrity.

const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'data', 'systems');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js') && !f.startsWith('_')).sort();
const allQuotes = [];

for (const f of files) {
  const id = f.replace(/\.js$/, '');
  const src = fs.readFileSync(path.join(dir, f), 'utf8');
  // Find top-level quotes array.
  const start = src.search(/\n\s*"quotes":\s*\[/);
  if (start < 0) continue;
  const open = src.indexOf('[', start);
  let depth = 0, i = open;
  for (; i < src.length; i++) {
    if (src[i] === '[') depth++;
    else if (src[i] === ']') { depth--; if (depth === 0) break; }
  }
  const block = src.slice(open, i + 1);
  // Match each quote object, with optional VERIFIED-AT comment either BEFORE the {,
  // or INSIDE the object body (between { and }).
  const objRe = /(?:\/\/\s*VERIFIED-AT:\s*([^\r\n]+)\s*\r?\n\s*)?\{([^{}]*)\}/g;
  let m;
  while ((m = objRe.exec(block))) {
    const before = m[1];
    const body = m[2];
    if (!/"text"/.test(body) || !/"author"/.test(body)) continue;
    const textM = body.match(/"text":\s*"((?:[^"\\]|\\.)*)"/);
    const authorM = body.match(/"author":\s*"((?:[^"\\]|\\.)*)"/);
    if (!textM || !authorM) continue;
    const insideUrl = (body.match(/\/\/\s*VERIFIED-AT:\s*([^\r\n]+)/) || [])[1];
    const url = (before || insideUrl || '').trim();
    allQuotes.push({
      id,
      url,
      author: authorM[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\'),
      text: textM[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\')
    });
  }
}

console.log('Total quotes:', allQuotes.length);
const withUrl = allQuotes.filter(q => q.url);
const withoutUrl = allQuotes.filter(q => !q.url);
console.log('With VERIFIED-AT:', withUrl.length);
console.log('Without VERIFIED-AT:', withoutUrl.length);
if (withoutUrl.length) {
  console.log('\n=== MISSING SOURCE ===');
  for (const q of withoutUrl) console.log(`  ${q.id}: ${q.author}`);
}
console.log('\n=== ALL QUOTES ===');
let lastId = null;
for (const q of allQuotes) {
  if (q.id !== lastId) {
    console.log('\n### ' + q.id);
    lastId = q.id;
  }
  console.log('  · ' + q.author);
  console.log('    ' + (q.url || '<NO SOURCE>'));
  const txt = q.text.length > 130 ? q.text.slice(0, 130) + '…' : q.text;
  console.log('    "' + txt + '"');
}
