import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {readJSON} from './policy-pipeline-core.mjs';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const browser = await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE,headless:true});
try {
  const page = await browser.newPage({viewport:{width:1365,height:900}}); const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:8765/index.html?lang=ru#finder');
  await page.locator('#filter-toggle').click();
  await page.locator('#verification-filter').selectOption('partial');
  await page.locator('.card').first().waitFor();
  const reviews = readJSON('data/policy-field-reviews.json').records;
  const expected = Object.values(reviews).filter(record=>{
    const count=Object.values(record.fields).filter(field=>field.status==='verified').length;
    return count>0 && count<5;
  }).length;
  assert.ok((await page.locator('#results-count').textContent()).includes(String(expected)));
  assert.ok((await page.locator('#audit-coverage').textContent()).includes('Частично: '+expected));
  const ids = await page.evaluate(()=>Object.fromEntries(colleges.map(c=>[c.catalogId,c.slug])));
  for (const [id,record] of Object.entries(reviews)) {
    await page.goto(`http://127.0.0.1:8765/university.html?id=${ids[id]}&lang=en`);
    await page.locator('.profile-policy-grid').waitFor();
    for (const key of ['aid','testing','english','fee','deadline']) {
      const row = page.locator(`[data-policy-field="${key}"]`); const field=record.fields[key];
      assert.equal(await row.getAttribute('data-policy-status'),field?.status || 'pending',id+' '+key+' status');
      assert.equal(await row.locator('p').textContent(),field?.status==='verified'?field.value:'Information is not available yet.',id+' '+key+' value');
      if (field) {
        assert.equal(await row.locator('a').getAttribute('href'),field.source);
        await row.locator('summary').click();
        assert.equal(await row.locator('blockquote').textContent(),field.evidence.quote);
      }
    }
  }
  await page.evaluate(slugs=>localStorage.setItem('fullride-compare-v1',JSON.stringify(slugs)),[ids['212009'],ids['166939']]);
  await page.goto('http://127.0.0.1:8765/compare.html?lang=en');
  await page.waitForFunction(()=>document.querySelector('.comparison-table')?.textContent.includes('No application fee for international first-year applicants'));
  assert.ok((await page.locator('.comparison-table').textContent()).includes('International admission is need-aware.'));
  const initialRows=await page.locator('[data-compare-row]:visible').count();
  assert.ok(initialRows>0);
  assert.equal(await page.locator('[data-compare-row="fee-waiver"] .compare-value--unknown').count(),2,'No fee is not automatically a verified fee-waiver policy');
  assert.equal(await page.locator('[data-compare-row="need-blind"] .compare-value--unknown').count(),1,'Unreviewed need-blind is unknown, not no');
  const toggle=page.locator('#differences-only');
  await page.locator('.difference-switch').click();
  assert.equal(await toggle.isChecked(),true);
  assert.ok(await page.locator('[data-compare-row]:visible').count()<initialRows);
  assert.equal(await page.locator('[data-compare-row="fee-waiver"]').count(),0,'Equal unknown values hide with differences-only');
  await page.goto(`http://127.0.0.1:8765/university.html?id=${ids['212674']}&lang=ru`);
  await page.locator('[data-policy-field="deadline"]').waitFor();
  assert.equal(await page.locator('[data-policy-field="deadline"]').getAttribute('data-policy-status'),'conflict');
  assert.ok((await page.locator('.policy-conflict').textContent()).includes('January 20'));
  await page.setViewportSize({width:390,height:844});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));
  assert.deepEqual(errors,[]);
  console.log(`PASS: partial filter (${expected}), coverage counters, all sourced fields/evidence in ${Object.keys(reviews).length} profiles, comparison and conflicting deadlines, mobile layout`);
} finally { await browser.close(); }
