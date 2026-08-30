/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import Stripe from 'stripe'
import { isBillingConfigured } from '@foundingos/config/commercial-mode'

// Dormant-safe: Stripe SDK is only ever constructed if STRIPE_SECRET_KEY is set.
// Importing this module must never throw or make a network call.
let stripeClient: Stripe | null = null

export function getStripeClient(): Stripe | null {
  if (!isBillingConfigured()) return null
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2025-02-24.acacia' })
  }
  return stripeClient
}
