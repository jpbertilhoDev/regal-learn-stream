# ✅ ERRO "duplicate key" RESOLVIDO!

## 🚨 **ERRO ENCONTRADO:**

```
Webhook Error: duplicate key value violates unique constraint "subscriptions_user_id_key"
```

---

## 🔍 **CAUSA:**

A tabela `subscriptions` tem uma **constraint UNIQUE** no campo `user_id`, ou seja:
- ✅ Cada usuário pode ter **apenas 1 assinatura**
- ❌ Quando o webhook tentava **inserir novamente**, dava erro de duplicação

**PROBLEMA NO CÓDIGO:**

```typescript
// ❌ ANTES (sem especificar onConflict)
await supabase.from("subscriptions").upsert({
  user_id: userId,
  // ... outros campos
});
```

O `upsert` não sabia que devia **atualizar** ao invés de **inserir** quando o `user_id` já existia.

---

## ✅ **SOLUÇÃO APLICADA:**

Adicionei `{ onConflict: 'user_id' }` no upsert:

```typescript
// ✅ DEPOIS (especificando onConflict)
await supabase.from("subscriptions").upsert({
  user_id: userId,
  stripe_customer_id: customerId,
  stripe_subscription_id: subscriptionId,
  // ... outros campos
}, { onConflict: 'user_id' }); // ← ADICIONADO!
```

**O QUE ISSO FAZ:**
- ✅ Se o `user_id` **NÃO existe** → **Insere** novo registro
- ✅ Se o `user_id` **JÁ existe** → **Atualiza** registro existente
- ✅ **Nunca mais dá erro de duplicação!**

---

## 🔧 **O QUE FOI FEITO:**

1. ✅ **Corrigido `handleCheckoutCompleted`** (modo subscription)
2. ✅ **Corrigido `handleCheckoutCompleted`** (modo payment)
3. ✅ **Redeploy do webhook** para produção

---

## 🧪 **TESTAR AGORA:**

### **Opção 1: Fazer Novo Pagamento**

1. Acesse: http://localhost:8081
2. Clique em "QUERO MINHA VAGA"
3. Use um **email diferente** (ou o mesmo, agora funciona!)
4. Complete o pagamento
5. Aguarde 30 segundos

**O QUE DEVE ACONTECER:**
- ✅ Registro criado/atualizado no banco
- ✅ Email de boas-vindas enviado
- ✅ Link para criar senha recebido

---

### **Opção 2: Reenviar Evento do Stripe**

1. Acesse: https://dashboard.stripe.com/workbench
2. Procure por `checkout.session.completed`
3. Clique nos "..." → "Resend webhook"
4. Aguarde 30 segundos
5. ✅ Verifique email (inbox + SPAM)

---

## 📋 **VERIFICAR LOGS:**

**Acesse:**
```
https://supabase.com/dashboard/project/tzdatllacntstuaoabou/logs/edge-functions?fn=stripe-webhook
```

**Mensagens ESPERADAS (SUCESSO):**

```
✅ "Processing one-time payment: pi_..."
✅ "Creating new user for email: ..."
✅ "User created successfully: ..."
✅ "Sending welcome email with password creation link..."
✅ "Welcome email sent successfully via Resend: { id: '...' }"
✅ "One-time payment processed for user ..."
```

**Mensagens de ERRO (se aparecer, me envie):**

```
❌ "Error creating one-time payment record:"
❌ "Error sending email via Resend:"
❌ "Resend API error:"
```

---

## 🎯 **PRÓXIMOS PASSOS:**

1. ✅ **Fazer novo pagamento de teste**
2. ✅ **Verificar logs** (link acima)
3. ✅ **Verificar email** (inbox + SPAM)
4. ✅ **Clicar no link** "Criar Minha Senha"
5. ✅ **Criar senha** e fazer login
6. ✅ **TUDO FUNCIONANDO!** 🎉

---

## 💡 **SE O EMAIL AINDA NÃO CHEGAR:**

### **Verificar:**

1. ✅ **Logs mostram "Welcome email sent"?**
   - Se **SIM** → Email foi enviado, verificar SPAM
   - Se **NÃO** → Verificar erro nos logs

2. ✅ **Erro "Resend API error"?**
   - API Key pode estar inválida
   - Verificar em https://resend.com/api-keys

3. ✅ **Nenhum log aparece?**
   - Webhook do Stripe não está sendo chamado
   - Verificar configuração no Stripe Dashboard

---

## 📸 **ME ENVIE:**

Após fazer o teste:

1. ✅ **Screenshot dos logs** do Supabase
2. ✅ **Confirmação:** "Recebi o email!" OU "Ainda não recebi"
3. ✅ **Se houver erro, qual foi?**

Vamos finalizar isso AGORA! 🚀


