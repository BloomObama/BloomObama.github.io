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
  console.log('PASS: primary pages run with enforced CSP');
} finally {
  await browser.close();
}
