const puppeteer = require('puppeteer');

(async ()=>{
  const url = 'http://127.0.0.1:8080/brainova.html';
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: true, args:['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);
  console.log('Opening', url);
  await page.goto(url, { waitUntil: 'networkidle2' });
  // Wait for a card to be present
  await page.waitForSelector('.game-card', { visible: true });
  console.log('Clicking first game card');
  await page.click('.game-card');
  // Wait for overlay active
  await page.waitForSelector('#overlay.active', { visible: true });
  console.log('Overlay opened');
  // Wait for close button and click
  await page.waitForSelector('#closeBtn', { visible: true });
  await page.click('#closeBtn');
  // Ensure overlay is hidden
  try{
    await page.waitForSelector('#overlay.active', { hidden: true, timeout: 5000 });
    console.log('Overlay closed - TEST PASSED');
    await browser.close();
    process.exit(0);
  }catch(e){
    console.error('Overlay did not close in time - TEST FAILED', e);
    await page.screenshot({ path: 'tools/overlay_failure.png', fullPage: true });
    await browser.close();
    process.exit(2);
  }
})();