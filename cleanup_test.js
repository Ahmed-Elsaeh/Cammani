const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'apps/api/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function cleanup() {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('email', 'test@example.com');
  
  if (error) {
    console.error('Error cleaning up:', error);
  } else {
    console.log('Cleaned up test@example.com');
  }
}

cleanup();
