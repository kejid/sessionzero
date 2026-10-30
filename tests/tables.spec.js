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
