import { createRequire } from "node:module";
import fs from "node:fs";
import vm from "node:vm";

const sourceContext = vm.createContext({});
vm.runInContext(fs.readFileSync(new URL('../college-policies.js', import.meta.url), 'utf8'), sourceContext);
const latestDate = Object.values(sourceContext.FullRidePolicyAudits).map(item => item.checkedAt).sort().at(-1);
const latestBatch = Object.entries(sourceContext.FullRidePolicyAudits).filter(([, item]) => item.verified && item.checkedAt === latestDate);

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
  for (const [id, expected] of latestBatch) {
    const slug = await page.evaluate(id => colleges.find(item => String(item.catalogId) === id)?.slug, id);
    assert(slug, `Missing exact-ID index entry: ${id}`);
    await page.goto(`http://127.0.0.1:8765/university.html?id=${encodeURIComponent(slug)}&lang=en`, { waitUntil:'domcontentloaded' });
    await page.locator('.profile-policy-grid').waitFor();
    assert(await page.locator('.profile-status.is-verified').count() === 1, `${slug}: reviewed status`);
    const rows = page.locator('.profile-policy-grid article');
    for (const [position, field] of ['aid','testing','english','fee','deadline'].entries()) {
      assert(await rows.nth(position).locator('p').textContent() === expected[field], `${slug}: published ${field}`);
      assert(await rows.nth(position).locator('a').getAttribute('href') === expected[`${field}Source`], `${slug}: official ${field} evidence`);
    }
  }
  assert(errors.length === 0, `Runtime errors: ${errors.join("; ")}`);
  console.log(`PASS: compact catalogue, lazy card details, university profile, comparison, legacy-bundle exclusion, and all five sourced fields for ${latestBatch.length} latest reviewed profiles`);
} finally {
  await browser.close();
}
