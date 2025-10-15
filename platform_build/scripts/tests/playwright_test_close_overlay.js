const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try{
    await page.goto('http://127.0.0.1:8080/global_platform.html', { waitUntil: 'networkidle' });
    // Wait for grid and card 13 to appear
    await page.waitForSelector('.game-card[data-game-id="13"]');
    // Click the card 13 to open in overlay
    await page.click('.game-card[data-game-id="13"]');
    // Wait for overlay to be active
    await page.waitForSelector('#overlay.active', { timeout: 3000 });
    // Get iframe handle
    const iframeHandle = await page.waitForSelector('#overlay iframe');
    const frame = await iframeHandle.contentFrame();
    // Ensure frame loaded
    await frame.waitForLoadState('domcontentloaded');

    // Execute closePlatform inside the iframe if present, otherwise send postMessage
    const result = await frame.evaluate(() => {
      try{
        if(typeof closePlatform === 'function'){
          closePlatform();
          return 'called-closePlatform';
        }
      }catch(e){}
      // fallback: post message to parent
      try{ parent.postMessage({ action: 'close', reason: 'test' }, '*'); return 'posted-close'; }catch(e){ return 'no-action'; }
    });

    console.log('Action inside iframe:', result);

    // Wait a short time and assert overlay is not active
    await page.waitForTimeout(500);
    const overlayVisible = await page.$eval('#overlay', el => el.classList.contains('active'));
    console.log('Overlay active after close attempt:', overlayVisible);

    if(overlayVisible){
      console.error('TEST FAILED: overlay still active');
      process.exit(2);
    }

    console.log('TEST PASSED: overlay closed');
    await browser.close();
    process.exit(0);
  }catch(err){
    console.error('Test error', err);
    try{ await browser.close(); }catch(e){}
    process.exit(1);
  }
})();
