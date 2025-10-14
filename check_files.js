const http = require('http');
const paths = [
  '/brainova.html',
  '/jeux2brainova.html',
  '/jeux13.html',
  '/jeux20.html',
  '/carte_qi.html',
  '/connexion_et_profil.html',
  '/connexion et profil.html'
];
const host = '127.0.0.1';
const port = 8080;
function head(path){
  return new Promise((resolve)=>{
    const opts = { hostname: host, port, path, method: 'HEAD' };
    const req = http.request(opts, res => { resolve({path, status: res.statusCode}); });
    req.on('error', err => { resolve({path, error: err.message}); });
    req.end();
  });
}
(async ()=>{
  for(const p of paths){
    const r = await head(p);
    console.log(r.path, r.status || r.error);
  }
})();
