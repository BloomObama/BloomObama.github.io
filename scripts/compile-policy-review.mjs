// Expand concise, manually reviewed claims using captured source metadata.
// This never approves a proposal or infers policy from keyword matches.
import fs from 'node:fs';
import path from 'node:path';
import { root, readJSON, loadColleges, policy, validateReview } from './policy-pipeline-core.mjs';

const [input, output] = process.argv.slice(2);
if (!input || !output) throw new Error('Usage: compile-policy-review.mjs reviewed-spec.json proposal.json');
const spec = readJSON(input);
const state = readJSON('.policy-cache/state.json');
const colleges = loadColleges();
const manifest = readJSON('data/policy-source-manifest.json');
const proposal = { schemaVersion:1, cycle:policy.cycle, records:{} };
for (const [id, record] of Object.entries(spec.records)) {
  const lookup = hash => {
    const file = path.join(root,'.policy-cache',id,hash+'.json');
    return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file,'utf8')) : null;
  };
  const fields = {};
  for (const [key, claim] of Object.entries(record.fields)) {
    const source = record.sources[claim.source];
    const captured = Object.values(state).filter(item=>item.catalogId===Number(id) && item.status==='captured' && item.url===source).sort((a,b)=>b.capturedAt.localeCompare(a.capturedAt))[0];
    if (!captured) throw new Error(`Missing captured source: ${id} ${key} ${source}`);
    fields[key] = {
      status:claim.status || 'verified', value:claim.value, source,
      checkedAt:captured.capturedAt.slice(0,10), cycle:policy.cycle,
      method:'editorial', reviewer:'FullRide editorial',
      ...(claim.attributes ? {attributes:claim.attributes} : {}),
      evidence:{hash:captured.hash,quote:claim.quote}
    };
  }
  validateReview(id,{fields},colleges,manifest,lookup);
  proposal.records[id]={fields};
}
const destination = path.resolve(root,output);
if (!destination.startsWith(root+path.sep)) throw new Error('Output must remain inside the project');
fs.writeFileSync(destination,JSON.stringify(proposal,null,2)+'\n',{flag:'wx'});
console.log(`Validated proposal for ${Object.keys(proposal.records).length} institutions. Not approved or published.`);
