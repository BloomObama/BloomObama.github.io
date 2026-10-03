import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const sandbox=vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(root,'ielts-library-data.js'),'utf8'),sandbox);
vm.runInContext(fs.readFileSync(path.join(root,'ielts-resources.js'),'utf8').split('let resourceLanguage =')[0]+'\nglobalThis.list=resources;',sandbox);
const all=sandbox.list,results=[];
const queue=[...new Set(all.flatMap(item=>[item.url,item.backupUrl]).filter(Boolean))];
async function worker(){
 while(queue.length){
  const url=queue.shift();
  try{
   const response=await fetch(url,{signal:AbortSignal.timeout(20000),headers:{'User-Agent':'Mozilla/5.0 (compatible; FullRideLinkCheck/1.0)'}});
   const html=await response.text();
   const unavailable=/this part of Cambridge.org is currently unavailable/i.test(html);
   const status=response.ok&&!unavailable?'reachable':[401,403,405,429].includes(response.status)?'restricted':unavailable?'publisher-unavailable':'failed';
   results.push({url,finalUrl:response.url,status,http:response.status,title:html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g,' ').slice(0,180)||null});
  }catch(error){results.push({url,status:'failed',error:error.message});}
 }
}
await Promise.all([worker(),worker(),worker()]);
const report={checkedAt:new Date().toISOString(),resources:all.length,results};
fs.writeFileSync(path.join(root,'data/resource-link-check.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(results.some(item=>item.status==='failed'))process.exitCode=1;
