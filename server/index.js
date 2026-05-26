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

// Aggregate ballots into a ranked tally: score = upvotes − vetoes.
export function buildTally(list, ballots) {
  const counts = new Map(list.map(id => [id, { id, up: 0, veto: 0 }]));
  for (const b of ballots) {
    for (const id of b.up) if (counts.has(id)) counts.get(id).up++;
    for (const id of b.veto) if (counts.has(id)) counts.get(id).veto++;
  }
  return [...counts.values()]
    .map(c => ({ ...c, score: c.up - c.veto }))
    .sort((a, b) => b.score - a.score || b.up - a.up || a.id.localeCompare(b.id));
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
    const list = cleanIdList(req.body?.list).slice(0, MAX_LIST);
    if (list.length === 0) return res.status(400).json({ error: 'list_required' });

    // Retry on the (astronomically unlikely) id collision.
    for (let attempt = 0; attempt < 5; attempt++) {
      const id = makeId();
      try {
        await pool.query(
          'INSERT INTO rooms (id, title, list) VALUES ($1, $2, $3)',
          [id, title, JSON.stringify(list)]
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
    const roomRes = await pool.query('SELECT title, list, created_at FROM rooms WHERE id = $1', [req.params.id]);
    if (roomRes.rowCount === 0) return res.status(404).json({ error: 'not_found' });
    const room = roomRes.rows[0];

    const ballotsRes = await pool.query(
      'SELECT voter, up, veto, updated_at FROM ballots WHERE room_id = $1 ORDER BY updated_at ASC',
      [req.params.id]
    );
    const ballots = ballotsRes.rows.map(r => ({
      voter: r.voter, up: r.up, veto: r.veto, updatedAt: r.updated_at,
    }));

    res.json({
      roomId: req.params.id,
      title: room.title || '',
      list: room.list,
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
    const roomRes = await pool.query('SELECT list FROM rooms WHERE id = $1', [req.params.id]);
    if (roomRes.rowCount === 0) return res.status(404).json({ error: 'not_found' });
    const allowed = new Set(roomRes.rows[0].list);

    const voter = typeof req.body?.voter === 'string' ? req.body.voter.trim().slice(0, MAX_VOTER) : '';
    if (!voter) return res.status(400).json({ error: 'voter_required' });

    const up = cleanIdList(req.body?.up, allowed);
    const veto = cleanIdList(req.body?.veto, allowed).filter(id => !up.includes(id)); // up wins over veto

    await pool.query(
      `INSERT INTO ballots (room_id, voter, up, veto, updated_at)
       VALUES ($1, $2, $3, $4, now())
       ON CONFLICT (room_id, voter)
       DO UPDATE SET up = EXCLUDED.up, veto = EXCLUDED.veto, updated_at = now()`,
      [req.params.id, voter, JSON.stringify(up), JSON.stringify(veto)]
    );
    res.json({ ok: true, voter, up, veto });
  } catch (e) {
    console.error('PUT /room/:id/ballot', e);
    res.status(500).json({ error: 'server_error' });
  }
});

// ---- OG link-preview pages ----------------------------------------------
// Social crawlers ignore the SPA hash fragment and don't run JS, so they can't
// read per-link OG from the static site. These HTML routes return per-link OG
// meta and instantly redirect humans into the SPA. Share links point here.
const SITE = process.env.SITE_ORIGIN || 'https://sessionzero.games';
function htmlEsc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}
// Reuse the already-generated per-system OG images; fall back to the home card.
function ogImage(firstId) {
  return (firstId && /^[a-z0-9_-]+$/i.test(firstId)) ? `${SITE}/og/${firstId}.jpg` : `${SITE}/og/home.jpg`;
}
function ogPage({ title, desc, image, redirect }) {
  const t = htmlEsc(title), d = htmlEsc(desc), img = htmlEsc(image), r = htmlEsc(redirect);
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
<meta property="og:url" content="${r}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${t}">
<meta name="twitter:description" content="${d}">
<meta name="twitter:image" content="${img}">
<link rel="canonical" href="${r}">
<meta http-equiv="refresh" content="0; url=${r}">
</head><body>
<p>Opening Session Zero… <a href="${r}">Continue</a></p>
<script>location.replace(${JSON.stringify(redirect)});</script>
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
    const title = (r.rows[0].title && r.rows[0].title.trim()) || 'Vote: what should we play next?';
    const desc = `${list.length} tabletop RPGs · vote with your group on Session Zero`;
    res.set('Content-Type', 'text/html; charset=utf-8')
       .set('Cache-Control', 'public, max-age=300')
       .send(ogPage({ title, desc, image: ogImage(list[0]), redirect: `${SITE}/#room=${id}` }));
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
  const title = `A shortlist of ${arr.length} tabletop RPG${arr.length === 1 ? '' : 's'}`;
  const desc = 'A hand-picked list shared on Session Zero — tap any game to read more.';
  res.set('Content-Type', 'text/html; charset=utf-8')
     .set('Cache-Control', 'public, max-age=300')
     .send(ogPage({ title, desc, image: ogImage(arr[0]), redirect: `${SITE}/#list=${ids}` }));
});

// Only boot the server when run directly (`node index.js`), not when imported by tests.
import { pathToFileURL } from 'node:url';
const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  initDb()
    .then(() => app.listen(PORT, () => console.log(`Session Zero rooms API on :${PORT}`)))
    .catch(e => { console.error('DB init failed', e); process.exit(1); });
}
