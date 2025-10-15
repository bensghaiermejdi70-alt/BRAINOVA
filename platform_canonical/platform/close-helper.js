(function(){
  // Standard helper to close a game and return focus to the platform.
  // Usage: <script src="/platform/close-helper.js"></script>
  // then: <button onclick="__closeToPlatform('jeux1')">✕</button>
  function closeToPlatform(source){
    try{
      var payload = { action: 'close', source: source };
      // Prefer parent (iframe overlay)
      if(window.parent && window.parent !== window){
        window.parent.postMessage(payload, '*');
        return;
      }
      // Then opener (opened via window.open)
      if(window.opener && !window.opener.closed){
        try{ window.opener.postMessage(payload, '*'); return; }catch(e){}
      }
      // Finally, navigate to a known platform page as a fallback.
      var fallback = '/global_platform.html';
      if(window.location && window.location.origin){
        // Keep origin-relative path.
        window.location.href = fallback;
      } else {
        window.location.href = 'global_platform.html';
      }
    }catch(e){
      try{ window.location.href = '/global_platform.html'; }catch(_){}
    }
  }
  // Expose globally
  window.__closeToPlatform = closeToPlatform;
})();
