const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

(async ()=>{
  try{
    const file = path.resolve(__dirname, '..', 'brainova.html');
    const html = fs.readFileSync(file, 'utf8');
    const dom = new JSDOM(html, {
      url: 'http://127.0.0.1:8080/brainova.html',
      runScripts: 'dangerously',
      resources: 'usable'
    });

    // Wait for the inline scripts to execute
    await new Promise((res, rej)=>{
      dom.window.addEventListener('DOMContentLoaded', ()=>{
        // small delay to let scripts run
        setTimeout(res, 200);
      });
      // fallback timeout
      setTimeout(()=>{ res(); }, 2000);
    });

    const w = dom.window;
    const overlay = w.document.getElementById('overlay');
    const iframe = w.document.getElementById('overlayIframe');
    const closeBtn = w.document.getElementById('closeBtn');

    console.log('Overlay element found?', !!overlay);
    console.log('Iframe found?', !!iframe);

    // Ensure OverlayManager exists
    console.log('OverlayManager present?', !!w.OverlayManager, typeof w.OverlayManager);

    // Open overlay via OverlayManager.open (should call openGame)
    try{
      if(w.OverlayManager && typeof w.OverlayManager.open === 'function'){
        w.OverlayManager.open('./jeux2brainova.html', 'Test - jeux2');
      } else if(typeof w.openGame === 'function'){
        w.openGame('./jeux2brainova.html', 'Test - jeux2');
      } else {
        console.warn('No open API available — proceeding to set overlay active manually.');
        overlay.classList.add('active');
        iframe.src = './jeux2brainova.html';
      }
    }catch(e){ console.warn('open failed', e.message); overlay.classList.add('active'); iframe.src = './jeux2brainova.html'; }

    // Wait a bit
    await new Promise(r=>setTimeout(r,200));
    console.log('Overlay active before postMessage?', overlay.classList.contains('active'));

    // Simulate iframe posting a close message to parent
    try{
      // simulate from child: use window.postMessage (jsdom treats same window)
      w.postMessage({ action: 'close', reason: 'test', source: 'test-child' }, '*');
    }catch(e){ console.error('postMessage failed', e.message); }

    // wait a bit for handler
    await new Promise(r=>setTimeout(r,200));

    console.log('Overlay active after postMessage?', overlay.classList.contains('active'), 'iframe.src=', iframe.src);

    // Now simulate standalone fallback: emulate that window.parent === window scenario by evaluating closePlatform in a mimicked game page
    const gameFile = path.resolve(__dirname, '..', 'jeux2brainova.html');
    const gameHtml = fs.readFileSync(gameFile, 'utf8');
    const gameDom = new JSDOM(gameHtml, { url: 'http://127.0.0.1:8080/jeux2brainova.html', runScripts: 'dangerously', resources: 'usable' });
    await new Promise(res=>{ gameDom.window.addEventListener('DOMContentLoaded', ()=>setTimeout(res, 200)); setTimeout(res, 2000); });

    // Check that closePlatform exists and when called it navigates to brainova.html
    if(typeof gameDom.window.closePlatform === 'function'){
      // override location.href to capture navigation
      const nav = { href: null };
      Object.defineProperty(gameDom.window, 'location', { value: nav, writable: true });
      gameDom.window.closePlatform();
      await new Promise(r=>setTimeout(r,100));
      console.log('Standalone closePlatform navigated to:', nav.href);
    } else {
      console.warn('closePlatform() not found in jeux2brainova.html');
    }

    dom.window.close();
    gameDom.window.close();
    process.exit(0);
  }catch(err){
    console.error('Test failed:', err && err.stack || err);
    process.exit(2);
  }
})();
