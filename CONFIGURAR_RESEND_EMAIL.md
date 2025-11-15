# 📧 Configurar Resend para Envio de Emails Automáticos

## ✅ **O QUE FOI FEITO:**

### **1. Página de Login Atualizada** ✅
- ❌ Removida opção de "Criar Conta"
- ✅ Apenas LOGIN (email usado no pagamento)
- ✅ Adicionado "Esqueci minha senha"
- ✅ Link para "Garanta sua vaga" para quem não pagou

### **2. Fluxo Garantido:**
- ✅ Email do Stripe = Email de Login
- ✅ Conta criada automaticamente após pagamento
- ✅ Cliente usa o mesmo email do pagamento para entrar

---

## 🚀 **CONFIGURAR RESEND NO SUPABASE:**

### **Passo 1: Criar Conta no Resend**

1. Acesse: https://resend.com/signup
2. Crie sua conta gratuita
3. Confirme seu email

### **Passo 2: Adicionar Domínio (Opcional mas Recomendado)**

**Opção A: Usar domínio próprio (masterclass.com.br)**
1. Acesse: https://resend.com/domains
2. Clique em **"Add Domain"**
3. Digite seu domínio: `masterclass.com.br`
4. Adicione os registros DNS no seu provedor:
   ```
   Tipo: TXT
   Nome: @
   Valor: resend_verify=...
   
   Tipo: MX
   Nome: @
   Valor: feedback-smtp.us-east-1.amazonses.com
   Prioridade: 10
   ```
5. Aguarde verificação (5-10 minutos)

**Opção B: Usar domínio do Resend (teste)**
- Emails virão de: `onboarding@resend.dev`
- Funciona, mas pode cair em spam

### **Passo 3: Gerar API Key**

1. Acesse: https://resend.com/api-keys
2. Clique em **"Create API Key"**
3. Nome: `MASTER CLASS Supabase`
4. Permission: **Full Access**
5. **COPIE A API KEY** (começa com `re_...`)
   ⚠️ Só aparece uma vez!

### **Passo 4: Configurar no Supabase**

1. Acesse: https://supabase.com/dashboard/project/tzdatllacntstuaoabou/settings/auth
2. Role até **"SMTP Settings"**
3. Clique em **"Enable Custom SMTP"**
4. Preencha:

```
SMTP Host: smtp.resend.com
SMTP Port: 465
SMTP Username: resend
SMTP Password: [Sua API Key do Resend - re_...]
Sender Email: noreply@masterclass.com.br (ou seu domínio)
Sender Name: MASTER CLASS
```

5. Clique em **"Save"**

### **Passo 5: Teste**

Execute no PowerShell:

```powershell
# Teste de envio de email
curl -X POST "https://tzdatllacntstuaoabou.supabase.co/auth/v1/recover" `
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6ZGF0bGxhY250c3R1YW9hYm91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MzYwMDYsImV4cCI6MjA3ODUxMjAwNn0.SGB352z9MHTyY130M6T_tMNRm3pZfsQvRSeE5E0fbF8" `
  -H "Content-Type: application/json" `
  -d '{"email": "seu-email-teste@gmail.com"}'
```

Você deve receber um email em segundos!

---

## 📧 **PERSONALIZAR TEMPLATES DE EMAIL:**

### **1. Acesse Templates**

https://supabase.com/dashboard/project/tzdatllacntstuaoabou/auth/templates

### **2. Selecione "Confirm signup" ou "Magic Link"**

### **3. Personalize o HTML**

**Template Sugerido para "Reset Password" (Boas-vindas):**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Bem-vindo à MASTER CLASS</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  
  <!-- Header com Logo -->
  <div style="background: linear-gradient(135deg, #D4AF37 0%, #B8932C 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: #000; margin: 0; font-size: 32px; font-weight: bold;">
      🎉 BEM-VINDO À MASTER CLASS
    </h1>
  </div>

  <!-- Conteúdo -->
  <div style="background: #ffffff; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    
    <p style="font-size: 18px; color: #333; margin-bottom: 20px;">
      Olá! 👋
    </p>

    <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 20px;">
      Seu pagamento foi <strong style="color: #28a745;">confirmado com sucesso</strong>! 🎊
    </p>

    <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 30px;">
      Agora você tem acesso completo à plataforma MASTER CLASS. Estamos muito felizes em ter você conosco nessa jornada de transformação!
    </p>

    <!-- Box de Instruções -->
    <div style="background: #f8f9fa; border-left: 4px solid #D4AF37; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
      <h3 style="color: #333; margin-top: 0; font-size: 18px;">📝 Próximos Passos:</h3>
      <ol style="color: #555; line-height: 1.8; margin: 10px 0;">
        <li>Clique no botão abaixo para <strong>criar sua senha</strong></li>
        <li>Faça login na plataforma</li>
        <li>Comece sua jornada de transformação!</li>
      </ol>
    </div>

    <!-- Botão de Ação -->
    <div style="text-align: center; margin: 40px 0;">
      <a href="{{ .ConfirmationURL }}" 
         style="display: inline-block; 
                padding: 16px 40px; 
                background: linear-gradient(135deg, #D4AF37 0%, #B8932C 100%); 
                color: #000; 
                text-decoration: none; 
                border-radius: 8px; 
                font-weight: bold; 
                font-size: 18px;
                box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);">
        🔑 Criar Minha Senha
      </a>
    </div>

    <!-- Benefícios -->
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
      <h3 style="color: #333; margin-top: 0; text-align: center; font-size: 20px;">
        ✨ O Que Você Vai Encontrar:
      </h3>
      <ul style="list-style: none; padding: 0; margin: 20px 0;">
        <li style="padding: 10px 0; color: #555; font-size: 16px;">
          ✅ <strong>Acesso vitalício</strong> a todas as trilhas
        </li>
        <li style="padding: 10px 0; color: #555; font-size: 16px;">
          ✅ <strong>Mentorias exclusivas</strong> com especialistas
        </li>
        <li style="padding: 10px 0; color: #555; font-size: 16px;">
          ✅ <strong>Comunidade</strong> de alunos engajados
        </li>
        <li style="padding: 10px 0; color: #555; font-size: 16px;">
          ✅ <strong>Certificados</strong> de conclusão
        </li>
        <li style="padding: 10px 0; color: #555; font-size: 16px;">
          ✅ <strong>Suporte direto</strong> com a equipe
        </li>
      </ul>
    </div>

    <!-- Suporte -->
    <div style="text-align: center; padding: 20px 0; border-top: 1px solid #e0e0e0; margin-top: 30px;">
      <p style="color: #777; font-size: 14px; margin: 0;">
        Precisa de ajuda? Entre em contato:
        <a href="mailto:suporte@masterclass.com.br" style="color: #D4AF37; text-decoration: none;">
          suporte@masterclass.com.br
        </a>
      </p>
    </div>

  </div>

  <!-- Footer -->
  <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
    <p style="margin: 5px 0;">
      © 2024 MASTER CLASS - Todos os direitos reservados
    </p>
    <p style="margin: 5px 0;">
      Se você não solicitou este email, pode ignorá-lo com segurança.
    </p>
  </div>

</body>
</html>
```

---

## 🎨 **VARIÁVEIS DISPONÍVEIS NO TEMPLATE:**

- `{{ .Email }}` - Email do usuário
- `{{ .ConfirmationURL }}` - Link para criar/resetar senha
- `{{ .SiteURL }}` - URL da aplicação (http://localhost:8081 ou seu domínio)
- `{{ .Token }}` - Token de confirmação
- `{{ .TokenHash }}` - Hash do token

---

## 📊 **MONITORAR EMAILS NO RESEND:**

### **Dashboard do Resend:**

1. Acesse: https://resend.com/emails
2. Veja:
   - ✅ Emails enviados
   - ✅ Emails entregues
   - ✅ Emails abertos
   - ✅ Links clicados
   - ❌ Bounces/Erros

---

## 🧪 **TESTE COMPLETO:**

### **1. Fazer Pagamento de Teste**

1. Acesse: `http://localhost:8081`
2. Clique em "Garantir Minha Vaga"
3. Use um **email real**
4. Complete o pagamento

### **2. Verificar Email**

Dentro de **30-60 segundos**, você deve receber:

**Assunto:** "Reset Your Password" (ou personalizado)  
**De:** noreply@masterclass.com.br  
**Para:** email-usado-no-pagamento@gmail.com

### **3. Clicar no Link**

1. Abra o email
2. Clique em "Criar Minha Senha"
3. Crie sua senha
4. Faça login
5. **Acesse a plataforma!** 🎉

---

## 💰 **CUSTOS DO RESEND:**

### **Plano Gratuito:**
- ✅ 100 emails/dia
- ✅ 3.000 emails/mês
- ✅ Perfeito para começar!

### **Plano Pago ($20/mês):**
- ✅ 50.000 emails/mês
- ✅ Domínio personalizado
- ✅ Suporte prioritário

---

## ⚙️ **CONFIGURAÇÃO RECOMENDADA:**

```
SMTP Host: smtp.resend.com
SMTP Port: 465 (SSL) ou 587 (TLS)
SMTP Username: resend
SMTP Password: re_SuaApiKey...
Sender Email: noreply@masterclass.com.br
Sender Name: MASTER CLASS
```

---

## 🔒 **SEGURANÇA:**

### **Proteja sua API Key:**
- ❌ NUNCA compartilhe sua API Key
- ❌ NUNCA commite no Git
- ✅ Use apenas no Supabase Dashboard
- ✅ Rotacione periodicamente

### **SPF e DKIM:**

Se usar domínio próprio, configure:

```
Tipo: TXT
Nome: @
Valor: v=spf1 include:amazonses.com ~all

Tipo: TXT
Nome: resend._domainkey
Valor: [Fornecido pelo Resend]
```

---

## ✅ **CHECKLIST FINAL:**

### **Resend:**
- [ ] Conta criada
- [ ] Domínio adicionado (opcional)
- [ ] DNS configurado
- [ ] API Key gerada

### **Supabase:**
- [ ] SMTP habilitado
- [ ] Credenciais configuradas
- [ ] Templates personalizados
- [ ] Teste de envio realizado

### **Fluxo:**
- [x] Login atualizado (só login, sem criar conta)
- [x] "Esqueci minha senha" adicionado
- [x] Email do Stripe = Email de login
- [ ] Email automático funcionando
- [ ] Templates personalizados

---

## 🆘 **PROBLEMAS COMUNS:**

### **"Email não chega"**

1. Verifique SPAM
2. Verifique API Key no Supabase
3. Veja logs: https://resend.com/emails
4. Teste com outro email

### **"Email vai para SPAM"**

1. Configure SPF/DKIM
2. Use domínio próprio
3. Adicione remetente na lista de contatos

### **"Link do email expirou"**

1. Links expiram em 24 horas
2. Use "Esqueci minha senha" para novo link

---

**📧 CONFIGURAÇÃO COMPLETA! Emails automáticos via Resend prontos!**

**Última atualização:** 14 de novembro de 2025  
**Status:** ✅ Login atualizado | ⏳ Aguardando configuração do Resend


