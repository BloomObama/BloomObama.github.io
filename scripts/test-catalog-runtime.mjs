import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const browser = await chromium.launch({ executablePath:process.env.BROWSER_EXECUTABLE, headless:true });
const assert = (condition, message) => { if (!condition) throw new Error(message); };

try {
  const page = await browser.newPage({ viewport:{ width:1365, height:900 } });
  const requests = [];
  const errors = [];
  page.on("request", request => requests.push(request.url()));
  page.on("pageerror", error => errors.push(error.message));

  await page.goto("http://127.0.0.1:8765/index.html?lang=ru#finder", { waitUntil:"domcontentloaded" });
  await page.locator("#search").fill("Harvard University");
  await page.locator(".card").first().waitFor();
  assert((await page.locator(".card h3").first().textContent()).includes("Harvard"), "Harvard search result did not render");
  await page.waitForFunction(() => !document.querySelector(".card-description")?.textContent.includes("Загружаем"));
  assert(!(await page.locator(".card-footer a").last().getAttribute("href") || "").startsWith("#"), "Official card link was not hydrated");
  assert(!requests.some(url => /college-(catalog|directory|media|policies)\.js|\/data\.js/.test(url)), "A legacy full-data bundle was downloaded");

  await page.locator(".profile-link").first().click();
  await page.waitForURL(/university\.html\?id=/);
  await page.locator("#profile-root h1").waitFor();
  assert((await page.locator("#profile-root h1").textContent()).includes("Harvard"), "University detail did not load");
  await page.evaluate(() => localStorage.setItem("fullride-compare-v1", JSON.stringify(["harvard","yale"])));
  await page.goto("http://127.0.0.1:8765/compare.html?lang=ru", { waitUntil:"domcontentloaded" });
  await page.locator(".comparison-table").waitFor();
  assert(await page.locator(".comparison-college-head").count() === 2, "Comparison did not render two selected universities");
  assert(errors.length === 0, `Runtime errors: ${errors.join("; ")}`);
  console.log("PASS: compact catalogue, lazy card details, university profile, comparison, and legacy-bundle exclusion");
} finally {
  await browser.close();
}
