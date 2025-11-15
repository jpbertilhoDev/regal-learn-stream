# 🚨 CONFIGURAR WEBHOOK DO STRIPE - URGENTE!

## ❌ **PROBLEMA:**

Você fez o pagamento MAS:
- ❌ Subscription NÃO foi criada no banco (tabela vazia)
- ❌ Email de boas-vindas NÃO foi enviado
- ❌ Sistema NÃO está funcionando

**CAUSA:** Webhook do Stripe **NÃO está configurado ou NÃO está funcionando!**

---

## ⚡ **SOLUÇÃO URGENTE (10 MINUTOS):**

### **PASSO 1: Verificar se Webhook Existe**

1. **Acesse:**
   ```
   https://dashboard.stripe.com/webhooks
   ```

2. **O que você vê?**

   **A. Lista VAZIA ou sem este endpoint:**
   ```
   https://tzdatllacntstuaoabou.supabase.co/functions/v1/stripe-webhook
   ```
   → ❌ **Webhook NÃO está configurado!** (vá para PASSO 2)

   **B. Webhook existe:**
   ```
   URL: https://tzdatllacntstuaoabou.supabase.co/functions/v1/stripe-webhook
   Status: Enabled ✅ ou Disabled ❌
   ```
   → Se **Disabled**, clique em "..." → "Enable"
   → Se **Enabled**, vá para PASSO 4 (ver logs)

---

### **PASSO 2: Criar Webhook (SE NÃO EXISTIR)**

1. **No Stripe Dashboard, clique em:**
   ```
   [Add endpoint]  ← Botão azul no canto superior direito
   ```

2. **Preencha:**

   **Endpoint URL:**
   ```
   https://tzdatllacntstuaoabou.supabase.co/functions/v1/stripe-webhook
   ```

   **Description (opcional):**
   ```
   MASTER CLASS - Webhook de Pagamentos
   ```

   **Version:**
   ```
   Latest API version (padrão)
   ```

3. **Clique em "Select events"**

4. **Marque ESTES 5 eventos:**
   ```
   ✅ checkout.session.completed
   ✅ customer.subscription.updated
   ✅ customer.subscription.deleted
   ✅ invoice.payment_succeeded
   ✅ invoice.payment_failed
   ```

   **Como encontrar:**
   - Use a busca no topo
   - Digite "checkout.session.completed"
   - Marque o checkbox
   - Repita para os outros 4 eventos

5. **Clique em "Add events"**

6. **Clique em "Add endpoint"** (botão final)

7. **✅ Webhook criado!**

---

### **PASSO 3: Copiar Signing Secret**

**MUITO IMPORTANTE!** ⚠️

1. **Após criar o webhook, você verá:**
   ```
   Signing secret
   whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
   [Reveal]  [Copy]
   ```

2. **Clique em "Reveal"** (se estiver oculto)

3. **Clique em "Copy"** ou copie manualmente

4. **O secret começa com:** `whsec_`

5. **Exemplo:**
   ```
   whsec_1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P
   ```

6. **GUARDE ESSE SECRET!** Você vai precisar no próximo passo!

---

### **PASSO 4: Configurar Secret no Supabase**

1. **Abra o PowerShell/Terminal**

2. **Cole este comando (SUBSTITUA o secret):**
   ```powershell
   npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_SEU_SECRET_AQUI --project-ref tzdatllacntstuaoabou
   ```

   **ATENÇÃO:** Substitua `whsec_SEU_SECRET_AQUI` pelo secret que você copiou!

3. **Exemplo REAL:**
   ```powershell
   npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_1A2B3C4D5E6F7G8H9I0J --project-ref tzdatllacntstuaoabou
   ```

4. **Pressione Enter**

5. **Aguarde o comando finalizar**

6. **Você verá:**
   ```
   Updated secrets for project: tzdatllacntstuaoabou
   ```

7. **✅ Secret configurado!**

---

### **PASSO 5: Testar o Webhook**

#### **Opção A: Fazer Novo Pagamento de Teste**

1. **Acesse:** `http://localhost:8081`

2. **Faça um novo pagamento de teste**

3. **Use cartão de teste:**
   ```
   Número: 4242 4242 4242 4242
   Data: 12/25
   CVC: 123
   ```

4. **Complete o pagamento**

5. **Aguarde 1-2 minutos**

6. **Verifique:**
   - Tabela `subscriptions` no Supabase
   - Email na caixa de entrada (e SPAM!)

---

#### **Opção B: Testar Webhook Manualmente (Sem Pagar)**

1. **No Stripe Dashboard, vá para o webhook que você criou**

2. **Clique em "..." (3 pontinhos)**

3. **Clique em "Send test webhook"**

4. **Selecione:** `checkout.session.completed`

5. **Clique em "Send test webhook"**

6. **Veja o resultado:**
   - **200 OK** ✅ = Funcionou!
   - **400/500 Error** ❌ = Tem erro (veja os logs)

---

### **PASSO 6: Verificar se Funcionou**

#### **1. Ver Subscription no Banco:**

**Acesse:**
```
https://supabase.com/dashboard/project/tzdatllacntstuaoabou/editor
```

**Clique em:** `subscriptions` (tabela)

**O que você deve ver:**
```
✅ 1 ou mais registros
✅ Com user_id, stripe_customer_id, status: "active"
```

**Se a tabela AINDA estiver vazia:** ❌
```
→ Webhook não funcionou
→ Vá para PASSO 7 (Debug)
```

---

#### **2. Ver Email Enviado:**

**Verifique:**
1. ✅ Caixa de entrada
2. ✅ SPAM/Lixo Eletrônico
3. ✅ Resend Dashboard: https://resend.com/emails

---

### **PASSO 7: Debug (SE NÃO FUNCIONAR)**

#### **Ver Logs do Webhook no Stripe:**

1. **Acesse:**
   ```
   https://dashboard.stripe.com/test/events
   ```

2. **Procure pelo evento mais recente:**
   - Tipo: `checkout.session.completed`
   - Quando você fez o pagamento

3. **Clique no evento**

4. **Role até "Webhook details"**

5. **Veja:**
   - **Attempt 1, 2, 3...** (tentativas)
   - **Response code:**
     - **200** = ✅ Sucesso!
     - **400** = ❌ Bad request (erro no código)
     - **401** = ❌ Unauthorized (secret errado)
     - **500** = ❌ Server error (erro no webhook)

6. **Clique em "View details"**

7. **Veja a mensagem de erro completa**

8. **ME ENVIE O ERRO!** 🆘

---

#### **Ver Logs do Supabase:**

1. **Acesse:**
   ```
   https://supabase.com/dashboard/project/tzdatllacntstuaoabou/logs/functions
   ```

2. **Selecione:** `stripe-webhook`

3. **Veja os logs recentes**

4. **Procure por erros em vermelho**

5. **ME ENVIE OS LOGS!** 🆘

---

## 🎯 **CHECKLIST COMPLETO:**

Marque o que você JÁ FEZ:

- [ ] 1. Acessei https://dashboard.stripe.com/webhooks
- [ ] 2. Webhook existe? (Se não, criei)
- [ ] 3. Webhook está "Enabled"?
- [ ] 4. Copiei o Signing Secret (whsec_...)
- [ ] 5. Executei: `npx supabase secrets set STRIPE_WEBHOOK_SECRET=...`
- [ ] 6. Fiz um pagamento de teste
- [ ] 7. Aguardei 1-2 minutos
- [ ] 8. Verifiquei tabela `subscriptions`
- [ ] 9. Verifiquei email (inbox + spam)

---

## 📊 **DIAGNÓSTICO RÁPIDO:**

### **Se a tabela `subscriptions` estiver vazia:**

| Situação | Causa | Solução |
|----------|-------|---------|
| Webhook não existe no Stripe | Não foi criado | Criar agora (PASSO 2) |
| Webhook existe mas "Disabled" | Foi desativado | Ativar webhook |
| Webhook existe e "Enabled" | Secret errado ou erro no código | Ver logs (PASSO 7) |
| Evento não aparece nos logs | Pagamento não foi concluído | Fazer novo pagamento |

---

## ⚠️ **MODO TEST vs LIVE:**

**ATENÇÃO:** Você está usando chaves LIVE ou TEST?

### **Se usando chaves LIVE:**
```
Webhook precisa estar em:
https://dashboard.stripe.com/webhooks (live mode)
```

### **Se usando chaves TEST:**
```
Webhook precisa estar em:
https://dashboard.stripe.com/test/webhooks (test mode)
```

**IMPORTANTE:** O modo do webhook precisa ser o MESMO das suas chaves API!

---

## 🔧 **COMANDOS ÚTEIS:**

### **Ver secrets configurados no Supabase:**
```powershell
npx supabase secrets list --project-ref tzdatllacntstuaoabou
```

### **Atualizar secret:**
```powershell
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_NOVO_SECRET --project-ref tzdatllacntstuaoabou
```

### **Deploy do webhook (se fez alterações):**
```powershell
npx supabase functions deploy stripe-webhook --project-ref tzdatllacntstuaoabou --no-verify-jwt
```

---

## 🆘 **SE NADA FUNCIONAR:**

**ME ENVIE:**

1. ✅ Print do Stripe Dashboard (webhooks)
2. ✅ Print dos logs do evento no Stripe
3. ✅ Print dos logs do Supabase
4. ✅ Qual modo você está usando? (Test ou Live)
5. ✅ Qual chave API você está usando? (pk_test ou pk_live)

Com essas informações, vou identificar o problema exato! 🔍

---

## ✅ **DEPOIS QUE FUNCIONAR:**

1. ✅ Tabela `subscriptions` terá registros
2. ✅ Email de boas-vindas chegará
3. ✅ Cliente conseguirá criar senha e fazer login
4. ✅ Sistema funcionará perfeitamente!

---

**🚀 COMECE AGORA PELO PASSO 1!**

Verifique se o webhook existe no Stripe e me diga o resultado! 🔍


