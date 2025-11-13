import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!signature || !webhookSecret) {
    return new Response("Missing signature or webhook secret", { status: 400 });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

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
  const subscriptionId = session.subscription as string;
  const customerEmail = session.customer_details?.email;

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
  } else {
    userId = user.id;
  }

  // Get subscription details from Stripe
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Create or update subscription record
  const { error: subError } = await supabase.from("subscriptions").upsert({
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    stripe_price_id: subscription.items.data[0].price.id,
    stripe_product_id: subscription.items.data[0].price.product as string,
    status: subscription.status,
    plan_type: subscription.items.data[0].price.recurring?.interval || "one_time",
    current_period_start: new Date(subscription.current_period_start * 1000),
    current_period_end: new Date(subscription.current_period_end * 1000),
    cancel_at_period_end: subscription.cancel_at_period_end,
    trial_start: subscription.trial_start
      ? new Date(subscription.trial_start * 1000)
      : null,
    trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
  });

  if (subError) {
    console.error("Error creating subscription:", subError);
    throw subError;
  }

  console.log(`Subscription created for user ${userId}`);
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
