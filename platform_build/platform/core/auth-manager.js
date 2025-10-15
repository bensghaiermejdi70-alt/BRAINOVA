// Minimal session-only AuthManager for the static platform
// Contract:
// - Child auth pages must postMessage({ action: 'login-success', user }) to parent on success
// - Parent will store session in sessionStorage under 'brainovaSession' and expose AuthManager.getSession()
// - Parent and children can call window.postMessage({ action: 'logout' }) to request logout

(function(window){
  if(window.AuthManager) return; // already loaded

  const KEY = 'brainovaSession';

  const withinIframe = () => window.self !== window.top;

  const saveSession = (user)=>{
    try{ sessionStorage.setItem(KEY, JSON.stringify(user)); }catch(e){}
  };

  const clearSession = ()=>{
    try{ sessionStorage.removeItem(KEY); }catch(e){}
  };

  const getSession = ()=>{
    try{ const s = sessionStorage.getItem(KEY); return s ? JSON.parse(s) : null; }catch(e){ return null; }
  };

  // Open an auth URL in overlay if OverlayManager exists, otherwise open new tab
  const openAuthUrl = (url, title)=>{
    try{
      if(window.OverlayManager && typeof window.OverlayManager.open === 'function'){
        window.OverlayManager.open(url, title||'Connexion');
        return;
      }
    }catch(e){}
    try{ window.open(url, '_blank'); }catch(e){}
  };

  const handleMessage = (ev)=>{
    if(!ev || !ev.data) return;
    let data = ev.data;
    if(typeof data === 'string'){
      try{ data = JSON.parse(data); }catch(e){ return; }
    }
    if(!data || typeof data !== 'object') return;
    const action = (data.action || '').toString().toLowerCase();
    if(action === 'login-success'){
        const user = data.user || {};
        saveSession(user);
        // merge into session-scoped demo users so overlayed connexion/inscription pages can share them
        try{
          const key = 'brainova_demo_users';
          const raw = sessionStorage.getItem(key);
          const map = raw ? JSON.parse(raw) : {};
          if(user && user.email){
            const em = String(user.email).toLowerCase();
            const existing = map[em] || {};
            // preserve existing password if present, otherwise take from posted user (if any)
            const password = existing.password || user.password || (data && data.meta && data.meta.password) || undefined;
            map[em] = { name: user.name || existing.name || '', email: user.email, avatar: user.avatar || existing.avatar || '', id: user.id || existing.id || ('u_'+Date.now()) };
            if(password) map[em].password = password;
            sessionStorage.setItem(key, JSON.stringify(map));
          }
        }catch(e){}
      // update UI if app provided callback
      try{ if(typeof window.onAuthChange === 'function') window.onAuthChange(getSession()); }catch(e){}
    }
    if(action === 'logout'){
      clearSession();
      try{ if(typeof window.onAuthChange === 'function') window.onAuthChange(null); }catch(e){}
    }
  };

  window.addEventListener('message', handleMessage, false);

  window.AuthManager = {
    openAuth: openAuthUrl,
    getSession: getSession,
    logout: ()=>{ clearSession(); try{ if(window.OverlayManager) OverlayManager.close(); }catch(e){}; try{ window.postMessage({ action:'logout' }, '*'); }catch(e){} },
    _internal: { KEY }
  };

  // Auto attach small helper to header update if element exists
  function applySessionToHeader(){
    try{
      const u = getSession();
      const sigEl = document.getElementById('userSigle');
      if(!sigEl) return;
      if(u){
        const sig = (u.avatar && u.avatar.length>0) ? u.avatar : (u.name?u.name.split(' ').map(n=>n.charAt(0)).join('').toUpperCase():'');
        sigEl.textContent = sig; sigEl.style.display='flex';
      }else{ sigEl.style.display='none'; }
    }catch(e){}
  }

  // Expose hook used by pages to refresh header when session changes
  window.onAuthChange = function(){ applySessionToHeader(); };

  // run once on load
  setTimeout(applySessionToHeader, 100);

})(window);
