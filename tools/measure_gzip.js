#!/usr/bin/env node
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

function measure(filePath){
  const full = path.resolve(filePath);
  if(!fs.existsSync(full)){
    console.error('MISSING', filePath); return null;
  }
  const buf = fs.readFileSync(full);
  const gz = zlib.gzipSync(buf);
  return { path: filePath, bytes: buf.length, kb: (buf.length/1024).toFixed(2), gzBytes: gz.length, gzKB: (gz.length/1024).toFixed(2) };
}

const targets = process.argv.slice(2);
if(targets.length===0) targets.push('checkout-success.html','global_platform_correct.html');
const results = targets.map(measure).filter(Boolean);
console.log(JSON.stringify(results, null, 2));
