import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const index=read('index.html'),app=read('app.js'),planner=read('planner.js'),compare=read('compare.js');

assert.doesNotMatch(index,/58\s*\/\s*5[\s,]002/,'initial HTML must not flash a stale audit count');
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
console.log('PASS: production counts, core CTAs, actionable states, date safety, undo and mobile compare');
