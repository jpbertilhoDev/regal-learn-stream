# 🔧 CSP Corrigida + Diagnóstico Completo

## ✅ **O Que Foi Feito:**

### **1. Content Security Policy Adicionada** ✅

Adicionei meta tag CSP no `index.html` permitindo:
- ✅ Conexões ao Supabase (`tzdatllacntstuaoabou.supabase.co`)
- ✅ Conexões ao Stripe (todos os domínios necessários)
- ✅ WebSocket ao Supabase (`wss://...`)
- ✅ Fonts, Scripts e Estilos necessários

---

## 🧪 **TESTE AGORA (PASSO A PASSO):**

### **Passo 1: Limpe o Cache e Recarregue**

**No navegador (Chrome/Edge):**
1. Abra **DevTools** (F12)
2. **Clique com botão direito** no ícone de reload (⟳)
3. Selecione **"Limpar cache e recarregar forçado"**

Ou use:
- **Windows:** `Ctrl + Shift + R` ou `Ctrl + F5`
- **Mac:** `Cmd + Shift + R`

### **Passo 2: Verifique o Console**

Após recarregar, abra o Console (F12) e veja se:
- ❌ Ainda tem erro de CSP?
- ❌ Ainda tem erro 400?

### **Passo 3: Teste a Função Diretamente**

Cole este código no **Console (F12)**:

```javascript
// Teste direto da Edge Function
fetch('https://tzdatllacntstuaoabou.supabase.co/functions/v1/create-checkout', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6ZGF0bGxhY250c3R1YW9hYm91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MzYwMDYsImV4cCI6MjA3ODUxMjAwNn0.SGB352z9MHTyY130M6T_tMNRm3pZfsQvRSeE5E0fbF8'
  },
  body: JSON.stringify({
    priceId: 'price_1STKqaIE9hS1TW2fCTDJHPLy',
    mode: 'payment',
    anonymous: true
  })
})
.then(r => r.json())
.then(d => {
  console.log('%c=== RESPOSTA DA FUNÇÃO ===', 'color: blue; font-size: 16px; font-weight: bold');
  
  if (d.error) {
    console.error('%c❌ ERRO:', 'color: red; font-size: 14px; font-weight: bold');
    console.error(d.error);
    console.error('%c📝 Detalhes:', 'color: orange; font-size: 14px');
    console.error(d.details);
    console.error('%c💡 Tipo:', 'color: yellow; font-size: 14px');
    console.error(d.type);
  } else {
    console.log('%c✅ SUCESSO!', 'color: green; font-size: 14px; font-weight: bold');
    console.log('%c🔗 URL do Checkout:', 'color: blue; font-size: 14px');
    console.log(d.url);
  }
})
.catch(e => {
  console.error('%c❌ ERRO DE REDE:', 'color: red; font-size: 16px; font-weight: bold');
  console.error(e);
});
```

### **Passo 4: Analise a Resposta**

#### **Se der SUCESSO (✅):**
```
✅ SUCESSO!
🔗 URL do Checkout: https://checkout.stripe.com/c/pay/...
```
**Ação:** Copie a URL e acesse no navegador! O checkout vai funcionar!

#### **Se der ERRO (❌):**

**Erro Comum 1: "No such price: price_..."**
```
❌ ERRO: No such price: price_1STKqaIE9hS1TW2fCTDJHPLy
```
**Causa:** Price ID não existe ou está em modo diferente (test vs live)

**Solução:**
1. Acesse: https://dashboard.stripe.com/products/prod_TQBC6Eq6v7EYHH
2. Verifique se está em modo **LIVE**
3. Confirme o Price ID correto
4. Copie o Price ID exato

**Erro Comum 2: "Invalid API Key"**
```
❌ ERRO: Invalid API Key provided
```
**Causa:** Chave do Stripe incorreta ou em modo diferente

**Solução:**
```powershell
# Verificar secrets
npx supabase secrets list --project-ref tzdatllacntstuaoabou

# Reconfigurar se necessário
npx supabase secrets set STRIPE_SECRET_KEY="sk_live_SUA_CHAVE" --project-ref tzdatllacntstuaoabou
```

**Erro Comum 3: "CSP Violation"**
```
❌ ERRO: Failed to fetch
TypeError: Failed to fetch
```
**Causa:** CSP ainda bloqueando

**Solução:**
1. Force refresh (Ctrl+Shift+R)
2. Feche e abra o navegador
3. Tente em aba anônima

---

## 🎯 **VERIFICAÇÕES NO STRIPE DASHBOARD:**

### **1. Produto Existe?**

Acesse: https://dashboard.stripe.com/products/prod_TQBC6Eq6v7EYHH

**Verifique:**
- ✅ Toggle "Test mode" está **DESLIGADO** (deve estar em LIVE)
- ✅ Produto aparece na lista
- ✅ Status: **Active**
- ✅ Price ID: `price_1STKqaIE9hS1TW2fCTDJHPLy`

### **2. Conta Ativada?**

Acesse: https://dashboard.stripe.com/settings/account

**Verifique:**
- ✅ "Payments" está habilitado
- ✅ Não há avisos vermelhos
- ✅ Conta verificada

### **3. Logs de Erro?**

Acesse: https://dashboard.stripe.com/logs

**Procure:**
- ⚠️ Erros nos últimos 5-10 minutos
- 🔍 Mensagem de erro exata
- 📊 Status code (400, 404, 500?)

---

## 🔄 **PLANO B: Usar Modo TEST**

Se continuar com erro 400, teste com modo TEST primeiro:

### **1. Ative Test Mode:**
Dashboard Stripe → Toggle "Test mode" (canto superior direito)

### **2. Crie Produto de Teste:**
```
Name: Teste - R$ 1,00
Price: 1.00 BRL
Type: One-time payment
```

### **3. Configure Test Keys:**

```powershell
# Configurar secret key de teste
npx supabase secrets set STRIPE_SECRET_KEY="sk_test_SUA_CHAVE_AQUI" --project-ref tzdatllacntstuaoabou

# Atualizar .env.local
@"
VITE_SUPABASE_URL=https://tzdatllacntstuaoabou.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6ZGF0bGxhY250c3R1YW9hYm91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MzYwMDYsImV4cCI6MjA3ODUxMjAwNn0.SGB352z9MHTyY130M6T_tMNRm3pZfsQvRSeE5E0fbF8
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_SUA_CHAVE_AQUI
"@ | Out-File -FilePath .env.local -Encoding ASCII -NoNewline
```

### **4. Atualizar Price ID:**

Em `src/lib/stripe.ts`:
```typescript
export const STRIPE_PRICES = {
  ONE_TIME: "price_test_SEU_PRICE_ID_DE_TESTE", // ← Cole aqui
  PRODUCT_ID: "prod_test_...",
}
```

### **5. Teste com Cartão de Teste:**
```
Número: 4242 4242 4242 4242
Data: 12/34
CVV: 123
```

---

## 📊 **Checklist de Debug:**

### **Antes de Testar:**
- [ ] Forçar reload (Ctrl+Shift+R)
- [ ] Console limpo (sem erros antigos)
- [ ] DevTools aberto (F12)

### **Durante o Teste:**
- [ ] Erro de CSP sumiu?
- [ ] Erro 400 sumiu?
- [ ] Consegue ver logs no console?

### **Depois do Teste:**
- [ ] Copie a mensagem de erro exata
- [ ] Verifique logs do Stripe Dashboard
- [ ] Tire print da tela se necessário

---

## 🆘 **ME ENVIE:**

Se ainda der erro, me envie:

1. **Print do Console completo** (F12 → Console)
2. **Resultado do script de teste** (o JavaScript acima)
3. **Confirmação:** O produto existe no Stripe? (sim/não)
4. **Print dos logs do Stripe:** https://dashboard.stripe.com/logs

Com isso vou identificar exatamente o problema!

---

## ✅ **RESUMO:**

1. ✅ CSP corrigida no `index.html`
2. 🔄 Force refresh (Ctrl+Shift+R)  
3. 🧪 Execute o teste no console
4. 📊 Verifique o Stripe Dashboard
5. 🆘 Me envie os erros se persistir

**A causa mais provável é Price ID inválido ou conta não ativada!**


