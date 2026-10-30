const { test, expect } = require('@playwright/test');

// The pool from the design mock: 9 players, 4 games, 2 GMs.
const ballot = (voter, up, down, gm) => ({ voter, up, down, veto: [], gm: !!gm });
const POOL = [
  ballot('Аня', ['wildsea', 'blades'], [], true),
  ballot('Боря', ['wildsea', 'blades'], ['mothership']),
  ballot('Вика', ['wildsea', 'cairn'], []),
  ballot('Гриша', ['wildsea', 'mothership'], ['cairn']),
  ballot('Даша', ['wildsea', 'cairn'], ['blades']),
  ballot('Егор', ['blades', 'mothership'], [], true),
  ballot('Женя', ['mothership'], ['wildsea']),
  ballot('Зоя', ['blades', 'mothership'], ['cairn']),
  ballot('Илья', ['blades', 'cairn'], []),
];
const GAMES = ['wildsea', 'blades', 'mothership', 'cairn'];

async function build(page, ballots, games, count, seats) {
  await page.goto('/');
  return page.evaluate(([b, g, c, s]) => szBuildTables(b, g, c, s), [ballots, games, count, seats]);
}

// Open the room's tables panel with the server's answers mocked.
async function openPanel(page) {
  const room = {
    roomId: 'tdrag', title: 'Pool', list: GAMES, ballots: POOL, voters: POOL.map(b => b.voter), tally: [],
    maxSuggest: 3, suggested: {}, custom: {}, expected: null, noVeto: true, seating: null,
  };
  await page.route('**/room/tdrag', r => r.fulfill({ json: room, headers: { 'Access-Control-Allow-Origin': '*' } }));
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('sz-voter-name', 'Аня'));
  await page.evaluate(() => szEnterRoom('tdrag'));
  await page.waitForSelector('.sz-tally-head', { state: 'attached' });
  await page.evaluate(() => { szSetTab('results'); szTablesToggle(); });
  await page.waitForSelector('.sz-table');
  return room;
}
const tableOf = (page, name) => page.evaluate(n => {
  const chip = [...document.querySelectorAll('.sz-seat')].find(c => c.dataset.v === n);
  const zone = chip.closest('.sz-table, .sz-tables-out');
  return [...document.querySelectorAll('.sz-table, .sz-tables-out')].indexOf(zone);
}, name);

test.describe('Dragging players on a desktop', () => {
  test.use({ isMobile: false, hasTouch: false, viewport: { width: 1100, height: 900 } });

  const center = async loc => {
    await loc.scrollIntoViewIfNeeded();
    const box = await loc.boundingBox();
    return [box.x + box.width / 2, box.y + box.height / 2];
  };

  test('to another table, then out of the seating', async ({ page }) => {
    await openPanel(page);
    const from = await tableOf(page, 'Илья');
    const to = from === 0 ? 1 : 0;
    await page.locator('.sz-seat', { hasText: 'Илья' }).dragTo(page.locator('.sz-table').nth(to));
    expect(await tableOf(page, 'Илья')).toBe(to);

    // "Not seated" is empty, so it only appears once the drag has started
    const out = page.locator('.sz-tables-out');
    await expect(out).toBeHidden();
    await page.mouse.move(...await center(page.locator('.sz-seat', { hasText: 'Илья' })));
    await page.mouse.down();
    await page.mouse.move(600, 500, { steps: 5 });
    await expect(out).toBeVisible();
    const [x, y] = await center(out);
    await page.mouse.move(x, y, { steps: 5 });
    await page.mouse.move(x + 4, y);  // dragover only comes with the next move here
    await expect(out).toHaveClass(/sz-drop/);
    await page.mouse.up();
    await expect(out.locator('.sz-seat', { hasText: 'Илья' })).toBeVisible();
    await expect(out).not.toHaveClass(/sz-drop/);
  });

  test('a vote arriving mid-drag does not break the drop', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    const room = await openPanel(page);
    const from = await tableOf(page, 'Илья');
    await page.mouse.move(...await center(page.locator('.sz-seat', { hasText: 'Илья' })));
    await page.mouse.down();
    await page.mouse.move(600, 500, { steps: 5 });
    room.ballots = room.ballots.concat(ballot('Новый', ['wildsea'], []));
    room.voters = room.ballots.map(b => b.voter);
    await page.evaluate(() => szLoadRoom());
    const [x, y] = await center(page.locator('.sz-table').nth(from === 0 ? 1 : 0));
    await page.mouse.move(x, y, { steps: 5 });
    await page.mouse.move(x + 4, y);
    await page.mouse.up();
    await expect(page.locator('.sz-seat', { hasText: 'Новый' })).toHaveCount(1);
    await expect(page.locator('.sz-seat', { hasText: 'Илья' })).toHaveCount(1);
    expect(errors).toEqual([]);
  });

  test('dropping on the same table is not an edit', async ({ page }) => {
    await openPanel(page);
    const from = await tableOf(page, 'Илья');
    await page.locator('.sz-seat', { hasText: 'Илья' }).dragTo(page.locator('.sz-table').nth(from), { targetPosition: { x: 10, y: 10 } });
    expect(await tableOf(page, 'Илья')).toBe(from);
    expect(await page.evaluate(() => szTables.edited)).toBe(false);
  });

  test('a cancelled drag changes nothing', async ({ page }) => {
    await openPanel(page);
    const from = await tableOf(page, 'Илья');
    await page.mouse.move(...await center(page.locator('.sz-seat', { hasText: 'Илья' })));
    await page.mouse.down();
    await page.mouse.move(5, 5, { steps: 5 });
    await page.mouse.up();
    expect(await tableOf(page, 'Илья')).toBe(from);
    await expect(page.locator('.sz-tables-out')).toBeHidden();
    await expect(page.locator('.sz-seat-picked')).toHaveCount(0);
  });
});

test.describe('Moving players between tables', () => {
  test('by pressing a name, then Move here', async ({ page }) => {
    await openPanel(page);
    const from = await tableOf(page, 'Илья');
    const to = from === 0 ? 1 : 0;
    await page.locator('.sz-seat', { hasText: 'Илья' }).click();
    await page.locator('.sz-table').nth(to).locator('.sz-seat-here').click();
    expect(await tableOf(page, 'Илья')).toBe(to);
  });
});

test.describe('Splitting a pool into tables', () => {
  test('seats everyone, with a GM at each table and nobody on a game they are against', async ({ page }) => {
    const { options } = await build(page, POOL, GAMES, 2, 5);
    expect(options.length).toBeGreaterThan(0);
    const best = options[0];
    expect(best.out).toEqual([]);
    const seated = best.tables.flatMap(t => [t.gm, ...t.players]);
    expect(seated.slice().sort()).toEqual(POOL.map(b => b.voter).sort());
    for (const t of best.tables) {
      expect(['Аня', 'Егор']).toContain(t.gm);
      for (const v of [t.gm, ...t.players]) {
        expect(POOL.find(b => b.voter === v).down).not.toContain(t.game);
      }
    }
  });

  test('leaves out a player who is against every table', async ({ page }) => {
    const pool = POOL.concat(ballot('Кирилл', [], GAMES));
    const { options } = await build(page, pool, GAMES, 2, 5);
    expect(options[0].out).toEqual(['Кирилл']);
  });

  test('never overfills a table', async ({ page }) => {
    const { options } = await build(page, POOL, GAMES, 2, 3);
    for (const t of options[0].tables) expect(t.players.length + 1).toBeLessThanOrEqual(3);
    expect(options[0].out.length).toBe(3);
  });

  test('refuses when there are fewer GMs than tables', async ({ page }) => {
    const pool = POOL.map(b => ({ ...b, gm: b.voter === 'Аня' }));
    expect(await build(page, pool, GAMES, 2, 5)).toEqual({ error: 'gms', gms: 1 });
  });

  test('refuses when a GM would have to run a game they are against', async ({ page }) => {
    const pool = [
      ballot('Аня', [], ['wildsea', 'blades'], true),
      ballot('Егор', ['wildsea', 'blades'], [], true),
      ballot('Боря', ['wildsea'], []),
    ];
    expect(await build(page, pool, ['wildsea', 'blades'], 2, 5)).toEqual({ error: 'gm_against' });
  });
});
