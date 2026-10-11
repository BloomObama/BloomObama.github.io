import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const browser = await chromium.launch({ executablePath:process.env.BROWSER_EXECUTABLE, headless:true });

try {
  const page = await browser.newPage({ viewport:{ width:1365, height:900 } });
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:8765/index.html?lang=en',{waitUntil:'domcontentloaded'});
  await page.waitForSelector('#auth-dialog',{state:'attached'});
  await page.locator('#auth-loading').waitFor({state:'hidden',timeout:15000});
  await page.waitForTimeout(1000);
  await page.evaluate(()=>{
    document.body.classList.add('auth-open');
    document.getElementById('auth-dialog').setAttribute('aria-hidden','false');
    document.getElementById('auth-loading').hidden=true;
    document.getElementById('auth-guest').hidden=true;
    document.getElementById('auth-user').hidden=false;
    document.getElementById('auth-user-avatar').textContent='A';
    document.getElementById('auth-user-name').textContent='Admit Vector';
    document.getElementById('auth-user-email').textContent='account@example.com';
    document.getElementById('auth-verification').classList.add('is-verified');
    document.getElementById('auth-verification-label').textContent='Email verified';
    document.getElementById('auth-send-verification').hidden=true;
    document.getElementById('auth-refresh-user').hidden=true;
    document.querySelector('#auth-profile-form input').value='Admit Vector';
    document.getElementById('av-analytics-consent')?.remove();
  });
  await page.waitForTimeout(350);
  const drawer=page.locator('#auth-dialog');
  const signedInState=await page.evaluate(()=>({open:document.body.classList.contains('auth-open'),userHidden:document.getElementById('auth-user').hidden,guestHidden:document.getElementById('auth-guest').hidden,visibility:getComputedStyle(document.getElementById('auth-dialog')).visibility}));
  if(!signedInState.open || signedInState.userHidden || !signedInState.guestHidden || signedInState.visibility!=='visible') throw new Error('Mock account state was replaced: '+JSON.stringify(signedInState));
  const check=async(label)=>{
    const result=await drawer.evaluate(el=>({width:el.getBoundingClientRect().width,viewport:innerWidth,scroll:el.scrollWidth,client:el.clientWidth,background:getComputedStyle(el).backgroundColor}));
    if(result.width>result.viewport+1 || result.scroll>result.client+1) throw new Error(`${label}: drawer overflows ${JSON.stringify(result)}`);
  };
  await check('desktop light');
  await drawer.screenshot({path:join(tmpdir(),'admitvector-auth-drawer-light.png')});
  await page.evaluate(()=>{document.documentElement.dataset.theme='dark';});
  await check('desktop dark');
  await drawer.screenshot({path:join(tmpdir(),'admitvector-auth-drawer-dark.png')});
  await page.setViewportSize({width:390,height:844});
  await check('mobile dark');
  await drawer.screenshot({path:join(tmpdir(),'admitvector-auth-drawer-mobile.png')});
  await page.setViewportSize({width:1365,height:900});
  await page.evaluate(()=>{
    document.documentElement.dataset.theme='light';
    document.getElementById('auth-user').hidden=true;
    document.getElementById('auth-guest').hidden=false;
  });
  await check('guest light');
  await drawer.screenshot({path:join(tmpdir(),'admitvector-auth-drawer-guest.png')});
  if(errors.length) throw new Error('Browser errors: '+errors.join('; '));
  console.log('PASS: account drawer signed-in/guest, light/dark, mobile layout');
} finally {
  await browser.close();
}
