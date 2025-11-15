# 🚨 ERRO 429 - RATE LIMITING

## O QUE É?

Erro **429 - Too Many Requests** significa que você atingiu o **limite de requisições** permitido por algum serviço em um período de tempo.

---

## 🔍 QUAL SERVIÇO ESTÁ BLOQUEANDO?

### **1. Abra o Console do Navegador (F12)**

1. Aperte `F12` no navegador
2. Vá para a aba **"Console"** ou **"Network"**
3. Procure por requisições com status **429**
4. Veja qual URL está retornando 429

---

## 📧 **SE FOR RESEND (Email):**

### **Limites do Plano Gratuito:**
- ✅ **100 emails por dia**
- ✅ **1 email por segundo**
- ✅ **Máximo 3.000 emails por mês**

### **URL Bloqueada:**
```
https://api.resend.com/emails
```

### **Solução:**

#### **Opção A: Aguardar**
```
⏰ Aguarde 1-2 minutos entre testes
🔄 Limite reseta a cada minuto
```

#### **Opção B: Ver Quantos Emails Você Enviou**
1. Acesse: https://resend.com/emails
2. Veja quantos emails foram enviados hoje
3. Se atingiu 100, aguarde até amanhã (reset às 00:00 UTC)

#### **Opção C: Upgrade do Plano (Produção)**
- Plano Pro: **$20/mês** → 50.000 emails/mês
- Link: https://resend.com/pricing

---

## 🔐 **SE FOR SUPABASE AUTH:**

### **Limites do Plano Gratuito:**
- ✅ **60 requisições por minuto** (por IP)
- ✅ **50.000 usuários ativos mensais**
- ✅ Rate limiting mais restrito para criação de usuários

### **URL Bloqueada:**
```
https://tzdatllacntstuaoabou.supabase.co/auth/v1/...
```

### **Solução:**

#### **Opção A: Aguardar**
```
⏰ Aguarde 5-10 minutos
🔄 Limite reseta automaticamente
```

#### **Opção B: Limpar Usuários de Teste**

1. Acesse: https://supabase.com/dashboard/project/tzdatllacntstuaoabou/auth/users

2. **Delete usuários de teste antigos:**
   - Selecione usuários com emails de teste
   - Clique em "Delete User"

3. **OU via SQL:**
   
```sql
-- ⚠️ CUIDADO: Isso deleta TODOS os usuários!
-- Use apenas em ambiente de TESTE!

-- Ver quantos usuários você tem:
SELECT COUNT(*) FROM auth.users;

-- Deletar usuários de teste específicos:
-- (NÃO PODE SER FEITO VIA SQL - apenas via Dashboard)
```

#### **Opção C: Usar Outro IP (VPN/Mobile)**
```
📱 Use internet móvel (4G/5G) temporariamente
🌐 Ou use uma VPN
🔄 Seu IP terá um limite novo
```

---

## 💳 **SE FOR STRIPE:**

### **Limites da API:**
- ✅ **100 requisições por segundo** (por chave)
- ✅ Muito difícil atingir em testes manuais

### **URL Bloqueada:**
```
https://api.stripe.com/v1/...
```

### **Solução:**

#### **Opção A: Aguardar**
```
⏰ Aguarde 1 minuto
🔄 Limite reseta automaticamente
```

#### **Opção B: Ver Suas Requisições**
1. Acesse: https://dashboard.stripe.com/test/logs
2. Veja quantas requisições foram feitas
3. Verifique se há algum loop infinito

---

## 🚀 **COMO EVITAR NO FUTURO:**

### **1. Intervalo Entre Testes**
```
✅ Aguarde 1-2 minutos entre cada teste de pagamento
✅ Não faça múltiplos pagamentos consecutivos
```

### **2. Limpar Dados de Teste Regularmente**
```
✅ Delete usuários de teste antigos
✅ Delete pagamentos de teste no Stripe
✅ Delete emails de teste no Resend
```

### **3. Usar Console para Debug (em vez de testar direto)**
```javascript
// Teste a criação de checkout sem completar pagamento:
const response = await fetch('https://tzdatllacntstuaoabou.supabase.co/functions/v1/create-checkout', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': 'sua_anon_key'
  },
  body: JSON.stringify({
    priceId: 'price_1STLpcK7zFdJhUJSvXM7o8Kk',
    mode: 'payment',
    anonymous: true
  })
});

const data = await response.json();
console.log(data);
// ✅ Você terá a URL do Stripe, mas NÃO precisa completar o pagamento
```

### **4. Usar Webhook Local (Stripe CLI)**

Em vez de testar via pagamento real toda vez:

```powershell
# Terminal 1 - Stripe CLI (escuta webhooks)
stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook

# Terminal 2 - Simular webhook (sem fazer pagamento)
stripe trigger checkout.session.completed
```

Isso **simula** o pagamento sem precisar criar usuário/enviar email toda vez!

---

## 🔍 **VERIFICAR LOGS EM TEMPO REAL:**

### **Logs do Webhook (Supabase):**
```powershell
npx supabase functions logs stripe-webhook --project-ref tzdatllacntstuaoabou
```

### **Emails Enviados (Resend):**
https://resend.com/emails

### **Usuários Criados (Supabase):**
https://supabase.com/dashboard/project/tzdatllacntstuaoabou/auth/users

### **Pagamentos (Stripe):**
https://dashboard.stripe.com/test/payments

---

## ⚡ **SOLUÇÃO RÁPIDA AGORA:**

### **Faça isso em ordem:**

1. ✅ **Aguarde 10 minutos** (deixa tudo resetar)

2. ✅ **Limpe usuários de teste:**
   - Acesse: https://supabase.com/dashboard/project/tzdatllacntstuaoabou/auth/users
   - Delete usuários com emails de teste

3. ✅ **Verifique Resend:**
   - Acesse: https://resend.com/emails
   - Veja se está próximo do limite (100/dia)

4. ✅ **Faça UM teste apenas:**
   - Use um email diferente
   - Complete o pagamento
   - Aguarde o email (pode demorar 2-3 minutos)
   - Não repita o teste imediatamente

5. ✅ **Se der erro 429 novamente:**
   - Aguarde até amanhã (reset diário)
   - Ou considere upgrade do Resend ($20/mês)

---

## 💡 **ALTERNATIVA: USAR STRIPE CLI PARA TESTES**

### **Instalar Stripe CLI:**
```powershell
# Windows (via Scoop)
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe

# Ou baixar direto:
# https://github.com/stripe/stripe-cli/releases/latest
```

### **Autenticar:**
```powershell
stripe login
```

### **Simular Webhook (sem pagar):**
```powershell
# Simula um pagamento completo
stripe trigger checkout.session.completed

# Isso vai:
# ✅ Chamar o webhook
# ✅ Criar usuário
# ✅ Enviar email
# ❌ Sem gastar seu limite de testes!
```

---

## 📊 **MONITORAR LIMITES:**

### **Resend:**
- Dashboard: https://resend.com/emails
- Limite visível: "X of 100 emails sent today"

### **Supabase:**
- Dashboard: https://supabase.com/dashboard/project/tzdatllacntstuaoabou/settings/billing
- Uso de API: Visível em "Usage"

### **Stripe:**
- Dashboard: https://dashboard.stripe.com/test/logs
- Requisições em tempo real

---

## 🎯 **RESUMO:**

### **O QUE FAZER AGORA:**
1. ⏰ **Aguarde 10 minutos**
2. 🧹 **Limpe usuários de teste**
3. 🧪 **Faça UM teste apenas**
4. ⏱️ **Aguarde 2 minutos entre testes**

### **PARA PRODUÇÃO:**
- 💰 Upgrade Resend: $20/mês (50k emails)
- 💰 Upgrade Supabase: $25/mês (se necessário)
- ✅ Rate limits muito maiores

### **BOA PRÁTICA:**
- ✅ Use Stripe CLI para testes repetidos
- ✅ Não teste direto com pagamento toda vez
- ✅ Mantenha intervalo de 1-2 min entre testes

---

**🚀 AGUARDE 10 MINUTOS E TENTE NOVAMENTE!** ⏱️

Se persistir, me avise qual URL está retornando 429! 🔍


