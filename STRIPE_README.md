# 💳 Integração Stripe - Mentoria Master Class

## 📁 Arquivos Criados

✅ **Documentação:**
- `STRIPE_SETUP.md` - Guia completo passo a passo (PRODUÇÃO)
- `STRIPE_QUICKSTART.md` - Guia rápido em 10 passos

✅ **Código:**
- `src/hooks/useRequireSubscription.tsx` - Hook para proteger rotas premium
- `src/pages/Success.tsx` - Página de confirmação após pagamento (já existia)
- `supabase/functions/stripe-webhook/index.ts` - Webhook handler (já existia)
- `supabase/functions/create-checkout/index.ts` - Criar sessão de checkout (já existia)
- `supabase/functions/create-portal/index.ts` - Portal do cliente (já existia)

---

## ⚡ Início Rápido

### 1. Configure Variáveis de Ambiente

**Frontend (.env.local):**
```bash
VITE_SUPABASE_URL=https://tzdatllacntstuaoabou.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6ZGF0bGxhY250c3R1YW9hYm91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MzYwMDYsImV4cCI6MjA3ODUxMjAwNn0.SGB352z9MHTyY130M6T_tMNRm3pZfsQvRSeE5E0fbF8
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51ST3LFIE9hS1TW2fvQgym2Fd0gvN57iQOwM06CnAGjJXjHpFwqFmayDao08EBBtbW91l6dYPTvhRncBD9qRXfpFi00XAAksIJG
```

**Backend (Supabase Dashboard):**
- ✅ `STRIPE_SECRET_KEY` (já configurado)
- ✅ `STRIPE_WEBHOOK_SECRET` (já configurado)
- ⚠️ `SUPABASE_URL` (FALTA)
- ⚠️ `SUPABASE_SERVICE_ROLE_KEY` (FALTA)

### 2. Crie Produtos no Stripe

1. Acesse: https://dashboard.stripe.com/products
2. **Certifique-se que está em MODO LIVE** (não test mode)
3. Crie 2 produtos:
   - Plano Mensal: R$ 208,00
   - Pagamento Único: R$ 2.500,00
4. **Copie os Price IDs**

### 3. Atualize Price IDs no Código

Edite `src/lib/stripe.ts`:
```typescript
export const STRIPE_PRICES = {
  MONTHLY: "price_SEU_ID_AQUI",
  ONE_TIME: "price_SEU_ID_AQUI",
} as const;
```

### 4. Deploy das Funções

```bash
supabase login
supabase link --project-ref tzdatllacntstuaoabou
supabase functions deploy create-checkout
supabase functions deploy create-portal
supabase functions deploy stripe-webhook
```

---

## 🧪 Como Testar

### Teste Seguro (R$ 1,00)

1. Crie produto temporário no Stripe por R$ 1,00
2. Use esse Price ID no código
3. Teste com seu próprio cartão
4. Verifique se webhook funciona
5. Volte aos valores reais

### Monitorar

```bash
# Logs em tempo real
supabase functions logs stripe-webhook --live

# Verificar funções deployadas
supabase functions list
```

---

## 🔐 Como Proteger Rotas Premium

Use o hook `useRequireSubscription`:

```typescript
import { useRequireSubscription } from "@/hooks/useRequireSubscription";

function MinhaRotaPremium() {
  const { hasAccess, loading } = useRequireSubscription();
  
  if (loading) return <Loading />;
  
  // Se não tem acesso, já foi redirecionado automaticamente
  return <ConteudoPremium />;
}
```

---

## 📊 Estrutura de Dados

### Tabela: `subscriptions`

```sql
user_id                  UUID        -- Referência ao usuário
stripe_customer_id       TEXT        -- ID do cliente no Stripe
stripe_subscription_id   TEXT        -- ID da subscription no Stripe
stripe_price_id          TEXT        -- Price ID do produto
stripe_product_id        TEXT        -- Product ID do produto
status                   TEXT        -- active, inactive, past_due, canceled, trialing
plan_type                TEXT        -- month, year, one_time
current_period_start     TIMESTAMP   -- Início do período atual
current_period_end       TIMESTAMP   -- Fim do período atual
cancel_at_period_end     BOOLEAN     -- Se vai cancelar no fim do período
```

### Tabela: `transactions`

```sql
user_id                  UUID        -- Referência ao usuário
subscription_id          UUID        -- Referência à subscription
stripe_payment_intent_id TEXT        -- ID do payment intent
stripe_invoice_id        TEXT        -- ID da invoice
amount                   DECIMAL     -- Valor em reais
currency                 TEXT        -- BRL
status                   TEXT        -- succeeded, pending, failed, refunded
description              TEXT        -- Descrição do pagamento
```

---

## 🔄 Fluxo de Pagamento

```
1. Cliente clica em "Garantir Minha Vaga"
   ↓
2. Frontend chama Edge Function create-checkout
   ↓
3. Stripe cria sessão de pagamento
   ↓
4. Cliente é redirecionado para Stripe Checkout
   ↓
5. Cliente preenche dados e paga
   ↓
6. Stripe processa pagamento
   ↓
7. 🔔 WEBHOOK: Stripe envia checkout.session.completed
   ↓
8. Edge Function stripe-webhook:
   - Cria usuário (se não existir)
   - Cria/atualiza subscription
   - Registra transaction
   ↓
9. Cliente é redirecionado para /success
   ↓
10. Cliente acessa conteúdo premium
```

---

## 🚨 Troubleshooting

| Problema | Solução |
|----------|---------|
| Webhook não funciona | Ver logs: `supabase functions logs stripe-webhook` |
| Subscription não criada | Verificar `SUPABASE_SERVICE_ROLE_KEY` |
| Cliente sem acesso | Verificar `subscription.status === "active"` |
| Erro 400 no webhook | Verificar `STRIPE_WEBHOOK_SECRET` |

---

## 📞 Links Úteis

- **Stripe Dashboard:** https://dashboard.stripe.com
- **Webhooks:** https://dashboard.stripe.com/webhooks
- **Supabase Dashboard:** https://supabase.com/dashboard/project/tzdatllacntstuaoabou
- **Documentação Stripe:** https://stripe.com/docs
- **Guia Completo:** Ver `STRIPE_SETUP.md`
- **Guia Rápido:** Ver `STRIPE_QUICKSTART.md`

---

## ✅ Status Atual

✅ Implementação completa do Stripe
✅ Webhook configurado
✅ Funções Supabase criadas
✅ Página de sucesso criada
✅ Hook de proteção de rotas criado
✅ Documentação completa

⚠️ **FALTA FAZER:**
1. Adicionar `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` no Supabase
2. Criar produtos no Stripe (modo LIVE)
3. Atualizar Price IDs no código
4. Deploy das funções
5. Teste completo

---

**Última atualização:** 14 de novembro de 2025


