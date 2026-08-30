/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/

// Single source of truth for Demo Mode vs Commercial Mode. Every commercial
// integration point (DB, auth, Stripe) must check this before doing anything
// live — this is what keeps the whole system dormant until real credentials
// are supplied, with zero behavior change to the existing demo flows.

export type CommercialMode = 'demo' | 'commercial'

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL)
}

export function isAuthConfigured() {
  return Boolean(process.env.NEXTAUTH_SECRET && process.env.EMAIL_SERVER && process.env.EMAIL_FROM)
}

export function isBillingConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY)
}

// Commercial Mode requires ALL THREE foundations configured — a partial setup
// (e.g. DB only, no Stripe) still runs in Demo Mode to avoid a half-activated,
// inconsistent state (subscriptions with no billing, or billing with no DB row).
export function getCommercialMode(): CommercialMode {
  return isDatabaseConfigured() && isAuthConfigured() && isBillingConfigured() ? 'commercial' : 'demo'
}

export function isCommercialMode() {
  return getCommercialMode() === 'commercial'
}
