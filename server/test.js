// Unit tests for the pure logic (validation + tally). No DB needed.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cleanIdList, buildTally } from './index.js';

test('cleanIdList drops non-strings, blanks, dupes, and over-long ids', () => {
  const out = cleanIdList(['cairn', 'cairn', '', 42, null, '  blades  ', 'x'.repeat(100)]);
  assert.deepEqual(out, ['cairn', 'blades']);
});

test('cleanIdList restricts to the allowed set when given one', () => {
  const allowed = new Set(['cairn', 'mothership']);
  assert.deepEqual(cleanIdList(['cairn', 'blades', 'mothership'], allowed), ['cairn', 'mothership']);
});

test('cleanIdList returns [] for non-array input', () => {
  assert.deepEqual(cleanIdList(undefined), []);
  assert.deepEqual(cleanIdList('cairn'), []);
});

test('buildTally ranks by score = up − veto, then up, then id', () => {
  const list = ['cairn', 'mothership', 'blades'];
  const ballots = [
    { up: ['cairn', 'mothership'], veto: ['blades'] },
    { up: ['cairn'], veto: ['mothership'] },
    { up: ['cairn', 'blades'], veto: [] },
  ];
  const tally = buildTally(list, ballots);
  assert.deepEqual(tally.map(t => t.id), ['cairn', 'blades', 'mothership']);
  assert.deepEqual(tally.find(t => t.id === 'cairn'), { id: 'cairn', up: 3, veto: 0, score: 3 });
  assert.deepEqual(tally.find(t => t.id === 'mothership'), { id: 'mothership', up: 1, veto: 1, score: 0 });
  assert.deepEqual(tally.find(t => t.id === 'blades'), { id: 'blades', up: 1, veto: 1, score: 0 });
});

test('buildTally includes systems with zero ballots', () => {
  const tally = buildTally(['a', 'b'], []);
  assert.deepEqual(tally, [
    { id: 'a', up: 0, veto: 0, score: 0 },
    { id: 'b', up: 0, veto: 0, score: 0 },
  ]);
});

test('buildTally ignores ids not in the list', () => {
  const tally = buildTally(['a'], [{ up: ['a', 'ghost'], veto: ['ghost'] }]);
  assert.deepEqual(tally, [{ id: 'a', up: 1, veto: 0, score: 1 }]);
});
