/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'
import { createStripeCustomer, createCheckoutSession } from '@foundingos/billing'
import { isCommercialMode } from '@foundingos/config/commercial-mode'

// Safe backend endpoint for package purchases. Returns 501 (not an error state for the
// caller to crash on) whenever Commercial Mode isn't active — the onboarding form already
// falls back to its existing Demo Mode activation whenever it sees this response.
export async function POST(request: Request) {
  if (!isCommercialMode()) {
    return NextResponse.json({ ok: false, reason: 'not_configured', message: 'Commercial Mode is not active — continuing in Demo Mode.' }, { status: 501 })
  }

  const body = await request.json().catch(() => null)
  if (!body?.email || !body?.name || !body?.brandSlug || !body?.priceId) {
    return NextResponse.json({ ok: false, reason: 'error', message: 'Missing required fields.' }, { status: 400 })
  }

  const customerResult = await createStripeCustomer({ email: body.email, name: body.name, brandSlug: body.brandSlug })
  if (!customerResult.ok) return NextResponse.json(customerResult, { status: 502 })

  const checkoutResult = await createCheckoutSession({
    customerId: customerResult.data.customerId,
    priceId: body.priceId,
    successUrl: body.successUrl ?? `${new URL(request.url).origin}/onboarding?checkout=success`,
    cancelUrl: body.cancelUrl ?? `${new URL(request.url).origin}/onboarding?checkout=cancelled`,
  })
  if (!checkoutResult.ok) return NextResponse.json(checkoutResult, { status: 502 })

  return NextResponse.json(checkoutResult, { status: 200 })
}
