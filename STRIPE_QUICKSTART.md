# ⚡ Guia Rápido - Stripe em Produção

## 🎯 Objetivo
Colocar o Stripe funcionando em **PRODUÇÃO** (pagamentos reais) em 10 passos.

---

## ✅ Checklist Rápido

### 1️⃣ Criar `.env.local` na raiz

```bash
VITE_SUPABASE_URL=https://tzdatllacntstuaoabou.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6ZGF0bGxhY250c3R1YW9hYm91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MzYwMDYsImV4cCI6MjA3ODUxMjAwNn0.SGB352z9MHTyY130M6T_tMNRm3pZfsQvRSeE5E0fbF8
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51ST3LFIE9hS1TW2fvQgym2Fd0gvN57iQOwM06CnAGjJXjHpFwqFmayDao08EBBtbW91l6dYPTvhRncBD9qRXfpFi00XAAksIJG
```

---

### 2️⃣ Adicionar 2 Secrets no Supabase

Vá em: **Supabase Dashboard → Settings → Edge Functions → Secrets**

```bash
SUPABASE_URL
https://tzdatllacntstuaoabou.supabase.co

SUPABASE_SERVICE_ROLE_KEY
[Pegar em: Supabase → Settings → API → service_role]
```

> Você já tem `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET` configurados ✅

---

### 3️⃣ Criar Produtos no Stripe (Modo LIVE)

**Produto 1: Plano Mensal**
- Dashboard → Products → Add product
- Nome: `Mentoria MASTER CLASS - Mensal`
- Preço: `R$ 208,00` / Monthly
- **COPIE O PRICE ID** (price_...)

**Produto 2: Pagamento Único**
- Nome: `Mentoria MASTER CLASS - Pagamento Único`
- Preço: `R$ 2.500,00` / One time
- **COPIE O PRICE ID** (price_...)

---

### 4️⃣ Atualizar Price IDs no Código

Edite `src/lib/stripe.ts`:

```typescript
export const STRIPE_PRICES = {
  MONTHLY: "price_SEU_ID_AQUI",    // ← Cole o Price ID mensal
  ONE_TIME: "price_SEU_ID_AQUI",   // ← Cole o Price ID único
} as const;
```

---

### 5️⃣ Instalar Supabase CLI

```bash
# Windows
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Mac/Linux
brew install supabase/tap/supabase
```

---

### 6️⃣ Deploy das Funções

```bash
# Login
supabase login

# Link ao projeto
supabase link --project-ref tzdatllacntstuaoabou

# Deploy
supabase functions deploy create-checkout
supabase functions deploy create-portal
supabase functions deploy stripe-webhook
```

---

### 7️⃣ Testar com R$ 1,00 (Recomendado)

1. **Criar produto de teste:**
   - Stripe → Products → Add product
   - Nome: "Teste - Apagar depois"
   - Preço: R$ 1,00
   - Copie Price ID

2. **Atualizar temporariamente em `src/lib/stripe.ts`:**
   ```typescript
   MONTHLY: "price_ID_DE_1_REAL",
   ```

3. **Testar:**
   ```bash
   npm run dev
   ```
   - Acesse `localhost:5173`
   - Clique em "Garantir Minha Vaga"
   - Use SEU CARTÃO (cobrará R$ 1,00)
   - Complete pagamento

4. **Verificar:**
   - Stripe Dashboard → Payments (deve aparecer R$ 1,00)
   - Supabase → Table Editor → subscriptions (deve ter 1 linha)
   - Terminal: `supabase functions logs stripe-webhook --live`

---

### 8️⃣ Se Teste OK, Voltar aos Valores Reais

Edite `src/lib/stripe.ts`:

```typescript
export const STRIPE_PRICES = {
  MONTHLY: "price_ID_REAL_MENSAL",
  ONE_TIME: "price_ID_REAL_UNICO",
} as const;
```

---

### 9️⃣ Build e Deploy

```bash
# Build
npm run build

# Deploy (exemplo Vercel)
vercel --prod
```

---

### 🔟 Monitoramento

- **Stripe Dashboard:** https://dashboard.stripe.com/payments
- **Supabase Logs:** `supabase functions logs stripe-webhook --live`
- **Webhook Status:** Stripe → Developers → Webhooks → mentoriamaster

---

## 🚨 Troubleshooting Rápido

### Webhook não funciona
```bash
# Ver logs
supabase functions logs stripe-webhook --live

# Verificar se função está no ar
supabase functions list
```

### Subscription não é criada
- Verifique se `SUPABASE_SERVICE_ROLE_KEY` está correta
- Veja logs: `supabase functions logs stripe-webhook`

### Cliente não acessa conteúdo
- Verifique se subscription.status === "active"
- Veja Table Editor → subscriptions

---

## 📞 Precisa de Ajuda?

Veja o guia completo: `STRIPE_SETUP.md`


