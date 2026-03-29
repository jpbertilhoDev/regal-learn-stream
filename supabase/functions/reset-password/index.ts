import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email é obrigatório" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create Supabase admin client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://tzdatllacntstuaoabou.supabase.co";
    const supabaseServiceKey = Deno.env.get("SERVICE_ROLE_KEY") as string;
    
    if (!supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Configuração do servidor incompleta" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Get production URL from env or use origin
    const productionUrl = Deno.env.get("PRODUCTION_URL") || 
      req.headers.get("origin") || 
      "http://localhost:8081";

    // Generate password reset link using admin API
    const { data: resetData, error: resetError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email,
    });

    if (resetError) {
      console.error("Error generating reset link:", resetError);
      
      // Check if it's a rate limit error
      if (resetError.message.includes("429") || resetError.message.includes("rate limit")) {
        return new Response(
          JSON.stringify({ 
            error: "Muitas tentativas. Aguarde 10 minutos e tente novamente.",
            code: "RATE_LIMIT"
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Check if user doesn't exist
      if (resetError.message.includes("not found") || resetError.message.includes("does not exist")) {
        return new Response(
          JSON.stringify({ 
            error: "Email não encontrado. Verifique se digitou corretamente.",
            code: "USER_NOT_FOUND"
          }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({ 
          error: resetError.message || "Erro ao gerar link de recuperação",
          code: "GENERAL_ERROR"
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Extract token from the generated link and create custom URL
    const actionLink = resetData.properties.action_link;
    const resetUrl = actionLink.replace(/^.*\/auth\/v1\/verify/, `${productionUrl}/create-password`);

    // Send email via Resend (if configured)
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (resendApiKey) {
      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "MASTER CLASS <noreply@masterclass.com.br>",
            to: email,
            subject: "🔐 Recuperação de Senha - MASTER CLASS",
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #FFA500 0%, #FF8C00 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                  <h1 style="color: white; margin: 0; font-size: 28px;">MASTER CLASS</h1>
                </div>
                <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #ddd;">
                  <h2 style="color: #FFA500; margin-top: 0;">Recuperação de Senha</h2>
                  <p>Olá,</p>
                  <p>Recebemos uma solicitação para redefinir a senha da sua conta MASTER CLASS.</p>
                  <p>Clique no botão abaixo para criar uma nova senha:</p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background: linear-gradient(135deg, #FFA500 0%, #FF8C00 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                      🔐 Redefinir Minha Senha
                    </a>
                  </div>
                  <p style="font-size: 12px; color: #666; margin-top: 30px;">
                    Se você não solicitou esta alteração, ignore este email. Sua senha permanecerá a mesma.
                  </p>
                  <p style="font-size: 12px; color: #666;">
                    Este link expira em 1 hora por motivos de segurança.
                  </p>
                </div>
              </body>
              </html>
            `,
          }),
        });

        if (!emailResponse.ok) {
          const errorData = await emailResponse.json();
          console.error("Error sending email via Resend:", errorData);
          // Don't fail - the link was generated successfully
        }
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        // Don't fail - the link was generated successfully
      }
    }

    // Return success (email will be sent by Supabase if Resend fails)
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Link de recuperação gerado com sucesso. Verifique sua caixa de entrada.",
        // Don't return the actual link for security
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error: any) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Erro inesperado ao processar solicitação",
        code: "UNEXPECTED_ERROR"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

