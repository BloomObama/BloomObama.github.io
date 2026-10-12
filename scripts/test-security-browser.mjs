import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const browser = await chromium.launch({ executablePath:process.env.BROWSER_EXECUTABLE, headless:true });
try {
  const context = await browser.newContext();
  await context.addInitScript(() => {
    window.__cspViolations = [];
    document.addEventListener('securitypolicyviolation', event => {
      window.__cspViolations.push(`${event.violatedDirective}: ${event.blockedURI}`);
    });
  });
  for (const path of ['/index.html', '/universities/index.html', '/university.html?id=yale', '/compare.html', '/practice.html', '/sat-resources.html', '/ielts-resources.html', '/settings.html', '/admin.html']) {
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:8765${path}`, { waitUntil:'domcontentloaded' });
    await page.waitForTimeout(1000);
    const violations = await page.evaluate(() => window.__cspViolations);
    if (violations.length) throw new Error(`${path}: CSP blocked ${violations.join(', ')}`);
    await page.close();
  }
  const payload = '<img id="security-xss" src=x onerror="window.__queryXss=1">';
  const queryPage = await context.newPage();
  await queryPage.goto(`http://127.0.0.1:8765/index.html?q=${encodeURIComponent(payload)}&lang=${encodeURIComponent(payload)}&returnUrl=${encodeURIComponent('https://evil.example')}`, { waitUntil:'domcontentloaded' });
  if (await queryPage.locator('#search').inputValue() !== payload) throw new Error('search query was not preserved as inert input text');
  if (await queryPage.locator('#security-xss').count() || await queryPage.evaluate(() => window.__queryXss)) throw new Error('query-string payload executed');
  if (new URL(queryPage.url()).origin !== 'http://127.0.0.1:8765') throw new Error('external returnUrl caused a redirect');
  await queryPage.goto(`http://127.0.0.1:8765/university.html?id=${encodeURIComponent(payload)}`, { waitUntil:'domcontentloaded' });
  if (!await queryPage.locator('.profile-missing').count()) throw new Error('invalid university id must render the missing state');
  if (await queryPage.locator('#security-xss').count() || await queryPage.evaluate(() => window.__queryXss)) throw new Error('university id payload executed');
  await queryPage.goto(`http://127.0.0.1:8765/planner.html?view=${encodeURIComponent(payload)}`, { waitUntil:'domcontentloaded' });
  if (await queryPage.locator('[data-panel="profile"][class*="is-active"]').count() !== 1) throw new Error('invalid planner view was not reduced to the safe default');
  await queryPage.evaluate(value => {
    localStorage.setItem('admitvector-student-data-v1', JSON.stringify({ profile:{ major:value } }));
    localStorage.setItem('fullride-preferences-v1', JSON.stringify({
      updatedAt:Date.now(), value:{ profile:{ name:value, avatarImage:`x');background:url(javascript:window.__storedXss=1);/*` } }
    }));
  }, payload);
  await queryPage.goto('http://127.0.0.1:8765/planner.html?view=profile', { waitUntil:'domcontentloaded' });
  await queryPage.locator('[name="major"]').waitFor();
  if (await queryPage.locator('[name="major"]').inputValue() !== payload) throw new Error('stored profile text was not preserved as inert input text');
  if (await queryPage.locator('#security-xss').count() || await queryPage.evaluate(() => window.__storedXss)) throw new Error('stored profile/avatar payload executed');
  await queryPage.close();
  console.log('PASS: primary pages run with enforced CSP; query parameters, stored text and returnUrl remain inert');
} finally {
  await browser.close();
}
