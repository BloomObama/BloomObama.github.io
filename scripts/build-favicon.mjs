import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const playwright = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const browser = await playwright.chromium.launch({
  headless: true,
  executablePath: process.env.BROWSER_EXECUTABLE || undefined,
});

try {
  const page = await browser.newPage({ viewport: { width: 96, height: 96 }, deviceScaleFactor: 1 });
  const svg = fs.readFileSync(path.join(root, 'assets/app-icon.svg'), 'utf8');
  await page.setContent(`<style>html,body{margin:0;width:96px;height:96px;overflow:hidden}</style>${svg}`);
  await page.locator('svg').screenshot({ path: path.join(root, 'favicon-av.png') });
  console.log('Rendered favicon-av.png from assets/app-icon.svg');
} finally {
  await browser.close();
}
