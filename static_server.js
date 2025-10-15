const http = require('http');
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const port = process.env.PORT ? parseInt(process.env.PORT,10) : 8080;
const HOST = process.env.HOST || '0.0.0.0';
const server = http.createServer((req, res) => {
  try{
    let reqPath = decodeURIComponent(req.url.split('?')[0]);
    if(reqPath === '/' ) reqPath = '/brainova.html';
    const filePath = path.join(root, reqPath);
    if(!filePath.startsWith(root)) { res.statusCode=403; res.end('Forbidden'); return; }
    fs.stat(filePath, (err, stats) => {
      if(err){ res.statusCode = 404; res.end('Not found'); return; }
      if(stats.isDirectory()){ res.statusCode = 403; res.end('Forbidden'); return; }
      if(req.method === 'HEAD') { res.statusCode = 200; res.end(); return; }
      const stream = fs.createReadStream(filePath);
      res.statusCode = 200;
      // Set content-type based on extension for better handling
      const ext = path.extname(filePath).toLowerCase();
      const mime = (ext === '.css') ? 'text/css' : (ext === '.js') ? 'application/javascript' : 'text/html; charset=utf-8';
      res.setHeader('Content-Type', mime);
      stream.pipe(res);
    });
  }catch(e){ res.statusCode=500; res.end('Server error'); }
});
server.listen(port, HOST, ()=>{ console.log('static-server: listening http://' + HOST + ':'+port); });
