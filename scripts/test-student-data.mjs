import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const storage=new Map();
const context=vm.createContext({
  console,Date,JSON,Number,String,Array,Object,RegExp,Math,
  localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value)},
  window:{dispatchEvent(){},addEventListener(){}},CustomEvent:class{},globalThis:null
});
context.globalThis=context;
context.FullRidePolicy={known:(college,key)=>college.known?.includes(key)||false};
vm.runInContext(fs.readFileSync(new URL('../student-data.js',import.meta.url),'utf8'),context);
const api=context.AdmitVectorStudent;
assert.ok(api,'student data API is exposed');
api.updateProfile({sat:1450,ielts:7,annualBudget:25000,needsAid:true,aidLevel:'near-full',applicationYear:2027});
const unknown={slug:'unknown',known:[],finderFacts:{tuition:60000},facts:{satAverage:1400}};
assert.equal(api.fit(unknown).english.key,'unknown');
assert.equal(api.fit(unknown).financial.key,'unknown');
const optional={slug:'optional',known:['testing','english','aid','deadline'],testing:'SAT/ACT test optional',english:'IELTS 6.5 required',aid:'Meets full demonstrated need',aidCategory:'full-need',checkedAt:'2026-10-01',finderFacts:{tuition:65000},facts:{satAverage:1360},deadline:'Regular Decision: January 5.'};
const fit=api.fit(optional);
assert.equal(fit.testing.key,'test-optional');
assert.equal(fit.english.key,'requirement-met');
assert.ok(!api.checklistFor(optional).includes('sat-act'),'optional tests must not become checklist requirements');
assert.equal(api.deadlineFor(optional,'RD',2027),'2027-01-05');
optional.deadline='Restrictive Early Action: November 1 · Regular Decision: January 1';
assert.equal(api.deadlineFor(optional,'RD',2027),'2027-01-01','the date must follow the selected plan, not an earlier plan in the same sentence');
api.upsertApplication({collegeSlug:'optional',plan:'RD',checked:{application:true}});
assert.equal(api.value.applications.length,1);
assert.equal(api.value.applications[0].checked.application,true);
assert.equal(api.normalizeProfile({sat:9999}).sat,null,'out-of-range scores are discarded');
console.log('Student profile, fit, checklist and deadline invariants passed');
