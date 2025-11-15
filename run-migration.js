import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabaseUrl = 'https://tzdatllacntstuaoabou.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6ZGF0bGxhY250c3R1YW9hYm91Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjkzNjAwNiwiZXhwIjoyMDc4NTEyMDA2fQ.FUBo-wmGPtNCVyhZDKb3p5VnojUyK-inr47IMbkpU5s';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const sql = readFileSync('supabase/migrations/20241114_add_subscription_columns.sql', 'utf8');

console.log('Executando SQL...');
console.log(sql);
console.log('\n---\n');

// Execute SQL via RPC
const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

if (error) {
  console.error('❌ Erro:', error);
  process.exit(1);
} else {
  console.log('✅ SQL executado com sucesso!');
  console.log(data);
}


