import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import policy from '../policy-core.js';
import {loadColleges} from './policy-pipeline-core.mjs';

const root=path.resolve(import.meta.dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const index=read('index.html'),app=read('app.js'),planner=read('planner.js'),plannerHtml=read('planner.html'),compare=read('compare.js'),sitemap=read('sitemap.xml');
const colleges=loadColleges(),complete=colleges.filter(college=>college.verified).length,partial=colleges.filter(college=>!college.verified&&policy.count(college)>0).length,fields=colleges.reduce((total,college)=>total+policy.count(college),0);
const format=value=>String(value).replace(/\B(?=(\d{3})+(?!\d))/g,' ');

assert.match(index,new RegExp(`id="audit-count"[^>]*>${format(complete)} \/ ${format(colleges.length)}<`),'initial HTML must contain the current audit count');
assert.match(index,new RegExp(`id="audit-coverage"[^>]*>Повністю: ${format(complete)} · Частково: ${format(partial)} · Підтверджених вимог: ${format(fields)} \/ ${format(colleges.length*policy.fields.length)}<`),'initial HTML must contain current coverage');
assert.doesNotMatch(index,/id="data-updated"[^>]*>[^<]*(?:завантаж|loading|—)/i,'initial HTML must contain the current review date');
assert.match(app,/colleges\.filter\(college => college\.verified\)\.length/,'complete review count must come from runtime data');
assert.match(app,/latestReview=colleges\.map\(college=>college\.checkedAt\)/,'latest review date must come from reviewed records');
assert.match(index,/data-hero-planner/,'homepage must expose the primary profile route');
assert.match(app,/data-clear-no-results/,'search empty state must provide a recovery action');
assert.match(app,/focusable=\[\.\.\.q\('shortlist-drawer'\)/,'shortlist dialog must trap keyboard focus');
assert.match(planner,/deadline-row--\$\{state\}/,'deadlines must expose today, upcoming, passed and unknown states');
assert.match(planner,/Date\.UTC\(year,month-1,day\+1\)/,'calendar end dates must avoid local-time rollover');
assert.match(planner,/deadlineNotVerified/,'unknown deadlines must not be presented as dates');
assert.match(planner,/notify\(t\('removed'\)/,'application removal must offer undo');
assert.match(compare,/renderMobileComparison/,'compare must have a mobile presentation');
assert.match(plannerHtml,/meta name="robots" content="noindex,follow"/,'planner must be excluded from search results');
assert.doesNotMatch(sitemap,/\/planner<\/loc>/,'planner must not be listed in the public sitemap');
console.log('PASS: production counts, core CTAs, actionable states, date safety, undo and mobile compare');
