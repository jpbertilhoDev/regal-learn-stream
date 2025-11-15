# 🔍 DEBUG ERRO 429 - Apenas 2 Testes

## ❓ SITUAÇÃO:

Erro 429 aparecendo após apenas **2 testes**, então **NÃO é limite do Resend**.

Precisamos descobrir qual serviço está bloqueando!

---

## 📋 **CHECKLIST DE INVESTIGAÇÃO:**

### **1. Identificar URL Exata (CRÍTICO)**

```
✅ Abra F12
✅ Vá para aba "Network"
✅ Procure requisição com status 429 (vermelha)
✅ Clique nela
✅ Copie "Request URL"
```

**Possíveis URLs:**

#### **A. Supabase Auth:**
```
https://tzdatllacntstuaoabou.supabase.co/auth/v1/admin/users
→ Limite de criação de usuários (2-3 por minuto)
```

#### **B. Supabase Edge Function:**
```
https://tzdatllacntstuaoabou.supabase.co/functions/v1/create-checkout
→ Limite de invocações
```

#### **C. Stripe API:**
```
https://api.stripe.com/v1/payment_methods
→ Limite de pagamentos
```

#### **D. Stripe Checkout:**
```
https://js.stripe.com/v3/...
→ Rate limit do Stripe.js
```

---

### **2. Verificar Múltiplas Requisições (Loop)**

```
✅ F12 → Network
✅ Limpe o log (ícone lixeira)
✅ Clique em "Garantir Minha Vaga"
✅ CONTE quantas requisições aparecem
```

**Interpretação:**
- ✅ **1-2 requisições** = Normal
- ⚠️ **3-5 requisições** = Retry automático (pode causar 429)
- ❌ **10+ requisições** = Loop infinito! (BUG)

---

### **3. Verificar Erros no Console**

```
✅ F12 → Console
✅ Procure mensagens em vermelho
✅ Copie todos os erros
```

**Possíveis erros relacionados:**
```javascript
// Rate limit explícito
Error: Too many requests

// Timeout causando retry
Error: Request timeout

// CORS error causando retry
Access-Control-Allow-Origin

// Network error causando retry
Failed to fetch
```

---

### **4. Quando Aparece o Erro?**

Marque onde o erro 429 aparece:

- [ ] Ao clicar em "Garantir Minha Vaga" (landing page)
- [ ] Na página de checkout do Stripe
- [ ] Ao preencher dados do cartão
- [ ] Ao clicar em "Pay" no Stripe
- [ ] Após concluir pagamento (redirecionamento)
- [ ] Ao clicar no link do email
- [ ] Na página de criar senha

---

## 🔍 **POSSÍVEIS CAUSAS (Com Apenas 2 Testes):**

### **Causa 1: Rate Limit Muito Restritivo do Supabase Auth**

**Problema:**
- Supabase pode ter rate limit de **2-3 criações de usuário por minuto**
- Se você fez 2 testes em menos de 1 minuto, atingiu o limite

**Como Verificar:**
```
1. Veja no Dashboard quantos usuários foram criados:
   https://supabase.com/dashboard/project/tzdatllacntstuaoabou/auth/users

2. Se tem 2 usuários criados nos últimos 2 minutos = É isso!
```

**Solução:**
```
✅ Aguarde 5 minutos
✅ Delete os 2 usuários de teste
✅ Faça um novo teste
```

---

### **Causa 2: Webhook Sendo Chamado Múltiplas Vezes**

**Problema:**
- Stripe pode estar enviando webhook múltiplas vezes
- Cada webhook tenta criar usuário e enviar email

**Como Verificar:**
```powershell
# Ver logs do webhook
npx supabase functions logs stripe-webhook --project-ref tzdatllacntstuaoabou
```

**O que procurar:**
```
Se aparecer VÁRIAS vezes:
"Checkout completed - Mode: payment"

Isso significa que o webhook está sendo chamado múltiplas vezes!
```

**Solução:**
```
✅ O webhook já tem idempotency (não deveria duplicar)
✅ Mas podemos adicionar mais proteção
```

---

### **Causa 3: Retry Automático no Frontend**

**Problema:**
- Talvez o código esteja fazendo retry automático em caso de erro

**Como Verificar:**
```javascript
// Abra F12 → Console e cole isso:
console.log('Checking for retry logic...');

// Veja se o botão está disparando múltiplas requisições
```

**Código Atual (src/hooks/useSubscription.tsx):**
```typescript
const createCheckoutSession = async (priceId: string, mode: "subscription" | "payment" = "subscription") => {
  try {
    const response = await supabase.functions.invoke("create-checkout", {
      body: { priceId, mode, anonymous: true },
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
    });

    if (response.error) {
      throw response.error;
    }

    return response.data;
  } catch (err) {
    console.error("Error creating checkout session:", err);
    throw err; // ✅ NÃO faz retry - OK!
  }
};
```

**Análise:** ✅ Código está correto, não faz retry automático.

---

### **Causa 4: Stripe Account Under Review**

**Problema:**
- Sua conta Stripe pode ter rate limits mais restritos durante revisão

**Como Verificar:**
```
1. Acesse: https://dashboard.stripe.com/test/dashboard
2. Veja se há algum banner de "Account under review"
3. Veja se há alguma mensagem de limite
```

**Solução:**
```
✅ Aguarde aprovação da conta
✅ Ou use outro cartão de teste
✅ Ou aguarde 1 hora entre testes
```

---

### **Causa 5: IP Bloqueado Temporariamente**

**Problema:**
- Algum serviço pode ter bloqueado seu IP temporariamente

**Como Verificar:**
```
✅ Teste em outro navegador (Chrome/Edge)
✅ Teste em janela anônima
✅ Teste no celular (4G)
```

**Se funcionar no celular/outro navegador:**
```
→ É problema de IP/cookies
→ Limpe cache e cookies
→ Aguarde 30 minutos
```

---

## 🛠️ **AÇÕES IMEDIATAS:**

### **Opção 1: Debug Completo (Recomendado)**

1. **Abra F12 → Network**
2. **Limpe o log**
3. **Clique em "Garantir Minha Vaga"**
4. **Tire uma PRINT mostrando:**
   - Todas as requisições feitas
   - A requisição com 429 (se houver)
   - A URL completa da requisição

5. **Me envie a print ou me diga:**
   - URL exata do erro 429
   - Quantas requisições foram feitas
   - Quando o erro aparece

---

### **Opção 2: Solução Rápida (Temporária)**

```
1. ✅ Aguarde 10 minutos
2. ✅ Limpe cache/cookies (CTRL+SHIFT+DELETE)
3. ✅ Reinicie o navegador
4. ✅ Delete usuários de teste no Supabase
5. ✅ Faça UM teste apenas
```

---

### **Opção 3: Teste via Console (Bypass Frontend)**

```javascript
// Cole isso no Console do navegador (F12 → Console):

const testCheckout = async () => {
  const response = await fetch('https://tzdatllacntstuaoabou.supabase.co/functions/v1/create-checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6ZGF0bGxhY250c3R1YW9hYm91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MzYwMDYsImV4cCI6MjA3ODUxMjAwNn0.SGB352z9MHTyY130M6T_tMNRm3pZfsQvRSeE5E0fbF8'
    },
    body: JSON.stringify({
      priceId: 'price_1STLpcK7zFdJhUJSvXM7o8Kk',
      mode: 'payment',
      anonymous: true
    })
  });

  const data = await response.json();
  
  if (response.status === 429) {
    console.log('❌ ERRO 429 - Rate Limit!');
    console.log('Response:', data);
  } else if (response.ok) {
    console.log('✅ SUCESSO!');
    console.log('Checkout URL:', data.url);
  } else {
    console.log('❌ ERRO:', response.status);
    console.log('Response:', data);
  }
  
  return { status: response.status, data };
};

// Execute:
testCheckout();
```

Isso testa **diretamente** a API, sem passar pelo React!

---

## 📊 **MONITORAMENTO:**

### **1. Ver Logs em Tempo Real:**
```powershell
npx supabase functions logs stripe-webhook --project-ref tzdatllacntstuaoabou
```

### **2. Ver Usuários Criados:**
https://supabase.com/dashboard/project/tzdatllacntstuaoabou/auth/users

### **3. Ver Emails Enviados:**
https://resend.com/emails

### **4. Ver Pagamentos:**
https://dashboard.stripe.com/test/payments

---

## 🎯 **PRÓXIMOS PASSOS:**

**Me diga:**

1. **Qual é a URL exata que está dando 429?**
   ```
   F12 → Network → 429 → Request URL = ?
   ```

2. **Quando o erro aparece?**
   ```
   [ ] Ao clicar no botão
   [ ] No Stripe Checkout
   [ ] Após pagar
   [ ] Ao abrir email
   ```

3. **Quantas requisições aparecem no Network?**
   ```
   F12 → Network → Limpar → Clicar botão → Contar = ?
   ```

4. **Tem algum erro no Console?**
   ```
   F12 → Console → Erros em vermelho = ?
   ```

Com essas informações, posso te dar uma solução exata! 🎯

---

**🔍 AGUARDANDO SUAS RESPOSTAS PARA RESOLVER!**


