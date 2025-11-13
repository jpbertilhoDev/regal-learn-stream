// Stripe Price IDs - Add your actual price IDs from Stripe Dashboard
export const STRIPE_PRICES = {
  // Monthly subscription
  MONTHLY: "price_1234567890", // Replace with your actual Price ID

  // Annual subscription (one-time payment for lifetime access)
  ANNUAL: "price_0987654321", // Replace with your actual Price ID

  // One-time payment option
  ONE_TIME: "price_1122334455", // Replace with your actual Price ID
} as const;

// Product details matching your landing page
export const PRODUCTS = {
  MASTER_CLASS: {
    monthly: {
      priceId: STRIPE_PRICES.MONTHLY,
      amount: 208,
      currency: "BRL",
      interval: "month",
      displayPrice: "R$ 208",
    },
    oneTime: {
      priceId: STRIPE_PRICES.ONE_TIME,
      amount: 2500,
      currency: "BRL",
      interval: null,
      displayPrice: "R$ 2.500",
    },
  },
} as const;
