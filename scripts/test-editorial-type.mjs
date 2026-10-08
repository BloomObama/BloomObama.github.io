import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const browser = await chromium.launch({ executablePath:process.env.BROWSER_EXECUTABLE, headless:true });
const routes = ['index.html','practice.html','ielts-resources.html','sat-resources.html','compare.html','settings.html','university.html','guide.html','universities/index.html','universities/harvard.html'];
const check = (value,message) => { if (!value) throw new Error(message); };
try {
  const page = await browser.newPage({ viewport:{ width:1440, height:900 } });
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  for (const route of routes) {
    await page.goto(`http://127.0.0.1:8765/${route}?lang=uk`, { waitUntil:'domcontentloaded' });
    await page.waitForTimeout(180);
    check(await page.locator('link[rel="icon"][href="/favicon-mark.png"]').count()===1,`${route}: favicon link`);
    if (!route.includes('guide') && !route.startsWith('universities/')) {
      check(await page.locator('link[href="editorial-type.css?v=1"]').count()===1,`${route}: editorial stylesheet`);
    }
    check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),`${route}: desktop overflow`);
    await page.setViewportSize({width:390,height:844});
    check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),`${route}: mobile overflow`);
    await page.setViewportSize({width:1440,height:900});
  }
  await page.goto('http://127.0.0.1:8765/practice.html?lang=uk',{waitUntil:'domcontentloaded'});
  check(await page.locator('.practice-module__number small').first().evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>=11.5),'practice module label is readable');
  check((await page.locator('[data-practice-key="eyebrow"]').textContent()).includes('AdmitVector'),'practice uses current brand');
  await page.locator('.practice-deck').first().screenshot({path:join(tmpdir(),'admitvector-practice-type.png')});
  await page.goto('http://127.0.0.1:8765/sat-resources.html?lang=uk',{waitUntil:'domcontentloaded'});
  check(await page.locator('.sat-card__source').first().evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>=12),'SAT source labels are readable');
  await page.locator('.sat-tracker').screenshot({path:join(tmpdir(),'admitvector-sat-type.png')});
  await page.evaluate(()=>{ document.documentElement.dataset.theme='dark'; });
  await page.locator('.sat-tracker').screenshot({path:join(tmpdir(),'admitvector-sat-type-dark.png')});
  await page.goto('http://127.0.0.1:8765/index.html?lang=uk',{waitUntil:'domcontentloaded'});
  check(await page.locator('.fr-rail__link').first().evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>=12),'navigation is readable');
  await page.locator('.random-teaser').screenshot({path:join(tmpdir(),'admitvector-finder-type.png')});
  check(errors.length===0,'no browser errors: '+errors.join('; '));
  console.log('PASS: 10 routes, favicon, editorial typography, mobile width, current brand');
} finally { await browser.close(); }
