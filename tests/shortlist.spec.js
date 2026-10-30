const { test, expect } = require('@playwright/test');

// First visit: empty storage, browse mode.
async function openCatalog(page) {
  await page.goto('/');
  await page.waitForSelector('.rc-pick');
}

const pick = (page, id) => page.locator(`.rc-pick[data-pick-id="${id}"]`);
const bar = (page) => page.locator('#shortlist-bar');
const cards = (page) => page.locator('#results-grid .result-card');

test.describe('Shortlist', () => {
  test('starts empty, with the bar hidden', async ({ page }) => {
    await openCatalog(page);
    await expect(bar(page)).toBeHidden();
    expect(await page.evaluate(() => szGetPick().size)).toBe(0);
  });

  test('+ on a card adds and removes a game without opening it', async ({ page }) => {
    await openCatalog(page);
    await pick(page, 'alien').click();
    await expect(pick(page, 'alien')).toHaveClass(/on/);
    await expect(pick(page, 'alien')).toHaveAttribute('aria-pressed', 'true');
    await expect(bar(page)).toBeVisible();
    await expect(page.locator('#results')).toHaveClass(/active/);

    await pick(page, 'alien').click();
    await expect(pick(page, 'alien')).not.toHaveClass(/on/);
    await expect(bar(page)).toBeHidden();
  });

  test('survives a reload', async ({ page }) => {
    await openCatalog(page);
    await pick(page, 'alien').click();
    await page.reload();
    await page.waitForSelector('.rc-pick');
    await expect(pick(page, 'alien')).toHaveClass(/on/);
    await expect(bar(page)).toBeVisible();
  });

  test('Send opens the share panel with exactly the shortlist', async ({ page }) => {
    await openCatalog(page);
    await pick(page, 'alien').click();
    await pick(page, 'blades').click();
    await page.locator('.slb-send').click();
    await expect(page.locator('#sz-pick-count')).toContainText('2');
    expect(await page.evaluate(() => [...szPick].sort())).toEqual(['alien', 'blades']);
  });

  test('an empty share panel explains how to fill the list', async ({ page }) => {
    await openCatalog(page);
    await page.evaluate(() => shareFromResults());
    await expect(page.locator('.sz-pick-empty')).toBeVisible();
    await expect(page.locator('#sz-room .sz-pick-action').first()).toBeDisabled();
  });

  test('sharing with a filter and no shortlist sends the filtered games', async ({ page }) => {
    await openCatalog(page);
    await page.evaluate(() => cycleTagFilter('fam:year-zero'));
    const shown = await cards(page).count();
    await page.evaluate(() => shareFromResults());
    expect(await page.evaluate(() => szPick.size)).toBe(shown);
  });

  test('a filter matching nothing keeps the saved shortlist', async ({ page }) => {
    await openCatalog(page);
    await pick(page, 'alien').click();
    await page.evaluate(() => {
      cycleTagFilter('fam:year-zero');
      cycleTagFilter('fam:year-zero'); // now excluded, so an include of it can't match
      tagInclude.add('fam:year-zero');
      renderResults();
      shareFromResults();
    });
    expect(await page.evaluate(() => [...szPick])).toEqual(['alien']);
  });

  test('Add shown adds the filtered games to the list', async ({ page }) => {
    await openCatalog(page);
    await pick(page, 'blades').click();
    await page.evaluate(() => cycleTagFilter('fam:year-zero'));
    const shown = await cards(page).count();
    await page.locator('.slb-add').click();
    expect(await page.evaluate(() => szPick.size)).toBe(shown + 1);
    await expect(page.locator('.slb-add')).toBeHidden();
  });
});

test.describe('Publisher filter', () => {
  test('lists publishers with 2+ games, and search finds the rest', async ({ page }) => {
    await openCatalog(page);
    const visible = page.locator('.tag-filter-btn.publisher:not([hidden])');
    await page.evaluate(() => document.getElementById('results-tag-filter').classList.add('expanded'));
    const counts = await visible.locator('.tag-filter-count').allTextContents();
    expect(counts.length).toBeGreaterThan(1);
    expect(counts.every((c) => Number(c) >= 2)).toBe(true);

    await page.evaluate(() => setPublisherSearch('cavalry'));
    await expect(visible).toHaveCount(1);
    await expect(visible).toContainText('Cavalry Games');
  });

  test('include ORs publishers, exclude removes them', async ({ page }) => {
    await openCatalog(page);
    const count = async (keys) => page.evaluate((ks) => {
      clearTagFilter();
      ks.forEach((k) => cycleTagFilter(k));
      return document.querySelectorAll('#results-grid .result-card').length;
    }, keys);
    const a = await count(['pub:chaosium']);
    const b = await count(['pub:magpie-games']);
    expect(a).toBeGreaterThan(0);
    expect(b).toBeGreaterThan(0);
    expect(await count(['pub:chaosium', 'pub:magpie-games'])).toBe(a + b);

    const all = await count([]);
    const excluded = await page.evaluate(() => {
      cycleTagFilter('pub:chaosium');
      cycleTagFilter('pub:chaosium');
      return document.querySelectorAll('#results-grid .result-card').length;
    });
    expect(excluded).toBe(all - a);
  });
});
