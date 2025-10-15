const { createClient } = require('@supabase/supabase-js');

let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

exports.handler = async function(event) {
  // Support GET ?session_id=... or POST { session_id }
  const params = (event.httpMethod === 'GET') ? event.queryStringParameters || {} : JSON.parse(event.body || '{}');
  const sessionId = params.session_id || params.sessionId || null;
  const customerEmail = params.customer_email || params.customerEmail || null;

  if (!supabase) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: 'Supabase not configured' }) };
  }

  try {
    if (sessionId) {
      const { data, error } = await supabase.from('purchases').select('*').eq('session_id', sessionId).limit(1);
      if (error) return { statusCode: 500, body: JSON.stringify({ ok: false, error }) };
      const allowed = data && data.length > 0;
      return { statusCode: 200, body: JSON.stringify({ ok: true, allowed, row: data && data[0] || null }) };
    }

    if (customerEmail) {
      const { data, error } = await supabase.from('purchases').select('*').eq('customer_email', customerEmail).limit(1);
      if (error) return { statusCode: 500, body: JSON.stringify({ ok: false, error }) };
      const allowed = data && data.length > 0;
      return { statusCode: 200, body: JSON.stringify({ ok: true, allowed, row: data && data[0] || null }) };
    }

    return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'missing session_id or customer_email' }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: err.message || err }) };
  }
};
