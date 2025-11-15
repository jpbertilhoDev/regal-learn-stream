# 🎓 Guia Completo de Configuração do Stripe - PRODUÇÃO - Mentoria Master Class

Este guia te levará passo a passo para configurar o Stripe em **PRODUÇÃO** (pagamentos reais) na plataforma de ensino.

⚠️ **IMPORTANTE:** Este guia configura pagamentos REAIS. Todos os valores serão cobrados de verdade.

## 📋 Índice
1. [Ativar Conta Stripe](#1-ativar-conta-stripe)
2. [Criar Produtos no Stripe](#2-criar-produtos-no-stripe)
3. [Configurar Webhooks](#3-configurar-webhooks)
4. [Variáveis de Ambiente](#4-variáveis-de-ambiente)
5. [Deploy das Funções](#5-deploy-das-funções)
6. [Configuração Final](#6-configuração-final)
7. [Monitoramento](#7-monitoramento)

---

## 1. Ativar Conta Stripe

### 1.1 Ativar Conta para Produção
1. Acesse: https://dashboard.stripe.com
2. Clique em **"Activate your account"**
3. Preencha **TODAS** as informações:
   - ✅ Informações da empresa
   - ✅ Representante legal
   - ✅ Dados bancários (para receber pagamentos)
   - ✅ Documentos (pode ser solicitado CPF/CNPJ)

⏱️ **Tempo de aprovação:** 1-2 dias úteis (geralmente mais rápido)

### 1.2 Pegar as Chaves de API (PRODUÇÃO)
1. **CERTIFIQUE-SE** que o toggle está em **MODO LIVE** (não em test mode)
2. Vá em: **Developers → API keys**
3. Copie as chaves de PRODUÇÃO:
   - ✅ **Publishable key** (começa com `pk_live_...`)
   - ✅ **Secret key** (começa com `sk_live_...`)

🔴 **ATENÇÃO:** Guarde suas chaves em segurança:
```
pk_live_[SUA_PUBLISHABLE_KEY_AQUI]
sk_live_[SUA_SECRET_KEY_AQUI]
```

---

## 2. Criar Produtos no Stripe

### 2.1 Produto 1: Plano Mensal (Recorrente)
1. **CERTIFIQUE-SE** que está em **MODO LIVE** (não test mode)
2. Dashboard → **Products** → **Add product**
3. Preencha:
   ```
   Nome: Mentoria MASTER CLASS - Mensal
   Descrição: Acesso mensal completo à plataforma de ensino
   ```
4. Pricing:
   ```
   Preço: R$ 208,00
   Billing period: Monthly
   Currency: BRL
   ```
5. Clique em **Save product**
6. **COPIE O PRICE ID DE PRODUÇÃO** (começa com `price_...`)

🔴 **IMPORTANTE:** Este Price ID será diferente do modo teste!

### 2.2 Produto 2: Pagamento Único
1. Dashboard → **Products** → **Add product**
2. Preencha:
   ```
   Nome: Mentoria MASTER CLASS - Pagamento Único
   Descrição: Acesso vitalício à plataforma de ensino
   ```
3. Pricing:
   ```
   Preço: R$ 2.500,00
   Billing period: One time
   ```
4. Clique em **Save product**
5. **COPIE O PRICE ID** (começa com `price_...`)

### 2.3 Atualizar Price IDs no Código

Edite `src/lib/stripe.ts`:

```typescript
export const STRIPE_PRICES = {
  MONTHLY: "price_SEU_ID_MENSAL_AQUI",    // ← Cole o Price ID do plano mensal
  ONE_TIME: "price_SEU_ID_UNICO_AQUI",     // ← Cole o Price ID do pagamento único
} as const;
```

---

## 3. Configurar Webhooks

### 3.1 Criar Endpoint de Webhook
1. **CERTIFIQUE-SE** que está em **MODO LIVE**
2. Dashboard → **Developers** → **Webhooks** → **Add endpoint**
3. Preencha:
   ```
   Endpoint URL: https://your-project-id.supabase.co/functions/v1/stripe-webhook
   Description: Webhook de PRODUÇÃO - Mentoria Master Class
   ```

✅ **Após criar o webhook, copie o secret:**
```
whsec_[SEU_WEBHOOK_SECRET_AQUI]
```

### 3.2 Selecionar Eventos
Marque estes eventos:
- ✅ `checkout.session.completed`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_succeeded`
- ✅ `invoice.payment_failed`

### 3.3 Copiar Webhook Secret
1. Após criar, clique no endpoint
2. **Signing secret** → Clique em "Reveal"
3. **COPIE O SECRET** (começa com `whsec_...`)

### 3.4 Configurar Billing Portal
1. Dashboard → **Settings** → **Billing** → **Customer portal**
2. Clique em **Activate test link**
3. Configure:
   - ✅ Permitir cancelamento de assinatura
   - ✅ Permitir atualização de método de pagamento
   - ✅ Permitir visualização de faturas

---

## 4. Variáveis de Ambiente

### 4.1 Frontend (.env.local)
Crie o arquivo `.env.local` na raiz do projeto:

```bash
# Supabase
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Stripe (PRODUÇÃO - Pagamentos Reais)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_[SUA_PUBLISHABLE_KEY_AQUI]
```

### 4.2 Backend (Supabase Edge Functions)

✅ **Você já configurou 2 das 4 variáveis necessárias!**

1. Vá em: **Supabase Dashboard** → **Project Settings** → **Edge Functions** → **Secrets**
2. Configure estas 4 variáveis:

```bash
# 1. Stripe Secret Key (PRODUÇÃO)
STRIPE_SECRET_KEY=sk_live_[SUA_SECRET_KEY_AQUI]

# 2. Webhook Secret
STRIPE_WEBHOOK_SECRET=whsec_[SEU_WEBHOOK_SECRET_AQUI]

# 3. Supabase URL
SUPABASE_URL=https://your-project-id.supabase.co

# 4. Service Role Key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Como pegar a Service Role Key:**
1. Supabase Dashboard → **Settings** → **API**
2. Procure por **"service_role"** key (NÃO a "anon" key!)
3. Clique em **"Reveal"** e copie

---

## 5. Deploy das Funções

### 5.1 Instalar Supabase CLI

```bash
# Windows (com Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Mac
brew install supabase/tap/supabase

# Linux
brew install supabase/tap/supabase
```

### 5.2 Login e Link ao Projeto

```bash
# Login
supabase login

# Link ao projeto
supabase link --project-ref your-project-id
```

### 5.3 Deploy das Funções

```bash
# Deploy todas as funções
supabase functions deploy create-checkout
supabase functions deploy create-portal
supabase functions deploy stripe-webhook

# Verificar se está no ar
supabase functions list
```

---

## 6. Configuração Final

### 6.1 Atualizar Price IDs no Código

⚠️ **CRÍTICO:** Você precisa atualizar os Price IDs de PRODUÇÃO no código!

Edite o arquivo `src/lib/stripe.ts`:

```typescript
export const STRIPE_PRICES = {
  MONTHLY: "price_SEU_PRICE_ID_MENSAL_DE_PRODUCAO",
  ONE_TIME: "price_SEU_PRICE_ID_UNICO_DE_PRODUCAO",
} as const;
```

**Como pegar os Price IDs:**
1. Stripe Dashboard (modo LIVE)
2. Products → Clique no produto
3. Copie o Price ID que aparece na seção Pricing

### 6.2 Teste com Valor Baixo (Recomendado)

🔴 **IMPORTANTE:** Como está em PRODUÇÃO, recomendo criar um produto temporário com R$ 1,00 para teste!

1. **Criar produto de teste temporário:**
   - Stripe Dashboard → Products → Add product
   - Nome: "Teste - Apagar depois"
   - Preço: R$ 1,00 (one-time)
   - Copie o Price ID

2. **Atualizar código temporariamente:**
   - Coloque esse Price ID no código
   - Faça o teste completo
   - Se funcionar, volte para os valores reais

3. **Testar checkout:**
   - Vá em `http://localhost:5173`
   - Clique em "Garantir Minha Vaga"
   - Use SEU PRÓPRIO CARTÃO (será cobrado R$ 1,00)
   - Complete o pagamento

4. **Verificar logs do webhook:**
   ```bash
   # Terminal 1: Ver logs em tempo real
   supabase functions logs stripe-webhook --live
   ```

4. **Verificar no Stripe Dashboard:**
   - Developers → Webhooks → mentoriamaster → Events
   - Deve mostrar: **✅ Delivered** (200)

5. **Verificar no banco:**
   - Supabase Dashboard → Table Editor → `subscriptions`
   - Deve ter criado nova linha com `status = "active"`

### 6.3 Testar Webhook Localmente com Stripe CLI

```bash
# Instalar Stripe CLI
# Windows: scoop install stripe
# Mac: brew install stripe/stripe-cli/stripe

# Login
stripe login

# Escutar webhooks
stripe listen --forward-to https://your-project-id.supabase.co/functions/v1/stripe-webhook

# Em outro terminal, disparar evento de teste
stripe trigger checkout.session.completed
```

### 6.4 Checklist de Verificação

- [ ] Checkout abre corretamente
- [ ] Pagamento é processado com sucesso
- [ ] Webhook recebe evento (status 200)
- [ ] Subscription é criada no banco
- [ ] Usuário ganha acesso ao conteúdo
- [ ] Email de boas-vindas é enviado (se configurado)

---

## 7. Monitoramento

### 7.1 Dashboard do Stripe
Monitore diariamente:
- **Payments:** Ver todos os pagamentos
- **Customers:** Lista de clientes
- **Subscriptions:** Assinaturas ativas
- **Disputes:** Contestações (chargebacks)

### 7.2 Webhooks
- **Developers → Webhooks → mentoriamaster**
- Verifique taxa de sucesso: deve estar > 99%
- Se eventos falharem, veja os logs

### 7.3 Logs do Supabase
```bash
# Ver logs em tempo real
supabase functions logs stripe-webhook --live
```

### 7.4 Alertas Importantes

Configure alertas para:
- ❌ Pagamentos falhados
- ⚠️ Webhooks com erro
- 💳 Chargebacks/disputas
- 🔄 Renovações recusadas

### 7.5 Backup e Segurança
- ✅ Faça backup regular das tabelas `subscriptions` e `transactions`
- ✅ Nunca compartilhe suas chaves secretas
- ✅ Rotacione webhook secrets periodicamente
- ✅ Monitore acessos suspeitos

---

## 🚨 Troubleshooting

### Webhook não está sendo chamado
- ✅ Verifique se a função `stripe-webhook` está deployada
- ✅ Verifique a URL no Stripe Dashboard
- ✅ Veja logs: `supabase functions logs stripe-webhook`

### Subscription não é criada
- ✅ Verifique logs do webhook
- ✅ Verifique se `SUPABASE_SERVICE_ROLE_KEY` está correta
- ✅ Verifique permissões RLS na tabela `subscriptions`

### Erro de assinatura inválida
- ✅ Verifique se `STRIPE_WEBHOOK_SECRET` está correto
- ✅ Secret de teste ≠ secret de produção

### Cliente não consegue acessar conteúdo
- ✅ Verifique se `subscription.status === "active"`
- ✅ Verifique se `useSubscription` está sendo usado corretamente
- ✅ Veja se RLS policies permitem acesso

---

## 📞 Suporte

- **Stripe Docs:** https://stripe.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Logs do Webhook:** `supabase functions logs stripe-webhook --live`
- **Eventos no Stripe:** Dashboard → Developers → Events

---

## ✅ Checklist Final - PRODUÇÃO

### Pré-requisitos
- [x] Conta Stripe criada
- [x] Chaves de API de PRODUÇÃO obtidas
- [x] Webhook criado e secret obtido

### Configuração Supabase
- [x] `STRIPE_SECRET_KEY` configurado (sk_live_...)
- [x] `STRIPE_WEBHOOK_SECRET` configurado (whsec_...)
- [ ] `SUPABASE_URL` configurado
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurado

### Produtos e Preços
- [ ] Produtos criados no modo LIVE
- [ ] Price IDs copiados
- [ ] Price IDs atualizados em `src/lib/stripe.ts`
- [ ] Código commitado

### Funções Serverless
- [ ] Supabase CLI instalado
- [ ] Login no Supabase feito
- [ ] Função `create-checkout` deployada
- [ ] Função `create-portal` deployada
- [ ] Função `stripe-webhook` deployada

### Testes
- [ ] Teste com R$ 1,00 realizado (recomendado)
- [ ] Webhook recebeu evento (status 200)
- [ ] Subscription criada no banco
- [ ] Cliente consegue acessar conteúdo
- [ ] Teste de cancelamento funcionou

### Produção
- [ ] Price IDs reais no código
- [ ] Build de produção criado
- [ ] Deploy em produção feito
- [ ] Teste completo em produção
- [ ] Monitoramento configurado
- [ ] Alertas configurados

---

**Última atualização:** 14 de novembro de 2025

