const http = require('http');
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const port = 8080;
const server = http.createServer((req, res) => {
  try{
    let urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (urlPath === '/') urlPath = '/global_platform.html';
    const file = path.join(root, urlPath);
    fs.stat(file, (err, st) => {
      if (err) { res.statusCode = 404; res.end('Not found'); return; }
      if (req.method === 'HEAD') { res.statusCode = 200; res.end(); return; }
      const stream = fs.createReadStream(file);
      res.statusCode = 200;
      stream.pipe(res);
    });
  }catch(e){ res.statusCode=500; res.end('server error'); }
});
server.listen(port, '127.0.0.1', () => console.log(`node-server: serving ${root} on http://127.0.0.1:${port}`));
process.on('uncaughtException', e => { console.error('uncaught', e); });
