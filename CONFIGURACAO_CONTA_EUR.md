# 🔄 Configuração Nova Conta Stripe (EUR)

## ✅ **O QUE JÁ FOI ATUALIZADO:**

### **1. Price IDs no Código** ✅
```typescript
// src/lib/stripe.ts
PRODUCT_ID: "prod_TPrQBOCZWZedpt"
ONE_TIME: "price_1ST1hXK7zFdJhUJSFhUNyyWO"
```

### **2. Webhook Secret no Supabase** ✅
```
STRIPE_WEBHOOK_SECRET: whsec_tYZrkbxNsBxgLcbXpo4EUhTfjkBUHFik
```

---

## ⚠️ **FALTAM AS CHAVES API:**

Para finalizar, você precisa fornecer as chaves da **nova conta EUR**:

### **1. Acesse o Dashboard da Conta EUR**

Acesse: https://dashboard.stripe.com/apikeys

**Certifique-se que:**
- ✅ Está logado na conta EUR
- ✅ Está em modo **LIVE** (não test)

### **2. Copie as Chaves**

Você vai ver:
- **Publishable key:** `pk_live_...` (começa com pk_live_)
- **Secret key:** `sk_live_...` (começa com sk_live_, precisa clicar em "Reveal")

---

## 🔧 **CONFIGURE AS CHAVES:**

### **Passo 1: Configurar Secret Key no Supabase**

**No PowerShell:**

```powershell
cd c:\Users\jpber\Documents\regal-learn-stream

# Substitua pela sua Secret Key da conta EUR
npx supabase secrets set STRIPE_SECRET_KEY="sk_live_SUA_CHAVE_AQUI" --project-ref tzdatllacntstuaoabou

# Verificar se foi configurado
npx supabase secrets list --project-ref tzdatllacntstuaoabou
```

### **Passo 2: Atualizar .env.local**

**No PowerShell:**

```powershell
# Substitua pela sua Publishable Key da conta EUR
@"
VITE_SUPABASE_URL=https://tzdatllacntstuaoabou.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6ZGF0bGxhY250c3R1YW9hYm91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MzYwMDYsImV4cCI6MjA3ODUxMjAwNn0.SGB352z9MHTyY130M6T_tMNRm3pZfsQvRSeE5E0fbF8
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_SUA_CHAVE_AQUI
"@ | Out-File -FilePath .env.local -Encoding ASCII -NoNewline
```

### **Passo 3: Reiniciar Servidor**

```powershell
# Se estiver rodando, pare (Ctrl+C) e inicie novamente:
npm run dev
```

---

## 🔍 **CONFIGURAR WEBHOOK NO STRIPE (Conta EUR):**

### **1. Acesse Webhooks**

https://dashboard.stripe.com/webhooks

**Certifique-se:**
- ✅ Está na conta EUR
- ✅ Está em modo LIVE

### **2. Criar Endpoint (se não existir)**

1. Clique em **"Add endpoint"**
2. **Endpoint URL:**
   ```
   https://tzdatllacntstuaoabou.supabase.co/functions/v1/stripe-webhook
   ```
3. **Events to send:**
   - Selecione: `checkout.session.completed`
   - Selecione: `customer.subscription.updated`
   - Selecione: `customer.subscription.deleted`
   - Selecione: `invoice.payment_succeeded`
   - Selecione: `invoice.payment_failed`
4. Clique em **"Add endpoint"**

### **3. Verificar Webhook Secret**

Após criar, você verá:
- **Signing secret:** `whsec_...`

Se for diferente de `whsec_tYZrkbxNsBxgLcbXpo4EUhTfjkBUHFik`, atualize:

```powershell
npx supabase secrets set STRIPE_WEBHOOK_SECRET="whsec_O_QUE_APARECER_AQUI" --project-ref tzdatllacntstuaoabou
```

---

## 🧪 **TESTAR:**

### **1. Recarregue o Site**
```
http://localhost:8081
```
Pressione: `Ctrl + Shift + R` (force refresh)

### **2. Clique em "Garantir Minha Vaga"**

### **3. No Console (F12), execute:**

```javascript
fetch('https://tzdatllacntstuaoabou.supabase.co/functions/v1/create-checkout', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6ZGF0bGxhY250c3R1YW9hYm91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MzYwMDYsImV4cCI6MjA3ODUxMjAwNn0.SGB352z9MHTyY130M6T_tMNRm3pZfsQvRSeE5E0fbF8'
  },
  body: JSON.stringify({
    priceId: 'price_1ST1hXK7zFdJhUJSFhUNyyWO',
    mode: 'payment',
    anonymous: true
  })
})
.then(r => r.json())
.then(d => {
  if (d.error) {
    console.error('❌ ERRO:', d.error, '\n📝 Detalhes:', d.details);
  } else {
    console.log('✅ SUCESSO! Redirecionando...');
    window.location.href = d.url;
  }
})
```

**Se der sucesso:** Você será redirecionado para o Stripe Checkout!

---

## 📊 **CHECKLIST DE CONFIGURAÇÃO:**

### **Configurado:**
- [x] Product ID atualizado
- [x] Price ID atualizado
- [x] Webhook Secret atualizado

### **FALTA:**
- [ ] Copiar Secret Key (`sk_live_...`) da conta EUR
- [ ] Configurar no Supabase (`secrets set`)
- [ ] Copiar Publishable Key (`pk_live_...`) da conta EUR
- [ ] Atualizar `.env.local`
- [ ] Reiniciar servidor (`npm run dev`)
- [ ] Configurar webhook no dashboard (se não tiver)
- [ ] Testar o fluxo completo

---

## 🆘 **ME ENVIE:**

Copie e me envie as chaves da conta EUR:

```
Secret Key: sk_live_...
Publishable Key: pk_live_...
```

**Ou** execute os comandos acima e me diga se funcionou!

---

## ⚠️ **IMPORTANTE:**

**Conta EUR vs Conta BRL:**
- Se o produto na conta EUR estiver em EUR, vai cobrar em EUR
- Se estiver em BRL, vai cobrar em BRL
- Verifique o preço no produto para garantir que está correto!

---

**Aguardando as chaves API para finalizar a configuração!** 🚀


