# 🔧 CORRIGIR TABELA SUBSCRIPTIONS - ADICIONAR COLUNAS

## 🚨 **PROBLEMA:**

```
Webhook Error: Could not find the 'stripe_price_id' column of 'subscriptions' in the schema cache
```

**CAUSA:** A tabela `subscriptions` não tem todas as colunas necessárias!

---

## ✅ **SOLUÇÃO (2 MINUTOS):**

### **PASSO 1: Abrir SQL Editor**

1. **Clique neste link:**
   ```
   https://supabase.com/dashboard/project/tzdatllacntstuaoabou/sql/new
   ```

2. Você verá um editor SQL vazio

---

### **PASSO 2: Colar SQL**

**Cole este SQL no editor:**

```sql
-- Add missing columns to subscriptions table
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS stripe_price_id text,
ADD COLUMN IF NOT EXISTS stripe_product_id text,
ADD COLUMN IF NOT EXISTS plan_type text,
ADD COLUMN IF NOT EXISTS current_period_start timestamptz,
ADD COLUMN IF NOT EXISTS current_period_end timestamptz,
ADD COLUMN IF NOT EXISTS cancel_at_period_end boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS trial_start timestamptz,
ADD COLUMN IF NOT EXISTS trial_end timestamptz;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id_status ON subscriptions(user_id, status);
```

---

### **PASSO 3: Executar**

1. **Clique no botão "RUN"** (canto inferior direito)
   
   OU

2. **Pressione:** `CTRL + ENTER`

---

### **PASSO 4: Verificar Sucesso**

Você deve ver:
```
✅ Success. No rows returned
```

**Se aparecer isso = SUCESSO!** ✅

---

## 🧪 **DEPOIS DE EXECUTAR O SQL:**

### **TESTE IMEDIATO:**

**Opção A: Reenviar Evento do Stripe** ⚡ (30 segundos)

1. Vá para: https://dashboard.stripe.com/test/workbench

2. Clique no evento `checkout.session.completed` que falhou

3. Clique em "..." → "Resend"

4. Aguarde 30 segundos

5. Verifique:
   - ✅ Evento fica verde (sem erro)
   - ✅ Tabela `subscriptions` tem registro com TODAS as colunas
   - ✅ Email chega

---

**Opção B: Fazer Novo Pagamento** 🔄 (2 minutos)

1. Acesse: http://localhost:8081

2. Clique em "Garantir Minha Vaga"

3. Use cartão de teste:
   ```
   4242 4242 4242 4242
   12/25
   123
   ```

4. Complete o pagamento

5. Aguarde 1-2 minutos

6. Verifique:
   - ✅ Tabela `subscriptions` (com TODOS os campos preenchidos!)
   - ✅ Email

---

## 📊 **VERIFICAR SE FUNCIONOU:**

### **1. Tabela Subscriptions:**

**Acesse:**
```
https://supabase.com/dashboard/project/tzdatllacntstuaoabou/editor
```

**Clique em:** `subscriptions`

**Você DEVE ver um registro com:**
```
✅ user_id
✅ stripe_customer_id
✅ stripe_subscription_id (ou onetime_...)
✅ stripe_price_id          ← NOVA!
✅ stripe_product_id        ← NOVA!
✅ status: "active"
✅ plan_type: "lifetime"    ← NOVA!
✅ current_period_start     ← NOVA!
✅ current_period_end       ← NOVA!
✅ cancel_at_period_end     ← NOVA!
```

---

### **2. Email:**

```
✅ Inbox
✅ SPAM
✅ Assunto: "🎉 Bem-vindo à MASTER CLASS - Crie sua senha agora!"
```

---

### **3. Stripe Event:**

```
https://dashboard.stripe.com/test/events
→ checkout.session.completed
→ Status: 200 OK ✅ (verde, sem erro)
```

---

## 🎯 **COLUNAS ADICIONADAS:**

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `stripe_price_id` | text | ID do preço no Stripe |
| `stripe_product_id` | text | ID do produto no Stripe |
| `plan_type` | text | Tipo do plano (lifetime, month, year) |
| `current_period_start` | timestamptz | Início do período atual |
| `current_period_end` | timestamptz | Fim do período atual |
| `cancel_at_period_end` | boolean | Se vai cancelar no fim do período |
| `trial_start` | timestamptz | Início do trial (opcional) |
| `trial_end` | timestamptz | Fim do trial (opcional) |

---

## ⚠️ **SE DER ERRO AO EXECUTAR O SQL:**

### **Erro: "column already exists"**

```
Sem problema! Significa que a coluna já existe.
O SQL usa "IF NOT EXISTS" então ignora colunas existentes.
```

### **Erro: "permission denied"**

```
1. Verifique se você está logado no Supabase
2. Verifique se está no projeto correto (tzdatllacntstuaoabou)
3. Tente novamente
```

### **Erro: "syntax error"**

```
1. Certifique-se de copiar o SQL COMPLETO
2. Não cole apenas uma parte
3. Cole do início (--Add...) até o fim (...status);
```

---

## 📋 **CHECKLIST COMPLETO:**

- [ ] 1. Abri SQL Editor no Supabase
- [ ] 2. Colei o SQL completo
- [ ] 3. Cliquei em "RUN"
- [ ] 4. Vi "Success. No rows returned"
- [ ] 5. Reenviei evento do Stripe (ou fiz novo pagamento)
- [ ] 6. Verifiquei tabela `subscriptions` (tem registro com todas as colunas!)
- [ ] 7. Recebi email de boas-vindas
- [ ] 8. ✅ **SISTEMA FUNCIONANDO!**

---

## 🚀 **APÓS EXECUTAR O SQL:**

1. ✅ **Reenvie o evento do Stripe** (ou faça novo pagamento)

2. ✅ **Verifique a tabela subscriptions**
   - Deve ter registro COMPLETO
   - Com todas as novas colunas preenchidas

3. ✅ **Verifique o email**
   - Deve chegar em 1-2 minutos
   - Verifique SPAM!

4. ✅ **Teste o fluxo completo:**
   - Receber email
   - Clicar no link
   - Criar senha
   - Fazer login
   - Acessar plataforma

---

## 💡 **POR QUE ESSAS COLUNAS SÃO NECESSÁRIAS?**

### **stripe_price_id & stripe_product_id:**
- Guardar referência exata do que foi comprado
- Útil para relatórios e analytics
- Permite verificar qual produto/preço o cliente tem

### **plan_type:**
- Identificar se é lifetime, mensal, anual, etc
- Usado para lógica de renovação
- Facilita queries e filtros

### **current_period_start & current_period_end:**
- Saber quando o acesso expira
- Calcular dias restantes
- Implementar lógica de renovação

### **cancel_at_period_end:**
- Saber se o cliente cancelou
- Permitir acesso até o fim do período pago
- Gerenciar cancelamentos gracefully

### **trial_start & trial_end:**
- Suporte para períodos de trial/teste
- Saber se cliente está em trial
- Converter trial em pagamento

---

## ✅ **RESULTADO ESPERADO:**

Após executar o SQL e reenviar o evento:

```
✅ Webhook executa sem erros
✅ Subscription criada no banco com TODOS os campos
✅ Email enviado via Resend
✅ Cliente recebe email
✅ Cliente cria senha
✅ Cliente faz login
✅ Cliente acessa plataforma
✅ SISTEMA COMPLETO FUNCIONANDO! 🎉
```

---

**📅 Data:** 14 de novembro de 2025  
**🔧 Status:** ⏳ **AGUARDANDO EXECUÇÃO DO SQL**  
**📝 Arquivo:** `supabase/migrations/20241114_add_subscription_columns.sql`

---

**🚀 EXECUTE O SQL AGORA E TESTE!**

1. Cole SQL no editor
2. Execute (RUN)
3. Reenvie evento do Stripe
4. Verifique tabela subscriptions
5. Verifique email
6. ✅ FUNCIONANDO!


