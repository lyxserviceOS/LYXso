// lyxso-app/lib/stripe.ts
// Stripe utility functions for frontend
import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Get Stripe.js instance
 */
export const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    if (!key) {
      console.warn('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set');
      return null;
    }

    stripePromise = loadStripe(key);
  }
  
  return stripePromise;
};

/**
 * Redirect to Stripe Checkout
 * Note: This is deprecated. Use the checkout_url from the session instead.
 * @deprecated Use direct URL redirect from createSubscriptionCheckout
 */
export async function redirectToCheckout(sessionId: string) {
  const stripe = await getStripe();
  
  if (!stripe) {
    throw new Error('Stripe er ikke konfigurert');
  }

  // For newer Stripe versions, redirectToCheckout might not be available
  // Use type assertion to handle this
  if ('redirectToCheckout' in stripe && typeof stripe.redirectToCheckout === 'function') {
    const { error } = await stripe.redirectToCheckout({ sessionId });
    
    if (error) {
      throw error;
    }
  } else {
    console.warn('redirectToCheckout is not available. Use checkout URL instead.');
    throw new Error('redirectToCheckout is deprecated. Use checkout URL from session.');
  }
}

/**
 * Create payment intent and get client secret
 */
export async function createPaymentIntent(
  orgId: string,
  amount: number,
  currency: string = 'nok',
  bookingId?: string,
  description?: string
) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  const response = await fetch(`${apiBaseUrl}/api/orgs/${orgId}/payments/create-intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      currency,
      booking_id: bookingId,
      description,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || error.error || 'Kunne ikke opprette betaling');
  }

  return await response.json();
}

/**
 * Create subscription checkout session
 */
export async function createSubscriptionCheckout(
  orgId: string,
  priceId: string,
  trialDays: number = 0
) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const frontendUrl = window.location.origin;
  
  const response = await fetch(`${apiBaseUrl}/api/orgs/${orgId}/subscriptions/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      price_id: priceId,
      trial_days: trialDays,
      success_url: `${frontendUrl}/min-side/billing?success=true`,
      cancel_url: `${frontendUrl}/priser?canceled=true`,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || error.error || 'Kunne ikke opprette checkout');
  }

  const { checkout_url } = await response.json();
  
  // Redirect to Stripe Checkout
  window.location.href = checkout_url;
}

/**
 * Get current subscription
 */
export async function getCurrentSubscription(orgId: string) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  const response = await fetch(`${apiBaseUrl}/api/orgs/${orgId}/subscriptions/current`);

  if (!response.ok) {
    throw new Error('Kunne ikke hente abonnement');
  }

  return await response.json();
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(orgId: string, immediately: boolean = false) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  const response = await fetch(`${apiBaseUrl}/api/orgs/${orgId}/subscriptions/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ immediately }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || error.error || 'Kunne ikke kansellere abonnement');
  }

  return await response.json();
}

/**
 * Reactivate subscription
 */
export async function reactivateSubscription(orgId: string) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  const response = await fetch(`${apiBaseUrl}/api/orgs/${orgId}/subscriptions/reactivate`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || error.error || 'Kunne ikke reaktivere abonnement');
  }

  return await response.json();
}

/**
 * Change subscription plan
 */
export async function changeSubscriptionPlan(orgId: string, newPriceId: string) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  const response = await fetch(`${apiBaseUrl}/api/orgs/${orgId}/subscriptions/change-plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ new_price_id: newPriceId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || error.error || 'Kunne ikke endre plan');
  }

  return await response.json();
}

/**
 * Get Stripe Customer Portal URL
 */
export async function getCustomerPortalUrl(orgId: string) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const returnUrl = `${window.location.origin}/min-side/billing`;
  
  const response = await fetch(
    `${apiBaseUrl}/api/orgs/${orgId}/subscriptions/portal?return_url=${encodeURIComponent(returnUrl)}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || error.error || 'Kunne ikke åpne kundeportal');
  }

  const { portal_url } = await response.json();
  
  // Redirect to portal
  window.location.href = portal_url;
}

/**
 * Get subscription invoices
 */
export async function getInvoices(orgId: string, limit: number = 10) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  const response = await fetch(
    `${apiBaseUrl}/api/orgs/${orgId}/subscriptions/invoices?limit=${limit}`
  );

  if (!response.ok) {
    throw new Error('Kunne ikke hente fakturaer');
  }

  return await response.json();
}

/**
 * Get available plans
 */
export async function getAvailablePlans() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  const response = await fetch(`${apiBaseUrl}/api/stripe/plans`);

  if (!response.ok) {
    throw new Error('Kunne ikke hente planer');
  }

  return await response.json();
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency: string = 'NOK'): string {
  return new Intl.NumberFormat('nb-NO', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
}
