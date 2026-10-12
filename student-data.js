/* One backwards-compatible source of truth for the applicant profile and application plan. */
(() => {
  const KEY = 'admitvector-student-data-v1';
  const aidLevels = ['none','partial','full-tuition','near-full','full-ride'];
  const plans = ['ED','EA','REA','RD','Rolling','Other'];
  const categories = ['dream','very-competitive','competitive','financial-fallback'];
  const baseProfile = {
    citizenship:'', country:'', graduationYear:null, gpa:null, sat:null, act:null,
    ielts:null, toefl:null, duolingo:null, major:'', annualBudget:null,
    needsAid:false, aidLevel:'none', states:[], types:[], sizes:[], settings:[],
    applicationYear:null, plans:[]
  };
  const clone = value => JSON.parse(JSON.stringify(value));
  const text = (value,max=120) => typeof value === 'string' ? value.trim().slice(0,max) : '';
  const num = (value,min,max) => value !== '' && value != null && Number.isFinite(Number(value)) && Number(value) >= min && Number(value) <= max ? Number(value) : null;
  const list = (value, allowed, max=60) => Array.isArray(value) ? [...new Set(value.map(item=>text(item,60)).filter(item=>item && (!allowed || allowed.includes(item))))].slice(0,max) : [];
  function normalizeProfile(value={}) {
    return {
      citizenship:text(value.citizenship,80), country:text(value.country,80),
      graduationYear:num(value.graduationYear,2024,2045), gpa:num(value.gpa,0,4),
      sat:num(value.sat,400,1600), act:num(value.act,1,36), ielts:num(value.ielts,0,9),
      toefl:num(value.toefl,0,120), duolingo:num(value.duolingo,10,160), major:text(value.major,120),
      annualBudget:num(value.annualBudget,0,300000), needsAid:value.needsAid===true,
      aidLevel:aidLevels.includes(value.aidLevel)?value.aidLevel:'none',
      states:list(value.states), types:list(value.types,['research','liberal-arts','specialized']),
      sizes:list(value.sizes,['small','medium','large']), settings:list(value.settings,['urban','suburban','town','rural']),
      applicationYear:num(value.applicationYear,2026,2045), plans:list(value.plans,plans,6)
    };
  }
  function normalizeApplication(value={}) {
    const checked=value.checked&&typeof value.checked==='object'&&!Array.isArray(value.checked)?value.checked:{};
    return {
      collegeSlug:text(value.collegeSlug,140).replace(/[^a-z0-9-]/gi,''),
      plan:plans.includes(value.plan)?value.plan:'RD', category:categories.includes(value.category)?value.category:'competitive',
      manualDeadline:/^\d{4}-\d{2}-\d{2}$/.test(value.manualDeadline||'')?value.manualDeadline:'',
      checked:Object.fromEntries(Object.entries(checked).filter(([key,val])=>/^[a-z0-9-]{1,40}$/i.test(key)&&val===true).slice(0,40)),
      note:text(value.note,1200), updatedAt:num(value.updatedAt,0,Date.now()+60000)||Date.now()
    };
  }
  function normalize(value={}) {
    const applications=Array.isArray(value.applications)?value.applications.map(normalizeApplication).filter(item=>item.collegeSlug).slice(0,100):[];
    const categoriesByCollege=value.categories&&typeof value.categories==='object'&&!Array.isArray(value.categories)?value.categories:{};
    return {
      version:1, profile:normalizeProfile(value.profile||{}),
      categories:Object.fromEntries(Object.entries(categoriesByCollege).filter(([slug,cat])=>/^[a-z0-9-]{1,140}$/i.test(slug)&&categories.includes(cat)).slice(0,500)),
      applications:[...new Map(applications.map(item=>[item.collegeSlug,item])).values()]
    };
  }
  function read() { try{return normalize(JSON.parse(localStorage.getItem(KEY)||'{}'));}catch{return normalize();} }
  let state=read();
  function save(next=state, source='local') {
    state=normalize(next);
    try{localStorage.setItem(KEY,JSON.stringify(state));}catch{}
    window.dispatchEvent(new CustomEvent('fullride:student-data',{detail:{source}}));
    if(source==='local')window.dispatchEvent(new CustomEvent('fullride:local-data-changed',{detail:{kind:'student-data'}}));
    return clone(state);
  }
  const policyKnown=(college,key)=>globalThis.FullRidePolicy?.known?.(college,key)===true || (college?.verified===true && Boolean(college?.[key]));
  const lower=value=>String(value||'').toLowerCase();
  function testPolicy(college) {
    if(!policyKnown(college,'testing'))return {status:'unknown',key:'unknown'};
    const value=lower(college.testing);
    if(/test[- ]?(optional|flexible)|not required|не треб|не потріб|без sat|sat.*optional/.test(value))return {status:'optional',key:'test-optional'};
    if(/sat|act/.test(value)&&/required|обязат|потріб/.test(value))return {status:'required',key:'test-required'};
    return {status:'unknown',key:'unknown'};
  }
  function englishFit(college,profile=state.profile) {
    if(!policyKnown(college,'english'))return {key:'unknown',tone:'unknown'};
    const value=lower(college.english);
    if(/not required|waiv|освобож|не треб|не потріб/.test(value))return {key:'requirement-met',tone:'good'};
    const candidates=[
      ['ielts',profile.ielts,/ielts[^\d]{0,30}(\d(?:\.\d)?)/i],['toefl',profile.toefl,/toefl[^\d]{0,30}(\d{2,3})/i],['duolingo',profile.duolingo,/(?:duolingo|det)[^\d]{0,30}(\d{2,3})/i]
    ];
    let found=false;
    for(const [,score,pattern] of candidates){const match=String(college.english||'').match(pattern);if(match){found=true;if(score!=null&&score>=Number(match[1]))return {key:'requirement-met',tone:'good'};}}
    if(found&&(profile.ielts!=null||profile.toefl!=null||profile.duolingo!=null))return {key:'requirement-not-met',tone:'bad'};
    return {key:'unknown',tone:'unknown'};
  }
  function satFit(college,profile=state.profile) {
    const policy=testPolicy(college);
    if(policy.status==='optional')return {key:'test-optional',tone:'good'};
    if(policy.status==='required')return profile.sat!=null||profile.act!=null?{key:'requirement-met',tone:'good'}:{key:'missing-required-test',tone:'bad'};
    return {key:'unknown',tone:'unknown'};
  }
  function academicFit(college,profile=state.profile) {
    const avg=Number(college?.facts?.satAverage), rate=Number(college?.facts?.admissionRate);
    if(profile.sat==null||!Number.isFinite(avg))return {key:'unknown',tone:'unknown'};
    if(profile.sat>=avg+80)return {key:'strong',tone:'good'};
    if(profile.sat>=avg-40)return {key:'reasonable',tone:'good'};
    if(Number.isFinite(rate)&&rate>0&&rate<.2)return {key:'very-competitive',tone:'bad'};
    return {key:'competitive',tone:'warn'};
  }
  function financialFit(college,profile=state.profile) {
    const tuition=Number(college?.finderFacts?.tuition ?? college?.facts?.tuitionOut);
    if(profile.annualBudget==null||!Number.isFinite(tuition))return {key:'unknown',tone:'unknown'};
    if(!profile.needsAid)return profile.annualBudget>=tuition?{key:'strong',tone:'good'}:profile.annualBudget>=tuition*.75?{key:'possible',tone:'warn'}:{key:'difficult',tone:'bad'};
    if(!policyKnown(college,'aid'))return {key:'unknown',tone:'unknown'};
    if(profile.annualBudget>=tuition)return {key:'strong',tone:'good'};
    if(['need-blind','full-need'].includes(college.aidCategory)||college.needBlind===true)return {key:'possible',tone:'warn'};
    if(college.aidCategory==='limited')return {key:'very-difficult',tone:'bad'};
    return {key:'difficult',tone:'bad'};
  }
  function freshness(college) {
    if(!college?.checkedAt)return {key:'incomplete',tone:'unknown'};
    const days=Math.floor((Date.now()-Date.parse(college.checkedAt+'T12:00:00Z'))/86400000);
    if(!Number.isFinite(days))return {key:'incomplete',tone:'unknown'};
    return days<=30?{key:'fresh',tone:'good'}:days<=90?{key:'review-soon',tone:'warn'}:{key:'potentially-outdated',tone:'bad'};
  }
  function fit(college,profile=state.profile) {
    const academic=academicFit(college,profile), financial=financialFit(college,profile), english=englishFit(college,profile), testing=satFit(college,profile);
    const known=[english,testing].filter(item=>item.key!=='unknown');
    const missing=known.some(item=>item.tone==='bad');
    return {academic,financial,english,testing,overall:known.length===2?{key:missing?'missing-requirements':'ready',tone:missing?'bad':'good'}:{key:'unknown',tone:'unknown'},confidence:freshness(college)};
  }
  function checklistFor(college,profile=state.profile) {
    const items=['application','common-app','personal-essay','supplemental-essays','transcript','school-report','recommendation-1','recommendation-2'];
    const testing=testPolicy(college); if(testing.status==='required')items.push('sat-act');
    if(policyKnown(college,'english')&&!/not required|waiv|освобож|не треб|не потріб/i.test(college.english||''))items.push('english-test');
    if(profile.needsAid&&policyKnown(college,'aid'))items.push('financial-documents');
    if(policyKnown(college,'fee')&&!/no application fee|fee waiver|без.*взнос|без.*внесок/i.test(college.fee||''))items.push('fee');
    items.push('submitted'); return items;
  }
  const months={january:1,february:2,march:3,april:4,may:5,june:6,july:7,august:8,september:9,october:10,november:11,december:12};
  function deadlineFor(college,plan,year=state.profile.applicationYear) {
    if(!year||!policyKnown(college,'deadline'))return '';
    const text=String(college.deadline||'');
    const aliases={ED:['ED','Early Decision'],EA:['EA','Early Action'],REA:['REA','Restrictive Early Action'],RD:['RD','Regular Decision'],Rolling:['Rolling']}[plan]||[plan];
    let segment='';
    for(const alias of aliases){const match=text.match(new RegExp(`\\b${alias.replace(/\s+/g,'\\s+')}\\b`,'i'));if(match){segment=text.slice(match.index,match.index+120);break;}}
    if(!segment)return '';
    const match=segment.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:,\s*(20\d{2}))?/i);
    if(!match)return '';
    const month=months[match[1].toLowerCase()], day=Number(match[2]);
    let target=Number(match[3])||Number(year)-1; if(month<=6&&plan==='RD')target=Number(year);
    return `${target}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  }
  const api={
    key:KEY,get value(){return clone(state);},normalize,normalizeProfile,fit,freshness,checklistFor,deadlineFor,testPolicy,
    updateProfile(patch){return save({...state,profile:{...state.profile,...patch}});},
    setCategory(slug,category){const categories={...state.categories};if(categoriesByValue(category))categories[slug]=category;else delete categories[slug];return save({...state,categories});},
    upsertApplication(value){const item=normalizeApplication(value),applications=state.applications.filter(existing=>existing.collegeSlug!==item.collegeSlug);applications.push(item);return save({...state,applications});},
    removeApplication(slug){return save({...state,applications:state.applications.filter(item=>item.collegeSlug!==slug)});},
    clear(){
      state=normalize();
      try{localStorage.removeItem(KEY);}catch{}
      window.dispatchEvent(new CustomEvent('fullride:student-data',{detail:{source:'account-clear'}}));
      return clone(state);
    },
    merge(remote){
      if(!remote||typeof remote!=='object')return clone(state);
      const incoming=normalize(remote);
      const profileHasData=Object.values(incoming.profile).some(value=>Array.isArray(value)?value.length:value!==null&&value!==''&&value!==false);
      const mergedApps=new Map(state.applications.map(item=>[item.collegeSlug,item]));
      incoming.applications.forEach(item=>{const local=mergedApps.get(item.collegeSlug);if(!local||item.updatedAt>=local.updatedAt)mergedApps.set(item.collegeSlug,item);});
      return save({version:1,profile:profileHasData?incoming.profile:state.profile,categories:{...state.categories,...incoming.categories},applications:[...mergedApps.values()]},'cloud');
    },
    export:()=>clone(state)
  };
  function categoriesByValue(value){return categories.includes(value);}
  globalThis.AdmitVectorStudent=api;
  window.addEventListener('storage',event=>{if(event.key===KEY){state=read();window.dispatchEvent(new CustomEvent('fullride:student-data',{detail:{source:'storage'}}));}});
})();
