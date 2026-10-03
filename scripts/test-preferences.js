const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
function setup(store=new Map(),search='') {
  const events=new Map();
  const root={dataset:{},style:{setProperty(){}}};
  let time=Date.now();
  class Clock extends Date {static now(){return time;}}
  const context={Date:Clock,URLSearchParams,crypto:require('node:crypto').webcrypto,location:{search},
    localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},
    document:{documentElement:root,addEventListener(){}},
    CustomEvent:class{constructor(type,options={}){this.type=type;this.detail=options.detail;}}
  };
  context.window=context;
  context.addEventListener=(key,fn)=>events.set(key,[...(events.get(key)||[]),fn]);
  context.dispatchEvent=event=>(events.get(event.type)||[]).forEach(fn=>fn(event));
  context.FullRidePolicy={known:c=>c.verified===true};
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(require.resolve('../preferences.js'),'utf8'),context);
  return {p:context.FullRidePreferences,store,context,root,tick:()=>time+=10};
}
const {p,store,context,root,tick}=setup();
assert.equal(p.value.admission.budget,null);
assert.equal(p.match({}).total,0,'no profile is not a match');
p.update({admission:{degree:'3',focus:'stem',budget:0,scholarship:true}});
const college={finderFacts:{degree:3,tuition:0},focus:['stem'],aidCategory:'merit'};
let match=p.match(college);
assert.equal(match.matched,3);
assert.equal(match.complete,false,'unknown aid cannot produce green');
assert.equal(match.checks.at(-1).result,'unknown');
assert.equal(p.match({...college,verified:true}).complete,true,'all known criteria match');
assert.equal(p.match({...college,verified:true,finderFacts:{degree:3,tuition:100}}).mismatch,true);
assert.equal(p.match({finderFacts:{degree:3},focus:['stem'],verified:true,aidCategory:'merit'}).complete,false,'unknown tuition cannot match zero budget');
const cleaned=p.normalize({admission:{year:2027.5,budget:-1},preparation:{dailyWords:2.5,examDate:'2026-02-30'},cards:{newWords:3.5,reviewLimit:1001},profile:{name:'x'.repeat(100)},interface:{theme:'bad'}});
assert.equal(cleaned.preparation.examDate,'');
assert.equal(cleaned.cards.newWords,20);
assert.equal(cleaned.cards.reviewLimit,20);
assert.equal(cleaned.preparation.dailyWords,20);
assert.equal(cleaned.admission.budget,null);
assert.equal(cleaned.profile.name.length,80);
assert.equal(cleaned.interface.theme,'light');
assert.equal(p.normalize({preparation:{examDate:'2028-02-29'}}).preparation.examDate,'2028-02-29');
tick();p.update({profile:{notes:'guest draft'},interface:{theme:'dark',fontScale:1.25,reduceMotion:true}});
assert.equal(root.dataset.theme,'dark');assert.equal(root.style.fontSize,'20px');assert.equal(root.dataset.motion,'reduce');
p.setAccount('user-A');tick();p.update({profile:{notes:'private A'}});
p.setAccount('user-B');assert.notEqual(p.value.profile.notes,'private A','switching account isolates personal notes');
tick();p.update({profile:{notes:'private B'}});p.setAccount('user-A');assert.equal(p.value.profile.notes,'private A');
p.setAccount(null);assert.equal(p.value.profile.notes,'guest draft','logout returns guest, not previous account');
p.setAccount('user-A');
const old=p.record();p.merge({updatedAt:old.updatedAt-1,value:{profile:{notes:'stale'}}});
assert.equal(p.value.profile.notes,'private A','stale cloud does not overwrite');
tick();p.merge({updatedAt:context.Date.now(),value:{profile:{notes:'remote'},interface:{theme:'dark'}}});
assert.equal(p.value.profile.notes,'remote');
vm.runInContext(fs.readFileSync(require.resolve('../practice-state.js'),'utf8'),context);
const cloud=context.FullRidePracticeState.cloudRecord();
assert.equal(cloud.state.preferences.value.profile.notes,'remote');
const other=setup();other.p.setAccount('user-A');other.context.FullRidePreferences.merge({updatedAt:1,value:{}});
vm.runInContext(fs.readFileSync(require.resolve('../practice-state.js'),'utf8'),other.context);
other.context.FullRidePracticeState.mergeCloud([cloud],[]);
assert.equal(other.p.value.profile.notes,'remote','cloud wrapper round-trips preferences without rule schema expansion');
const restart=setup(store);assert.equal(restart.root.dataset.theme,'dark','appearance applies before Firebase loads');
restart.p.setAccount('user-A');assert.equal(restart.p.value.profile.notes,'remote','account data survives reload');
const newDevice=setup();newDevice.p.update({profile:{notes:'recent guest draft'}});
newDevice.p.setAccount('existing-user');
assert.equal(newDevice.p.value.profile.notes,'','guest draft is not blindly adopted before cloud read');
newDevice.p.merge({updatedAt:Date.now()-1000,value:{profile:{notes:'existing cloud profile'}}});
newDevice.p.adoptGuest();
assert.equal(newDevice.p.value.profile.notes,'existing cloud profile','new-device login preserves cloud data');
const newAccount=setup();newAccount.p.update({profile:{notes:'guest draft to keep'}});
newAccount.p.setAccount('new-user');newAccount.p.adoptGuest();
assert.equal(newAccount.p.value.profile.notes,'guest draft to keep','genuinely new account adopts guest settings');
context.localStorage.setItem=()=>{throw Error('quota');};
assert.equal(p.update({profile:{name:'in memory'}}),false);
assert.equal(p.persisted,false,'blocked storage is disclosed');
console.log('PASS: preferences validation, matching, unknown data, storage, account isolation, cloud wrapper and immediate appearance');
