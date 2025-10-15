const fs = require('fs');
['jeux13.html','jeux20.html'].forEach(f=>{
  try{ const b = fs.readFileSync(require('path').join(__dirname,'..',f)); console.log(f, b.length); }catch(e){ console.error('ERR', f, e.message) }
})
