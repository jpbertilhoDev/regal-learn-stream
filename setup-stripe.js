/**
 * Script de Configuração Automática do Stripe
 * 
 * Este script configura automaticamente as variáveis necessárias
 * para o funcionamento do Stripe em produção.
 * 
 * USO:
 * node setup-stripe.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setup() {
  console.log('\n🎓 Configuração do Stripe - Mentoria Master Class\n');
  console.log('Este script vai configurar todas as variáveis necessárias.\n');

  // 1. Coletar informações
  console.log('📋 Coletando informações necessárias...\n');
  
  const serviceRoleKey = await question('1️⃣  Service Role Key do Supabase: ');
  const priceIdMonthly = await question('2️⃣  Price ID Mensal (price_...): ');
  const priceIdOneTime = await question('3️⃣  Price ID Pagamento Único (price_...): ');

  // 2. Criar arquivo .env.local
  console.log('\n📝 Criando arquivo .env.local...');
  
  const envContent = `# Supabase
VITE_SUPABASE_URL=https://tzdatllacntstuaoabou.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6ZGF0bGxhY250c3R1YW9hYm91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MzYwMDYsImV4cCI6MjA3ODUxMjAwNn0.SGB352z9MHTyY130M6T_tMNRm3pZfsQvRSeE5E0fbF8

# Stripe (PRODUÇÃO)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51ST3LFIE9hS1TW2fvQgym2Fd0gvN57iQOwM06CnAGjJXjHpFwqFmayDao08EBBtbW91l6dYPTvhRncBD9qRXfpFi00XAAksIJG
`;

  fs.writeFileSync('.env.local', envContent);
  console.log('✅ Arquivo .env.local criado!');

  // 3. Atualizar Price IDs no código
  console.log('\n📝 Atualizando Price IDs no código...');
  
  const stripeTsPath = path.join('src', 'lib', 'stripe.ts');
  const stripeTsContent = `// Stripe Price IDs - Configurado automaticamente
export const STRIPE_PRICES = {
  // Monthly subscription
  MONTHLY: "${priceIdMonthly}",

  // One-time payment option
  ONE_TIME: "${priceIdOneTime}",
} as const;

// Product details matching your landing page
export const PRODUCTS = {
  MASTER_CLASS: {
    monthly: {
      priceId: STRIPE_PRICES.MONTHLY,
      amount: 208,
      currency: "BRL",
      interval: "month",
      displayPrice: "R$ 208",
    },
    oneTime: {
      priceId: STRIPE_PRICES.ONE_TIME,
      amount: 2500,
      currency: "BRL",
      interval: null,
      displayPrice: "R$ 2.500",
    },
  },
} as const;
`;

  fs.writeFileSync(stripeTsPath, stripeTsContent);
  console.log('✅ Price IDs atualizados em src/lib/stripe.ts!');

  // 4. Criar arquivo com comandos para adicionar secrets
  console.log('\n📝 Criando comandos para configurar Supabase Secrets...');
  
  const commandsContent = `# Comandos para Adicionar Secrets no Supabase
# Execute estes comandos no PowerShell:

# 1. SUPABASE_URL
npx supabase secrets set SUPABASE_URL=https://tzdatllacntstuaoabou.supabase.co --project-ref tzdatllacntstuaoabou

# 2. SUPABASE_SERVICE_ROLE_KEY
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey} --project-ref tzdatllacntstuaoabou

# Para verificar as secrets configuradas:
npx supabase secrets list --project-ref tzdatllacntstuaoabou
`;

  fs.writeFileSync('configure-supabase-secrets.txt', commandsContent);
  console.log('✅ Comandos salvos em configure-supabase-secrets.txt!');

  // 5. Resumo final
  console.log('\n\n✅ ========================================');
  console.log('✅ CONFIGURAÇÃO CONCLUÍDA COM SUCESSO!');
  console.log('✅ ========================================\n');

  console.log('📁 Arquivos criados/atualizados:');
  console.log('   ✅ .env.local');
  console.log('   ✅ src/lib/stripe.ts');
  console.log('   ✅ configure-supabase-secrets.txt\n');

  console.log('🎯 Próximos passos:\n');
  console.log('1️⃣  Execute os comandos do arquivo configure-supabase-secrets.txt');
  console.log('   (copie e cole no PowerShell)\n');
  
  console.log('2️⃣  Teste a aplicação:');
  console.log('   npm run dev\n');
  
  console.log('3️⃣  Monitore os logs do webhook:');
  console.log('   npx supabase functions logs stripe-webhook --project-ref tzdatllacntstuaoabou\n');

  console.log('📚 Documentação completa: STRIPE_SETUP.md\n');

  rl.close();
}

setup().catch(console.error);


