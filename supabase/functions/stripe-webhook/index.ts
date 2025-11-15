import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://tzdatllacntstuaoabou.supabase.co";
const supabaseServiceKey = Deno.env.get("SERVICE_ROLE_KEY") as string;

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!signature || !webhookSecret) {
    return new Response("Missing signature or webhook secret", { status: 400 });
  }

  try {
    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);

    console.log(`Processing event: ${event.type}`);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check idempotency - have we already processed this event?
    const { data: existingEvent } = await supabase
      .from("webhook_events")
      .select("id")
      .eq("stripe_event_id", event.id)
      .single();

    if (existingEvent) {
      console.log(`Event ${event.id} already processed`);
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }

    // Record the event
    await supabase.from("webhook_events").insert({
      stripe_event_id: event.id,
      event_type: event.type,
      processed: false,
    });

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(supabase, session);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(supabase, subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(supabase, subscription);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(supabase, invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(supabase, invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Mark event as processed
    await supabase
      .from("webhook_events")
      .update({ processed: true })
      .eq("stripe_event_id", event.id);

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(`Error processing webhook: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
});

async function handleCheckoutCompleted(
  supabase: any,
  session: Stripe.Checkout.Session
) {
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string | null;
  const paymentIntentId = session.payment_intent as string | null;
  const customerEmail = session.customer_details?.email;
  const mode = session.mode; // "payment" or "subscription"

  console.log(`Checkout completed - Mode: ${mode}, Email: ${customerEmail}`);

  if (!customerEmail) {
    console.error("No customer email in checkout session");
    return;
  }

  // Check if user exists
  const { data: existingUser } = await supabase.auth.admin.listUsers();
  const user = existingUser.users.find((u: any) => u.email === customerEmail);

  let userId: string;

  if (!user) {
    // Create new user with a temporary password
    const tempPassword = crypto.randomUUID();
    console.log(`Creating new user for email: ${customerEmail}`);
    
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: customerEmail,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        name: session.customer_details?.name || "",
      },
    });

    if (createError) {
      console.error("Error creating user:", createError);
      throw createError;
    }

    userId = newUser.user.id;
    console.log(`User created successfully: ${userId}`);
    
    // Send password creation email for first access
    console.log("Sending welcome email with password creation link...");
    try {
      // Generate password reset token
      const { data: resetData, error: resetError } = await supabase.auth.admin.generateLink({
        type: 'recovery',
        email: customerEmail,
      });
      
      if (resetError) {
        console.error("Error generating password creation link:", resetError);
        throw resetError;
      }

      // Send email via Resend
      const resendApiKey = Deno.env.get("RESEND_API_KEY") || "re_UfY3YF1r_HscB7Ah8EURvFWeY39Cvypue";
      const productionUrl = Deno.env.get("PRODUCTION_URL") || "http://localhost:8081";
      
      // Extract token from the generated link
      const actionLink = resetData.properties.action_link;
      const resetUrl = actionLink.replace(/^.*\/auth\/v1\/verify/, `${productionUrl}/create-password`);
      
      // Send email via Resend API
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "MASTER CLASS <onboarding@resend.dev>",
          to: [customerEmail],
          subject: "🎉 Bem-vindo à MASTER CLASS - Crie sua senha agora!",
          html: `
            <h1>Bem-vindo à MASTER CLASS!</h1>
            <p>Seu pagamento foi confirmado com sucesso!</p>
            <p>Para acessar a plataforma, clique no botão abaixo para criar sua senha:</p>
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #000000; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-size: 18px; font-weight: 800; display: inline-block;">
              Criar Minha Senha
            </a>
            <p>Este link expira em 1 hora.</p>
            <p>Se você não fez este pagamento, ignore este email.</p>
          `,
        }),
      });

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error("Error sending email via Resend:", errorText);
        throw new Error(`Resend API error: ${errorText}`);
      }

      const emailResult = await emailResponse.json();
      console.log("Welcome email sent successfully via Resend:", emailResult);
      
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
      // Don't throw - user was created, they can use "forgot password"
    }
  } else {
    userId = user.id;
    console.log(`User already exists: ${userId}`);
  }

  // Handle subscription mode (recurring payment)
  if (mode === "subscription" && subscriptionId) {
    console.log(`Processing subscription: ${subscriptionId}`);
    
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const { error: subError } = await supabase.from("subscriptions").upsert({
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      stripe_price_id: subscription.items.data[0].price.id,
      stripe_product_id: subscription.items.data[0].price.product as string,
      status: subscription.status,
      plan_type: subscription.items.data[0].price.recurring?.interval || "month",
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000),
      cancel_at_period_end: subscription.cancel_at_period_end,
      trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
      trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    }, { onConflict: 'user_id' }); // Resolver conflito por user_id

    if (subError) {
      console.error("Error creating subscription:", subError);
      throw subError;
    }

    console.log(`Subscription created for user ${userId}`);
  }
  
  // Handle payment mode (one-time payment)
  else if (mode === "payment" && paymentIntentId) {
    console.log(`Processing one-time payment: ${paymentIntentId}`);
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    const priceId = lineItems.data[0]?.price?.id;
    const productId = lineItems.data[0]?.price?.product as string;

    // Create a "lifetime" subscription for one-time payments
    const { error: subError } = await supabase.from("subscriptions").upsert({
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: `onetime_${paymentIntentId}`, // Unique ID for one-time
      stripe_price_id: priceId,
      stripe_product_id: productId,
      status: "active",
      plan_type: "lifetime", // Mark as lifetime access
      current_period_start: new Date(),
      current_period_end: new Date('2099-12-31'), // Lifetime access
      cancel_at_period_end: false,
      trial_start: null,
      trial_end: null,
    }, { onConflict: 'user_id' }); // Resolver conflito por user_id

    if (subError) {
      console.error("Error creating one-time payment record:", subError);
      throw subError;
    }

    // Also record the transaction
    const { error: txError } = await supabase.from("transactions").insert({
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_payment_intent_id: paymentIntentId,
      amount: paymentIntent.amount / 100, // Convert from cents
      currency: paymentIntent.currency.toUpperCase(),
      status: paymentIntent.status,
      payment_method: paymentIntent.payment_method_types[0],
    });

    if (txError) {
      console.error("Error recording transaction:", txError);
      // Don't throw - subscription was created
    }

    console.log(`One-time payment processed for user ${userId}`);
  }
  
  else {
    console.error(`Invalid session mode or missing IDs - Mode: ${mode}, Subscription: ${subscriptionId}, PaymentIntent: ${paymentIntentId}`);
    throw new Error("Invalid checkout session configuration");
  }
}

async function handleSubscriptionUpdated(
  supabase: any,
  subscription: Stripe.Subscription
) {
  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000),
      cancel_at_period_end: subscription.cancel_at_period_end,
    })
    .eq("stripe_subscription_id", subscription.id);

  if (error) {
    console.error("Error updating subscription:", error);
    throw error;
  }

  console.log(`Subscription ${subscription.id} updated`);
}

async function handleSubscriptionDeleted(
  supabase: any,
  subscription: Stripe.Subscription
) {
  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
    })
    .eq("stripe_subscription_id", subscription.id);

  if (error) {
    console.error("Error deleting subscription:", error);
    throw error;
  }

  console.log(`Subscription ${subscription.id} canceled`);
}

async function handleInvoicePaymentSucceeded(
  supabase: any,
  invoice: Stripe.Invoice
) {
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("id, user_id")
    .eq("stripe_subscription_id", invoice.subscription)
    .single();

  if (!subscription) {
    console.log("No subscription found for invoice");
    return;
  }

  // Record transaction
  await supabase.from("transactions").insert({
    user_id: subscription.user_id,
    subscription_id: subscription.id,
    stripe_payment_intent_id: invoice.payment_intent as string,
    stripe_invoice_id: invoice.id,
    amount: invoice.amount_paid / 100, // Convert cents to currency
    currency: invoice.currency,
    status: "succeeded",
    description: `Payment for ${invoice.lines.data[0]?.description || "subscription"}`,
  });

  console.log(`Payment succeeded for invoice ${invoice.id}`);
}

async function handleInvoicePaymentFailed(
  supabase: any,
  invoice: Stripe.Invoice
) {
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("id, user_id")
    .eq("stripe_subscription_id", invoice.subscription)
    .single();

  if (!subscription) {
    console.log("No subscription found for invoice");
    return;
  }

  // Update subscription status
  await supabase
    .from("subscriptions")
    .update({ status: "past_due" })
    .eq("id", subscription.id);

  // Record failed transaction
  await supabase.from("transactions").insert({
    user_id: subscription.user_id,
    subscription_id: subscription.id,
    stripe_invoice_id: invoice.id,
    amount: invoice.amount_due / 100,
    currency: invoice.currency,
    status: "failed",
    description: `Failed payment for ${invoice.lines.data[0]?.description || "subscription"}`,
  });

  console.log(`Payment failed for invoice ${invoice.id}`);
}
