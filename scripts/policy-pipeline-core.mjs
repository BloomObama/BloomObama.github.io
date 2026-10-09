import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import policy from '../policy-core.js';

export const root = path.resolve(import.meta.dirname, '..');
export const readJSON = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
export const digest = text => createHash('sha256').update(text).digest('hex');
export const normalize = text => String(text).replace(/\s+/g, ' ').trim();
export function loadColleges() {
  const context = vm.createContext({ console }); context.globalThis = context;
  for (const file of ['college-catalog.js','college-directory.js','college-media.js','college-policies.js','data.js']) vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'), context);
  vm.runInContext('globalThis.result = colleges', context);
  const reviews = readJSON('data/policy-field-reviews.json');
  context.result.forEach(college => policy.apply(college, reviews.records[college.catalogId]));
  return context.result;
}
export function allowedURL(value, domains) {
  let url; try { url = new URL(value); } catch { return false; }
  return url.protocol === 'https:' && !url.username && !url.password && !url.port && !isIP(url.hostname) && domains.some(domain => url.hostname === domain || url.hostname.endsWith('.' + domain));
}
export function defaultDomains(college) {
  const parts = new URL(college.source || college.urls?.[0]).hostname.toLowerCase().split('.');
  while (parts.length > 2 && /^(www|admissions?|apply|undergraduate)$/.test(parts[0])) parts.shift();
  return [parts.join('.')];
}
export function sourcePriority(value) {
  const pathname = new URL(value).pathname;
  return (/international/i.test(pathname)?200:0)
    + (/financial.aid|scholarship|afford/i.test(pathname)?120:0)
    + (/requirements|checklist|deadline|testing|apply|first.year|freshman/i.test(pathname)?70:0)
    - (/(?:^|[\/-])graduate(?:[\/.-]|$)|transfer|study.abroad|alumni|current.student/i.test(pathname)?300:0)
    - (/visit|request|admitted|staff|event|news|blog/i.test(pathname)?200:0);
}
export function publicAddress(address) {
  if (isIP(address) === 4) {
    const [a,b] = address.split('.').map(Number);
    return !(a === 0 || a === 10 || a === 127 || a >= 224 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127));
  }
  // Restrict IPv6 to global unicast; reject mapped, local and link-local addresses.
  return /^[23][0-9a-f]{3}:/i.test(address);
}
export async function safeFetch(value, domains, beforeRequest) {
  let current = value;
  for (let redirects = 0; redirects <= 4; redirects++) {
    if (!allowedURL(current, domains)) throw new Error('Unapproved source/redirect: ' + current);
    const addresses = await lookup(new URL(current).hostname, { all:true });
    if (!addresses.length || addresses.some(item => !publicAddress(item.address))) throw new Error('Non-public source address');
    if (beforeRequest) await beforeRequest(current);
    const response = await fetch(current, { redirect:'manual', signal:AbortSignal.timeout(18000), headers:{ 'User-Agent':'AdmitVectorPolicyBot/1.0 (+https://www.admitvector.com/)' } });
    if ([301,302,303,307,308].includes(response.status)) {
      const next = response.headers.get('location'); await response.body?.cancel();
      if (!next) throw new Error('Missing redirect location');
      current = new URL(next, current).href; continue;
    }
    return response;
  }
  throw new Error('Too many redirects');
}
export async function limitedText(response, maximum = 2_000_000) {
  if (Number(response.headers.get('content-length')) > maximum) { await response.body?.cancel(); throw new Error('Source too large'); }
  const reader = response.body.getReader(); const chunks = []; let size = 0;
  try {
    while (true) { const {done,value} = await reader.read(); if (done) break; size += value.length; if (size > maximum) throw new Error('Source too large'); chunks.push(value); }
  } finally { await reader.cancel(); }
  return Buffer.concat(chunks).toString('utf8');
}
export function htmlText(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || html;
  return normalize(main.replace(/<!--([\s\S]*?)-->/g,' ').replace(/<(script|style|noscript|nav|header|footer)\b[^>]*>[\s\S]*?<\/\1>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&(?:nbsp|#160);/gi,' ').replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&#(?:39|x27);/gi,"'").replace(/&ndash;/gi,'–').replace(/&mdash;/gi,'—').replace(/&rsquo;/gi,"'"));
}
// Conservative robots rules: a failed robots fetch blocks crawling, not verification.
export function robotsAllowed(text, pathname) {
  const groups = []; let group = null;
  for (const line of text.split(/\r?\n/)) {
    const match = line.replace(/#.*/, '').trim().match(/^(user-agent|allow|disallow)\s*:\s*(.*)$/i); if (!match) continue;
    const [,raw,value] = match; const key = raw.toLowerCase();
    if (key === 'user-agent') { if (!group || group.rules.length) { group = { agents:[], rules:[] }; groups.push(group); } group.agents.push(value.toLowerCase()); }
    else if (group && value) group.rules.push({allow:key === 'allow', value});
  }
  const specific = groups.filter(g => g.agents.some(a => a !== '*' && 'fullridepolicybot'.startsWith(a)));
  const chosen = specific.length ? specific : groups.filter(g => g.agents.includes('*'));
  const matches = chosen.flatMap(g => g.rules).filter(rule => {
    const pattern = '^' + rule.value.split('*').map(part => part.replace(/[.+?^${}()|[\]\\]/g,'\\$&')).join('.*').replace(/\\\$$/,'$');
    return new RegExp(pattern).test(pathname);
  }).sort((a,b) => b.value.length - a.value.length || Number(b.allow) - Number(a.allow));
  return matches.length ? matches[0].allow : true;
}
export function robotsDelay(text) {
  const delays = [...text.matchAll(/^\s*crawl-delay\s*:\s*(\d+(?:\.\d+)?)\s*(?:#.*)?$/gim)].map(match=>Number(match[1]));
  return Math.max(1,...delays);
}
const topics = { aid:/financial aid|need.blind|need.aware|scholarship/ig, testing:/test.optional|test.free|test.blind|\bSAT\b|\bACT\b/ig, english:/English proficiency|TOEFL|IELTS|Duolingo/ig, fee:/application fee|fee waiver|free to apply/ig, deadline:/deadline|early decision|regular decision/ig };
export function candidates(text) {
  return Object.fromEntries(Object.entries(topics).map(([key,pattern]) => [key, [...text.matchAll(pattern)].slice(0,3).map(match => normalize(text.slice(Math.max(0,match.index-100),match.index+250)))]));
}
export function priority(college, manifest) {
  const coverage = policy.count(college);
  return (manifest ? 1000 : 0) + (coverage > 0 && coverage < 5 ? 400 : 0) + (college.facts?.predominantDegree === 3 ? 200 : 0) + (college.facts?.control === 2 ? 80 : 0) + Math.min(50, Math.round((college.facts?.nonresidentShare || 0)*100));
}
const attributeKeys = {aid:['aidShort','aidCategory','needBlind'],testing:['testFlexible'],english:['englishStatus'],fee:['feeWaiver'],deadline:[]};
export function validateReview(id, record, colleges, manifest, snapshotLookup) {
  const college = colleges.find(c => String(c.catalogId) === String(id));
  if (!college) throw new Error('Unknown exact institution ID: ' + id);
  if (!record.fields || !Object.keys(record.fields).length) throw new Error('Empty review');
  const domains = manifest.records[id]?.domains || defaultDomains(college);
  for (const [key, field] of Object.entries(record.fields)) {
    if (!policy.fields.includes(key) || !['verified','conflict','pending'].includes(field.status)) throw new Error('Invalid field/status');
    if (field.status === 'pending') continue;
    if (!allowedURL(field.source,domains) || field.cycle !== policy.cycle || !/^\d{4}-\d{2}-\d{2}$/.test(field.checkedAt) || new Date(field.checkedAt).toISOString().slice(0,10) !== field.checkedAt || field.checkedAt > new Date().toISOString().slice(0,10)) throw new Error('Invalid source/cycle/date');
    if (!field.reviewer || field.method !== 'editorial' || !field.value || field.value.length > 2500) throw new Error('Editorial review required');
    const evidence = field.evidence;
    if (!evidence || !/^[a-f0-9]{64}$/.test(evidence.hash || '') || !evidence.quote || evidence.quote.split(/\s+/).length > 25) throw new Error('Short source evidence required');
    if (snapshotLookup) {
      const snapshot = snapshotLookup(evidence.hash);
      if (!snapshot || snapshot.catalogId !== Number(id) || snapshot.url !== field.source || snapshot.hash !== digest(snapshot.text) || snapshot.hash !== evidence.hash || !normalize(snapshot.text).includes(normalize(evidence.quote))) throw new Error('Evidence does not match captured source');
      if (snapshot.capturedAt && field.checkedAt !== snapshot.capturedAt.slice(0,10)) throw new Error('Review date does not match captured evidence');
    }
    for (const [attribute,value] of Object.entries(field.attributes || {})) {
      if (!attributeKeys[key].includes(attribute)) throw new Error('Wrong field attribute');
      if (['needBlind','testFlexible','feeWaiver'].includes(attribute) && typeof value !== 'boolean') throw new Error('Invalid boolean attribute');
      if (attribute === 'aidCategory' && !['need-blind','need-aware','merit','limited','unverified'].includes(value)) throw new Error('Invalid aid category');
      if (attribute === 'englishStatus' && !['required','notRequired','unverified'].includes(value)) throw new Error('Invalid English status');
      if (attribute === 'aidShort' && (typeof value !== 'string' || value.length > 100)) throw new Error('Invalid aid label');
    }
  }
}
export { policy };
