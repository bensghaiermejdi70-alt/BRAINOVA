#!/usr/bin/env node
// Petit utilitaire de synchronisation pour le dev
// Récupère périodiquement la version servie de `global_platform.html` et remplace
// le fichier local si le contenu a changé.

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

const argv = process.argv.slice(2);
const url = argv[0] || 'http://127.0.0.1:8080/brainova.html';
const localPath = argv[1] || path.resolve(__dirname, '..', 'global_platform.html');
const intervalSec = Number(argv[2] || 5);

console.log(`Sync tool: polling ${url} -> ${localPath} every ${intervalSec}s`);

function fetchUrl(u){
  return new Promise((resolve, reject) => {
    const lib = u.startsWith('https://') ? https : http;
    const req = lib.get(u, (res) => {
      if(res.statusCode >= 300 && res.statusCode < 400 && res.headers.location){
        // follow redirect
        resolve(fetchUrl(res.headers.location));
        return;
      }
      if(res.statusCode !== 200){
        reject(new Error('HTTP '+res.statusCode));
        res.resume();
        return;
      }
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.setTimeout(5000, () => { req.abort(); reject(new Error('timeout')); });
  });
}

let lastHash = null;
const crypto = require('crypto');

async function checkOnce(){
  try{
    const html = await fetchUrl(url);
    const hash = crypto.createHash('sha256').update(html).digest('hex');
    if(hash !== lastHash){
      // compare with file content to avoid overwriting unintended local edits
      let localContent = null;
      try{ localContent = fs.readFileSync(localPath, 'utf8'); }catch(e){ /* file not found */ }
      const localHash = localContent ? crypto.createHash('sha256').update(localContent).digest('hex') : null;
      if(localHash !== hash){
        fs.writeFileSync(localPath, html, 'utf8');
        console.log(new Date().toISOString(), 'Updated local file from', url);
      }else{
        // local already identical
      }
      lastHash = hash;
    }
  }catch(err){
    process.stdout.write('.'); // small heartbeat
  }
}

(async function(){
  // initial check
  await checkOnce();
  setInterval(checkOnce, intervalSec * 1000);
})();
