import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('test-results',{recursive:true});
const server=spawn('python3',['-m','http.server','8765','--bind','127.0.0.1'],{stdio:'ignore'});
let browser;
try{
  browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--disable-web-security']});
  const page=await browser.newPage({viewport:{width:1600,height:900},deviceScaleFactor:1});
  const errors=[];
  page.on('pageerror',e=>errors.push('PAGE '+e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push('CONSOLE '+m.text())});
  for(let n=0;n<20;n++){try{await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded',timeout:3000});break}catch(e){if(n===19)throw e;await new Promise(r=>setTimeout(r,300))}}
  await page.waitForTimeout(3500);
  await page.screenshot({path:'test-results/driving.png'});
  await page.keyboard.down('w');await page.waitForTimeout(2000);await page.keyboard.up('w');
  await page.screenshot({path:'test-results/accelerating.png'});
  await page.keyboard.press('2');await page.waitForTimeout(600);
  await page.screenshot({path:'test-results/developer-view.png'});
  // Capture the whole circuit in a fixed, straight-down view for visual review.
  // F2 already activates the developer camera above; capture it from a
  // larger viewport so the full layout and surrounding runoffs are visible.
  await page.setViewportSize({width:2200,height:1800});
  await page.keyboard.press('5');
  await page.waitForTimeout(1200);
  await page.screenshot({path:'test-results/full-circuit-overhead.png'});
  await page.keyboard.press('5');
  await page.setViewportSize({width:1600,height:900});
  await writeFile('test-results/errors.txt',errors.join('\n')||'No browser errors detected');
  const canvases=await page.locator('canvas').count();
  if(!canvases)throw Error('No WebGL canvas rendered');
  if(errors.length)throw Error(errors.join('\n'));
}finally{if(browser)await browser.close();server.kill()}
