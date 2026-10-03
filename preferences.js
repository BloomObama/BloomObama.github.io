/* Small synchronous preferences bootstrap. No SDK, analytics or catalogue download. */
(() => {
  const KEY = 'fullride-preferences-v1';
  const defaults = {
    interface:{language:'uk',theme:'light',fontScale:1,reduceMotion:false},
    profile:{name:'',avatar:'initial',hideName:false,country:'',gpa:null,notes:''},
    admission:{year:new Date().getFullYear()+1,degree:'',focus:'',region:'',budget:null,scholarship:false},
    preparation:{ielts:null,sat:null,examDate:'',dailyWords:20},
    cards:{newWords:20,reviewLimit:20,direction:'recognition',autoSpeak:false,speechRepeats:1},
    reminders:{practice:false,deadlines:false,browser:false,time:'18:00',frequency:'daily',weekday:1,daysAhead:7,items:[]}
  };
  const clone = value => JSON.parse(JSON.stringify(value));
  const text = (value,max) => typeof value === 'string' ? value.trim().slice(0,max) : '';
  const choice = (value,allowed,fallback) => allowed.includes(value) ? value : fallback;
  const number = (value,min,max,fallback=null) => value!=='' && value!==null && value!==undefined && Number.isFinite(Number(value)) && Number(value)>=min && Number(value)<=max ? Number(value) : fallback;
  const integer = (value,min,max,fallback=null) => Number.isInteger(number(value,min,max)) ? number(value,min,max) : fallback;
  const date = value => /^\d{4}-\d{2}-\d{2}$/.test(value || '') && !Number.isNaN(Date.parse(value+'T12:00:00')) && new Date(value+'T12:00:00').getDate()===Number(value.slice(8,10)) ? value : '';
  function normalize(value={}) {
    if(!value||typeof value!=='object'||Array.isArray(value))value={};
    const d = clone(defaults), i=value.interface||{}, p=value.profile||{}, a=value.admission||{}, prep=value.preparation||{}, c=value.cards||{}, r=value.reminders||{};
    d.interface = {language:choice(i.language,['uk','ru','en'],'uk'),theme:choice(i.theme,['light','dark'],'light'),fontScale:choice(Number(i.fontScale),[1,1.125,1.25],1),reduceMotion:i.reduceMotion===true};
    d.profile = {name:text(p.name,80),avatar:choice(p.avatar,['initial','sun','leaf','star'],'initial'),hideName:p.hideName===true,country:text(p.country,80),gpa:number(p.gpa,0,4),notes:text(p.notes,2000)};
    d.admission = {year:integer(a.year,2026,2040,defaults.admission.year),degree:choice(a.degree,['','3','4'],''),focus:choice(a.focus,['','stem','arts','social-sciences','business'],''),region:choice(a.region,['','northeast','south','midwest','west'],''),budget:number(a.budget,0,300000),scholarship:a.scholarship===true};
    d.preparation = {ielts:number(prep.ielts,0,9),sat:integer(prep.sat,400,1600),examDate:date(prep.examDate),dailyWords:integer(prep.dailyWords,1,200,20)};
    d.cards = {newWords:integer(c.newWords,0,100,20),reviewLimit:integer(c.reviewLimit,1,100,20),direction:choice(c.direction,['recognition','reproduction'],'recognition'),autoSpeak:c.autoSpeak===true,speechRepeats:choice(Number(c.speechRepeats),[1,2,3],1)};
    d.reminders = {practice:r.practice===true,deadlines:r.deadlines===true,browser:r.browser===true,time:/^([01]\d|2[0-3]):[0-5]\d$/.test(r.time||'')?r.time:'18:00',frequency:choice(r.frequency,['daily','weekly'],'daily'),weekday:choice(Number(r.weekday),[0,1,2,3,4,5,6],1),daysAhead:choice(Number(r.daysAhead),[0,1,3,7,14],7),items:Array.isArray(r.items)?r.items.filter(item=>item && date(item.date) && text(item.title,120)).slice(0,50).map(item=>({id:text(item.id,80).replace(/[^a-z0-9_-]/gi,'_')||crypto.randomUUID(),title:text(item.title,120),date:date(item.date)})):[]};
    return d;
  }
  let account = null, persisted = true;
  const storageKey = () => account ? KEY+':'+account : KEY;
  const read = key => { try { const record=JSON.parse(localStorage.getItem(key)||'null');return {updatedAt:number(record?.updatedAt,0,Date.now()+60000,0),value:normalize(record?.value)}; } catch {persisted=false;return {updatedAt:0,value:clone(defaults)};} };
  let record = read(KEY);
  // Appearance is shared across pages; personal fields remain account-scoped.
  try {const appearance=JSON.parse(localStorage.getItem(KEY+'-appearance'));if(appearance)record.value.interface=normalize({interface:appearance}).interface;}catch{}
  const announce = source => window.dispatchEvent(new CustomEvent('fullride:preferences',{detail:{source,persisted}}));
  function apply() {
    const i=record.value.interface, root=document.documentElement;
    root.dataset.theme=i.theme;
    root.dataset.motion=i.reduceMotion?'reduce':'normal';
    root.style.fontSize=(16*i.fontScale)+'px';
    root.style.setProperty('--fr-font-scale',i.fontScale);
    root.style.colorScheme=i.theme;
    try{localStorage.setItem(KEY+'-appearance',JSON.stringify(i));}catch{}
  }
  function write(value,source='local',updatedAt=Date.now()) {
    record={updatedAt,value:normalize(value)};
    try {localStorage.setItem(storageKey(),JSON.stringify(record));persisted=true;}catch {persisted=false;}
    apply();announce(source);
    if(source==='local')window.dispatchEvent(new CustomEvent('fullride:local-data-changed'));
    return persisted;
  }
  function update(patch) {
    const next=clone(record.value);
    for(const section of Object.keys(defaults))if(patch[section])Object.assign(next[section],patch[section]);
    return write(next);
  }
  function merge(remote) {
    if(remote && Number.isFinite(remote.updatedAt) && remote.updatedAt>record.updatedAt && remote.updatedAt<=Date.now()+60000)write(remote.value,'cloud',remote.updatedAt);
  }
  function match(college) {
    const a=record.value.admission, checks=[];
    const add=(key,result)=>checks.push({key,result});
    const f=college.finderFacts||{};
    if(a.degree)add('degree',f.degree==null?'unknown':String(f.degree)===a.degree?'match':'mismatch');
    if(a.focus)add('focus',college.focus?.length?college.focus.includes(a.focus)?'match':'mismatch':'unknown');
    if(a.region)add('region',college.region?college.region===a.region?'match':'mismatch':'unknown');
    if(a.budget!==null)add('budget',Number.isFinite(f.tuition)?f.tuition<=a.budget?'match':'mismatch':'unknown');
    if(a.scholarship) {
      const known=globalThis.FullRidePolicy?.known(college,'aid');
      add('scholarship',known&&['need-blind','need-aware','merit','full-need'].includes(college.aidCategory)?'match':'unknown');
    }
    const matched=checks.filter(c=>c.result==='match').length;
    return {checks,matched,total:checks.length,complete:checks.length>0&&checks.every(c=>c.result==='match'),mismatch:checks.some(c=>c.result==='mismatch')};
  }
  const api = {
    get value(){return clone(record.value);},get persisted(){return persisted;},get account(){return account;},
    record:()=>clone(record),normalize,update,merge,match,
    language:()=>choice(new URLSearchParams(location.search).get('lang'),['uk','ru','en'],record.value.interface.language),
    motionBehavior:()=>record.value.interface.reduceMotion||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',
    setAccount(uid){
      if(account===(uid||null))return;
      const appearance=record.value.interface;
      account=uid||null;record=read(storageKey());
      if(account&&!record.updatedAt)record.value.interface=appearance;
      apply();announce('account');
    },
    adoptGuest(){
      // Only call after reading an account with no cloud settings.
      // Otherwise a recent guest draft could overwrite an existing profile.
      if(!account||record.updatedAt)return;
      const guest=read(KEY);
      if(guest.updatedAt)write(guest.value,'cloud');
    },
    avatar:()=>({initial:record.value.profile.name.charAt(0).toUpperCase()||'FR',sun:'☀',leaf:'❧',star:'✦'}[record.value.profile.avatar]),
    reset:()=>write(clone(defaults)),
    backup:()=>clone(record),
    key:KEY
  };
  globalThis.FullRidePreferences=api;
  apply();
  window.addEventListener('storage',event=>{if(event.key===storageKey()){record=read(storageKey());apply();announce('storage');}});
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-lang],[data-profile-lang],[data-compare-lang],[data-practice-lang],[data-resource-lang]');
    const lang=button?.dataset.lang||button?.dataset.profileLang||button?.dataset.compareLang||button?.dataset.practiceLang||button?.dataset.resourceLang;
    if(lang&&lang!==record.value.interface.language)update({interface:{language:lang}});
  });
})();
