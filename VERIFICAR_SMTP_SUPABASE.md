# 🔍 VERIFICAR CONFIGURAÇÃO SMTP - SUPABASE

## 🚨 **PROBLEMA IDENTIFICADO:**

O webhook do Supabase está sendo chamado pelo Stripe, MAS:
- ❌ Não cria usuário na base de dados
- ❌ Não envia email
- ❌ Eventos do Stripe estão falhando

**CAUSA PROVÁVEL:** SMTP não está configurado ou está com erro!

---

## ⚡ **VERIFICAÇÃO URGENTE (5 MINUTOS):**

### **PASSO 1: Verificar se SMTP está Habilitado**

1. **Acesse:**
   ```
   https://supabase.com/dashboard/project/tzdatllacntstuaoabou/settings/auth
   ```

2. **Role até a seção "SMTP Settings"**

3. **Verifique:**

   **A. "Enable Custom SMTP" está LIGADO?**
   ```
   ✅ ON (verde) → Continuar para verificar configuração
   ❌ OFF (cinza) → ESSE É O PROBLEMA! Ative agora!
   ```

---

### **PASSO 2: Verificar Configuração SMTP**

Se o "Enable Custom SMTP" estiver **LIGADO**, verifique se está assim:

```
Host: smtp.resend.com
Port: 587
Username: resend
Password: re_UfY3YF1r_HscB7Ah8EURvFWeY39Cvypue
Sender email: onboarding@resend.dev
Sender name: MASTER CLASS
```

**Se estiver DIFERENTE:**
- ❌ Pode estar causando erro de envio de email
- ✅ Corrija para os valores acima

---

### **PASSO 3: Testar SMTP**

No mesmo dashboard, procure por um botão:
```
[Test SMTP Configuration]  ou  [Send test email]
```

Se existir, clique e teste!

---

## 🔍 **OUTRA VERIFICAÇÃO: SERVICE_ROLE_KEY**

O webhook precisa da **SERVICE_ROLE_KEY** para criar usuários!

1. **Acesse:**
   ```
   https://supabase.com/dashboard/project/tzdatllacntstuaoabou/settings/api
   ```

2. **Procure por "service_role key"**

3. **Clique em "Reveal" e copie**

4. **Execute este comando:**
   ```powershell
   npx supabase secrets set SERVICE_ROLE_KEY=SUA_CHAVE_AQUI --project-ref tzdatllacntstuaoabou
   ```

---

## 📊 **POSSÍVEIS PROBLEMAS:**

### **Problema 1: SMTP Desabilitado** ⚠️
```
Sintoma: Webhook executa mas email não é enviado
Solução: Ativar "Enable Custom SMTP"
```

### **Problema 2: SMTP Mal Configurado** ⚠️
```
Sintoma: Erro ao tentar enviar email
Solução: Corrigir host, port, username, password
```

### **Problema 3: SERVICE_ROLE_KEY Incorreta** ⚠️
```
Sintoma: Erro ao criar usuário
Solução: Atualizar SERVICE_ROLE_KEY
```

### **Problema 4: API Key do Resend Expirada** ⚠️
```
Sintoma: Erro 401 ao enviar email
Solução: Gerar nova API Key no Resend
```

---

## 🛠️ **SOLUÇÃO RÁPIDA:**

### **Se SMTP estiver DESABILITADO:**

1. Vá para: https://supabase.com/dashboard/project/tzdatllacntstuaoabou/settings/auth

2. Procure "SMTP Settings"

3. **Ative "Enable Custom SMTP"** (toggle para ON)

4. **Preencha:**
   ```
   Host: smtp.resend.com
   Port: 587 (ou 2587)
   Username: resend
   Password: re_UfY3YF1r_HscB7Ah8EURvFWeY39Cvypue
   Sender email: onboarding@resend.dev
   Sender name: MASTER CLASS
   Enable email confirmations: OFF (desligado)
   ```

5. **Clique em "Save"**

6. **Aguarde 1 minuto**

7. **Faça novo pagamento de teste**

---

## 📋 **CHECKLIST:**

- [ ] SMTP está habilitado (Enable Custom SMTP = ON)
- [ ] Host = smtp.resend.com
- [ ] Port = 587
- [ ] Username = resend
- [ ] Password = re_UfY3YF1r_HscB7Ah8EURvFWeY39Cvypue
- [ ] Sender email = onboarding@resend.dev
- [ ] SERVICE_ROLE_KEY está configurada
- [ ] STRIPE_WEBHOOK_SECRET está configurada

---

## 🔍 **COMO VER OS ERROS EXATOS:**

### **1. Logs do Supabase Edge Function:**
```
https://supabase.com/dashboard/project/tzdatllacntstuaoabou/logs/edge-functions
```

Procure por:
- `stripe-webhook`
- Mensagens de erro em vermelho
- "Error creating user"
- "Error sending email"

### **2. Logs do Stripe:**
```
https://dashboard.stripe.com/test/events
```

Clique no evento `checkout.session.completed` que falhou e veja:
- Response code (400, 401, 500?)
- Mensagem de erro

---

## 💡 **TESTE RÁPIDO:**

### **Teste Manual de Email (sem pagamento):**

1. Vá para: https://supabase.com/dashboard/project/tzdatllacntstuaoabou/auth/users

2. Clique em "Invite user" ou "Add user"

3. Digite um email de teste

4. Supabase vai tentar enviar email de convite

5. **Se o email NÃO chegar:**
   - ❌ SMTP está mal configurado
   - Verifique configurações

6. **Se o email CHEGAR:**
   - ✅ SMTP está OK!
   - O problema é outro (provavelmente SERVICE_ROLE_KEY)

---

## 🎯 **FAÇA ISSO AGORA:**

1. ✅ Acesse: https://supabase.com/dashboard/project/tzdatllacntstuaoabou/settings/auth

2. ✅ Verifique seção "SMTP Settings"

3. ✅ Me diga:
   - "Enable Custom SMTP" está ON ou OFF?
   - Quais são os valores de Host, Port, Username?

4. ✅ Acesse: https://supabase.com/dashboard/project/tzdatllacntstuaoabou/logs/edge-functions

5. ✅ Me envie os erros que aparecem em vermelho!

Com essas informações, vou identificar o problema exato! 🔍

---

**🚀 COMECE PELA VERIFICAÇÃO DO SMTP!**


