/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'
import { handleStripeWebhook } from '@foundingos/billing'

function apiRoot() {
  const configured = (process.env.CORE_OPERATIONS_API_BASE || process.env.NEXT_PUBLIC_FOUNDINGOS_API_URL || process.env.NEXT_PUBLIC_CORE_OPERATIONS_API_URL || '')
    .trim().replace(/\/ops\/?$/, '').replace(/\/+$/, '')
  if (!configured) return ''
  return /\/api\/v1$/.test(configured) ? configured : `${configured}/api/v1`
}

async function syncEntitlements(body: { tenantId: string; plan?: string; workspaces: string[]; active: boolean }) {
  const root = apiRoot()
  const token = process.env.PLATFORM_BOOTSTRAP_TOKEN?.trim()
  if (!root || !token) return false
  const response = await fetch(`${root}/ops/platform/billing/entitlements`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-bootstrap-token': token }, body: JSON.stringify(body) }).catch(() => null)
  return Boolean(response?.ok)
}

// Stripe webhook endpoint. Safe to call with zero configuration — returns 501
// (not an unhandled crash) until STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET exist.
export async function POST(request: Request) {
  const rawBody = await request.text()
  const signature = request.headers.get('stripe-signature')
  const result = await handleStripeWebhook(rawBody, signature)
  const event = result.event
  if (event && event.type.startsWith('customer.subscription.')) {
    const subscription = event.data.object as { status?: string; metadata?: Record<string, string> }
    const tenantId = subscription.metadata?.tenantId
    if (tenantId) {
      const synced = await syncEntitlements({
        tenantId,
        plan: subscription.metadata?.plan,
        workspaces: (subscription.metadata?.workspaces || '').split(',').filter(Boolean),
        active: event.type !== 'customer.subscription.deleted' && ['active', 'trialing'].includes(String(subscription.status)),
      })
      // A non-2xx makes Stripe retry, so entitlements never silently drift from billing.
      if (!synced) return NextResponse.json({ message: 'Entitlement sync failed' }, { status: 502 })
    }
  }
  return NextResponse.json({ message: result.message }, { status: result.status })
}
