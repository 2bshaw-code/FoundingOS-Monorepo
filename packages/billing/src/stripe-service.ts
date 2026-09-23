/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { getStripeClient } from './stripe-client.ts'
import { isDatabaseConfigured, withTenantScope } from '@foundingos/db'
import { isCommercialMode } from '@foundingos/config/commercial-mode'

export type CommercialResult<T> = { ok: true; data: T } | { ok: false; reason: 'not_configured' | 'error'; message: string }

function notConfigured<T>(): CommercialResult<T> {
  return { ok: false, reason: 'not_configured', message: 'Commercial Mode is not active — set DATABASE_URL, NEXTAUTH_SECRET, EMAIL_SERVER/EMAIL_FROM, and STRIPE_SECRET_KEY to enable it. FounderOS continues running in Demo Mode.' }
}

export async function createStripeCustomer(params: { email: string; name: string; brandSlug: string }): Promise<CommercialResult<{ customerId: string }>> {
  const stripe = getStripeClient()
  if (!stripe || !isCommercialMode()) return notConfigured()
  try {
    const customer = await stripe.customers.create({ email: params.email, name: params.name, metadata: { brandSlug: params.brandSlug } })
    return { ok: true, data: { customerId: customer.id } }
  } catch (error) {
    return { ok: false, reason: 'error', message: error instanceof Error ? error.message : 'Unknown Stripe error' }
  }
}

export async function createCheckoutSession(params: {
  customerId: string
  priceId: string
  brandSlug: string
  successUrl: string
  cancelUrl: string
}): Promise<CommercialResult<{ checkoutUrl: string }>> {
  const stripe = getStripeClient()
  if (!stripe || !isCommercialMode()) return notConfigured()
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: params.customerId,
      line_items: [{ price: params.priceId, quantity: 1 }],
      // Propagated onto the resulting Subscription object itself (not just this
      // Checkout Session) so the webhook handler can read brandSlug back off
      // subscription.metadata once the subscription is created — see
      // webhook-handler.ts.
      subscription_data: { metadata: { brandSlug: params.brandSlug } },
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
    })
    if (!session.url) return { ok: false, reason: 'error', message: 'Stripe did not return a checkout URL.' }
    return { ok: true, data: { checkoutUrl: session.url } }
  } catch (error) {
    return { ok: false, reason: 'error', message: error instanceof Error ? error.message : 'Unknown Stripe error' }
  }
}

// Called by the webhook handler once a subscription event is verified. Writes the
// resulting billing state into the brand's BrandSubscription row — only runs in
// Commercial Mode. Repointed from a dropped per-user Subscription model (see
// docs/single-schema-migration.md, 20260925090000_legacy_scaffold_removal) to the
// live, brandSlug-keyed BrandSubscription — Stripe subscriptions/customers in this
// checkout flow are already scoped per-brand, not per-user, so brandSlug is the
// correct (and only available) key here.
export async function syncSubscriptionFromStripe(params: {
  brandSlug: string
  stripeCustomerId: string
  stripeSubscriptionId: string
  status: 'trialing' | 'active' | 'past_due' | 'canceled'
  plan: string
}): Promise<CommercialResult<{ brandSlug: string }>> {
  if (!isDatabaseConfigured() || !isCommercialMode()) return notConfigured()

  await withTenantScope({ brandSlug: params.brandSlug }, (tx) =>
    tx.brandSubscription.upsert({
      where: { brandSlug: params.brandSlug },
      update: {
        status: params.status,
        baseTier: params.plan,
        stripeCustomerId: params.stripeCustomerId,
        stripeSubscriptionId: params.stripeSubscriptionId,
      },
      create: {
        brandSlug: params.brandSlug,
        status: params.status,
        baseTier: params.plan,
        stripeCustomerId: params.stripeCustomerId,
        stripeSubscriptionId: params.stripeSubscriptionId,
      },
    }),
  )

  return { ok: true, data: { brandSlug: params.brandSlug } }
}
