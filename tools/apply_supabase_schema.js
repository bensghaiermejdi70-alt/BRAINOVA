const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

async function main(){
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!SUPABASE_URL || !SUPABASE_KEY){
    console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env');
    process.exit(1);
  }
  const sqlPath = path.join(__dirname, '..', 'netlify', 'supabase_schema.sql');
  if(!fs.existsSync(sqlPath)){
    console.error('Cannot find supabase_schema.sql at', sqlPath);
    process.exit(1);
  }
  const sql = fs.readFileSync(sqlPath, 'utf8');
  try{
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });
    // Supabase JS does not expose an arbitrary SQL runner; we will use the REST SQL endpoint
    // Build a request to /rest/v1/rpc (or use the SQL editor API). Simpler: use the SQL RPC via Postgres
    // However, supabase-js doesn't expose direct SQL execution. We'll fall back to POST to the SQL endpoint.

    // Use the SQL API: POST to `${SUPABASE_URL}/rest/v1/rpc` isn't correct. Instead use the PostgREST SQL function: /rpc
    // The reliable way without additional libs: call the Supabase SQL Admin endpoint using the service role key via fetch.

    const fetch = require('node-fetch');
    const url = SUPABASE_URL.replace(/\/$/, '') + '/sql';
    // Many Supabase projects use /rest/v1 or /rpc; the SQL admin endpoint is not public. We'll attempt the 'query' endpoint.
    // Safer: use the Postgres direct client via 'pg' if available. We'll try using 'pg' if installed.
    let pg;
    try{
      pg = require('pg');
    }catch(e){
      console.warn('pg not installed, falling back to REST (may fail). To be robust, install pg (npm i pg)');
    }

    if(pg){
      const { Client } = pg;
      const connectionString = process.env.SUPABASE_DB_URL || process.env.SUPABASE_CONNECTION_STRING;
      if(!connectionString){
        console.error('pg available but SUPABASE_DB_URL / SUPABASE_CONNECTION_STRING not set. Set one or install Postgres connection string env var.');
        process.exit(1);
      }
      const client = new Client({ connectionString });
      await client.connect();
      console.log('Connected to Postgres, executing SQL...');
      await client.query(sql);
      await client.end();
      console.log('Schema applied successfully');
      process.exit(0);
    }else{
      // Attempt to use the Supabase REST SQL endpoint (unsupported for many projects) by calling /rest/v1/rpc
      console.log('Attempting REST fallback; this may fail depending on Supabase project settings.');
      const resp = await fetch(SUPABASE_URL + '/rest/v1/rpc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/sql',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        },
        body: sql
      });
      const text = await resp.text();
      if(!resp.ok){
        console.error('REST fallback failed', resp.status, text);
        process.exit(1);
      }
      console.log('Schema applied via REST fallback:', text);
      process.exit(0);
    }

  }catch(err){
    console.error('Error applying schema', err);
    process.exit(1);
  }
}

main();
