// Unit tests for the pure logic (validation + tally). No DB needed.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cleanIdList, buildTally, suggestError, cleanCustom, cleanExpected, cleanSeating, ogPage } from './index.js';

test('ogPage names the share URL in og:url and sends humans to the SPA', () => {
  const html = ogPage({
    title: 'T', desc: 'D', image: 'https://site/og/vote.jpg',
    redirect: 'https://site/#room=abc', shareUrl: 'https://api/r/abc?l=ru',
  });
  assert.match(html, /<meta property="og:url" content="https:\/\/api\/r\/abc\?l=ru">/);
  assert.match(html, /<link rel="canonical" href="https:\/\/site\/#room=abc">/);
  assert.match(html, /url=https:\/\/site\/#room=abc">/);
});

test('cleanIdList drops non-strings, blanks, dupes, and over-long ids', () => {
  const out = cleanIdList(['cairn', 'cairn', '', 42, null, '  blades  ', 'x'.repeat(100)]);
  assert.deepEqual(out, ['cairn', 'blades']);
});

test('cleanIdList restricts to the allowed set when given one', () => {
  const allowed = new Set(['cairn', 'mothership']);
  assert.deepEqual(cleanIdList(['cairn', 'blades', 'mothership'], allowed), ['cairn', 'mothership']);
});

test('cleanExpected keeps whole numbers in range, anything else means not set', () => {
  assert.equal(cleanExpected(5), 5);
  for (const bad of [0, -1, 51, 2.5, '5', null, undefined]) assert.equal(cleanExpected(bad), null);
});

test('cleanSeating seats each voter once and drops strangers', () => {
  const out = cleanSeating(
    { tables: [{ game: 'cairn', gm: 'Ann', players: ['Bob', 'Bob', 'Ghost', 7] }], out: ['Bob', 'Cid'], by: 'x', at: 'y' },
    ['cairn', 'blades'], ['Ann', 'Bob', 'Cid']
  );
  assert.deepEqual(out, { tables: [{ game: 'cairn', gm: 'Ann', players: ['Bob'] }], out: ['Cid'] });
});

test('cleanSeating lets one GM run several tables, but not also play', () => {
  const out = cleanSeating(
    { tables: [{ game: 'cairn', gm: 'Ann', players: ['Bob'] }, { game: 'blades', gm: 'Ann', players: ['Ann', 'Cid'] }], out: ['Ann'] },
    ['cairn', 'blades'], ['Ann', 'Bob', 'Cid']
  );
  assert.deepEqual(out, {
    tables: [{ game: 'cairn', gm: 'Ann', players: ['Bob'] }, { game: 'blades', gm: 'Ann', players: ['Cid'] }],
    out: [],
  });
});

test('cleanSeating rejects a line-up that cannot stand', () => {
  const list = ['cairn', 'blades'], voters = ['Ann', 'Bob'];
  const t = (game, gm) => ({ game, gm, players: [] });
  assert.equal(cleanSeating({ tables: [] }, list, voters), null);
  assert.equal(cleanSeating(undefined, list, voters), null);
  assert.equal(cleanSeating({ tables: [t('mork', 'Ann')] }, list, voters), null);
  assert.equal(cleanSeating({ tables: [t('cairn', 'Ghost')] }, list, voters), null);
  assert.equal(cleanSeating({ tables: [t('cairn', 'Ann'), t('cairn', 'Bob')] }, list, voters), null);
});

test('cleanIdList returns [] for non-array input', () => {
  assert.deepEqual(cleanIdList(undefined), []);
  assert.deepEqual(cleanIdList('cairn'), []);
});

test('buildTally: score = up − against; a single veto knocks a game out', () => {
  const list = ['cairn', 'mothership', 'blades', 'mork'];
  const ballots = [
    { up: ['cairn', 'mothership', 'blades'], down: [], veto: [] },
    { up: ['mothership', 'blades'], down: ['cairn'], veto: [] },
    { up: ['blades', 'mork'], down: [], veto: ['mothership'] },
  ];
  const tally = buildTally(list, ballots);
  // mothership has 2 ups but a veto → last; cairn 1 up − 1 against = 0 → below mork
  assert.deepEqual(tally.map(t => t.id), ['blades', 'mork', 'cairn', 'mothership']);
  assert.deepEqual(tally.find(t => t.id === 'cairn'), { id: 'cairn', up: 1, down: 1, veto: 0, score: 0, vetoed: false });
  assert.deepEqual(tally.find(t => t.id === 'mothership'), { id: 'mothership', up: 2, down: 0, veto: 1, score: 2, vetoed: true });
});

test('buildTally accepts ballots saved before "against" existed', () => {
  const tally = buildTally(['a'], [{ up: ['a'], veto: [] }]);
  assert.deepEqual(tally, [{ id: 'a', up: 1, down: 0, veto: 0, score: 1, vetoed: false }]);
});

test('buildTally includes systems with zero ballots', () => {
  const tally = buildTally(['a', 'b'], []);
  assert.deepEqual(tally, [
    { id: 'a', up: 0, down: 0, veto: 0, score: 0, vetoed: false },
    { id: 'b', up: 0, down: 0, veto: 0, score: 0, vetoed: false },
  ]);
});

test('buildTally ignores ids not in the list', () => {
  const tally = buildTally(['a'], [{ up: ['a', 'ghost'], down: ['ghost'], veto: ['ghost'] }]);
  assert.deepEqual(tally, [{ id: 'a', up: 1, down: 0, veto: 0, score: 1, vetoed: false }]);
});

test('suggestError allows a new game and enforces id, duplicates and the per-voter limit', () => {
  const room = { list: ['cairn'], suggested: {} };
  assert.equal(suggestError(room, 'Ann', 'mothership'), null);
  assert.equal(suggestError(room, '', 'mothership'), 'voter_required');
  assert.equal(suggestError(room, 'Ann', 'bad id!'), 'bad_id');
  assert.equal(suggestError(room, 'Ann', 'cairn'), 'already_listed');
  const full = { list: ['a', 'b', 'c', 'd'], suggested: { b: 'Ann', c: 'Ann', d: 'Ann' } };
  assert.equal(suggestError(full, 'Ann', 'e'), 'suggest_limit');
  assert.equal(suggestError(full, 'Bob', 'e'), null);
});

test('cleanCustom keeps named custom games, caps fields and drops the rest', () => {
  const { list, custom } = cleanCustom(
    ['cairn', 'custom-heist', 'custom-noname', 'custom-xss'],
    {
      'custom-heist': { name: '  Heist Night  ', tagline: 'x'.repeat(300), image: 'https://img/a.png' },
      'custom-noname': { tagline: 'no name' },
      'custom-xss': { name: 'Bad', image: 'javascript:alert(1)' },
      cairn: { name: 'Fake Cairn' },
    },
  );
  assert.deepEqual(list, ['cairn', 'custom-heist', 'custom-xss']);
  assert.equal(custom['custom-heist'].name, 'Heist Night');
  assert.equal(custom['custom-heist'].tagline.length, 200);
  assert.equal(custom['custom-xss'].image, '');
  assert.equal(custom.cairn, undefined); // catalog ids can't be overridden
});
