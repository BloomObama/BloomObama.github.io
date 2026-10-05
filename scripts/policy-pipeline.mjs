import fs from 'node:fs';
import path from 'node:path';
import { root, readJSON, loadColleges, policy, priority, safeFetch, limitedText, htmlText, robotsAllowed, robotsDelay, candidates, digest, allowedURL, defaultDomains, sourcePriority, validateReview } from './policy-pipeline-core.mjs';

const args = process.argv.slice(2); const command = args.shift() || 'summary';
const option = (name, fallback) => args.includes(name) ? args[args.indexOf(name)+1] : fallback;
const colleges = loadColleges(); const manifest = readJSON('data/policy-source-manifest.json');
const cache = path.join(root,'.policy-cache'); fs.mkdirSync(cache,{recursive:true});
const statePath = path.join(cache,'state.json');
const state = fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath,'utf8')) : {};
// A parser upgrade is not a policy change. Old extractor states remain useful
// snapshots, but cannot generate a changed-policy alert.
for (const item of Object.values(state)) if (item.extractorVersion!==1) item.changed=false;
const writeJSON = (file,data) => fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
const changedIDs = new Set(Object.values(state).filter(s=>s.changed).map(s=>s.catalogId));
const queue = colleges.filter(c => !c.verified || changedIDs.has(c.catalogId)).map(c => ({catalogId:c.catalogId,name:c.name,coverage:policy.count(c),priority:priority(c,manifest.records[c.catalogId])+(changedIDs.has(c.catalogId)?2000:0)+(c.basicOnly?0:100),urls:manifest.records[c.catalogId]?.urls || [c.source]})).sort((a,b) => b.priority-a.priority || a.catalogId-b.catalogId);

if (command === 'summary' || command === 'queue') {
  const summary = { total:colleges.length, federalRelease:'2025-05-19 (historical, mixed reporting years)', fullyReviewed:colleges.filter(c=>c.verified).length, partiallyReviewed:colleges.filter(c=>policy.count(c)>0&&!c.verified).length, verifiedFields:colleges.reduce((n,c)=>n+policy.count(c),0), possibleFields:colleges.length*5, remainingInstitutions:queue.length, capturedPages:Object.values(state).filter(s=>s.status==='captured'&&s.hash).length, unavailablePages:Object.values(state).filter(s=>s.status==='unavailable').length, changedPages:Object.values(state).filter(s=>s.changed).length };
  if (command === 'queue') { writeJSON(path.join(cache,'queue.json'),queue); console.log(JSON.stringify({summary,next:queue.slice(0,Number(option('--limit',20)))},null,2)); }
  else console.log(JSON.stringify(summary,null,2));
} else if (command === 'collect') {
  const limit = Math.min(500,Math.max(1,Number(option('--limit',10))));
  const pages = Math.min(8,Math.max(1,Number(option('--pages',3))));
  const parallel = Math.min(8,Math.max(1,Number(option('--parallel',4))));
  if (!Number.isInteger(limit) || !Number.isInteger(pages) || !Number.isInteger(parallel)) throw new Error('Invalid batch size');
  const ids = option('--ids','').split(',').filter(Boolean).map(Number);
  const attemptedIDs = new Set(Object.values(state).map(item=>item.catalogId));
  const resumable = queue.filter(c=>(!args.includes('--unseen') || !attemptedIDs.has(c.catalogId)) && (!args.includes('--resume') || c.urls.some(url=>state[c.catalogId+'|'+url]?.status!=='captured' || state[c.catalogId+'|'+url]?.changed)));
  const selected = ids.length ? colleges.filter(c=>ids.includes(c.catalogId)).map(c=>({...c,urls:manifest.records[c.catalogId]?.urls||[c.source]})).slice(0,limit) : resumable.slice(0,limit);
  const robotsCache = new Map(); const results = [];
  const groups = new Map();
  for (const college of selected) {
    const domain = manifest.records[college.catalogId]?.domains?.[0] || defaultDomains(college)[0];
    if (!groups.has(domain)) groups.set(domain,[]);
    groups.get(domain).push(college);
  }
  const pendingGroups = [...groups.values()];
  async function collectCollege(college) {
    const domains = manifest.records[college.catalogId]?.domains || defaultDomains(college);
    const visited = new Set(); const urls = [...college.urls]; let processed = 0;
    while (urls.length && processed < pages) {
      const url = urls.shift(); if (visited.has(url) || !allowedURL(url,domains)) continue; visited.add(url); processed++;
      if (args.includes('--resume') && state[college.catalogId+'|'+url]?.status==='captured' && !state[college.catalogId+'|'+url]?.changed) continue;
      const stamp = new Date().toISOString();
      try {
        const checkRobots = async candidate => {
          const origin = new URL(candidate).origin;
          if (!robotsCache.has(origin)) {
            const response = await safeFetch(origin+'/robots.txt',domains);
            robotsCache.set(origin,response.status === 404 ? '' : response.ok ? await limitedText(response,100000) : null);
            if (!response.ok && response.status!==404) await response.body?.cancel();
          }
          const robots = robotsCache.get(origin);
          if (robots === null || !robotsAllowed(robots,new URL(candidate).pathname+new URL(candidate).search)) throw new Error('Robots policy unavailable or disallows crawling');
          const delay=robotsDelay(robots);
          if (delay>30) throw new Error('Crawl delay requires a slower manual collection schedule');
          await new Promise(resolve=>setTimeout(resolve,delay*1000));
        };
        const response = await safeFetch(url,domains,checkRobots);
        if (!response.ok) { await response.body?.cancel(); throw new Error('HTTP '+response.status); }
        if (!response.headers.get('content-type')?.includes('text/html')) { await response.body?.cancel(); throw new Error('Non-HTML source: manual review required'); }
        const html = await limitedText(response); const text = htmlText(html);
        if (text.length < 300 || /verify you are human|checking your browser|access denied|captcha/i.test(text.slice(0,3000))) throw new Error('Blocked/empty response is not evidence');
        const hash = digest(text); const key = college.catalogId+'|'+url; const previous = state[key];
        const snapshot = {extractorVersion:1,catalogId:college.catalogId,url:response.url,requestedURL:url,hash,capturedAt:stamp,text,candidates:candidates(text)};
        const directory = path.join(cache,String(college.catalogId)); fs.mkdirSync(directory,{recursive:true}); writeJSON(path.join(directory,hash+'.json'),snapshot);
        state[key] = {extractorVersion:1,catalogId:college.catalogId,url:response.url,hash,capturedAt:stamp,changed:Boolean(previous?.extractorVersion===1 && (previous.hash!==hash||previous.changed)),previousHash:previous?.hash||null,status:'captured',candidateFields:Object.entries(snapshot.candidates).filter(([,items])=>items.length).map(([key])=>key)};
        results.push({catalogId:college.catalogId,url,hash,status:previous?.hash===hash?'unchanged':previous?.hash?'changed':'new',candidateFields:state[key].candidateFields});
        const discovered = new Map();
        for (const match of html.matchAll(/href\s*=\s*["']([^"']+)["']/gi)) {
          let next; try { next = new URL(match[1].replace(/&amp;/g,'&'),response.url); } catch { continue; }
          next.hash=''; if (next.search || !/admission|international|financial.aid|scholarship|afford|apply|deadline|testing|first.year|freshman/i.test(next.pathname) || /\.(pdf|css|js|png|jpg|jpeg|svg|webp|woff2?)$/i.test(next.pathname) || /\/(assets|academics)\//i.test(next.pathname)) continue;
          if (allowedURL(next.href,domains) && !visited.has(next.href)) {
            const score = sourcePriority(next.href);
            discovered.set(next.href,score);
          }
        }
        for (const [next] of [...discovered].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))) if (!urls.includes(next)&&urls.length<30) urls.push(next);
        if (!manifest.records[college.catalogId]) urls.sort((a,b)=>sourcePriority(b)-sourcePriority(a)||a.localeCompare(b));
      } catch (error) {
        const key = college.catalogId+'|'+url;
        state[key] = {...state[key],catalogId:college.catalogId,url,lastAttemptAt:stamp,lastError:error.message,status:'unavailable'};
        results.push({catalogId:college.catalogId,url,status:'unavailable',reason:error.message});
        if (processed === 1 && !manifest.records[college.catalogId]) {
          const home = new URL('/',url).href;
          if (allowedURL(home,domains) && !visited.has(home)) urls.unshift(home);
        }
      }
      writeJSON(statePath,state);
    }
    console.log(JSON.stringify({institution:college.name,catalogId:college.catalogId,pages:processed}));
  }
  await Promise.all(Array.from({length:Math.min(parallel,pendingGroups.length)},async()=>{
    while (pendingGroups.length) for (const college of pendingGroups.shift()) await collectCollege(college);
  }));
  writeJSON(path.join(cache,'last-batch.json'),results);
  console.log(JSON.stringify({pages:results.length,captured:results.filter(r=>r.hash).length,unavailable:results.filter(r=>!r.hash),note:'Candidate snippets only. No automatic policy verification.'},null,2));
} else if (command === 'approve') {
  const file = option('--file'); if (!file) throw new Error('Use approve --file review.json');
  const proposal = JSON.parse(fs.readFileSync(path.resolve(root,file),'utf8'));
  if (proposal.schemaVersion!==1 || proposal.cycle!==policy.cycle) throw new Error('Invalid review document');
  const approved = readJSON('data/policy-field-reviews.json');
  // Validate the whole batch before changing anything.
  for (const [id,record] of Object.entries(proposal.records)) validateReview(id,record,colleges,manifest,hash=>{
    const file = path.join(cache,id,hash+'.json'); return fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):null;
  });
  for (const [id,record] of Object.entries(proposal.records)) {
    approved.records[id] = { fields:{...approved.records[id]?.fields,...record.fields} };
    for (const field of Object.values(record.fields)) for (const item of Object.values(state)) if (item.catalogId===Number(id)&&item.url===field.source&&item.hash===field.evidence?.hash) { item.changed=false; item.reviewedHash=item.hash; }
  }
  writeJSON(path.join(root,'data/policy-field-reviews.json'),approved);
  writeJSON(statePath,state);
  console.log('Approved exact-ID field reviews: '+Object.keys(proposal.records).length+'. Run npm run build:data.');
} else if (command === 'changes') console.log(JSON.stringify(Object.values(state).filter(item=>item.changed),null,2));
else throw new Error('Commands: summary, queue, collect, approve, changes');
