const { createClient } = require('@supabase/supabase-js');

let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
}

exports.handler = async function(event, context) {
  if (!supabase) return { statusCode: 500, body: JSON.stringify({ error: 'Supabase not configured' }) };
  const params = event.queryStringParameters || {};
  const email = params.email;
  const session_id = params.session_id;
  const game_id = params.game_id;

  try {
    if (email && game_id) {
      // check if this email bought this game_id
      const { data, error } = await supabase.from('purchases').select('*').eq('customer_email', email).eq('game_id', String(game_id));
      if (error) return { statusCode: 500, body: JSON.stringify({ error }) };
      return { statusCode: 200, body: JSON.stringify({ purchased: (data && data.length>0), purchases: data }) };
    }
    if (email) {
      const { data, error } = await supabase.from('purchases').select('*').eq('customer_email', email);
      if (error) return { statusCode: 500, body: JSON.stringify({ error }) };
      return { statusCode: 200, body: JSON.stringify({ purchases: data }) };
    }
    if (session_id) {
      const { data, error } = await supabase.from('purchases').select('*').eq('session_id', session_id);
      if (error) return { statusCode: 500, body: JSON.stringify({ error }) };
      return { statusCode: 200, body: JSON.stringify({ purchases: data }) };
    }
    return { statusCode: 400, body: JSON.stringify({ error: 'email or session_id required' }) };
  } catch (err) {
    console.error('check-purchase error', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
