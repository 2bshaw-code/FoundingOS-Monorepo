/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'
import { handleStripeWebhook } from '@foundingos/billing'

// Stripe webhook endpoint. Safe to call with zero configuration — returns 501
// (not an unhandled crash) until STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET exist.
export async function POST(request: Request) {
  const rawBody = await request.text()
  const signature = request.headers.get('stripe-signature')
  const result = await handleStripeWebhook(rawBody, signature)
  return NextResponse.json({ message: result.message }, { status: result.status })
}
