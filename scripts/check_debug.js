const http = require('http');
const url = 'http://127.0.0.1:8000/brainova.html';
http.get(url, res=>{
  let buf='';
  res.on('data',d=>buf+=d.toString());
  res.on('end',()=>{
    const m1 = buf.match(/GamesIndex:\s*<span id="dbgGamesIndex">([^<]*)<\/span>/i);
    const m2 = buf.match(/OverlayManager:\s*<span id="dbgOverlay">([^<]*)<\/span>/i);
    const m3 = buf.match(/Last resolved:\s*<span id="dbgLastUrl">([^<]*)<\/span>/i);
    console.log('dbgGamesIndex=', m1?m1[1]:'(not found)');
    console.log('dbgOverlay=', m2?m2[1]:'(not found)');
    console.log('dbgLastUrl=', m3?m3[1]:'(not found)');
  });
}).on('error',e=>{ console.error('request error', e.message); process.exit(2); });
