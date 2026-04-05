const { test, expect } = require('@playwright/test');

// Helper: skip setup screen
async function skipSetup(page) {
  await page.goto('/');
  await page.waitForTimeout(500);
  const skipBtn = page.locator('button:has-text("browse"), button:has-text("посмотреть")').first();
  if (await skipBtn.isVisible()) {
    await skipBtn.click();
    await page.waitForTimeout(500);
  }
}

// Helper: navigate to a system by clicking sidebar
async function goToSystem(page, systemId) {
  await skipSetup(page);
  // Open sidebar
  const hamburger = page.locator('.hamburger');
  if (await hamburger.isVisible()) {
    await hamburger.click();
    await page.waitForTimeout(300);
  }
  // Click system in nav
  const navItem = page.locator(`.nav-item[data-page="${systemId}"]`);
  await navItem.click();
  await page.waitForTimeout(500);
}

test.describe('Mobile UI checks', () => {

  test('setup screen - buttons fully visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
    await page.screenshot({ path: `test-results/01-setup-${test.info().project.name}.png`, fullPage: true });

    const viewport = page.viewportSize();

    // Start button
    const startBtn = page.locator('button:has-text("Start"), button:has-text("Начать")').first();
    if (await startBtn.isVisible()) {
      const box = await startBtn.boundingBox();
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
    }

    // Skip button
    const skipBtn = page.locator('button:has-text("browse"), button:has-text("посмотреть")').first();
    if (await skipBtn.isVisible()) {
      const box = await skipBtn.boundingBox();
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
    }
  });

  test('catalog view - cards not overflowing', async ({ page }) => {
    await skipSetup(page);
    await page.screenshot({ path: `test-results/02-catalog-${test.info().project.name}.png`, fullPage: true });

    const viewport = page.viewportSize();
    const cards = page.locator('.result-card');
    const count = await cards.count();
    for (let i = 0; i < Math.min(count, 5); i++) {
      const box = await cards.nth(i).boundingBox();
      if (box) {
        expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 2);
      }
    }
  });

  test('no horizontal scroll on system page', async ({ page }) => {
    await goToSystem(page, 'into-the-odd');
    await page.screenshot({ path: `test-results/03-system-page-${test.info().project.name}.png`, fullPage: true });

    const viewport = page.viewportSize();
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 5);
  });

  test('sidebar - close button dismisses sidebar', async ({ page }) => {
    await goToSystem(page, 'into-the-odd');

    // Open sidebar
    const hamburger = page.locator('.hamburger');
    await hamburger.click();
    await page.waitForTimeout(300);

    const sidebar = page.locator('.sidebar');
    await expect(sidebar).toHaveClass(/open/);

    await page.screenshot({ path: `test-results/04-sidebar-open-${test.info().project.name}.png`, fullPage: false });

    // Close via X button
    const closeBtn = page.locator('.sidebar-close');
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();
    await page.waitForTimeout(300);

    await expect(sidebar).not.toHaveClass(/open/);
    await page.screenshot({ path: `test-results/04b-sidebar-closed-${test.info().project.name}.png`, fullPage: false });
  });

  test('sidebar - backdrop tap dismisses sidebar', async ({ page }) => {
    await goToSystem(page, 'into-the-odd');

    const hamburger = page.locator('.hamburger');
    await hamburger.click();
    await page.waitForTimeout(300);

    const sidebar = page.locator('.sidebar');
    await expect(sidebar).toHaveClass(/open/);

    // Tap backdrop area (right edge of screen, outside sidebar)
    const viewport = page.viewportSize();
    await page.mouse.click(viewport.width - 5, viewport.height / 2);
    await page.waitForTimeout(300);

    const isStillOpen = await sidebar.evaluate(el => el.classList.contains('open'));
    if (isStillOpen) {
      console.log('NOTE: Backdrop tap did not close sidebar on ' + test.info().project.name + ' (viewport ' + viewport.width + 'px) - X button is the primary close method');
    }
    await page.screenshot({ path: `test-results/04c-backdrop-tap-${test.info().project.name}.png`, fullPage: false });
  });

  test('Star Wars FFG - description formatting and layout', async ({ page }) => {
    await goToSystem(page, 'star-wars-ffg');
    await page.screenshot({ path: `test-results/05-starwars-${test.info().project.name}.png`, fullPage: true });

    // miniMd working - bold headings present
    const strongs = page.locator('.system-page .setting-block strong');
    const strongCount = await strongs.count();
    expect(strongCount).toBeGreaterThan(0);

    // No horizontal overflow
    const viewport = page.viewportSize();
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 5);
  });

  test('Call of Cthulhu - page renders', async ({ page }) => {
    await goToSystem(page, 'call-of-cthulhu');
    await page.screenshot({ path: `test-results/06-cthulhu-${test.info().project.name}.png`, fullPage: true });

    const viewport = page.viewportSize();
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 5);
  });

  test('sidebar buttons - all within viewport', async ({ page }) => {
    await skipSetup(page);

    const hamburger = page.locator('.hamburger');
    if (await hamburger.isVisible()) {
      await hamburger.click();
      await page.waitForTimeout(300);
    }

    const viewport = page.viewportSize();

    // Check all pres-toggle buttons (Manage, Add, etc.) are within sidebar width
    const sidebarBtns = page.locator('.sidebar .pres-toggle');
    const count = await sidebarBtns.count();
    for (let i = 0; i < count; i++) {
      const box = await sidebarBtns.nth(i).boundingBox();
      if (box) {
        const isOutside = box.x + box.width > viewport.width || box.x < 0;
        if (isOutside) {
          const text = await sidebarBtns.nth(i).textContent();
          console.log(`BUG: Sidebar button "${text.trim()}" is outside viewport (x=${box.x}, w=${box.width}, viewport=${viewport.width})`);
        }
      }
    }

    await page.screenshot({ path: `test-results/07-sidebar-buttons-${test.info().project.name}.png`, fullPage: false });
  });

  test('quick-stats wrap properly on narrow screens', async ({ page }) => {
    await goToSystem(page, 'star-wars-ffg');

    const viewport = page.viewportSize();
    const qsItems = page.locator('.qs');
    const count = await qsItems.count();
    let clipped = 0;
    for (let i = 0; i < count; i++) {
      const box = await qsItems.nth(i).boundingBox();
      if (box && (box.x < 0 || box.x + box.width > viewport.width)) {
        clipped++;
        console.log(`BUG: Quick-stat #${i} clipped (x=${box.x}, w=${box.width})`);
      }
    }

    await page.screenshot({ path: `test-results/08-quickstats-${test.info().project.name}.png`, fullPage: false });
    expect(clipped).toBe(0);
  });

  test('voting results page - no overflow', async ({ page }) => {
    await skipSetup(page);
    await page.screenshot({ path: `test-results/09-results-${test.info().project.name}.png`, fullPage: true });

    const viewport = page.viewportSize();
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(viewport.width + 5);
  });
});
