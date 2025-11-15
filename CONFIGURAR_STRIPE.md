# ⚡ Configuração Rápida do Stripe (5 minutos)

## 🎯 O Que Você Precisa Fazer

### **Opção 1: Script Automático (Recomendado)**

```bash
node setup-stripe.js
```

O script vai pedir 3 informações e configurar tudo automaticamente.

---

### **Opção 2: Manual (se preferir)**

#### **1️⃣ Pegar Service Role Key**

```
https://supabase.com/dashboard/project/tzdatllacntstuaoabou/settings/api
```

Clique em **"Reveal"** na chave `service_role` e copie.

#### **2️⃣ Criar Produtos no Stripe**

Acesse: https://dashboard.stripe.com/products

**CERTIFIQUE-SE QUE ESTÁ EM MODO LIVE (não test)**

**Produto 1: Plano Mensal**
```
Nome: Mentoria MASTER CLASS - Mensal
Preço: R$ 208,00
Billing: Monthly
Currency: BRL
```
→ Copie o **Price ID** (price_...)

**Produto 2: Pagamento Único**
```
Nome: Mentoria MASTER CLASS - Pagamento Único
Preço: R$ 2.500,00
Billing: One time
Currency: BRL
```
→ Copie o **Price ID** (price_...)

#### **3️⃣ Configurar Variáveis**

**A. Criar `.env.local`:**

```bash
# Supabase
VITE_SUPABASE_URL=https://tzdatllacntstuaoabou.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6ZGF0bGxhY250c3R1YW9hYm91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MzYwMDYsImV4cCI6MjA3ODUxMjAwNn0.SGB352z9MHTyY130M6T_tMNRm3pZfsQvRSeE5E0fbF8

# Stripe (PRODUÇÃO)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51ST3LFIE9hS1TW2fvQgym2Fd0gvN57iQOwM06CnAGjJXjHpFwqFmayDao08EBBtbW91l6dYPTvhRncBD9qRXfpFi00XAAksIJG
```

**B. Atualizar `src/lib/stripe.ts`:**

```typescript
export const STRIPE_PRICES = {
  MONTHLY: "price_SEU_ID_MENSAL_AQUI",     // ← Cole aqui
  ONE_TIME: "price_SEU_ID_UNICO_AQUI",     // ← Cole aqui
} as const;
```

**C. Adicionar Secrets no Supabase (PowerShell):**

```powershell
# SUPABASE_URL
npx supabase secrets set SUPABASE_URL=https://tzdatllacntstuaoabou.supabase.co --project-ref tzdatllacntstuaoabou

# SUPABASE_SERVICE_ROLE_KEY (substitua pelo valor real)
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=SUA_SERVICE_ROLE_KEY_AQUI --project-ref tzdatllacntstuaoabou
```

#### **4️⃣ Verificar Configuração**

```powershell
# Listar todas as secrets configuradas
npx supabase secrets list --project-ref tzdatllacntstuaoabou
```

Deve mostrar:
- ✅ STRIPE_SECRET_KEY
- ✅ STRIPE_WEBHOOK_SECRET  
- ✅ SUPABASE_URL
- ✅ SUPABASE_SERVICE_ROLE_KEY

#### **5️⃣ Testar**

```bash
npm run dev
```

Acesse `localhost:5173`, clique em "Garantir Minha Vaga" e faça um teste!

---

## 🔍 Monitorar Logs

```bash
npx supabase functions logs stripe-webhook --project-ref tzdatllacntstuaoabou
```

---

## ✅ Checklist Final

- [ ] Service Role Key obtida
- [ ] 2 Produtos criados no Stripe (modo LIVE)
- [ ] 2 Price IDs copiados
- [ ] `.env.local` criado
- [ ] `src/lib/stripe.ts` atualizado com Price IDs reais
- [ ] Secrets adicionados no Supabase
- [ ] Teste realizado com sucesso

---

## 🚨 Troubleshooting

**Erro: "Missing SUPABASE_SERVICE_ROLE_KEY"**
→ Execute os comandos `npx supabase secrets set` novamente

**Webhook não funciona**
→ Ver logs: `npx supabase functions logs stripe-webhook --project-ref tzdatllacntstuaoabou`

**Price ID inválido**
→ Certifique-se que criou os produtos em **MODO LIVE**, não test

---

**Precisa de ajuda?** Veja: `STRIPE_SETUP.md` (guia completo)


