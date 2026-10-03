import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE,headless:true});
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:8765/';
// Inspect opaque surfaces and text, not photographic/illustrated book covers.
// Alpha colours are composited with ancestor backgrounds; large text needs 3:1.
async function contrast(page,scope){return page.locator(scope).first().evaluate(root=>{
  const rgb=s=>(s.match(/[\d.]+/g)||[]).map(Number);
  const blend=(a,b)=>{const alpha=a.length>3?a[3]:1;return a.slice(0,3).map((v,i)=>v*alpha+b[i]*(1-alpha));};
  const luminance=a=>a.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
  const failures=[];
  for(const el of [root,...root.querySelectorAll('*')]){
    if(![...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())||el.closest('svg,[aria-hidden="true"],.resource-card__visual,.hero-book,.profile-hero,.card--photo,.mosaic-caption'))continue;
    const s=getComputedStyle(el),r=el.getBoundingClientRect();
    if(!r.width||!r.height||s.visibility==='hidden'||Number(s.opacity)<.99||el.matches(':disabled')||el.closest('[hidden]'))continue;
    const chain=[];let patterned=false;
    for(let a=el;a;a=a.parentElement){const cs=getComputedStyle(a);if(cs.backgroundImage!=='none')patterned=true;chain.unshift(rgb(cs.backgroundColor));}
    if(patterned)continue;
    const bg=chain.reduce((result,color)=>blend(color,result),[255,255,255]),fg=blend(rgb(s.color),bg);
    const [low,high]=[luminance(bg),luminance(fg)].sort((a,b)=>a-b),ratio=(high+.05)/(low+.05);
    const large=parseFloat(s.fontSize)>=24||(parseFloat(s.fontSize)>=18.66&&Number(s.fontWeight)>=700),min=large?3:4.5;
    if(ratio<min-.02)failures.push({element:el.tagName.toLowerCase()+'.'+el.className,text:el.textContent.trim().slice(0,55),ratio:Math.round(ratio*100)/100,min,color:s.color,bg:bg.map(Math.round)});
  }
  return failures;
});}
try{
 const context=await browser.newContext({viewport:{width:1440,height:960},serviceWorkers:'block'});
 await context.route('**/*',route=>{const url=route.request().url();if(url.includes('auth.js')||url.includes('firebase-config.js'))return route.fulfill({contentType:'text/javascript',body:''});if(!url.startsWith(base))return route.abort();return route.continue();});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const audit=[];
 for(const theme of ['light','dark']){
  await page.goto(base+'settings.html?lang=en');
  await page.evaluate(theme=>FullRidePreferences.update({interface:{theme,reduceMotion:true}}),theme);
  await page.reload();await page.waitForSelector('#settings-form');
  assert.equal(await page.locator('[data-setting="interface.theme"][data-value="'+theme+'"]').getAttribute('aria-pressed'),'true');
  for(const section of ['account','admission','interface','study','reminders','data']){
   await page.locator('#'+section).scrollIntoViewIfNeeded();
   audit.push(...(await contrast(page,'#'+section)).map(v=>({page:'settings/'+section,theme,...v})));
   await page.screenshot({path:'theme-settings-'+section+'-'+theme+'-preview.png'});
  }
  for(const [file,scopes]of [['index.html',['.search-prompt','.roi-section','.aid-guide','.method','.about','.contact']],['practice.html',['.practice-main']],['compare.html',['.compare-hero','.compare-workspace']],['university.html?id=harvard',['.profile-root']],['ielts-resources.html',['.resource-path','.resource-note','.resources-library']]]){
   await page.goto(base+file+(file.includes('?')?'&':'?')+'lang=en');
   await page.locator(scopes[0]).first().waitFor();
   for(const scope of scopes){await page.locator(scope).first().scrollIntoViewIfNeeded();audit.push(...(await contrast(page,scope)).map(v=>({page:file,scope,theme,...v})));}
   if(file==='index.html'){
    await page.locator('#roi-toggle').click();await page.locator('.roi-panel').scrollIntoViewIfNeeded();
    audit.push(...(await contrast(page,'.roi-panel')).map(v=>({page:'roi-open',theme,...v})));
    for(const scope of ['.aid-guide','.method','.about','.search-prompt']){await page.locator(scope).scrollIntoViewIfNeeded();await page.screenshot({path:'theme-catalog-'+scope.slice(1)+'-'+theme+'-preview.png'});}
    await page.locator('[data-shortlist-open]').first().click();await page.locator('#shortlist-drawer').waitFor({state:'visible'});
    audit.push(...(await contrast(page,'#shortlist-drawer')).map(v=>({page:'saved-drawer',theme,...v})));
    await page.locator('#shortlist-close').click();
   }
   if(file==='practice.html'){
    await page.locator('[data-deck="A1"] summary').click();
    audit.push(...(await contrast(page,'.practice-main')).map(v=>({page:'practice-expanded',theme,...v})));
    await page.locator('[data-start-deck="A1"][data-module="0"]').click();
    audit.push(...(await contrast(page,'#practice-modal')).map(v=>({page:'session-setup',theme,...v})));
    await page.locator('#session-start').click();
    if(await page.locator('#session-reveal').isVisible())await page.locator('#session-reveal').click();
    audit.push(...(await contrast(page,'#practice-modal')).map(v=>({page:'session-card',theme,...v})));
    await page.keyboard.press('Escape');
   }
   if(file==='compare.html'){
    await page.evaluate(()=>FullRideCompare.save(['harvard','yale']));await page.reload();await page.locator('.comparison-data-cell').first().waitFor();
    audit.push(...(await contrast(page,'.compare-workspace')).map(v=>({page:'compare-populated',theme,...v})));
    await page.evaluate(()=>FullRideCompare.clear());
   }
   if(file==='ielts-resources.html'){
    await page.locator('[data-resource-id="ielts-21-academic"]').click();
    audit.push(...(await contrast(page,'#resource-dialog')).map(v=>({page:'resource-dialog',theme,...v})));
    await page.locator('[data-resource-close]').click();
   }
  }
 }
 console.log(JSON.stringify([...new Map(audit.map(v=>[v.page+v.scope+v.theme+v.element+v.color+v.bg,v])).values()],null,2));
 assert.equal(audit.length,0,'normal text must be at least 4.5:1, large text 3:1 on audited surfaces');
 await page.goto(base+'settings.html?lang=ru');
 await page.locator('[data-setting="interface.theme"][data-value="light"]').click();
 assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
 await page.locator('[data-setting="interface.theme"][data-value="dark"]').click();
 assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
 await page.locator('[data-setting="interface.fontScale"][data-value="1.25"]').click();
 await page.locator('[name="profile.notes"]').fill('Kept during theme switching');
 await page.locator('[data-setting="interface.theme"][data-value="light"]').click();
 assert.equal(await page.locator('[name="profile.notes"]').inputValue(),'Kept during theme switching');
 await page.locator('#settings-form [type="submit"]').click();await page.reload();
 assert.equal(await page.locator('[name="profile.notes"]').inputValue(),'Kept during theme switching');
 for(const width of [1440,1024,768,390,320]){await page.setViewportSize({width,height:900});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'settings fits '+width+' with enlarged text');}
 assert.deepEqual(errors,[]);
 console.log('PASS: theme contrast audit, all six settings groups, visual controls, drafts, persistence and responsive settings');
}finally{await browser.close();}
