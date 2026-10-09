import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const rules = fs.readFileSync(path.join(root, 'firestore.rules'), 'utf8');
assert.match(rules, /request\.auth\.token\.email_verified == true/);
assert.match(rules, /request\.auth\.token\.email == 'admitvector@gmail\.com'/);
assert.match(rules, /match \/memberSummaries\/\{userId\}/);
assert.match(rules, /match \/memberActivity\/\{userId\}/);
assert.match(rules, /allow list: if isSiteAdmin\(\);/);
assert.match(rules, /request\.resource\.data\.email == request\.auth\.token\.email/);
assert.match(rules, /request\.resource\.data\.activeSeconds <= resource\.data\.activeSeconds \+ 60/);
assert.doesNotMatch(rules, /allow (?:read|list): if true/);

let now = 0;
let ticker;
const listeners = new Map();
globalThis.performance = { now: () => now };
const sessionValues = new Map();
globalThis.sessionStorage = {
  getItem: key => sessionValues.get(key) || null,
  setItem: (key, value) => sessionValues.set(key, value)
};
globalThis.document = {
  visibilityState: 'visible',
  hasFocus: () => true,
  addEventListener: (name, callback) => listeners.set(name, callback)
};
globalThis.window = {
  setInterval: callback => { ticker = callback; return 1; },
  clearInterval: () => { ticker = null; },
  addEventListener: (name, callback) => listeners.set(name, callback)
};

const writes = [];
const firestore = {
  doc: (_db, collection, uid) => `${collection}/${uid}`,
  setDoc: async (reference, data) => { writes.push({ reference, data }); },
  increment: seconds => ({ seconds }),
  serverTimestamp: () => 'server-time'
};
const { createMemberMetrics } = await import('../member-metrics.mjs');
const metrics = createMemberMetrics({ db:{}, firestore });
const user = { uid:'member-1', email:'member@example.com', emailVerified:true, displayName:'Student' };

await metrics.refreshIdentity(user);
assert.equal(writes[0].reference, 'memberSummaries/member-1');
assert.equal(writes[0].data.email, user.email);
assert.deepEqual(Object.keys(writes[0].data).sort(), ['displayName','email','updatedAt']);
await metrics.refreshIdentity(user);
assert.equal(writes.length, 1, 'unchanged identity should not cost another write');

metrics.start(user);
for (let second = 0; second < 31; second++) { now += 1000; ticker(); }
await metrics.flush();
assert.equal(writes[1].reference, 'memberActivity/member-1');
assert.equal(writes[1].data.activeSeconds.seconds, 30);
assert.deepEqual(Object.keys(writes[1].data).sort(), ['activeSeconds','updatedAt']);

await metrics.stop();
assert.equal(ticker, null);
assert.equal(writes.at(-1).reference, 'memberActivity/member-1');
assert.equal(writes.at(-1).data.activeSeconds.seconds, 1);
assert.equal(writes.some(write => 'password' in write.data || 'path' in write.data), false);
console.log('PASS: owner-only rule guards, minimal summary, focused-time increments, no password or page path');
