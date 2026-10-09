import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const browser = await chromium.launch({ executablePath:process.env.BROWSER_EXECUTABLE, headless:true });

try {
  const page = await browser.newPage({ viewport:{ width:1280, height:800 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:8765/admin.html', { waitUntil:'domcontentloaded' });
  if (!await page.locator('meta[name="robots"][content="noindex,nofollow"]').count()) throw new Error('owner page must not be indexed');
  if (!await page.locator('#admin-gate').isVisible()) throw new Error('owner gate must be visible while signed out');
  if (!await page.locator('#admin-dashboard').isHidden()) throw new Error('member data must not be shown while signed out');
  if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2)) throw new Error('owner page overflows desktop');
  await page.setViewportSize({ width:390, height:844 });
  if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2)) throw new Error('owner page overflows mobile');
  await page.goto('http://127.0.0.1:8765/privacy.html', { waitUntil:'domcontentloaded' });
  if (!await page.getByText('Необов\'язковий облік часу').isVisible()) throw new Error('privacy page must explain optional activity tracking');
  if (!await page.locator('a[href="mailto:admitvector@gmail.com"]').count()) throw new Error('privacy page must provide a contact');
  if (errors.length) throw new Error(`browser errors: ${errors.join('; ')}`);
  console.log('PASS: owner gate, privacy notice, desktop and mobile layout');
} finally {
  await browser.close();
}
