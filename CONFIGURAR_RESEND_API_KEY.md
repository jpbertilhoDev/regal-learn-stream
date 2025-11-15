# 🔑 CONFIGURAR RESEND API KEY - RESOLVER EMAIL

## 🚨 **PROBLEMA ENCONTRADO:**

```
❌ Erro 403 ao enviar email via Resend
```

**CAUSA:** A API Key do Resend está:
- Incorreta
- Expirada  
- Sem permissão

---

## ✅ **SOLUÇÃO (3 MINUTOS):**

### **PASSO 1: Gerar Nova API Key no Resend**

1. **Acesse o Resend Dashboard:**
   ```
   https://resend.com/api-keys
   ```

2. **Faça login** (se necessário)

3. **Clique em "Create API Key"**

4. **Preencha:**
   ```
   Name: MASTER CLASS Production
   Permission: Full Access (ou Sending Access)
   Domain: All Domains
   ```

5. **Clique em "Create"**

6. **COPIE a API Key** (começa com `re_`)
   ```
   Exemplo: re_ABC123XYZ456...
   ```

   ⚠️ **IMPORTANTE:** Copie AGORA! Não vai aparecer de novo!

---

### **PASSO 2: Configurar no Supabase**

**Cole este comando (SUBSTITUA a API key):**

```powershell
npx supabase secrets set RESEND_API_KEY=re_SUA_NOVA_KEY_AQUI --project-ref tzdatllacntstuaoabou
```

**Exemplo:**
```powershell
npx supabase secrets set RESEND_API_KEY=re_ABC123XYZ456 --project-ref tzdatllacntstuaoabou
```

---

### **PASSO 3: Redeploy do Webhook**

```powershell
npx supabase functions deploy stripe-webhook --project-ref tzdatllacntstuaoabou --no-verify-jwt
```

---

### **PASSO 4: Testar**

**Reenviar evento do Stripe:**

1. https://dashboard.stripe.com/test/workbench
2. Clique no evento `checkout.session.completed`
3. "..." → "Resend"
4. Aguarde 30 segundos
5. ✅ Verifique email (inbox + SPAM!)

---

## 🧪 **TESTE RÁPIDO DA API KEY:**

Depois de configurar, teste se funciona:

```powershell
$body = @{
  from = "MASTER CLASS <onboarding@resend.dev>"
  to = @("SEU_EMAIL_AQUI@gmail.com")
  subject = "🧪 Teste MASTER CLASS"
  html = "<h1>Funciona!</h1><p>Se você recebeu este email, o Resend está OK!</p>"
} | ConvertTo-Json

$headers = @{
  "Authorization" = "Bearer SUA_NOVA_API_KEY_AQUI"
  "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri "https://api.resend.com/emails" -Method POST -Headers $headers -Body $body
```

Se funcionar, você verá:
```json
{ "id": "abc-123-xyz" }
```

E receberá o email em 30 segundos!

---

## ⚠️ **VERIFICAÇÕES IMPORTANTES:**

### **1. Email "From" Precisa Estar Verificado:**

No Resend, o email `onboarding@resend.dev` é um **domínio de teste**.

**Para produção**, você precisa:

1. Adicionar seu próprio domínio no Resend
2. Verificar DNS (SPF, DKIM)
3. Usar email do seu domínio

**OU**

Use o domínio de teste do Resend enquanto testa:
- `onboarding@resend.dev` ✅ (funciona para testes)

---

### **2. Limites do Resend (Plano Gratuito):**

- ✅ 100 emails por dia
- ✅ 1 email por segundo
- ✅ 3.000 emails por mês

Se atingiu o limite → Upgrade ou aguarde reset (00:00 UTC)

---

### **3. IP/Domínio Pode Estar Bloqueado:**

Se você enviou muitos emails de teste, o Resend pode ter bloqueado temporariamente.

**Solução:**
- Aguarde 1 hora
- Ou crie nova conta no Resend

---

## 🔍 **TROUBLESHOOTING:**

### **Erro 403 - Forbidden:**
```
Causa: API Key inválida, expirada ou sem permissão
Solução: Gerar nova API Key no Resend
```

### **Erro 429 - Too Many Requests:**
```
Causa: Limite de emails excedido
Solução: Aguardar reset ou fazer upgrade
```

### **Erro 422 - Validation Error:**
```
Causa: Email "from" não verificado ou formato inválido
Solução: Usar onboarding@resend.dev ou verificar seu domínio
```

---

## 📋 **CHECKLIST:**

- [ ] 1. Acessei https://resend.com/api-keys
- [ ] 2. Criei nova API Key
- [ ] 3. Copiei a API Key (re_...)
- [ ] 4. Executei: `npx supabase secrets set RESEND_API_KEY=...`
- [ ] 5. Fiz redeploy: `npx supabase functions deploy stripe-webhook`
- [ ] 6. Testei enviando email de teste (comando acima)
- [ ] 7. Recebi o email de teste ✅
- [ ] 8. Reenviei evento do Stripe
- [ ] 9. Recebi email de boas-vindas ✅
- [ ] 10. ✅ **EMAIL FUNCIONANDO!**

---

## 🎯 **ALTERNATIVA: USAR SMTP DO SUPABASE**

Se o Resend não funcionar, você pode usar o **SMTP do Supabase**:

1. **Acesse:**
   ```
   https://supabase.com/dashboard/project/tzdatllacntstuaoabou/settings/auth
   ```

2. **Ative "Enable Custom SMTP"**

3. **Configure:**
   ```
   Host: smtp.resend.com
   Port: 587
   Username: resend
   Password: SUA_API_KEY_DO_RESEND
   Sender email: onboarding@resend.dev
   Sender name: MASTER CLASS
   ```

4. **Modifique o webhook** para usar `supabase.auth.resetPasswordForEmail()` em vez de Resend API direto

---

## 💡 **QUAL API KEY VOCÊ TEM?**

Me envie:

1. ✅ **Última API Key que você criou no Resend** (começa com `re_`)

2. ✅ **Quando foi criada?** (pode ter expirado se for muito antiga)

3. ✅ **Qual plano você tem no Resend?** (Free, Pro?)

Com essas informações, vou configurar corretamente! 🔧

---

**🔑 GERE UMA NOVA API KEY NO RESEND E ME ENVIE!**

Link direto: https://resend.com/api-keys


