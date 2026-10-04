import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { readJSON, root, htmlText, digest, candidates, allowedURL } from './policy-pipeline-core.mjs';

// Use only for a page the normal collector already fetched under its robots rules.
const [idArg, requestedURL, expectedText] = process.argv.slice(2);
const id = Number(idArg);
const manifest = readJSON('data/policy-source-manifest.json');
const domains = manifest.records[id]?.domains;
const cache = path.join(root, '.policy-cache');
const statePath = path.join(cache, 'state.json');
const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
const key = id + '|' + requestedURL;
const old = state[key];
if (!Number.isInteger(id) || !domains || !manifest.records[id].urls.includes(requestedURL) || !allowedURL(requestedURL, domains) || old?.status !== 'captured' || !old.hash || !expectedText) {
  throw new Error('An exact, previously permitted and captured source plus expected text are required');
}
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const browser = await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE, headless:true});
try {
  const page = await browser.newPage();
  await page.route('**/*', route => ['image','media','font'].includes(route.request().resourceType()) ? route.abort() : route.continue());
  await page.goto(requestedURL, {waitUntil:'domcontentloaded', timeout:20000});
  if (!allowedURL(page.url(), domains) || page.url() !== old.url) throw new Error('Unexpected rendered-source redirect');
  await page.waitForFunction(text => document.querySelector('main')?.innerText.includes(text), expectedText, {timeout:10000});
  const text = htmlText(await page.content());
  if (!text.includes(expectedText) || text.length < 300 || /verify you are human|checking your browser|access denied|captcha/i.test(text.slice(0,3000))) throw new Error('Expected evidence is missing from rendered source');
  const hash = digest(text);
  const capturedAt = new Date().toISOString();
  const snapshot = {extractorVersion:2,catalogId:id,url:page.url(),requestedURL,hash,capturedAt,text,candidates:candidates(text)};
  const directory = path.join(cache, String(id));
  fs.mkdirSync(directory, {recursive:true});
  fs.writeFileSync(path.join(directory, hash+'.json'), JSON.stringify(snapshot,null,2)+'\n');
  state[key] = {extractorVersion:2,catalogId:id,url:page.url(),hash,capturedAt,changed:false,previousHash:old.hash,status:'captured',candidateFields:Object.entries(snapshot.candidates).filter(([,hits])=>hits.length).map(([field])=>field)};
  fs.writeFileSync(statePath, JSON.stringify(state,null,2)+'\n');
  console.log(JSON.stringify({catalogId:id,url:page.url(),hash,capturedAt,expectedText}));
} finally { await browser.close(); }
