import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

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
    const { priceId, mode = "subscription", anonymous = false } = await req.json();
    
    console.log("Creating checkout session:", { priceId, mode, anonymous });

    if (!priceId) {
      throw new Error("Missing priceId");
    }

    // Create checkout session (anonymous or authenticated)
    const sessionConfig: any = {
      mode: mode as "subscription" | "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get("origin")}/auth?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/`,
      allow_promotion_codes: true,
      billing_address_collection: "required",
      customer_creation: "always", // Sempre cria customer no Stripe
      locale: "pt-BR", // Interface em português
    };

    // Configurar parcelamento para pagamentos no Brasil
    if (mode === "payment") {
      sessionConfig.payment_method_options = {
        card: {
          installments: {
            enabled: true, // Habilita parcelamento
          },
        },
      };
    }

    // Se for anonymous (sem login), Stripe vai pedir email
    if (anonymous) {
      console.log("Anonymous checkout - Stripe will collect email");
      sessionConfig.customer_email = undefined; // Stripe vai pedir
    } else {
      // Se tiver auth, usa o email do usuário
      const authHeader = req.headers.get("Authorization");
      if (authHeader) {
        try {
          const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://tzdatllacntstuaoabou.supabase.co";
          const supabaseServiceKey = Deno.env.get("SERVICE_ROLE_KEY");
          
          if (!supabaseServiceKey) {
            console.warn("SERVICE_ROLE_KEY not configured - proceeding with anonymous");
          } else {
            const supabase = createClient(supabaseUrl, supabaseServiceKey);
            const token = authHeader.replace("Bearer ", "");
            const { data: { user } } = await supabase.auth.getUser(token);
            
            if (user?.email) {
              sessionConfig.customer_email = user.email;
              sessionConfig.metadata = { supabase_user_id: user.id };
              console.log("Using authenticated user email");
            }
          }
        } catch (authError) {
          console.warn("Auth error, proceeding with anonymous:", authError);
        }
      }
    }

    console.log("Creating Stripe session with config:", {
      mode: sessionConfig.mode,
      has_customer_email: !!sessionConfig.customer_email,
      line_items_count: sessionConfig.line_items.length,
    });

    const session = await stripe.checkout.sessions.create(sessionConfig);
    
    console.log("Stripe session created successfully:", session.id);

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    console.error("Error stack:", error?.stack);
    console.error("Error details:", JSON.stringify(error, null, 2));
    
    return new Response(
      JSON.stringify({
        error: error?.message || String(error) || "Unknown error",
        type: error?.type || "unknown",
        details: error?.raw?.message || error?.toString() || "No details available",
        stack: error?.stack?.split('\n')[0] || "No stack trace",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
