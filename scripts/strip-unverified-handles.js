// One-shot cleanup: removes any quote object whose author starts with "u/"
// (Reddit handle attribution).
//
// Rationale: Reddit access is blocked from the build sandbox (HTTPS 403 from
// reddit.com / old.reddit.com). We can confirm a handle exists via
// reddit.com/user/<name>/about.json (which is permitted), but we cannot verify
// that the user actually wrote the quoted text. Per stage B agent rules,
// a quote should have a VERIFIED-AT URL where the verbatim text is grep-able.
// Real-handle u/ entries fail that bar.
//
// Reuses the same span-removal logic as scripts/strip-fake-quotes.js.

const fs = require('fs');
const path = require('path');

function findQuoteSpan(src, authorIdx) {
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
  let start = openIdx;
  while (start > 0 && /[ \t]/.test(src[start - 1])) start--;
  let end = closeIdx + 1;
  let trailing = end;
  while (trailing < src.length && /[ \t\n\r]/.test(src[trailing])) trailing++;
  if (src[trailing] === ',') {
    end = trailing + 1;
    while (end < src.length && src[end] === '\n') { end++; break; }
  } else {
    let back = start - 1;
    while (back >= 0 && /[ \t\n\r]/.test(src[back])) back--;
    if (src[back] === ',') start = back;
  }
  return [start, end];
}

function process(filePath) {
  let src = fs.readFileSync(filePath, 'utf8');
  const orig = src;
  const re = /"author":\s*"u\/([^"]+)"/g;
  const removals = [];
  let m;
  while ((m = re.exec(src))) {
    const span = findQuoteSpan(src, m.index);
    if (span) removals.push({ handle: m[1], span });
  }
  if (!removals.length) return { changed: false, removed: 0 };
  removals.sort((a, b) => b.span[0] - a.span[0]);
  for (const r of removals) {
    src = src.slice(0, r.span[0]) + src.slice(r.span[1]);
  }
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
console.log(`\nTotal: ${totalRemoved} unverified u/ quote objects removed from ${totalFiles} files.`);
