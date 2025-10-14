(function(){
  class OverlayManager{
    constructor(){
      this.overlay = null;
      this.iframe = null;
      this.create();
    }
    create(){
      this.overlay = document.createElement('div');
      this.overlay.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:10000;align-items:center;justify-content:center;';
      this.overlay.innerHTML = `<div style="position:relative;width:90%;height:90%;max-width:1400px;background:#000;border-radius:8px;overflow:hidden;">
        <button id="overlayCloseBtn" style="position:absolute;top:8px;right:8px;z-index:3;padding:8px 12px;">${window.getT('close')||'✖'}</button>
        <div id="overlayTitle" style="position:absolute;left:16px;top:8px;color:#fff;z-index:3;font-weight:700"></div>
        <iframe id="overlayIframe" style="width:100%;height:100%;border:0;background:#000" allowfullscreen></iframe>
        <!-- Non-blocking dialog container for messages proxied from iframe -->
        <div id="overlayDialog" style="display:none;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:10005;background:#fff;color:#000;padding:16px;border-radius:8px;max-width:80%;box-shadow:0 6px 24px rgba(0,0,0,0.6);">
          <div id="overlayDialogText" style="margin-bottom:12px;white-space:pre-wrap;color:#000;"></div>
          <div style="text-align:right"><button id="overlayDialogOk" style="padding:8px 12px;border-radius:6px;">OK</button></div>
        </div>
      </div>`;
      document.body.appendChild(this.overlay);
      this.iframe = this.overlay.querySelector('#overlayIframe');
      // Log iframe load and error events to ease debugging blank pages
      this.iframe.addEventListener('load', ()=>{
        try{ console.debug('Overlay iframe loaded:', this.iframe.src); }catch(e){}
        // After iframe loads, inject a small bridge so that iframe code that calls
        // alert/confirm/prompt will be intercepted and routed to the parent overlay
        // which shows a non-blocking inline modal. This prevents child pages from
        // blocking the parent and ensures the close flow always works.
        try{
          const bridge = `
            (function(){
              function send(type, text){
                const payload = { action: 'dialog', dialogType: type, text: String(text||'') };
                try{ parent.postMessage(payload, '*'); }catch(e){}
              }
              window.__platform_original_alert = window.alert;
              window.__platform_original_confirm = window.confirm;
              window.__platform_original_prompt = window.prompt;
              window.alert = function(msg){ send('alert', msg); };
              window.confirm = function(msg){ send('confirm', msg); return true; };
              window.prompt = function(msg, def){ send('prompt', msg+'\n(default: '+(def||'')+')'); return def||null; };
            })();
          `;
          // Try to write the bridge into the iframe. Use try/catch because cross-origin
          // frames will throw; in that case the iframe remains unmodified but behavior
          // falls back to postMessage-based dialog requests from the child.
          try{
            const doc = this.iframe.contentDocument || this.iframe.contentWindow.document;
            const script = doc.createElement('script');
            script.type = 'text/javascript';
            script.text = bridge;
            doc.head && doc.head.appendChild(script);
          }catch(e){ /* cross-origin or not ready yet - ignore */ }
        }catch(e){ /* ignore injection errors */ }
      });
      this.iframe.addEventListener('error', (ev)=>{
        try{ console.error('Overlay iframe failed to load:', this.iframe.src, ev); }catch(e){}
      });
      this.overlay.querySelector('#overlayCloseBtn').addEventListener('click', ()=>this.close());
      // dialog elements
      this.dialog = this.overlay.querySelector('#overlayDialog');
      this.dialogText = this.overlay.querySelector('#overlayDialogText');
      this.dialogOk = this.overlay.querySelector('#overlayDialogOk');
      this.dialogOk.addEventListener('click', ()=>{ this.dialog.style.display='none'; });
      this.overlay.addEventListener('click', (e)=>{ if(e.target===this.overlay) this.close(); });
      document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') this.close(); });
    }
    open(url, title){ this.iframe.src = url; this.overlay.querySelector('#overlayTitle').textContent = title||''; this.overlay.style.display='flex'; }
    close(){ this.iframe.src='about:blank'; this.overlay.style.display='none'; }
  }
  window.OverlayManager = new OverlayManager();
  // Listen for messages from child iframes so they can request actions
  window.addEventListener('message', (ev)=>{
    try{
      const data = ev.data || {};
      // support both stringified JSON and direct objects
      const payload = (typeof data === 'string') ? JSON.parse(data) : data;
      if(!payload || !payload.action) return;
      const action = payload.action;
      if(action === 'close' || action === 'go-home'){
        try{ window.OverlayManager.close(); }catch(e){}
      } else if(action === 'login-success'){
        // Bubble a login-success event on the window for the platform to react to
        try{ window.dispatchEvent(new CustomEvent('login-success', { detail: payload })); }catch(e){}
        try{ window.OverlayManager.close(); }catch(e){}
      } else if(action === 'dialog'){
        // payload: { action: 'dialog', dialogType: 'alert'|'confirm'|'prompt', text: '...' }
        try{
          const text = payload.text || '';
          // Show the non-blocking overlay dialog so the user is aware of messages from the game.
          try{
            window.OverlayManager.dialogText.textContent = text;
            window.OverlayManager.dialog.style.display = 'block';
          }catch(e){ /* ignore UI errors */ }
        }catch(e){ /* ignore malformed dialog payloads */ }
      }
    }catch(e){ /* ignore malformed messages */ }
  }, false);
})();