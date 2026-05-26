# Session Zero — rooms API

Tiny backend for **shareable lists** and **async voting rooms**. The static
site ([sessionzero.games](https://sessionzero.games)) stays on GitHub Pages and
calls this over `fetch()`. Without it, the site falls back to local in-room
voting — this service only powers the cross-device async flow.

## Endpoints

| Method | Path                | Body                          | Returns |
|--------|---------------------|-------------------------------|---------|
| `GET`  | `/health`           | —                             | `{ ok: true }` |
| `POST` | `/room`             | `{ title, list:[systemIds] }` | `{ roomId }` |
| `GET`  | `/room/:id`         | —                             | `{ title, list, ballots, tally, voters }` |
| `PUT`  | `/room/:id/ballot`  | `{ voter, up:[], veto:[] }`   | `{ ok, voter, up, veto }` |

Ballots upsert on `(room, voter)`, so a voter can change their mind. `up`
overrides `veto` for the same system. `tally` is ranked by `score = up − veto`.

## Data model

```
rooms   (id, title, list jsonb, created_at)
ballots (room_id, voter, up jsonb, veto jsonb, updated_at)   PK (room_id, voter)
```

Tables are created automatically on boot.

## Deploy on Railway

1. **New Project → Deploy from GitHub repo**, then set **Root Directory** to `server/`.
2. **Add → Database → PostgreSQL.** Railway injects `DATABASE_URL` automatically.
3. Deploy. The start command is `npm start` (from `package.json`).
4. Grab the public URL Railway assigns (e.g. `https://sessionzero-rooms.up.railway.app`).
5. Put that URL into the front-end config constant (`SESSIONZERO_API`) so the site
   knows where the rooms live.

By default the API only accepts browser requests from `sessionzero.games`, the
github.io mirror, and `localhost:8080`. Override with `ALLOWED_ORIGINS` if your
domain differs.

## Local dev

```bash
cd server
npm install
cp .env.example .env        # point DATABASE_URL at a local Postgres
npm start
```
