/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { getStripeClient } from './stripe-client.ts'
import { isBillingConfigured } from '@foundingos/config/commercial-mode'
import { syncSubscriptionFromStripe } from './stripe-service.ts'
import type Stripe from 'stripe'

export type WebhookResult = { status: number; message: string }

// Verifies the Stripe signature and processes subscription lifecycle events.
// Returns a plain result object so the calling API route stays a thin wrapper —
// safe to call even when billing isn't configured (returns 501, never throws).
export async function handleStripeWebhook(rawBody: string, signature: string | null): Promise<WebhookResult> {
  const stripe = getStripeClient()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripe || !webhookSecret || !isBillingConfigured()) {
    return { status: 501, message: 'Stripe is not configured — FounderOS is running in Demo Mode.' }
  }

  if (!signature) {
    return { status: 400, message: 'Missing Stripe-Signature header.' }
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (error) {
    return { status: 400, message: `Webhook signature verification failed: ${error instanceof Error ? error.message : 'unknown error'}` }
  }

  if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    const brandId = subscription.metadata?.brandId
    const userId = subscription.metadata?.userId
    const plan = subscription.metadata?.plan ?? 'unknown'

    if (!brandId || !userId) {
      return { status: 200, message: 'Ignored — subscription metadata missing brandId/userId.' }
    }

    await syncSubscriptionFromStripe({
      brandId,
      userId,
      stripeCustomerId: typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id,
      stripeSubscriptionId: subscription.id,
      status: subscription.status === 'canceled' ? 'canceled' : subscription.status === 'past_due' ? 'past_due' : subscription.status === 'trialing' ? 'trialing' : 'active',
      plan,
    })
  }

  return { status: 200, message: `Processed ${event.type}` }
}
