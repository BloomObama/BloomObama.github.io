import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const source = fs.readFileSync(path.join(root, 'analytics-consent.js'), 'utf8');
assert.match(source, /const measurementId = '';/, 'analytics stays inert until a real GA4 ID is configured');

function run(consent) {
  const storage = new Map(consent ? [['admitvector-analytics-consent-v1', consent]] : []);
  const requests = [];
  const elements = new Map();
  const makeElement = tag => ({
    tag, style:{}, children:[], textContent:'',
    setAttribute() {}, addEventListener(name, handler) { this[name] = handler; },
    append(...children) { this.children.push(...children); },
    remove() { elements.delete(this.id); }
  });
  const document = {
    readyState:'complete', cookie:'',
    createElement: makeElement,
    getElementById: id => elements.get(id) || null,
    querySelectorAll: () => [],
    addEventListener() {},
    head:{ append: script => requests.push(script.src) },
    body:{ append: element => elements.set(element.id, element) }
  };
  const context = {
    document, location:{ origin:'https://www.admitvector.com', pathname:'/practice' },
    localStorage:{ getItem:key => storage.get(key) || null, setItem:(key,value) => storage.set(key,value) },
    Date, encodeURIComponent
  };
  context.globalThis = context;
  context.window = context;
  context.addEventListener = () => {};
  vm.runInNewContext(source.replace("const measurementId = '';", "const measurementId = 'G-TEST123';"), context);
  return { requests, elements, storage, context };
}

const undecided = run(null);
assert.equal(undecided.requests.length, 0, 'no Google request before consent');
assert.ok(undecided.elements.has('av-analytics-consent'), 'visitor sees a choice');
undecided.elements.get('av-analytics-consent').children[1].children[0].click();
assert.equal(undecided.requests.length, 0, 'declining does not load Analytics');
assert.equal(undecided.storage.get('admitvector-analytics-consent-v1'), 'denied');

const granted = run('granted');
assert.equal(granted.requests.length, 1, 'prior consent loads one GA4 script');
assert.match(granted.requests[0], /G-TEST123/);
assert.equal(granted.elements.size, 0, 'prior consent does not show the prompt');
console.log('PASS: GA4 requires consent, rejection sends no request, prior consent loads once');
