const { test, expect } = require('@playwright/test');

// The address bar is what people copy, so it must be a URL crawlers can read.
const SYS = 'star-wars-ffg';
const path = (page) => page.evaluate(() => location.pathname + location.hash);

async function openCatalog(page) {
  await page.goto('/');
  await page.waitForSelector('.rc-pick');
}

test.describe('Address bar URLs', () => {
  test('opening a system shows its static page URL, assets still load', async ({ page }) => {
    const missing = [];
    page.on('response', (r) => {
      if (r.status() === 404 && r.url().includes('localhost')) missing.push(r.url());
    });
    await openCatalog(page);
    await page.evaluate((id) => showPage(id), SYS);
    await expect(page.locator(`#${SYS}`)).toHaveClass(/active/);
    expect(await path(page)).toMatch(new RegExp(`^(/ru)?/system/${SYS}\\.html$`));
    await page.waitForLoadState('networkidle');
    expect(missing).toEqual([]);
  });

  test('Back returns to the catalog URL and page', async ({ page }) => {
    await openCatalog(page);
    await page.evaluate((id) => showPage(id), SYS);
    await page.goBack();
    await expect(page.locator('#results')).toHaveClass(/active/);
    expect(await path(page)).toBe('/#results');
  });

  test('an old #system link still opens and rewrites the URL', async ({ page }) => {
    await page.goto(`/#${SYS}`);
    await expect(page.locator(`#${SYS}`)).toHaveClass(/active/);
    expect(await path(page)).toMatch(new RegExp(`/system/${SYS}\\.html$`));
  });

  test('switching language moves the URL between EN and RU pages', async ({ page }) => {
    await openCatalog(page);
    await page.evaluate((id) => { setLang('en'); showPage(id); }, SYS);
    expect(await path(page)).toBe(`/system/${SYS}.html`);
    await page.evaluate(() => setLang('ru'));
    expect(await path(page)).toBe(`/ru/system/${SYS}.html`);
  });

  test('custom and catalog pages keep hash URLs', async ({ page }) => {
    await openCatalog(page);
    expect(await page.evaluate(() => pageUrl('results'))).toBe('#results');
    expect(await page.evaluate(() => pageUrl('no-such-system'))).toBe('#no-such-system');
  });

  test('every official system has a static page to point at', async ({ page, request }) => {
    await openCatalog(page);
    const urls = await page.evaluate(() => {
      setLang('en');
      return Object.keys(SYSTEMS_DATA).map(pageUrl).filter((u) => !u.startsWith('#'));
    });
    expect(urls.length).toBeGreaterThan(100);
    for (const u of urls) expect((await request.get(u)).status(), u).toBe(200);
  });
});
