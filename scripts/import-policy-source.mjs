// Archive already-read official web-tool excerpts when the bounded HTML
// collector cannot retrieve a page. This performs no policy approval.
import fs from 'node:fs';
import path from 'node:path';
import { root, readJSON, loadColleges, allowedURL, defaultDomains, digest, candidates } from './policy-pipeline-core.mjs';

const input = process.argv[2];
if (!input) throw new Error('Usage: import-policy-source.mjs reviewed-web-excerpts.json');
const records = readJSON(input);
const colleges = loadColleges();
const manifest = readJSON('data/policy-source-manifest.json');
const state = readJSON('.policy-cache/state.json');
const snapshots = records.map(record => {
  const college = colleges.find(c => c.catalogId === record.catalogId);
  if (!college || !allowedURL(record.url,manifest.records[record.catalogId]?.domains || defaultDomains(college))) throw new Error('Unapproved institution/source');
  if (record.retrievalMethod !== 'web.open' || typeof record.text !== 'string' || record.text.length < 100 || record.text.length > 2000000) throw new Error('Expected a retrieved official-page excerpt');
  if (!record.retrievedAt || !Number.isFinite(Date.parse(record.retrievedAt)) || Date.parse(record.retrievedAt) > Date.now()) throw new Error('Invalid retrieval timestamp');
  // Retain the tool-returned excerpt verbatim: it is not a full HTML snapshot.
  return {extractorVersion:'web-excerpt-v1',representation:'retrieved-excerpt',retrievalMethod:record.retrievalMethod,catalogId:record.catalogId,url:record.url,hash:digest(record.text),capturedAt:record.retrievedAt,text:record.text,candidates:candidates(record.text)};
});
for (const snapshot of snapshots) {
  const directory = path.join(root,'.policy-cache',String(snapshot.catalogId));
  fs.mkdirSync(directory,{recursive:true});
  fs.writeFileSync(path.join(directory,snapshot.hash+'.json'),JSON.stringify(snapshot,null,2)+'\n');
  // Preserve direct-fetch failures; don't misreport a successful HTTP crawl.
  state[snapshot.catalogId+'|web-excerpt|'+snapshot.url] = {extractorVersion:snapshot.extractorVersion,retrievalMethod:snapshot.retrievalMethod,representation:snapshot.representation,catalogId:snapshot.catalogId,url:snapshot.url,hash:snapshot.hash,capturedAt:snapshot.capturedAt,status:'captured',changed:false,candidateFields:Object.entries(snapshot.candidates).filter(([,items])=>items.length).map(([key])=>key)};
}
fs.writeFileSync(path.join(root,'.policy-cache/state.json'),JSON.stringify(state,null,2)+'\n');
console.log(`Archived ${snapshots.length} manually inspected source excerpts; no policy fields approved.`);
