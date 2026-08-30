/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { getStripeClient } from './stripe-client.ts'
import { getPrismaClient } from '@foundingos/db'
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
// resulting billing state into the Subscription row — only runs in Commercial Mode.
export async function syncSubscriptionFromStripe(params: {
  brandId: string
  userId: string
  stripeCustomerId: string
  stripeSubscriptionId: string
  status: 'trialing' | 'active' | 'past_due' | 'canceled'
  plan: string
}): Promise<CommercialResult<{ subscriptionId: string }>> {
  const prisma = getPrismaClient()
  if (!prisma || !isCommercialMode()) return notConfigured()

  const billingState = params.status === 'trialing' ? 'trial' : params.status === 'canceled' ? 'cancelled' : params.status === 'past_due' ? 'past_due' : 'active'

  const subscription = await prisma.subscription.upsert({
    where: { id: params.stripeSubscriptionId },
    update: {
      status: params.status,
      billingState,
      stripeCustomerId: params.stripeCustomerId,
      stripeSubscriptionId: params.stripeSubscriptionId,
    },
    create: {
      id: params.stripeSubscriptionId,
      brandId: params.brandId,
      userId: params.userId,
      plan: params.plan,
      status: params.status,
      billingState,
      stripeCustomerId: params.stripeCustomerId,
      stripeSubscriptionId: params.stripeSubscriptionId,
    },
  })

  return { ok: true, data: { subscriptionId: subscription.id } }
}
