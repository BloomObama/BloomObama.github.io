import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const browser = await chromium.launch({ executablePath:process.env.BROWSER_EXECUTABLE, headless:true });
try {
  const page = await browser.newPage({ viewport:{ width:1440, height:1000 } });
  const assertSettledColor = async (locator, expected, label) => {
    // Observe the actual end state instead of assuming a wall-clock delay is
    // enough for every animation frame on a busy CI runner.
    await page.waitForFunction(({ element, expected }) => getComputedStyle(element).color === expected,
      { element:await locator.elementHandle(), expected }, { timeout:5000 });
    assert.equal(await locator.evaluate(el => getComputedStyle(el).color), expected, label);
  };
  await page.goto('http://127.0.0.1:8765/practice-test.html?lang=ru');
  await page.locator('.practice-deck').first().waitFor();
  const decks = page.locator('.practice-deck');
  assert.equal(await decks.count(), 9);
  for (let i = 0; i < 9; i++) {
    const deck = decks.nth(i), summary = deck.locator('summary');
    await summary.hover();
    const state = await deck.evaluate(el => {
      const summary = el.querySelector('summary');
      return {
        name:el.dataset.deck,
        background:getComputedStyle(summary).backgroundColor,
        title:getComputedStyle(summary.querySelector('b')).color,
        progress:getComputedStyle(summary.querySelector('strong')).color,
        extraHeight:el.getBoundingClientRect().height - summary.getBoundingClientRect().height
      };
    });
    assert(state.extraHeight < 12, `${state.name}: empty space in collapsed deck`);
    if (/^C[12]$/.test(state.name)) {
      assert.equal(state.background, 'rgba(255, 255, 255, 0.07)', `${state.name}: hover preserves red surface`);
      assert.equal(state.title, 'rgb(255, 255, 255)', `${state.name}: white title`);
      assert.equal(state.progress, 'rgb(255, 224, 160)', `${state.name}: readable progress`);
    }
    await summary.focus();
    assert.equal(await summary.evaluate(el => getComputedStyle(el).outlineStyle), 'solid', `${state.name}: keyboard focus`);
    await summary.click();
    const module = deck.locator('.practice-module').first();
    await module.hover();
    if (/^C[12]$/.test(state.name)) {
      assert.equal(await module.evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(161, 51, 75)', `${state.name}: expanded module hover`);
    }
    await summary.click();
  }
  await page.locator('[data-deck="C1"]').scrollIntoViewIfNeeded();
  await page.locator('[data-deck="C2"] summary').hover();
  await page.waitForTimeout(300);
  if (process.env.SCREENSHOT_PATH) await page.screenshot({ path:process.env.SCREENSHOT_PATH });
  await page.setViewportSize({ width:390, height:844 });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2), 'mobile deck layout');
  await page.setViewportSize({ width:1440, height:1000 });
  await page.locator('[data-deck="A1"] summary').click();
  await page.locator('[data-start-deck="A1"][data-module="0"]').click();
  await page.locator('#session-start').click();
  for (const [rating, background, color] of [
    ['again', 'rgb(255, 220, 227)', 'rgb(176, 0, 50)'],
    ['good', 'rgb(186, 247, 224)', 'rgb(0, 95, 74)']
  ]) {
    const button = page.locator(`[data-rate="${rating}"]`);
    await button.hover();
    assert.deepEqual(await button.evaluate(el => ({ background:getComputedStyle(el).backgroundColor, color:getComputedStyle(el).color })), { background, color }, `${rating}: semantic rating hover`);
  }
  for (const route of ['index.html?lang=ru#finder', 'compare.html?lang=ru', 'ielts-resources.html?lang=ru']) {
    await page.goto(`http://127.0.0.1:8765/${route}`);
    const active = page.locator('.fr-rail__link.is-active').first();
    await active.hover();
    await assertSettledColor(active, 'rgb(255, 255, 255)', `${route}: active navigation hover stays readable`);
    await active.focus();
    await assertSettledColor(active, 'rgb(255, 255, 255)', `${route}: active navigation focus stays readable`);
    if (route.startsWith('index')) {
      await page.locator('#search').fill('Harvard University');
      const card = page.locator('.card').first();
      await card.waitFor();
      const color = await card.locator('h3').evaluate(el => getComputedStyle(el).color);
      await card.hover();
      assert.equal(await card.locator('h3').evaluate(el => getComputedStyle(el).color), color, 'university card hover preserves title');
    }
    if (route.startsWith('ielts')) {
      const card = page.locator('.resource-card').first();
      const color = await card.locator('h3').evaluate(el => getComputedStyle(el).color);
      await card.hover();
      assert.equal(await card.locator('h3').evaluate(el => getComputedStyle(el).color), color, 'resource card hover preserves title');
      const filter = page.locator('.resource-filters button.is-active').first();
      await filter.hover();
      await assertSettledColor(filter, 'rgb(255, 255, 255)', 'active resource filter hover stays readable');
    }
  }
  console.log('PASS: all 9 deck hover/focus states, expanded modules, collapsed height, mobile layout, rating buttons, navigation, university/resource cards and active filters');
} finally { await browser.close(); }
