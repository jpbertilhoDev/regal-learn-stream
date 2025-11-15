# 🔍 VERIFICAR LOGS DO EMAIL - DIAGNÓSTICO

## 🎯 **O QUE FAZER:**

### **1. Verificar Logs do Webhook**

**Acesse:**
```
https://supabase.com/dashboard/project/tzdatllacntstuaoabou/logs/edge-functions?fn=stripe-webhook
```

**Procure por estas mensagens:**

✅ **Mensagens de SUCESSO:**
```
✅ "Sending welcome email with password creation link..."
✅ "Welcome email sent successfully via Resend:"
✅ "One-time payment processed for user"
```

❌ **Mensagens de ERRO:**
```
❌ "Error sending email via Resend:"
❌ "Resend API error:"
❌ "Error sending welcome email:"
```

---

### **2. Testar Novamente**

**Opção A: Fazer Novo Pagamento (Teste Rápido)**

1. Acesse: http://localhost:8081
2. Clique em "QUERO MINHA VAGA"
3. Use **email diferente** do anterior
4. Complete o pagamento
5. Aguarde 30 segundos
6. ✅ Verifique email (inbox + SPAM)

**Opção B: Reenviar Evento do Stripe**

1. https://dashboard.stripe.com/workbench
2. Procure por `checkout.session.completed`
3. Clique nos "..." → "Resend webhook"
4. Aguarde 30 segundos
5. ✅ Verifique logs no Supabase

---

### **3. Verificar Secrets Configurados**

```powershell
npx supabase secrets list --project-ref tzdatllacntstuaoabou
```

**Deve mostrar:**
```
✅ STRIPE_SECRET_KEY
✅ STRIPE_WEBHOOK_SECRET
✅ SERVICE_ROLE_KEY
✅ RESEND_API_KEY
✅ PRODUCTION_URL
```

---

## 🧪 **TESTE MANUAL DO RESEND (PARA CONFIRMAR API KEY)**

**Cole este comando (SUBSTITUA o email):**

```powershell
$body = @{
  from = "MASTER CLASS <onboarding@resend.dev>"
  to = @("SEU_EMAIL@gmail.com")
  subject = "🧪 Teste Manual"
  html = "<h1>Email de Teste</h1><p>Se você recebeu este email, o Resend está OK!</p>"
} | ConvertTo-Json

$resendKey = "re_UfY3YF1r_HscB7Ah8EURvFWeY39Cvypue"

$headers = @{
  "Authorization" = "Bearer $resendKey"
  "Content-Type" = "application/json"
}

try {
  $response = Invoke-RestMethod -Uri "https://api.resend.com/emails" -Method POST -Headers $headers -Body $body
  Write-Host "✅ EMAIL ENVIADO! ID: $($response.id)" -ForegroundColor Green
} catch {
  Write-Host "❌ ERRO: $($_.Exception.Message)" -ForegroundColor Red
}
```

Se **FUNCIONAR** → API Key OK, problema é no webhook  
Se **FALHAR** → API Key inválida/expirada

---

## 🚨 **POSSÍVEIS PROBLEMAS:**

### **1. Email Caindo no SPAM**
```
Solução: Verificar pasta SPAM do Gmail
```

### **2. Resend Bloqueando por Domínio**
```
Causa: onboarding@resend.dev só funciona para testes
Solução: Usar domínio próprio verificado no Resend
```

### **3. Link de Reset Malformado**
```
Causa: PRODUCTION_URL incorreta
Solução: Configurei como http://localhost:8081
```

### **4. Webhook Não Está Sendo Chamado**
```
Causa: Stripe não está enviando webhook
Solução: Verificar configuração no Stripe Dashboard
```

---

## 📋 **CHECKLIST DE DIAGNÓSTICO:**

Execute cada passo e me diga o resultado:

- [ ] 1. Acessei logs do Supabase (link acima)
- [ ] 2. Fiz novo pagamento de teste
- [ ] 3. Vi nos logs: "Sending welcome email..." ✅
- [ ] 4. Vi nos logs: "Welcome email sent..." ✅
- [ ] 5. Recebi email na caixa de entrada ✅
- [ ] 6. OU recebi email no SPAM ✅
- [ ] 7. OU vi erro nos logs (me envie o erro!) ❌

---

## 🎯 **ME ENVIE:**

1. ✅ **Screenshot dos logs do Supabase** (após fazer pagamento)
2. ✅ **Resultado do teste manual do Resend** (comando acima)
3. ✅ **Se viu algum erro, qual foi?**

Com essas informações, vou identificar o problema EXATO! 🔍


