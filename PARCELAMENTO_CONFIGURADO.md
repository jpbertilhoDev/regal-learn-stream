# 💳 Parcelamento em 12x Configurado!

## ✅ **O Que Foi Feito:**

### **1. Adicionado Suporte a Parcelamento**
```typescript
// No create-checkout/index.ts
if (mode === "payment") {
  sessionConfig.payment_method_options = {
    card: {
      installments: {
        enabled: true, // ✅ Habilita parcelamento em até 12x
      },
    },
  };
}
```

### **2. Interface em Português**
```typescript
locale: "pt-BR", // ✅ Stripe em português
```

### **3. Função Deployada**
✅ Edge Function `create-checkout` atualizada (versão mais recente)

---

## 🔍 **Sobre o Erro 400:**

O erro `400 Bad Request` no `api.stripe.com/v1/payment_methods` pode ser causado por:

### **Possível Causa 1: Price ID Inválido ou de Teste**

O Price ID que você forneceu pode:
- ❌ Não existir no Stripe
- ❌ Estar em modo TEST (mas você está usando chave LIVE)
- ❌ Estar inativo ou deletado

**Solução:** Verificar no Stripe Dashboard

### **Possível Causa 2: Conta Stripe Não Ativada**

Se sua conta Stripe não estiver totalmente ativada para aceitar pagamentos reais, você verá erros.

**Verificar:**
1. Acesse: https://dashboard.stripe.com/settings/account
2. Veja se há avisos de "Account Activation" ou "Complete your profile"
3. Certifique-se que "Payments" está habilitado

### **Possível Causa 3: Método de Pagamento Não Suportado**

Alguns cartões podem não funcionar dependendo da configuração.

**Verificar:**
1. Acesse: https://dashboard.stripe.com/settings/payment_methods
2. Certifique-se que "Cards" está habilitado
3. Verifique se há restrições regionais

---

## 🧪 **Como Testar Agora:**

### **Opção 1: Teste com Cartão Real (Cuidado!)**

⚠️ **Você está em modo LIVE** - vai cobrar de verdade!

1. Recarregue a página (F5)
2. Clique em "Garantir Minha Vaga"
3. Preencha os dados do seu cartão
4. **Você verá opção de parcelamento em até 12x!** 🎉

### **Opção 2: Teste com Chaves de Test (Recomendado)**

Para testar sem gastar dinheiro:

1. **Troque para Test Mode no Stripe:**
   - Dashboard do Stripe → Toggle "Test mode" (canto superior direito)

2. **Copie as chaves de TEST:**
   - Publishable key: `pk_test_...`
   - Secret key: `sk_test_...`

3. **Crie um produto de teste:**
   - Products → Add product
   - Price: R$ 1,00
   - One-time payment
   - Copie o Price ID de teste

4. **Atualize as chaves:**

```bash
# No PowerShell
npx supabase secrets set STRIPE_SECRET_KEY="sk_test_SUA_CHAVE_AQUI" --project-ref tzdatllacntstuaoabou
```

```typescript
// No .env.local
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_SUA_CHAVE_AQUI
```

```typescript
// No src/lib/stripe.ts
export const STRIPE_PRICES = {
  MONTHLY: "price_test_...", // Price ID de teste
  ONE_TIME: "price_test_...", // Price ID de teste
}
```

5. **Teste com cartão de teste:**
   - Número: `4242 4242 4242 4242`
   - Data: Qualquer data futura
   - CVV: Qualquer 3 dígitos

---

## 🔎 **Verificar o Erro Exato:**

Para ver o erro completo do Stripe, abra o **Console do Navegador (F12)** durante o checkout e veja a mensagem de erro.

Ou acesse os logs do Stripe:
- https://dashboard.stripe.com/logs

Lá você verá **exatamente** qual foi o erro retornado pela API.

---

## 📋 **Checklist de Verificação:**

### **No Stripe Dashboard:**

- [ ] Conta está ativada para receber pagamentos?
- [ ] Modo LIVE está ativo?
- [ ] O Price ID existe e está ativo?
- [ ] O Price ID é do tipo correto (one-time)?
- [ ] Payment methods (Cards) estão habilitados?

### **No Código:**

- [x] Parcelamento configurado
- [x] Locale pt-BR configurado
- [x] Edge Function deployada
- [x] .env.local criado
- [ ] Price ID válido em `src/lib/stripe.ts`

---

## 🎯 **Próximos Passos:**

### **1. Verificar Price ID (URGENTE)**

Acesse: https://dashboard.stripe.com/products

Encontre o produto `prod_TPtSXdIk9KDxjE` e:
- ✅ Confirme que o Price ID está correto
- ✅ Verifique se está em modo LIVE
- ✅ Copie o Price ID correto se necessário

### **2. Se o Price ID estiver errado:**

Crie um novo produto:
1. Products → Add product
2. Name: "Teste - Pagamento Único"
3. Price: R$ 1,00 (para testar barato)
4. One-time payment
5. Copie o novo Price ID
6. Cole em `src/lib/stripe.ts`

### **3. Teste novamente:**

1. Recarregue o site
2. Tente fazer o checkout
3. Veja se o parcelamento aparece
4. Verifique no Console (F12) se há erros

---

## 💡 **Dicas:**

### **Para ver as opções de parcelamento:**

No Stripe Checkout, quando você digitar o número do cartão, **automaticamente** aparecerá um dropdown:

```
Forma de pagamento:
┌─────────────────────────────┐
│ À vista - R$ 208,00        │
│ 2x de R$ 104,00            │
│ 3x de R$ 69,33             │
│ ...                         │
│ 12x de R$ 17,33            │
└─────────────────────────────┘
```

### **O parcelamento só aparece se:**

1. ✅ O valor for **maior que R$ 4,00** (mínimo do Stripe)
2. ✅ O modo for `payment` (não `subscription`)
3. ✅ O cartão suportar parcelamento
4. ✅ Você estiver usando cartão brasileiro

---

## 🆘 **Se Ainda Não Funcionar:**

Me envie:

1. **Print do erro no Console (F12)**
2. **Print dos logs do Stripe Dashboard**
3. **Confirmação de que o Price ID existe**

Com essas informações vou identificar exatamente o problema!

---

**Última atualização:** 14 de novembro de 2025
**Status:** ✅ Parcelamento configurado | ⏳ Aguardando verificação do Price ID


