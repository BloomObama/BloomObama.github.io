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
  const page = await browser.newPage();
  const source = `data:image/png;base64,${fs.readFileSync(path.join(root, 'assets/avatar-source.png')).toString('base64')}`;
  const icons = await page.evaluate(async (sourceUrl) => {
    const image = new Image();
    image.src = sourceUrl;
    await image.decode();
    const scan = document.createElement('canvas');
    scan.width = image.naturalWidth;
    scan.height = image.naturalHeight;
    const context = scan.getContext('2d', { willReadFrequently: true });
    context.drawImage(image, 0, 0);
    const pixels = context.getImageData(0, 0, scan.width, scan.height).data;
    let left = scan.width, top = scan.height, right = 0, bottom = 0;
    for (let y = 0; y < scan.height; y++) for (let x = 0; x < scan.width; x++) {
      if (pixels[(y * scan.width + x) * 4 + 3] < 32) continue;
      left = Math.min(left, x); top = Math.min(top, y);
      right = Math.max(right, x); bottom = Math.max(bottom, y);
    }
    if (left > right) throw new Error('Avatar source is fully transparent');
    const side = Math.max(right - left + 1, bottom - top + 1) * 1.03;
    const cx = (left + right) / 2, cy = (top + bottom) / 2;
    return [96, 192].map((size) => {
      const output = document.createElement('canvas');
      output.width = output.height = size;
      const outputContext = output.getContext('2d');
      outputContext.imageSmoothingQuality = 'high';
      outputContext.drawImage(image, cx - side / 2, cy - side / 2, side, side, 0, 0, size, size);
      return output.toDataURL('image/png').split(',')[1];
    });
  }, source);
  fs.writeFileSync(path.join(root, 'favicon-mark.png'), Buffer.from(icons[0], 'base64'));
  fs.writeFileSync(path.join(root, 'assets/app-icon-192.png'), Buffer.from(icons[1], 'base64'));
  console.log('Rendered favicon-mark.png and assets/app-icon-192.png from the supplied AV logo');
} finally {
  await browser.close();
}
