import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE,headless:true});
const base='http://127.0.0.1:8765/';
const authStub=`
const auth={currentUser:null},callbacks=[];
export const browserLocalPersistence={};
export const getAuth=()=>auth;
export const setPersistence=async()=>{};
export function onAuthStateChanged(a,fn){callbacks.push(fn);Promise.resolve().then(()=>fn(a.currentUser));}
window.__signIn=async(uid,password=true)=>{auth.currentUser={uid,email:uid+'@example.com',emailVerified:true,displayName:uid,providerData:[{providerId:password?'password':'google.com'}],reload:async()=>{}};for(const fn of callbacks)await fn(auth.currentUser);};
export async function signOut(){auth.currentUser=null;for(const fn of callbacks)await fn(null);}
export async function updateProfile(user,profile){Object.assign(user,profile);}
export async function sendPasswordResetEmail(a,email){window.__resetEmail=email;}
export async function sendEmailVerification(user){window.__verificationEmail=user.email;}
export const GoogleAuthProvider=class{};
`;
const firestoreStub=`
window.__docs={};
export const getFirestore=()=>({});
export const doc=(db,collection,uid)=>uid;
export const getDoc=async uid=>({exists:()=>Boolean(window.__docs[uid]),data:()=>window.__docs[uid]});
export const setDoc=async(uid,data)=>{window.__docs[uid]=JSON.parse(JSON.stringify(data));};
export const serverTimestamp=()=>123;
`;
try {
 const context=await browser.newContext({viewport:{width:1440,height:950},serviceWorkers:'block'});
 await context.route('**/*',route=>{
   const url=route.request().url();
   if(url.includes('firebase-app.js'))return route.fulfill({contentType:'text/javascript',body:'export const initializeApp=()=>({});'});
   if(url.includes('firebase-auth.js'))return route.fulfill({contentType:'text/javascript',body:authStub});
   if(url.includes('firebase-firestore.js'))return route.fulfill({contentType:'text/javascript',body:firestoreStub});
   if(!url.startsWith(base))return route.abort();
   return route.continue();
 });
 await context.addInitScript(()=>{
   window.__speeches=[];
   Object.defineProperty(window,'speechSynthesis',{value:{cancel(){},speak(u){window.__speeches.push(u.text);}}});
   window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};
 });
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'settings.html?lang=ru');
 await page.waitForFunction(()=>FullRideAuth.state.status==='guest');
 assert.equal(await page.locator('.settings-section').count(),6);
 assert.equal(await page.locator('.fr-rail__link[href^="settings.html"]').count(),1);
 const fill=(name,value)=>page.locator('[name="'+name+'"]').fill(value);
 const select=async(name,value)=>{const choice=page.locator('[data-setting="'+name+'"][data-value="'+value+'"]');if(await choice.count())await choice.click();else await page.locator('[name="'+name+'"]').selectOption(value);};
 await fill('profile.name','Мария');await fill('profile.notes','<script>window.bad=1</script>');
 await select('admission.degree','3');await select('admission.focus','stem');await fill('admission.budget','80000');
 await fill('preparation.dailyWords','5');await fill('cards.newWords','2');await fill('cards.reviewLimit','5');
 await select('cards.direction','reproduction');await select('cards.speechRepeats','3');await page.locator('[name="cards.autoSpeak"]').check();
 await page.locator('#settings-form [type="submit"]').click();
 await page.reload();
 assert.equal(await page.locator('[name="profile.notes"]').inputValue(),'<script>window.bad=1</script>');
 assert.equal(await page.evaluate(()=>window.bad),undefined,'notes are escaped, not executed');
 assert.equal(await page.locator('[name="cards.newWords"]').inputValue(),'2');
 await page.screenshot({path:'settings-light-preview.png'});
 await select('interface.theme','dark');await select('interface.fontScale','1.25');await page.locator('[name="interface.reduceMotion"]').check();
 await page.locator('#settings-form [type="submit"]').click();
 assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
 assert.equal(await page.locator('html').evaluate(e=>getComputedStyle(e).fontSize),'20px');
 await page.locator('.settings-tabs a').first().hover();
 assert.equal(await page.locator('.settings-tabs a').first().evaluate(e=>getComputedStyle(e).transform),'none','reduced motion disables hover jumps');
 await page.screenshot({path:'settings-dark-preview.png'});
 await page.setViewportSize({width:390,height:844});
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'large text does not overflow mobile settings');
 await page.screenshot({path:'settings-mobile-preview.png'});
 await page.setViewportSize({width:320,height:800});
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'settings fits 320px with large font');
 await page.setViewportSize({width:1440,height:950});
 // Calendar files and backup export are real downloadable artifacts.
 await page.locator('[name="reminders.practice"]').check();await page.locator('[name="reminders.deadlines"]').check();
 await fill('reminders.time','09:30');await select('reminders.frequency','weekly');
 await page.locator('#reminder-title').fill('Deadline, university; документы');await page.locator('#reminder-date').fill('2027-01-15');await page.locator('#settings-add-reminder').click();
 const [calendar]=await Promise.all([page.waitForEvent('download'),page.locator('#settings-calendar').click()]);
 const fs=await import('node:fs/promises');
 const calendarText=await fs.readFile(await calendar.path(),'utf8');
 assert(calendarText.includes('RRULE:FREQ=WEEKLY'));assert(calendarText.includes('TRIGGER:-P7D'));assert(calendarText.includes('SUMMARY:Deadline\\, university\\;'));
 const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#settings-export').click()]);
 const backup=JSON.parse(await fs.readFile(await download.path(),'utf8'));
 assert.equal(backup.preferences.value.profile.name,'Мария');assert.equal(backup.version,2);
 page.on('dialog',dialog=>dialog.accept());
 await fill('profile.name','Другой');await page.locator('#settings-form [type="submit"]').click();
 await page.locator('#settings-import-file').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});
 await page.waitForFunction(()=>document.querySelector('[name="profile.name"]').value==='Мария');
 const previous=await page.evaluate(()=>JSON.stringify(FullRideSettings.backup().state));
 await page.locator('#settings-import-file').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"app":"FullRide UA","version":2,"state":{"schemaVersion":1,"cards":[]},"__proto__":{"bad":true}}')});
 await page.waitForFunction(()=>document.getElementById('settings-status').textContent.includes('Данные не изменены'));
 assert.equal(await page.evaluate(()=>JSON.stringify(FullRideSettings.backup().state)),previous,'invalid restore leaves progress untouched');
 // Reminders are opt-in; their time/frequency uses the device timezone.
 const due=await page.evaluate(()=>{FullRidePreferences.update({reminders:{time:'09:30',frequency:'weekly',weekday:1,practice:true,deadlines:true}});return [FullRideReminders.due(new Date(2027,0,11,9,29)),FullRideReminders.due(new Date(2027,0,11,9,30)),FullRideReminders.due(new Date(2027,0,12,9,30))];});
 assert.equal(due[0].length,0);assert(due[1].some(x=>x.type==='practice'));assert(!due[2].some(x=>x.type==='practice'));
 // Exercise the actual auth integration with isolated SDK stubs, not real emails/accounts.
 await page.evaluate(()=>__signIn('user-A'));
 await fill('profile.notes','Private A');await fill('profile.name','Алиса');
 await page.locator('#settings-form [type="submit"]').click();await page.waitForFunction(()=>FullRideAuth.state.user.displayName==='Алиса');
 await page.locator('#settings-sync').click();await page.waitForFunction(()=>FullRideAuth.state.status==='synced');
 assert.equal(await page.evaluate(()=>__docs['user-A'].flashcards[0].state.preferences.value.profile.notes),'Private A');
 await page.locator('#settings-password').click();await page.waitForFunction(()=>window.__resetEmail==='user-A@example.com');
 await page.locator('[name="profile.hideName"]').check();await page.locator('#settings-form [type="submit"]').click();
 assert.equal(await page.locator('#account-trigger [data-auth-key="account"]').textContent(),'Аккаунт');
 await fill('profile.notes','Unsaved A');await page.locator('#settings-signout').click();await page.waitForFunction(()=>FullRideAuth.state.status==='guest');
 assert.notEqual(await page.locator('[name="profile.notes"]').inputValue(),'Unsaved A','logout does not leave private draft visible');
 await page.evaluate(()=>__signIn('user-B',false));assert.notEqual(await page.locator('[name="profile.notes"]').inputValue(),'Private A');
 assert(await page.locator('#settings-password').isHidden(),'Google account has no fake site password');
 await page.locator('#settings-signout').click();await page.waitForFunction(()=>FullRideAuth.state.status==='guest');
 await page.evaluate(()=>FullRidePreferences.update({interface:{fontScale:1,reduceMotion:false},reminders:{practice:false,deadlines:false},admission:{degree:'3',focus:'stem',budget:80000}}));
 await page.goto(base+'index.html?lang=ru#finder');
 await page.locator('#search').fill('Harvard');await page.locator('.card .personal-fit').waitFor();
 assert((await page.locator('.card .personal-fit').first().textContent()).includes('3/3'));
 await page.locator('.card').first().scrollIntoViewIfNeeded();await page.screenshot({path:'settings-catalog-dark-preview.png'});
 await page.goto(base+'practice-test.html?lang=ru');
 for(const [word,translation]of [['sell','продавать'],['school','школа'],['house','дом'],['book','книга'],['study','учиться']]){
  await page.locator('#word-input').fill(word);await page.locator('#translation-input').fill(translation);await page.locator('#card-form button').click();
 }
 await page.locator('#start-practice').click();
 assert((await page.locator('[data-practice-key="setupIntro"]').textContent()).includes('2'),'setup describes the actual personal session length');
 await page.locator('#session-start').click();
 assert.equal(await page.locator('#session-counter').textContent(),'1 из 2','personal fresh-word limit applies');
 assert.equal(await page.locator('#session-word').textContent(),'продавать','reverse cards show translation first');
 assert(await page.locator('#session-speak').isHidden(),'no spoken answer before reveal');
 assert.equal(await page.evaluate(()=>__speeches.length),0);
 await page.locator('#session-reveal').click();assert.equal(await page.locator('#session-word').textContent(),'sell');
 assert.equal(await page.evaluate(()=>__speeches.length),3,'configured automatic pronunciation count');
 await page.locator('.sentence-optional summary').click();await page.locator('#session-sentence').fill('I sell books.');
 await page.evaluate(()=>window.dispatchEvent(new CustomEvent('fullride:cloud-data')));
 assert.equal(await page.locator('#session-word').textContent(),'sell','cloud refresh does not flip a revealed reverse card');
 assert.equal(await page.locator('#session-sentence').inputValue(),'I sell books.','cloud refresh preserves an unfinished sentence');
 assert.equal(await page.evaluate(()=>__speeches.length),3,'cloud refresh does not repeat pronunciation');
 await page.locator('[data-rate="good"]').click();
 assert.equal(await page.evaluate(()=>FullRidePracticeState.state.cards.find(c=>c.word==='sell').srs.history.length),1,'answer after cloud refresh is persisted on the current card');
 await page.locator('#session-next').click();assert(await page.locator('#session-complete').isVisible(),'skip does not require a sentence');
 await page.locator('#session-finish-close').click();
 assert((await page.locator('#practice-daily-goal').textContent()).includes('1 / 5'),'daily goal includes completed reviews');
 await page.reload();assert((await page.locator('#practice-daily-goal').textContent()).includes('1 / 5'),'daily progress survives reload');
 await page.locator('#practice-deck-list [data-deck="A1"] summary').click();await page.locator('[data-start-deck="A1"][data-module="0"]').click();await page.locator('#session-start').click();
 assert.equal(await page.locator('#session-counter').textContent(),'1 из 20','ready-made blocks remain 20 words');
 await page.screenshot({path:'settings-practice-dark-preview.png'});
 await page.keyboard.press('Escape');
 for(const [file,target]of [['compare.html?lang=ru','.compare-hero'],['university.html?id=harvard&lang=ru','.profile-section'],['ielts-resources.html?lang=ru','.resources-library']]){
   await page.goto(base+file);await page.locator(target).first().waitFor();
   assert.equal(await page.locator('html').getAttribute('data-theme'),'dark','theme persists across '+file);
   await page.locator(target).first().scrollIntoViewIfNeeded();
   if(file.startsWith('ielts')){await page.locator('.resource-card').first().scrollIntoViewIfNeeded();await page.waitForFunction(()=>getComputedStyle(document.querySelector('.resource-card')).opacity==='1');}
   await page.screenshot({path:'settings-'+file.split('.')[0]+'-dark-preview.png'});
 }
 await page.evaluate(()=>FullRidePreferences.update({interface:{fontScale:1.25,reduceMotion:true}}));
 await page.setViewportSize({width:390,height:844});
 for(const [file,target]of [['index.html?lang=ru#finder','#search'],['practice-test.html?lang=ru','.practice-decks'],['compare.html?lang=ru','.compare-hero'],['university.html?id=harvard&lang=ru','.profile-section'],['ielts-resources.html?lang=ru','.resource-card']]){
   await page.goto(base+file);await page.locator(target).first().waitFor();
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'large text fits mobile '+file);
   assert.equal(await page.evaluate(()=>FullRidePreferences.motionBehavior()),'auto','scripted scroll also respects reduced motion');
 }
 await page.goto(base+'settings.html?lang=ru');
 await page.locator('[name="interface.language"]').selectOption('en');
 assert.equal(await page.locator('html').getAttribute('lang'),'en');
 await page.goto(base+'practice-test.html');
 assert.equal(await page.locator('html').getAttribute('lang'),'en','selected language is used without a query');
 assert.deepEqual(errors,[],'no page errors');
 // A failed local save must not block the emergency backup promised by the UI.
 const quotaPage=await context.newPage();
 await quotaPage.addInitScript(()=>{Storage.prototype.setItem=function(){throw new DOMException('Full','QuotaExceededError');};});
 const quotaErrors=[];quotaPage.on('pageerror',e=>quotaErrors.push(e.message));
 await quotaPage.goto(base+'settings-test.html?lang=ru');
 await quotaPage.locator('[name="profile.notes"]').fill('Keep this unsaved note');
 await quotaPage.locator('#settings-form [type="submit"]').click();
 assert((await quotaPage.locator('#settings-status').textContent()).includes('Браузер не разрешает'));
 const [emergency]=await Promise.all([quotaPage.waitForEvent('download'),quotaPage.locator('#settings-export').click()]);
 const emergencyBackup=JSON.parse(await fs.readFile(await emergency.path(),'utf8'));
 assert.equal(emergencyBackup.preferences.value.profile.notes,'Keep this unsaved note','export includes in-memory settings after failed save');
 assert.deepEqual(quotaErrors,[],'blocked storage does not crash settings');
 console.log('PASS: settings persistence, theme, mobile/large text, reduced motion, backup restore, calendar, reminders, matching, practice preferences and mocked account integration');
 await context.close();
}finally{await browser.close();}
