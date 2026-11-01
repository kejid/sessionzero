// Session Zero — shareable lists + async voting rooms.
// One tiny Express service backed by Postgres. The static site (GitHub Pages)
// calls this over fetch(); without it, the site falls back to local voting.

import crypto from 'node:crypto';
import express from 'express';
import cors from 'cors';
import pg from 'pg';

const PORT = process.env.PORT || 3000;

// Comma-separated list of allowed origins. Default covers the live site,
// the GitHub Pages mirror, and local dev. Set ALLOWED_ORIGINS to override.
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ||
  'https://sessionzero.games,https://kejid.github.io,http://localhost:8080,http://127.0.0.1:8080'
).split(',').map(s => s.trim()).filter(Boolean);

// Room ids are the only secret protecting a vote, so make them unguessable.
// 8 chars from an unambiguous alphabet (no 0/O/1/I/l) ≈ 49 bits of entropy.
const ID_ALPHABET = '23456789abcdefghjkmnpqrstuvwxyz';
function makeId(len = 8) {
  const bytes = crypto.randomBytes(len);
  let out = '';
  for (let i = 0; i < len; i++) out += ID_ALPHABET[bytes[i] % ID_ALPHABET.length];
  return out;
}

// ---- limits (keep payloads small; this is a friends-group tool) ----
const MAX_TITLE = 120;
const MAX_LIST = 80;        // systems in a single shared list
const MAX_ID = 48;          // length of a single system id
const MAX_VOTER = 40;       // voter display name
const MAX_SUGGEST = 3;      // games one voter may add to a room
const MAX_EXPECTED = 50;    // headcount a creator can say they expect
const MAX_TABLES = 6;       // tables in one pinned line-up

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS rooms (
      id         TEXT PRIMARY KEY,
      title      TEXT,
      list       JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS ballots (
      room_id    TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
      voter      TEXT NOT NULL,
      up         JSONB NOT NULL DEFAULT '[]',
      veto       JSONB NOT NULL DEFAULT '[]',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (room_id, voter)
    );
    -- "I'm the GM" flag on a ballot (added after launch, so migrate in place).
    ALTER TABLE ballots ADD COLUMN IF NOT EXISTS gm BOOLEAN NOT NULL DEFAULT false;
    -- Soft "against" votes (−1), separate from vetoes that knock a game out.
    ALTER TABLE ballots ADD COLUMN IF NOT EXISTS down JSONB NOT NULL DEFAULT '[]';
    -- Games players added to the room: { systemId: voterName }.
    ALTER TABLE rooms ADD COLUMN IF NOT EXISTS suggested JSONB NOT NULL DEFAULT '{}';
    -- The creator's own (non-catalog) games: { "custom-…": { name, tagline, image } }.
    ALTER TABLE rooms ADD COLUMN IF NOT EXISTS custom JSONB NOT NULL DEFAULT '{}';
    -- Creator's settings: how many voters to expect (NULL = not said) and whether vetoes are off.
    ALTER TABLE rooms ADD COLUMN IF NOT EXISTS expected INTEGER;
    ALTER TABLE rooms ADD COLUMN IF NOT EXISTS no_veto BOOLEAN NOT NULL DEFAULT false;
    -- The pinned line-up: { tables: [{ game, gm, players }], out, by, at }.
    ALTER TABLE rooms ADD COLUMN IF NOT EXISTS seating JSONB;
  `);
}

// ---- validation helpers (exported for tests) ----
export function cleanIdList(value, allowed) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  const out = [];
  for (const raw of value) {
    if (typeof raw !== 'string') continue;
    const id = raw.trim();
    if (!id || id.length > MAX_ID) continue;
    if (allowed && !allowed.has(id)) continue; // ballot ids must be in the room list
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

// The creator's own games travel with the room. Only "custom-…" ids are
// accepted (so a catalog game can't be renamed), every field is length-capped,
// and images must be http(s). Custom ids without a name are dropped from the list.
export function cleanCustom(list, raw) {
  const custom = {};
  const src = raw && typeof raw === 'object' ? raw : {};
  const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
  const kept = list.filter(id => {
    if (!id.startsWith('custom-')) return true;
    const c = src[id];
    const name = str(c && c.name, 80);
    if (!name) return false;
    const image = str(c.image, 500);
    custom[id] = {
      name,
      tagline: str(c.tagline, 200),
      image: /^https?:\/\//i.test(image) ? image : '',
    };
    return true;
  });
  return { list: kept, custom };
}

// How many voters the creator expects: a whole number in range, else not set.
export function cleanExpected(value) {
  return Number.isInteger(value) && value >= 1 && value <= MAX_EXPECTED ? value : null;
}

// A line-up to pin. Games must be in the room and people must have voted. A GM may
// run several tables; everyone else sits once. Returns null when any table can't
// stand as sent.
export function cleanSeating(raw, list, voters) {
  const tables = raw && Array.isArray(raw.tables) ? raw.tables : [];
  if (!tables.length || tables.length > MAX_TABLES) return null;
  const known = new Set(voters);
  const seated = new Set(tables.map(t => t && t.gm));
  const take = v => {
    if (typeof v !== 'string' || !known.has(v) || seated.has(v)) return false;
    seated.add(v);
    return true;
  };
  const games = new Set();
  const clean = [];
  for (const t of tables) {
    if (!t || !list.includes(t.game) || games.has(t.game) || !known.has(t.gm)) return null;
    games.add(t.game);
    clean.push({ game: t.game, gm: t.gm, players: (Array.isArray(t.players) ? t.players : []).filter(take) });
  }
  return { tables: clean, out: (Array.isArray(raw.out) ? raw.out : []).filter(take) };
}

// Can this voter add another game? (exported for tests)
export function suggestError(room, voter, id) {
  if (!voter) return 'voter_required';
  if (typeof id !== 'string' || !/^[a-z0-9_-]+$/i.test(id) || id.length > MAX_ID) return 'bad_id';
  if (room.list.includes(id)) return 'already_listed';
  if (room.list.length >= MAX_LIST) return 'list_full';
  const mine = Object.values(room.suggested || {}).filter(v => v === voter).length;
  if (mine >= MAX_SUGGEST) return 'suggest_limit';
  return null;
}

// Aggregate ballots into a ranked tally: score = up − down ("against").
// A veto knocks a game out: vetoed games rank below every non-vetoed one.
export function buildTally(list, ballots) {
  const counts = new Map(list.map(id => [id, { id, up: 0, down: 0, veto: 0 }]));
  for (const b of ballots) {
    for (const id of b.up) if (counts.has(id)) counts.get(id).up++;
    for (const id of b.down || []) if (counts.has(id)) counts.get(id).down++;
    for (const id of b.veto) if (counts.has(id)) counts.get(id).veto++;
  }
  return [...counts.values()]
    .map(c => ({ ...c, score: c.up - c.down, vetoed: c.veto > 0 }))
    .sort((a, b) => a.vetoed - b.vetoed || b.score - a.score || b.up - a.up || a.id.localeCompare(b.id));
}

const app = express();
app.use(express.json({ limit: '64kb' }));
app.use(cors({
  origin(origin, cb) {
    // Allow tools/curl (no Origin header) and any whitelisted browser origin.
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error('Origin not allowed: ' + origin));
  },
}));

app.get('/health', (_req, res) => res.json({ ok: true }));

// Create a room from a curated list of system ids.
app.post('/room', async (req, res) => {
  try {
    const title = typeof req.body?.title === 'string'
      ? req.body.title.trim().slice(0, MAX_TITLE) : '';
    const { list, custom } = cleanCustom(cleanIdList(req.body?.list).slice(0, MAX_LIST), req.body?.custom);
    if (list.length === 0) return res.status(400).json({ error: 'list_required' });

    // Retry on the (astronomically unlikely) id collision.
    for (let attempt = 0; attempt < 5; attempt++) {
      const id = makeId();
      try {
        await pool.query(
          'INSERT INTO rooms (id, title, list, custom, expected, no_veto) VALUES ($1, $2, $3, $4, $5, $6)',
          [id, title, JSON.stringify(list), JSON.stringify(custom), cleanExpected(req.body?.expected), req.body?.noVeto === true]
        );
        return res.status(201).json({ roomId: id });
      } catch (e) {
        if (e.code === '23505') continue; // unique_violation → new id
        throw e;
      }
    }
    res.status(500).json({ error: 'id_generation_failed' });
  } catch (e) {
    console.error('POST /room', e);
    res.status(500).json({ error: 'server_error' });
  }
});

// Read a room: its list plus every ballot and the live tally.
app.get('/room/:id', async (req, res) => {
  try {
    const roomRes = await pool.query('SELECT title, list, suggested, custom, expected, no_veto, seating, created_at FROM rooms WHERE id = $1', [req.params.id]);
    if (roomRes.rowCount === 0) return res.status(404).json({ error: 'not_found' });
    const room = roomRes.rows[0];

    const ballotsRes = await pool.query(
      'SELECT voter, up, down, veto, gm, updated_at FROM ballots WHERE room_id = $1 ORDER BY updated_at ASC',
      [req.params.id]
    );
    const ballots = ballotsRes.rows.map(r => ({
      voter: r.voter, up: r.up, down: r.down || [], veto: r.veto, gm: !!r.gm, updatedAt: r.updated_at,
    }));

    res.json({
      roomId: req.params.id,
      title: room.title || '',
      list: room.list,
      suggested: room.suggested || {},
      custom: room.custom || {},
      maxSuggest: MAX_SUGGEST,
      expected: room.expected,
      noVeto: room.no_veto,
      seating: room.seating,
      createdAt: room.created_at,
      voters: ballots.map(b => b.voter),
      ballots,
      tally: buildTally(room.list, ballots),
    });
  } catch (e) {
    console.error('GET /room/:id', e);
    res.status(500).json({ error: 'server_error' });
  }
});

// Cast or update a ballot. Upserts on (room, voter) so people can change their mind.
app.put('/room/:id/ballot', async (req, res) => {
  try {
    const roomRes = await pool.query('SELECT list, no_veto FROM rooms WHERE id = $1', [req.params.id]);
    if (roomRes.rowCount === 0) return res.status(404).json({ error: 'not_found' });
    const allowed = new Set(roomRes.rows[0].list);

    const voter = typeof req.body?.voter === 'string' ? req.body.voter.trim().slice(0, MAX_VOTER) : '';
    if (!voter) return res.status(400).json({ error: 'voter_required' });

    const up = cleanIdList(req.body?.up, allowed);
    // One choice per game: up wins over veto, veto over "against"
    const veto = roomRes.rows[0].no_veto ? [] : cleanIdList(req.body?.veto, allowed).filter(id => !up.includes(id));
    const down = cleanIdList(req.body?.down, allowed).filter(id => !up.includes(id) && !veto.includes(id));
    const gm = req.body?.gm === true;

    await pool.query(
      `INSERT INTO ballots (room_id, voter, up, down, veto, gm, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, now())
       ON CONFLICT (room_id, voter)
       DO UPDATE SET up = EXCLUDED.up, down = EXCLUDED.down, veto = EXCLUDED.veto, gm = EXCLUDED.gm, updated_at = now()`,
      [req.params.id, voter, JSON.stringify(up), JSON.stringify(down), JSON.stringify(veto), gm]
    );
    res.json({ ok: true, voter, up, down, veto, gm });
  } catch (e) {
    console.error('PUT /room/:id/ballot', e);
    res.status(500).json({ error: 'server_error' });
  }
});

// Pin the line-up everyone will see, or unpin it with seating: null.
app.put('/room/:id/seating', async (req, res) => {
  try {
    const roomRes = await pool.query('SELECT list FROM rooms WHERE id = $1', [req.params.id]);
    if (roomRes.rowCount === 0) return res.status(404).json({ error: 'not_found' });
    const by = typeof req.body?.by === 'string' ? req.body.by.trim().slice(0, MAX_VOTER) : '';
    if (!by) return res.status(400).json({ error: 'voter_required' });

    let seating = null;
    if (req.body?.seating !== null) {
      const ballotsRes = await pool.query('SELECT voter FROM ballots WHERE room_id = $1', [req.params.id]);
      const clean = cleanSeating(req.body?.seating, roomRes.rows[0].list, ballotsRes.rows.map(r => r.voter));
      if (!clean) return res.status(400).json({ error: 'bad_seating' });
      seating = { ...clean, by, at: new Date().toISOString() };
    }
    await pool.query('UPDATE rooms SET seating = $2 WHERE id = $1', [req.params.id, seating && JSON.stringify(seating)]);
    res.json({ ok: true, seating });
  } catch (e) {
    console.error('PUT /room/:id/seating', e);
    res.status(500).json({ error: 'server_error' });
  }
});

// A voter adds a game to the room's list (anyone can then vote on it; the GM
// can veto it like any other game).
app.post('/room/:id/suggest', async (req, res) => {
  try {
    const roomRes = await pool.query('SELECT list, suggested FROM rooms WHERE id = $1', [req.params.id]);
    if (roomRes.rowCount === 0) return res.status(404).json({ error: 'not_found' });
    const room = roomRes.rows[0];
    const voter = typeof req.body?.voter === 'string' ? req.body.voter.trim().slice(0, MAX_VOTER) : '';
    const id = typeof req.body?.id === 'string' ? req.body.id.trim() : '';
    const err = suggestError(room, voter, id);
    if (err) return res.status(err === 'suggest_limit' ? 429 : 400).json({ error: err });

    await pool.query(
      `UPDATE rooms SET list = list || $2::jsonb, suggested = suggested || $3::jsonb
       WHERE id = $1 AND NOT (list ? $4)`,
      [req.params.id, JSON.stringify([id]), JSON.stringify({ [id]: voter }), id]
    );
    res.status(201).json({ ok: true, id, voter });
  } catch (e) {
    console.error('POST /room/:id/suggest', e);
    res.status(500).json({ error: 'server_error' });
  }
});

// ---- OG link-preview pages ----------------------------------------------
// Social crawlers ignore the SPA hash fragment and don't run JS, so they can't
// read per-link OG from the static site. These HTML routes return per-link OG
// meta and instantly redirect humans into the SPA. Share links point here.
const SITE = process.env.SITE_ORIGIN || 'https://sessionzero.games';
// This server's own public origin. Share pages name themselves in og:url: crawlers
// that follow og:url (Facebook) would otherwise land on the SPA and get its home card.
const SHARE_ORIGIN = process.env.SHARE_ORIGIN || 'https://sessionzero-rooms-production.up.railway.app';
function htmlEsc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}
// Reuse the already-generated per-system OG images (EN + RU variants); fall back
// to the home card.
function ogImage(firstId, ru) {
  const dir = ru ? '/og/ru/' : '/og/';
  return (firstId && /^[a-z0-9_-]+$/i.test(firstId)) ? `${SITE}${dir}${firstId}.jpg` : `${SITE}/og/home.jpg`;
}
// Room links get the dedicated "group vote" card, so the preview reads as an
// invitation to vote rather than as a link to the first game on the list.
function voteOgImage(ru) {
  return `${SITE}${ru ? '/og/ru/' : '/og/'}vote.jpg`;
}
// Crawlers rarely forward the end user's locale, so the sharer's language is
// baked into the link (?l=ru); Accept-Language is a weak fallback.
function wantsRu(req) {
  if (req.query && req.query.l) return req.query.l === 'ru';
  return /^ru\b/.test(String(req.headers['accept-language'] || '').toLowerCase());
}
export function ogPage({ title, desc, image, redirect, shareUrl }) {
  const t = htmlEsc(title), d = htmlEsc(desc), img = htmlEsc(image), r = htmlEsc(redirect), u = htmlEsc(shareUrl);
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${t}</title>
<meta property="og:type" content="website">
<meta property="og:site_name" content="Session Zero">
<meta property="og:title" content="${t}">
<meta property="og:description" content="${d}">
<meta property="og:image" content="${img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${u}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${t}">
<meta name="twitter:description" content="${d}">
<meta name="twitter:image" content="${img}">
<link rel="canonical" href="${r}">
<meta http-equiv="refresh" content="0; url=${r}">
<meta name="color-scheme" content="dark">
<script>location.replace(${JSON.stringify(redirect)});</script>
<style>
  html,body{margin:0;height:100%;background:#050505;color:#94a3b8;font:15px/1.5 system-ui,sans-serif}
  body{display:flex;align-items:center;justify-content:center}
  a{color:#38bdf8}
</style>
</head><body>
<noscript><p><a href="${r}">Open Session Zero</a></p></noscript>
</body></html>`;
}

// Room share link → per-room OG (title from DB) + redirect to the SPA room.
app.get('/r/:id', async (req, res) => {
  const id = req.params.id;
  if (!/^[a-z0-9]+$/i.test(id)) return res.redirect(302, SITE + '/');
  try {
    const r = await pool.query('SELECT title, list FROM rooms WHERE id = $1', [id]);
    if (r.rowCount === 0) return res.redirect(302, SITE + '/');
    const list = r.rows[0].list || [];
    const ru = wantsRu(req);
    const title = (r.rows[0].title && r.rows[0].title.trim()) ||
      (ru ? 'Голосование: во что играем дальше?' : 'Vote: what should we play next?');
    const desc = ru
      ? `${list.length} настольных RPG · голосуйте группой в Session Zero`
      : `${list.length} tabletop RPGs · vote with your group on Session Zero`;
    res.set('Content-Type', 'text/html; charset=utf-8')
       .set('Cache-Control', 'public, max-age=300')
       .set('Vary', 'Accept-Language')
       .send(ogPage({ title, desc, image: voteOgImage(ru), redirect: `${SITE}/#room=${id}`, shareUrl: `${SHARE_ORIGIN}/r/${id}?l=${ru ? 'ru' : 'en'}` }));
  } catch (e) {
    console.error('GET /r/:id', e);
    res.redirect(302, SITE + '/');
  }
});

// List share link → shortlist OG (ids from the path) + redirect to the SPA list.
app.get('/l/:ids', (req, res) => {
  const ids = req.params.ids;
  if (!/^[A-Za-z0-9_,-]+$/.test(ids)) return res.redirect(302, SITE + '/');
  const arr = ids.split(',').filter(Boolean);
  const ru = wantsRu(req);
  const title = ru
    ? `Шортлист из ${arr.length} настольных RPG`
    : `A shortlist of ${arr.length} tabletop RPG${arr.length === 1 ? '' : 's'}`;
  const desc = ru
    ? 'Подборка игр из Session Zero — нажми на любую, чтобы узнать больше.'
    : 'A hand-picked list shared on Session Zero — tap any game to read more.';
  res.set('Content-Type', 'text/html; charset=utf-8')
     .set('Cache-Control', 'public, max-age=300')
     .set('Vary', 'Accept-Language')
     .send(ogPage({ title, desc, image: ogImage(arr[0], ru), redirect: `${SITE}/#list=${ids}`, shareUrl: `${SHARE_ORIGIN}/l/${ids}?l=${ru ? 'ru' : 'en'}` }));
});

// Only boot the server when run directly (`node index.js`), not when imported by tests.
import { pathToFileURL } from 'node:url';
const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  initDb()
    .then(() => app.listen(PORT, () => console.log(`Session Zero rooms API on :${PORT}`)))
    .catch(e => { console.error('DB init failed', e); process.exit(1); });
}
