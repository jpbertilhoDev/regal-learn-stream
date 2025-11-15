// Stripe Price IDs - Configurado para PRODUÇÃO (Conta EUR)
export const STRIPE_PRICES = {
  // One-time payment - Parcelável em até 12x
  ONE_TIME: "price_1STLpcK7zFdJhUJSvXM7o8Kk",
  
  // Product ID para referência
  PRODUCT_ID: "prod_TPrQBOCZWZedpt",
} as const;

// Product details matching your landing page
export const PRODUCTS = {
  MASTER_CLASS: {
    oneTime: {
      priceId: STRIPE_PRICES.ONE_TIME,
      amount: 208,
      currency: "BRL",
      interval: null,
      displayPrice: "R$ 208",
      installments: {
        enabled: true,
        maxInstallments: 12,
      },
    },
  },
} as const;
