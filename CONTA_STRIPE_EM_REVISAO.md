# ⚠️ Conta Stripe em Revisão - Como Proceder

## 🚨 **PROBLEMA IDENTIFICADO:**

Sua conta Stripe está **suspensa para pagamentos** enquanto o Stripe revisa seus dados.

**Mensagem do Dashboard:**
```
⚠️ Os pagamentos e os repasses foram suspensos enquanto revisamos seus dados
Recebemos os dados solicitados, e sua conta está em análise. 
Isso normalmente leva de 2 a 3 dias.
```

**Por isso o erro 400 está acontecendo!**

---

## 🎯 **SOLUÇÃO IMEDIATA: Usar Modo TEST**

Enquanto aguarda aprovação (2-3 dias), você pode **testar tudo** usando o modo TEST do Stripe.

---

## 🔧 **PASSO A PASSO: Configurar Modo TEST**

### **1. Ative o Test Mode no Stripe**

1. Acesse: https://dashboard.stripe.com
2. **Clique no toggle "Test mode"** (canto superior direito)
3. Deve ficar **LARANJA** quando ativo

### **2. Copie as Chaves de TEST**

1. Acesse: https://dashboard.stripe.com/test/apikeys
2. Copie:
   - **Publishable key:** `pk_test_...`
   - **Secret key:** `sk_test_...`

### **3. Crie um Produto de TESTE**

1. Com Test mode ATIVO
2. Acesse: https://dashboard.stripe.com/test/products
3. Clique em **"Add product"**
4. Preencha:
   ```
   Name: Mentoria MASTER CLASS - Teste
   Description: Produto para teste
   Price: 1.00 BRL (R$ 1,00)
   Billing: One-time payment
   ```
5. Clique em **"Add product"**
6. **COPIE o Price ID de TESTE** (começa com `price_test_...`)

### **4. Configure as Secrets no Supabase (TEST)**

**No PowerShell:**

```powershell
cd c:\Users\jpber\Documents\regal-learn-stream

# Configurar chave SECRET do Stripe (TEST)
npx supabase secrets set STRIPE_SECRET_KEY="sk_test_SUA_CHAVE_DE_TESTE_AQUI" --project-ref tzdatllacntstuaoabou

# Verificar se foi configurado
npx supabase secrets list --project-ref tzdatllacntstuaoabou
```

### **5. Atualize o .env.local (TEST)**

**No PowerShell:**

```powershell
@"
VITE_SUPABASE_URL=https://tzdatllacntstuaoabou.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6ZGF0bGxhY250c3R1YW9hYm91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MzYwMDYsImV4cCI6MjA3ODUxMjAwNn0.SGB352z9MHTyY130M6T_tMNRm3pZfsQvRSeE5E0fbF8
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_SUA_CHAVE_PUBLICA_DE_TESTE_AQUI
"@ | Out-File -FilePath .env.local -Encoding ASCII -NoNewline
```

### **6. Atualize o src/lib/stripe.ts (TEST)**

```typescript
// Stripe Price IDs - Configurado para TESTE
export const STRIPE_PRICES = {
  ONE_TIME: "price_test_SEU_PRICE_ID_DE_TESTE_AQUI", // ← Cole o Price ID de teste
  PRODUCT_ID: "prod_test_...", // ← Cole o Product ID de teste
} as const;
```

### **7. Reinicie o Servidor**

```powershell
# Se estiver rodando, pare (Ctrl+C) e rode novamente:
npm run dev
```

### **8. Teste com Cartão de TESTE**

No Stripe Checkout, use:
```
Número: 4242 4242 4242 4242
Data: 12/34 (qualquer data futura)
CVV: 123 (qualquer 3 dígitos)
Nome: Teste
CEP: 12345-678
```

**✅ Vai funcionar perfeitamente em modo TEST!**

---

## 🎉 **QUANDO SUA CONTA FOR APROVADA (2-3 dias):**

### **1. Verifique se Foi Aprovada**

Acesse: https://dashboard.stripe.com

**Procure:**
- ✅ Aviso de suspensão sumiu?
- ✅ Pode processar pagamentos?

### **2. Volte para LIVE Mode**

1. Dashboard → **Desative** "Test mode"
2. Acesse: https://dashboard.stripe.com/apikeys
3. Copie as chaves **LIVE**:
   - `pk_live_...`
   - `sk_live_...`

### **3. Reconfigure com Chaves LIVE**

```powershell
# Secret Key LIVE
npx supabase secrets set STRIPE_SECRET_KEY="sk_live_SUA_CHAVE_LIVE" --project-ref tzdatllacntstuaoabou

# .env.local LIVE
@"
VITE_SUPABASE_URL=https://tzdatllacntstuaoabou.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6ZGF0bGxhY250c3R1YW9hYm91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MzYwMDYsImV4cCI6MjA3ODUxMjAwNn0.SGB352z9MHTyY130M6T_tMNRm3pZfsQvRSeE5E0fbF8
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_SUA_CHAVE_LIVE
"@ | Out-File -FilePath .env.local -Encoding ASCII -NoNewline
```

### **4. Atualize o Price ID LIVE**

Seu produto LIVE já existe!
- **Product ID:** `prod_TQBC6Eq6v7EYHH`
- **Price:** R$ 1,00

Você precisa copiar o **Price ID** que aparece naquela tela que você me mostrou.

**No Stripe Dashboard (LIVE mode):**
1. Acesse o produto: https://dashboard.stripe.com/products/prod_TQBC6Eq6v7EYHH
2. Na seção "Preços", você verá algo como: `price_1ST...`
3. **Copie esse Price ID**

Depois, atualize `src/lib/stripe.ts`:
```typescript
// Stripe Price IDs - Configurado para PRODUÇÃO
export const STRIPE_PRICES = {
  ONE_TIME: "price_1ST...", // ← Cole o Price ID LIVE aqui
  PRODUCT_ID: "prod_TQBC6Eq6v7EYHH",
} as const;
```

---

## 📊 **RESUMO:**

| Status | Ação |
|--------|------|
| **AGORA (Conta Suspensa)** | ✅ Usar modo TEST para desenvolver/testar |
| **2-3 Dias (Após Aprovação)** | ✅ Voltar para modo LIVE com pagamentos reais |

---

## 💡 **VANTAGENS DE USAR TEST MODE AGORA:**

1. ✅ **Testa todo o fluxo** sem gastar dinheiro
2. ✅ **Desenvolve com tranquilidade** enquanto aguarda aprovação
3. ✅ **Verifica se o parcelamento funciona** (sim, funciona em test!)
4. ✅ **Garante que está tudo OK** para quando a conta for aprovada

---

## 🎯 **CHECKLIST:**

### **Para Testar AGORA (Modo TEST):**
- [ ] Ativar Test mode no Stripe
- [ ] Copiar chaves de teste (pk_test_ e sk_test_)
- [ ] Criar produto de teste (R$ 1,00)
- [ ] Configurar secrets no Supabase (test)
- [ ] Atualizar .env.local (test)
- [ ] Atualizar src/lib/stripe.ts (test price ID)
- [ ] Reiniciar servidor (npm run dev)
- [ ] Testar com cartão 4242 4242 4242 4242

### **Quando Conta For Aprovada:**
- [ ] Verificar aprovação no dashboard
- [ ] Desativar Test mode
- [ ] Copiar chaves LIVE
- [ ] Reconfigurar secrets (live)
- [ ] Atualizar .env.local (live)
- [ ] Copiar Price ID do produto LIVE
- [ ] Atualizar src/lib/stripe.ts (live)
- [ ] Testar com cartão real

---

## 🆘 **PRECISA DE AJUDA?**

Me avise quando:
1. ✅ Conseguir testar em modo TEST
2. ✅ Sua conta for aprovada pelo Stripe
3. ❌ Tiver dúvida em algum passo

---

**🎉 A boa notícia: O código está 100% correto! É só a conta estar em análise mesmo!**


