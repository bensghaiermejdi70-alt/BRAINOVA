const http = require('http');
function check(port){
  return new Promise((resolve)=>{
    const options = { method: 'HEAD', hostname: '127.0.0.1', port, path: '/global_platform.html', timeout: 2000 };
    const req = http.request(options, (res)=>{
      resolve({ port, ok: true, statusCode: res.statusCode, headers: res.headers });
    });
    req.on('error', (e)=> resolve({ port, ok: false, error: String(e) }));
    req.on('timeout', ()=>{ req.destroy(); resolve({ port, ok: false, error: 'timeout' }); });
    req.end();
  });
}
(async ()=>{
  const ports = [8080,8081];
  for(const p of ports){
    const r = await check(p);
    console.log(JSON.stringify(r));
  }
})();
