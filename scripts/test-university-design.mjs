import {createRequire} from 'node:module';
import {readdir,readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:8765';
const dir = new URL('../data/college-details/',import.meta.url);
let openAdmissionSlug;
for (const filename of await readdir(dir)) {
  const shard = JSON.parse(await readFile(new URL(filename,dir),'utf8'));
  const sample = Object.entries(shard).find(([,c]) => c.facts?.openAdmissions === 1 && c.facts?.enrollment === 62);
  if (sample) { openAdmissionSlug = sample[0]; break; }
}
assert.ok(openAdmissionSlug,'Real open-admission record for the reported overflow regression');
const browser = await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE,headless:true});
try {
  const context = await browser.newContext({viewport:{width:1440,height:1000}});
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror',error => errors.push(error.message));
  const visit = async (slug,lang='ru') => {
    await page.goto(`${base}/university.html?id=${slug}&lang=${lang}`,{waitUntil:'domcontentloaded'});
    await page.locator('.profile-policy-grid').waitFor();
    await page.evaluate(() => document.fonts.ready);
  };
  const layout = async () => {
    const failures = await page.evaluate(() => {
      const problems = [];
      if (document.documentElement.scrollWidth > innerWidth+1) problems.push('page horizontal overflow');
      document.querySelectorAll('.profile-stat-grid article').forEach(card => {
        const value = card.querySelector('strong').getBoundingClientRect();
        const label = card.querySelector('.profile-stat-label').getBoundingClientRect();
        const bounds = card.getBoundingClientRect();
        if (value.bottom > label.top+1) problems.push('stat value overlaps its label');
        if (card.scrollWidth > card.clientWidth+1 || label.bottom > bounds.bottom+1) problems.push('stat content escapes its card');
      });
      document.querySelectorAll('.profile-section-heading h2').forEach(title => {
        if (parseFloat(getComputedStyle(title).fontSize)>40) problems.push('oversized section heading');
      });
      return problems;
    });
    assert.deepEqual(failures,[]);
  };
  await visit('harvard');
  assert.equal(await page.locator('.profile-jump-nav a').count(),5);
  const check = page.locator('[data-profile-check="checkApplication"]');
  await check.check();
  assert.match(await page.locator('[data-checklist-count]').textContent(),/1/);
  await page.reload();
  await check.waitFor();
  assert.equal(await check.isChecked(),true,'checklist persists after reload');
  await page.locator('[data-profile-lang="en"]').click();
  assert.equal(await check.isChecked(),true,'checklist persists after language switch');
  assert.equal(await page.locator('[data-checklist-count]').textContent(),'1 of 8 checked');
  await check.focus();
  await page.keyboard.press('Space');
  assert.equal(await check.isChecked(),false,'keyboard toggles checkmark');
  await layout();
  await page.setViewportSize({width:390,height:844});
  await layout();
  await page.setViewportSize({width:1440,height:1000});
  await page.locator('.profile-hero').scrollIntoViewIfNeeded();
  await page.screenshot({path:'profile-hero-preview.png'});
  await page.locator('#profile-photos').scrollIntoViewIfNeeded();
  await page.waitForTimeout(450);
  assert.ok(await page.locator('.gallery-image').first().evaluate(el=>getComputedStyle(el,'::before').backgroundImage.includes('url(')),'gallery still has its image');
  await page.screenshot({path:'profile-gallery-preview.png'});
  // Invalid user storage must not break profile rendering or create arbitrary checklist entries.
  await page.evaluate(() => localStorage.setItem('fullride-profile-checklist-v1:166027','not-json'));
  await visit('harvard');
  assert.equal(await check.isChecked(),false);
  for (const lang of ['ru','uk','en']) {
    await visit(openAdmissionSlug,lang);
    assert.equal(await check.isChecked(),false,'each college has its own checklist');
    const textValue = page.locator('.profile-stat-grid strong.is-text-value');
    assert.equal(await textValue.count(),1);
    for (const width of [1920,1365,768,390,320]) {
      await page.setViewportSize({width,height:900});
      await layout();
      const card = page.locator('[data-policy-field="testing"]');
      await card.hover();
      assert.equal(await card.evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(255, 255, 255)','hover preserves contrast');
    }
  }
  await page.setViewportSize({width:1440,height:1000});
  await visit(openAdmissionSlug);
  await page.locator('#profile-overview').scrollIntoViewIfNeeded();
  await page.waitForTimeout(450);
  await page.screenshot({path:'profile-overview-preview.png'});
  await page.locator('#profile-admissions').scrollIntoViewIfNeeded();
  await page.waitForTimeout(450);
  assert.ok(await page.locator('[data-policy-field="aid"]').evaluate(el=>el.getBoundingClientRect().height)<180,'unknown aid is not an enormous empty panel');
  await page.screenshot({path:'profile-admissions-preview.png'});
  await page.locator('#profile-preparation').scrollIntoViewIfNeeded();
  await page.waitForTimeout(450);
  await page.screenshot({path:'profile-checklist-preview.png'});
  await page.setViewportSize({width:390,height:844});
  await page.locator('.profile-jump-nav a[href="#profile-admissions"]').click();
  await page.waitForTimeout(600);
  const sectionTop = await page.locator('#profile-admissions').evaluate(el=>el.getBoundingClientRect().top);
  const headerBottom = await page.locator('.topbar').evaluate(el=>el.getBoundingClientRect().bottom);
  assert.ok(sectionTop >= headerBottom-2,'anchor target is not hidden behind mobile header');
  await page.screenshot({path:'profile-mobile-preview.png'});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.locator('[data-profile-lang="uk"]').click();
  assert.equal(await page.locator('.profile-section').first().evaluate(el=>getComputedStyle(el).animationName),'none');
  assert.equal(await page.locator('[data-policy-field="testing"]').evaluate(el=>getComputedStyle(el).transitionDuration),'0s');
  await page.addInitScript(() => {
    const write = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key,value) {
      if (String(key).startsWith('fullride-profile-checklist-v1:')) throw new Error('Storage blocked');
      return write.call(this,key,value);
    };
  });
  await visit(openAdmissionSlug);
  await check.check();
  assert.match(await page.locator('[data-checklist-note]').textContent(),/не позволяет/);
  assert.deepEqual(errors,[],'no page errors');
  console.log('PASS: profile design, 3 languages, 5 widths, text-stat overlap, hover contrast, anchor navigation, saved/isolated checklist, keyboard, reduced motion and blocked storage');
} finally { await browser.close(); }
