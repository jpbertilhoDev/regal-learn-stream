# 🔧 Como Corrigir o Price ID do Stripe

## ❌ **Problema Identificado:**

O Price ID que você forneceu (`price_1ST3fzIE9hS1TW2fEvISHNOI`) é de **pagamento único** (one-time), mas o site está configurado para **assinatura mensal** (subscription).

**Erro do Stripe:**
```
"You must provide at least one recurring price in `subscription` mode when using prices."
```

---

## ✅ **Solução: Criar Produto Recorrente no Stripe**

### **Passo 1: Acesse o Dashboard do Stripe**

1. Abra: https://dashboard.stripe.com/products
2. **Certifique-se que está em MODO LIVE** (canto superior esquerdo)

### **Passo 2: Criar Novo Produto**

1. Clique em **"Add product"** (botão azul no topo)

2. **Preencha os Dados:**
   ```
   Product information:
   - Name: Mentoria MASTER CLASS - Assinatura Mensal
   - Description: Acesso mensal à mentoria de transformação espiritual
   - Image: (opcional) Faça upload de uma imagem
   ```

3. **Configure o Preço:**
   ```
   Pricing:
   - Model: Standard pricing
   - Price: 208.00
   - Currency: BRL (R$)
   - Billing period: ✅ Recurring
     - Every: 1
     - Period: Month
   ```

4. **Configurações Adicionais (opcional mas recomendado):**
   ```
   - Trial period: (deixe em branco se não quiser período gratuito)
   - Usage is metered: deixe desmarcado
   ```

5. Clique em **"Add product"**

### **Passo 3: Copiar o Price ID**

Após criar o produto, você verá algo assim:

```
Product ID: prod_XXXXXXXX
Price ID: price_XXXXXXXXXXXXXXXX ← COPIE ESTE!
```

**O Price ID vai começar com `price_` e ter vários caracteres aleatórios depois.**

### **Passo 4: Atualizar o Código**

Abra o arquivo `src/lib/stripe.ts` e substitua o MONTHLY Price ID:

**ANTES:**
```typescript
export const STRIPE_PRICES = {
  MONTHLY: "price_1ST3fzIE9hS1TW2fEvISHNOI", // ← ERRADO (é one-time)
  ONE_TIME: "price_1ST3fzIE9hS1TW2fEvISHNOI",
} as const;
```

**DEPOIS:**
```typescript
export const STRIPE_PRICES = {
  MONTHLY: "price_NOVO_ID_AQUI", // ← Cole o novo Price ID recorrente
  ONE_TIME: "price_1ST3fzIE9hS1TW2fEvISHNOI", // ← Mantém o atual
} as const;
```

### **Passo 5: Reverter os Botões para Monthly**

Depois de atualizar o Price ID, reverter os botões:

1. **src/components/Hero.tsx** - linha 41:
   ```typescript
   priceType="monthly" // ← Mudar de oneTime para monthly
   ```

2. **src/components/Pricing.tsx** - linha 82:
   ```typescript
   priceType="monthly" // ← Mudar de oneTime para monthly
   ```

---

## 🧪 **Teste Rápido (AGORA)**

**SE VOCÊ QUISER TESTAR AGORA sem criar novo produto:**

Já mudei temporariamente os botões para `priceType="oneTime"`. Isso vai:
- ✅ Funcionar com o Price ID atual
- ✅ Cobrar R$ 208,00 **uma vez só** (não mensal)
- ✅ Permitir testar o fluxo completo

**Teste:**
1. Recarregue a página (F5)
2. Clique em "Garantir Minha Vaga"
3. Você será redirecionado para o Stripe
4. Complete o pagamento de teste

**⚠️ ATENÇÃO:** Isso vai cobrar **R$ 208,00 uma vez**, NÃO mensalmente!

---

## 📋 **Resumo:**

| Item | Status | Ação |
|------|--------|------|
| Price ID atual | ⚠️ One-time | Criar novo recorrente |
| Botões | ✅ Ajustados | Temporariamente oneTime |
| Teste | ✅ Pronto | Pode testar agora |

---

## 🎯 **Próximos Passos:**

### **AGORA (Teste Rápido):**
1. ✅ Recarregue o site
2. ✅ Clique em "Garantir Minha Vaga"  
3. ✅ Teste o fluxo de pagamento

### **DEPOIS (Configuração Final):**
1. ⏳ Criar produto recorrente no Stripe
2. ⏳ Atualizar `src/lib/stripe.ts` com novo Price ID
3. ⏳ Reverter botões para `priceType="monthly"`

---

## 🆘 **Precisa de Ajuda?**

### **Como saber se um Price é Recorrente ou One-time?**

No Dashboard do Stripe:
1. Vá em **Products**
2. Clique no produto
3. Veja a seção **Pricing**:
   - ✅ **Recurring** → Mensal/Anual
   - ⚠️ **One-time** → Pagamento único

### **Criar Produto de Teste Barato**

Para testar sem gastar muito, crie um produto de **R$ 1,00 mensal**:
- Name: "Teste - Apagar Depois"
- Price: 1.00 BRL
- Recurring: Monthly
- Use o Price ID desse para testar

---

**Última atualização:** 14 de novembro de 2025
**Status:** ✅ Pronto para testar com oneTime


