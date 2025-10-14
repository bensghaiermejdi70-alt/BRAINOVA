const http = require('http');
const fs = require('fs');
const path = require('path');

// Bind to all interfaces to avoid localhost binding issues on some Windows setups
const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT ? parseInt(process.env.PORT,10) : (process.argv[2] ? parseInt(process.argv[2],10) : 8000);
const ROOT = path.resolve(__dirname);

const MIME = {
  '.html': 'text/html',
  '.htm': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain'
};

function contentType(filePath){
  const ext = path.extname(filePath).toLowerCase();
  return MIME[ext] || 'application/octet-stream';
}

const server = http.createServer((req, res) => {
  try{
    // Log incoming requests to help debug missing files when testing on different loopback IPs
    try{ console.log(`[req] ${req.method} ${req.url}`); }catch(e){}
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    let safePath = urlPath.replace(/\.{2,}/g,'');
  if(safePath === '/' || safePath === '') safePath = '/brainova.html';
    let filePath = path.join(ROOT, safePath.replace(/^\//, ''));
    // If the path is a directory, try index.html
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      const index = path.join(filePath, 'index.html');
      if (fs.existsSync(index)) {
        sendFile(index, res);
        return;
      }
    }

    // If the exact file doesn't exist, try common fallbacks for extensionless requests
    if (!fs.existsSync(filePath)){
      const ext = path.extname(filePath);
      if (!ext) {
        const tryExts = ['.html', '.htm', '.html.html'];
        let found = null;
        for (let e of tryExts) {
          const candidate = filePath + e;
          if (fs.existsSync(candidate)) { found = candidate; break; }
        }
        if (found) {
          filePath = found;
        }
      }
    }

    if (!fs.existsSync(filePath)){
      res.statusCode = 404;
      res.setHeader('Content-Type','text/plain');
      try{ console.log('[res] 404', filePath); }catch(e){}
      res.end('Not found');
      return;
    }

    sendFile(filePath, res);
  }catch(err){
    res.statusCode = 500; res.setHeader('Content-Type','text/plain'); res.end('Server error');
  }
});

function sendFile(filePath, res){
  const stream = fs.createReadStream(filePath);
  stream.on('open', ()=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', contentType(filePath));
    try{ console.log('[res] 200', filePath); }catch(e){}
    stream.pipe(res);
  });
  stream.on('error', (e)=>{
    res.statusCode = 500;
    res.setHeader('Content-Type','text/plain');
    res.end('Server error');
  });
}

server.listen(PORT, HOST, ()=>{
  console.log(`Static server running at http://${HOST}:${PORT}/`);
  console.log(`Serving from ${ROOT}`);
});

process.on('SIGINT', ()=>{ server.close(()=>process.exit(0)); });
