/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'

type SelfServePlan = 'lite' | 'starter' | 'growth'

// Workspace slugs are backend identifiers (see core-operations/backend/src/platform.ts).
const PLAN_WORKSPACES: Record<SelfServePlan, string[]> = {
  lite: ['retail'],
  starter: ['retail', 'finance', 'marketing'],
  growth: ['retail', 'logistics', 'finance', 'marketing', 'talent', 'health', 'intelligence'],
}

const PLAN_PRICE_ENV: Record<Exclude<SelfServePlan, 'lite'>, string> = {
  starter: 'STRIPE_PRICE_STARTER',
  growth: 'STRIPE_PRICE_GROWTH',
}

function apiRoot() {
  const configured = (process.env.CORE_OPERATIONS_API_BASE || process.env.NEXT_PUBLIC_FOUNDINGOS_API_URL || process.env.NEXT_PUBLIC_CORE_OPERATIONS_API_URL || '')
    .trim().replace(/\/ops\/?$/, '').replace(/\/+$/, '')
  if (!configured) return ''
  return /\/api\/v1$/.test(configured) ? configured : `${configured}/api/v1`
}

const text = (value: unknown, max = 200) => (typeof value === 'string' ? value.trim().slice(0, max) : '')

async function createStripeCheckout(params: { plan: Exclude<SelfServePlan, 'lite'>; email: string; tenantId: string; origin: string }) {
  const secret = process.env.STRIPE_SECRET_KEY?.trim()
  const price = process.env[PLAN_PRICE_ENV[params.plan]]?.trim()
  if (!secret || !price) return null
  const form = new URLSearchParams({
    mode: 'subscription',
    'line_items[0][price]': price,
    'line_items[0][quantity]': '1',
    customer_email: params.email,
    client_reference_id: params.tenantId,
    'metadata[tenantId]': params.tenantId,
    'metadata[plan]': params.plan,
    'subscription_data[metadata][tenantId]': params.tenantId,
    'subscription_data[metadata][plan]': params.plan,
    success_url: `${params.origin}/signup?checkout=success&plan=${params.plan}`,
    cancel_url: `${params.origin}/signup?checkout=cancelled&plan=${params.plan}`,
  })
  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form,
  })
  const body = await response.json().catch(() => null) as { url?: string; error?: { message?: string } } | null
  if (!response.ok || !body?.url) throw new Error(body?.error?.message || 'Payment checkout could not be started.')
  return body.url
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null
  if (!body) return NextResponse.json({ ok: false, message: 'Invalid request.' }, { status: 400 })
  // Honeypot field: real users never see or fill it.
  if (text(body.website)) return NextResponse.json({ ok: true, nextStep: 'signin' })

  const plan = text(body.plan) as SelfServePlan
  if (!(plan in PLAN_WORKSPACES)) return NextResponse.json({ ok: false, message: 'Choose Lite, Starter, or Growth. Enterprise is arranged with our team.' }, { status: 400 })
  const email = text(body.email).toLowerCase()
  const password = typeof body.password === 'string' ? body.password : ''
  const ownerName = text(body.ownerName)
  const businessName = text(body.businessName)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ ok: false, message: 'Enter a valid email address.' }, { status: 400 })
  if (!ownerName || !businessName) return NextResponse.json({ ok: false, message: 'Enter your name and business name.' }, { status: 400 })
  if (password.length < 12) return NextResponse.json({ ok: false, message: 'Choose a password with at least 12 characters.' }, { status: 400 })

  const root = apiRoot()
  const token = process.env.PLATFORM_BOOTSTRAP_TOKEN?.trim()
  if (!root || !token) return NextResponse.json({ ok: false, message: 'Sign-up is not available yet. Please try again shortly.' }, { status: 503 })

  const created = await fetch(`${root}/ops/platform/bootstrap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-bootstrap-token': token },
    body: JSON.stringify({ email, password, ownerName, businessName, plan, workspaces: PLAN_WORKSPACES[plan] }),
  }).catch(() => null)
  const createdBody = await created?.json().catch(() => null) as { data?: { tenantId?: string }; message?: string } | null
  if (!created?.ok || !createdBody?.data?.tenantId) {
    const status = created?.status === 409 || created?.status === 400 ? created.status : 502
    return NextResponse.json({ ok: false, message: createdBody?.message || 'Your account could not be created. Please try again.' }, { status })
  }

  if (plan === 'lite') return NextResponse.json({ ok: true, nextStep: 'signin' }, { status: 201 })
  try {
    const checkoutUrl = await createStripeCheckout({ plan, email, tenantId: createdBody.data.tenantId, origin: new URL(request.url).origin })
    return NextResponse.json({ ok: true, nextStep: checkoutUrl ? 'checkout' : 'signin', checkoutUrl }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ ok: true, nextStep: 'signin', message: error instanceof Error ? error.message : 'Payment checkout could not be started.' }, { status: 201 })
  }
}
