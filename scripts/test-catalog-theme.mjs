import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:8765/';
const browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE,headless:true});
try {
 const context=await browser.newContext({viewport:{width:1440,height:1000},serviceWorkers:'block'});
 await context.route('**/*',route=>{const u=route.request().url();if(u.includes('auth.js')||u.includes('firebase-config.js'))return route.fulfill({contentType:'text/javascript',body:''});if(!u.startsWith(base))return route.abort();return route.continue();});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'index.html?lang=en');
 await page.waitForFunction(()=>typeof FullRidePreferences!=='undefined'&&document.querySelector('#random-college-count')?.textContent.includes('5'));
 for(const theme of ['light','dark']){
  await page.setViewportSize({width:1440,height:1000});
  await page.evaluate(()=>FullRidePreferences.update({interface:{fontScale:1}}));
  await page.evaluate(theme=>FullRidePreferences.update({interface:{theme,reduceMotion:false}}),theme);
  for(const selector of ['.college-randomizer','.roi-banner','.aid-guide','.contact']){
   await page.locator(selector).scrollIntoViewIfNeeded();
   await page.screenshot({path:'catalog-new-'+selector.slice(1)+'-'+theme+'-preview.png'});
  }
  assert.equal(await page.locator('.roi-toggle').evaluate(el=>getComputedStyle(el).color),'rgb(72, 26, 42)','dark text on gold ROI button in '+theme);
  assert.equal(await page.locator('.guide-grid h3').first().evaluate(el=>getComputedStyle(el).color),'rgb(255, 247, 239)','light glossary headings in '+theme);
  for(const width of [1440,768,390,320]){
   await page.setViewportSize({width,height:1000});
   await page.evaluate(()=>FullRidePreferences.update({interface:{fontScale:1.25}}));
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'catalog fits '+width+' at enlarged text in '+theme);
   const track=await page.locator('.random-lever__track').boundingBox(),shell=await page.locator('.random-lever').boundingBox();
   assert(track.x>=shell.x&&track.x+track.width<=shell.x+shell.width,'mechanism fits casing at '+width);
  }
 }
 await page.setViewportSize({width:1440,height:1000});
 await page.evaluate(()=>FullRidePreferences.update({interface:{fontScale:1,theme:'light'}}));
 const handle=page.locator('#random-lever-handle');
 assert.deepEqual(await page.locator('.random-lever__knob').evaluate(el=>{const s=getComputedStyle(el);return [s.width,s.height,s.borderRadius];}),['42px','42px','50%'],'original round grip restored');
 await handle.scrollIntoViewIfNeeded();
 // Verify geometry, not just the progress value: the axle stays fixed while
 // the grip crosses from above to below it through a central 3D rotation.
 await page.evaluate(()=>FullRidePreferences.update({interface:{reduceMotion:true}}));
 const positions=[];
 for(const pull of [0,.5,1]){
  await page.locator('.random-lever').evaluate((el,pull)=>el.style.setProperty('--pull',pull),pull);
  const geometry=await handle.evaluate(el=>{
   const r=el.getBoundingClientRect(),knob=el.querySelector('.random-lever__knob').getBoundingClientRect(),pivot=document.querySelector('.random-lever__pivot').getBoundingClientRect(),s=getComputedStyle(el);
   return {origin:s.transformOrigin,center:{x:r.x+r.width/2,y:r.y+r.height/2},knobY:knob.y+knob.height/2,pivotX:pivot.x+pivot.width/2,pivotY:pivot.y+pivot.height/2,transform:s.transform};
  });
  assert.equal(geometry.origin,'32px 92px','central transform origin');
  positions.push(geometry);
  await page.locator('.random-lever').screenshot({path:'catalog-lever-axis-'+pull+'-preview.png'});
 }
 assert(positions[0].knobY<positions[0].pivotY-40,'grip starts above axle');
 assert(positions[2].knobY>positions[2].pivotY+40,'grip ends below axle');
 assert(positions[1].knobY>positions[0].knobY&&positions[1].knobY<positions[2].knobY,'grip follows downward arc');
 assert(positions.every(p=>Math.abs(p.pivotY-positions[0].pivotY)<.1&&Math.abs(p.pivotX-positions[0].pivotX)<.1),'axle does not travel');
 await page.locator('.random-lever').evaluate(el=>el.style.setProperty('--pull',0));
 await page.evaluate(()=>FullRidePreferences.update({interface:{reduceMotion:false}}));
 let box=await handle.boundingBox();
 await page.mouse.move(box.x+box.width/2,box.y+26);await page.mouse.down();await page.mouse.move(box.x+box.width/2,box.y+70,{steps:6});
 assert(Number(await handle.getAttribute('aria-valuenow'))>20,'partial drag changes lever position');
 await page.screenshot({path:'catalog-lever-pulled-preview.png'});
 await page.mouse.up();
 assert.equal(await handle.getAttribute('aria-valuenow'),'0','partial drag springs back');
 const reveal=async()=>{await page.waitForFunction(()=>document.querySelector('#random-reveal')?.classList.contains('is-visible'));assert.match(await page.locator('#random-reveal-link').getAttribute('href'),/^university\.html\?id=.+&lang=en$/);assert.equal(await handle.getAttribute('aria-valuenow'),'0');assert.equal(await handle.getAttribute('aria-busy'),'false');};
 const close=async()=>{await page.locator('#random-reveal-close').click();await page.locator('#random-teaser').waitFor({state:'visible'});await handle.scrollIntoViewIfNeeded();};
 await handle.click();await reveal();const first=await page.locator('#random-reveal-name').textContent();await close();
 await handle.focus();await page.keyboard.press('ArrowDown');assert.equal(await handle.getAttribute('aria-valuenow'),'20');await page.keyboard.press('Home');assert.equal(await handle.getAttribute('aria-valuenow'),'0');await page.keyboard.press('End');await reveal();assert.notEqual(await page.locator('#random-reveal-name').textContent(),first,'new pick differs from previous');await close();
 box=await handle.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+26);await page.mouse.down();await page.mouse.move(box.x+box.width/2,box.y+145,{steps:10});await page.mouse.up();await reveal();await close();
 await page.evaluate(()=>FullRidePreferences.update({interface:{reduceMotion:true}}));
 assert.equal(await handle.evaluate(el=>getComputedStyle(el).transitionDuration),'0s','reduced motion removes transition');
 await handle.focus();await page.keyboard.press('Enter');await reveal();
 // Touch pointer follows the same captured drag path without scrolling the page.
 const touch=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'});
 await touch.route('**/*',route=>{const u=route.request().url();if(u.includes('auth.js')||u.includes('firebase-config.js'))return route.fulfill({contentType:'text/javascript',body:''});if(!u.startsWith(base))return route.abort();return route.continue();});
 const mobile=await touch.newPage();await mobile.goto(base+'index.html?lang=en');await mobile.locator('#random-lever-handle').scrollIntoViewIfNeeded();
 const mb=await mobile.locator('#random-lever-handle').boundingBox(),cdp=await touch.newCDPSession(mobile),x=mb.x+mb.width/2,y=mb.y+25;
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
 for(let dy=20;dy<=120;dy+=20)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y+dy}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await mobile.locator('#random-reveal.is-visible').waitFor();
 await mobile.locator('.college-randomizer').scrollIntoViewIfNeeded();await mobile.screenshot({path:'catalog-mobile-preview.png'});
 await touch.close();assert.deepEqual(errors,[]);
 console.log('PASS: red/gold surfaces, both themes, enlarged text, responsive mechanism, partial/full drag, click, keyboard, touch and reduced motion');
} finally {await browser.close();}
