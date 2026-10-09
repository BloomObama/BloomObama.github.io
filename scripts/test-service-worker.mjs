import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const source = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const navigation = fs.readFileSync(path.join(root, 'site-nav.js'), 'utf8');
assert.match(source, /CACHE_VERSION = "fullride-v5"/);
assert.match(navigation, /register\("sw\.js\?v=5"/);

async function requestFor({ destination, mode = 'same-origin', offline = false }) {
  const listeners = new Map();
  const stored = new Map();
  const url = `https://www.admitvector.com/test.${destination === 'script' ? 'js' : 'png'}`;
  const request = { url, method:'GET', mode, destination };
  const stale = { version:'old', ok:true, clone() { return this; } };
  const fresh = { version:'new', ok:true, clone() { return this; } };
  stored.set(url, stale);
  const caches = {
    match: async item => stored.get(typeof item === 'string' ? item : item.url),
    open: async () => ({ put: async (item, response) => stored.set(item.url, response) })
  };
  const context = {
    URL, caches,
    Response:{ error:() => ({ version:'error' }) },
    fetch:async () => { if (offline) throw new Error('offline'); return fresh; },
    self:{ location:{ origin:'https://www.admitvector.com' }, addEventListener:(name, fn) => listeners.set(name, fn) }
  };
  vm.runInNewContext(source, context);
  let response;
  listeners.get('fetch')({ request, respondWith: value => { response = value; }, waitUntil: () => {} });
  return { response:await response, stored:stored.get(url) };
}

const onlineScript = await requestFor({ destination:'script' });
assert.equal(onlineScript.response.version, 'new', 'online scripts must bypass stale offline copies');
assert.equal(onlineScript.stored.version, 'new', 'the fresh script becomes the offline fallback');
const offlineScript = await requestFor({ destination:'script', offline:true });
assert.equal(offlineScript.response.version, 'old', 'offline scripts keep working from cache');
const onlineImage = await requestFor({ destination:'image' });
assert.equal(onlineImage.response.version, 'old', 'non-executable images may use stale-while-revalidate');
console.log('PASS: service worker refreshes executable assets online and preserves offline fallback');
