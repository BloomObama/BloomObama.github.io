import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const browser = await chromium.launch({
  ...(process.env.BROWSER_EXECUTABLE ? { executablePath:process.env.BROWSER_EXECUTABLE } : { channel:"msedge" }),
  headless:true
});
try {
  const page = await browser.newPage();
  await page.goto("http://127.0.0.1:8765/scripts/test-practice-browser.html");
  await page.waitForFunction(() => /^(PASS|FAIL):/.test(document.getElementById("result").textContent), null, { timeout:10000 });
  const result = await page.locator("#result").textContent();
  console.log(result);
  if (process.env.SCREENSHOT_PATH) await page.screenshot({ path:process.env.SCREENSHOT_PATH, fullPage:true });
  if (!result.startsWith("PASS:")) process.exitCode = 1;
} finally { await browser.close(); }
