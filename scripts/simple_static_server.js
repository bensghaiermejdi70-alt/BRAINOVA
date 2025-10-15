const http = require('http');
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const port = 8080;
const host = '127.0.0.1';

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(root, reqPath);
  fs.stat(filePath, (err, stats) => {
    if (err) { res.statusCode = 404; res.end('Not found'); return; }
    let finalPath = filePath;
    if (stats.isDirectory()) finalPath = path.join(filePath, 'index.html');
    const ext = path.extname(finalPath).toLowerCase();
    res.setHeader('Content-Type', mime[ext] || 'application/octet-stream');
    fs.createReadStream(finalPath).pipe(res);
  });
});

server.listen(port, host, () => {
  console.log(`STATIC_SERVER: http://${host}:${port}`);
});
