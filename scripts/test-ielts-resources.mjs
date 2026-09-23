import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const browser = await chromium.launch({ executablePath:process.env.BROWSER_EXECUTABLE, headless:true });
const check = (label,value) => { if (!value) throw new Error(label); return label; };
try {
  const page = await browser.newPage({ viewport:{ width:1440, height:1000 } });
  const pageErrors = [];
  page.on("pageerror",error => pageErrors.push(error.message));
  await page.goto("http://127.0.0.1:8765/ielts-resources.html?lang=ru", { waitUntil:"domcontentloaded" });
  const passed = [];
  passed.push(check("ten verified resources render",await page.locator(".resource-card").count() === 10));
  passed.push(check("all four book covers load",await page.locator('.resource-card__visual img').count() === 4));
  passed.push(check("book cover files decode",await page.locator('.resource-card__visual img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))));
  await page.locator('[data-resource-filter="book"]').click();
  passed.push(check("book filter shows four books",await page.locator(".resource-card").count() === 4));
  await page.locator("#resource-reset").click();
  await page.locator("#resource-search").fill("Writing");
  passed.push(check("search narrows the library",await page.locator(".resource-card").count() > 0 && await page.locator(".resource-card").count() < 10));
  await page.locator("#resource-reset").click();
  await page.locator('[data-resource-id="ielts-21-academic"]').click();
  passed.push(check("card opens an information dialog",await page.locator("#resource-dialog").evaluate(dialog => dialog.open)));
  const backupLink = page.locator(".resource-detail__fallback");
  const officialLink = page.locator(".resource-detail__official");
  passed.push(check("dialog contains a working ISBN fallback",(await backupLink.getAttribute("href")).startsWith("https://search.worldcat.org/")));
  passed.push(check("dialog keeps the official Cambridge link",(await officialLink.getAttribute("href")).startsWith("https://shop.cambridge.org/")));
  await page.locator("[data-resource-close]").click();
  await page.locator('[data-resource-lang="en"]').click();
  passed.push(check("language switch updates the page",await page.locator("#library-title").textContent() === "Choose what you need now"));
  passed.push(check("resource route is active in side navigation",await page.locator('[data-rail-route="resources"]').getAttribute("aria-current") === "page"));
  await page.locator('[data-path-resource="bc-mocks"]').click();
  passed.push(check("preparation path opens its promised resource",await page.locator("#resource-dialog-title").textContent() === "Free IELTS Practice & Mock Tests"));
  await page.locator("[data-resource-close]").click();
  await page.waitForTimeout(900);
  await page.screenshot({ path:"ielts-resources-desktop-preview.png", fullPage:true });
  await page.setViewportSize({ width:390, height:844 });
  await page.locator('[data-resource-lang="ru"]').click();
  await page.locator('[data-resource-id="official-guide"]').scrollIntoViewIfNeeded();
  await page.locator('[data-resource-id="official-guide"]').click();
  await page.waitForTimeout(350);
  passed.push(check("mobile dialog fills the viewport",await page.locator("#resource-dialog").evaluate(dialog => dialog.open && dialog.getBoundingClientRect().width >= 350)));
  await page.screenshot({ path:"ielts-resources-mobile-preview.png", fullPage:false });
  passed.push(check("page has no runtime errors",pageErrors.length === 0));
  console.log("PASS: " + passed.join(", "));
} finally {
  await browser.close();
}
