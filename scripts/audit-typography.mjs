import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const browser = await chromium.launch({ executablePath:process.env.BROWSER_EXECUTABLE, headless:true });
const routes = ['index.html','practice.html','ielts-resources.html','sat-resources.html','compare.html','settings.html','university.html','guide.html','universities/index.html','universities/harvard.html'];
try {
  const page = await browser.newPage({ viewport:{ width:1440, height:900 } });
  for (const route of routes) {
    await page.goto(`http://127.0.0.1:8765/${route}?lang=uk`, { waitUntil:'domcontentloaded' });
    await page.waitForTimeout(250);
    const samples = await page.evaluate(() => [...document.querySelectorAll('main *, .fr-rail *')].filter(element => {
      if (element.children.length || !element.textContent?.trim()) return false;
      const style = getComputedStyle(element), rect = element.getBoundingClientRect();
      return parseFloat(style.fontSize) < 12 && style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    }).map(element => ({
      selector:`${element.tagName.toLowerCase()}${element.className && typeof element.className === 'string' ? '.' + element.className.trim().split(/\s+/).join('.') : ''}`,
      size:getComputedStyle(element).fontSize,
      text:element.textContent.trim().slice(0,50)
    })).slice(0,24));
    console.log(route, JSON.stringify(samples));
  }
} finally { await browser.close(); }
