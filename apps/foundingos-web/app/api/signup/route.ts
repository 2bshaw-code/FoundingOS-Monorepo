/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'
import { commercialBases, commercialBoltOns, extraSeat, normalizeBases, normalizeBoltOns, planBaseWorkspaces, type BaseWorkspaceKey, type BoltOnKey } from '@foundingos/config/commercial'
import type { PlanTier } from '@foundingos/config/suites'

type SelfServePlan = 'lite' | 'core' | 'complete'

const PLAN_TIER: Record<SelfServePlan, PlanTier> = { lite: 'lite', core: 'starter', complete: 'growth' }

// Stripe Price IDs, one monthly recurring price per chargeable item.
// Core is billed per base workspace (Retail & Logistics, Talent, HR — £19 each).
const PRICE_ENV = {
  complete: 'STRIPE_PRICE_COMPLETE',
  retail: 'STRIPE_PRICE_CORE',
  talent: 'STRIPE_PRICE_TALENT',
  hr: 'STRIPE_PRICE_HR',
  commerce_pro: 'STRIPE_PRICE_COMMERCE_PRO',
  core_intelligence: 'STRIPE_PRICE_INTELLIGENCE',
  extra_seat: 'STRIPE_PRICE_EXTRA_SEAT',
} as const

function apiRoot() {
  const configured = (process.env.CORE_OPERATIONS_API_BASE || process.env.NEXT_PUBLIC_FOUNDINGOS_API_URL || process.env.NEXT_PUBLIC_CORE_OPERATIONS_API_URL || '')
    .trim().replace(/\/ops\/?$/, '').replace(/\/+$/, '')
  if (!configured) return ''
  return /\/api\/v1$/.test(configured) ? configured : `${configured}/api/v1`
}

const text = (value: unknown, max = 200) => (typeof value === 'string' ? value.trim().slice(0, max) : '')

async function createStripeCheckout(params: { plan: Exclude<SelfServePlan, 'lite'>; bases: BaseWorkspaceKey[]; boltOns: BoltOnKey[]; extraSeats: number; workspaces: string[]; email: string; tenantId: string; origin: string }) {
  const secret = process.env.STRIPE_SECRET_KEY?.trim()
  const items: Array<{ env: string; quantity: number }> = params.plan === 'complete'
    ? [{ env: PRICE_ENV.complete, quantity: 1 }]
    : params.bases.map((key) => ({ env: PRICE_ENV[key], quantity: 1 }))
  for (const key of params.boltOns) items.push({ env: PRICE_ENV[key], quantity: 1 })
  if (params.extraSeats > 0) items.push({ env: PRICE_ENV.extra_seat, quantity: params.extraSeats })
  const prices = items.map((item) => ({ price: process.env[item.env]?.trim(), quantity: item.quantity }))
  if (!secret || prices.some((item) => !item.price)) return null
  const form = new URLSearchParams({
    mode: 'subscription',
    customer_email: params.email,
    client_reference_id: params.tenantId,
    'metadata[tenantId]': params.tenantId,
    'metadata[plan]': params.plan,
    'metadata[bases]': params.bases.join(','),
    'metadata[boltOns]': params.boltOns.join(','),
    'metadata[extraSeats]': String(params.extraSeats),
    'subscription_data[metadata][tenantId]': params.tenantId,
    'subscription_data[metadata][plan]': PLAN_TIER[params.plan],
    'subscription_data[metadata][workspaces]': params.workspaces.join(','),
    success_url: `${params.origin}/signup?checkout=success&plan=${params.plan}`,
    cancel_url: `${params.origin}/signup?checkout=cancelled&plan=${params.plan}`,
  })
  prices.forEach((item, index) => {
    form.set(`line_items[${index}][price]`, item.price!)
    form.set(`line_items[${index}][quantity]`, String(item.quantity))
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

// Best-effort per-instance throttle; the endpoint is reachable without the site password so the mobile app can sign people up.
const attempts = new Map<string, number[]>()
function throttled(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const now = Date.now()
  const recent = (attempts.get(ip) || []).filter((at) => now - at < 60 * 60 * 1000)
  recent.push(now)
  attempts.set(ip, recent)
  return recent.length > 10
}

export async function POST(request: Request) {
  if (throttled(request)) return NextResponse.json({ ok: false, message: 'Too many sign-up attempts. Please try again later.' }, { status: 429 })
  const body = await request.json().catch(() => null) as Record<string, unknown> | null
  if (!body) return NextResponse.json({ ok: false, message: 'Invalid request.' }, { status: 400 })
  // Honeypot field: real users never see or fill it.
  if (text(body.website)) return NextResponse.json({ ok: true, nextStep: 'signin' })

  const plan = text(body.plan) as SelfServePlan
  if (!Object.hasOwn(PLAN_TIER, plan)) return NextResponse.json({ ok: false, message: 'Choose Lite, Core, or Complete. Enterprise is arranged with our team.' }, { status: 400 })
  const tier = PLAN_TIER[plan]
  const requestedBoltOns = Array.isArray(body.boltOns) ? body.boltOns.map(String) : []
  const requestedBases = Array.isArray(body.bases) ? body.bases.map(String) : []
  // Legacy clients sent Talent/HR as bolt-ons; treat them as base workspaces.
  if (requestedBoltOns.includes('talent_recruitment') || requestedBoltOns.includes('core_workforce')) requestedBases.push('talent')
  if (requestedBoltOns.includes('people_hr') || requestedBoltOns.includes('core_workforce')) requestedBases.push('hr')
  // Bases and bolt-ons apply to Core only; Complete already includes them all.
  const bases = plan === 'core' ? normalizeBases(requestedBases) : []
  const boltOns = plan === 'core' ? normalizeBoltOns(requestedBoltOns) : []
  const seatsRequested = Math.floor(Number(body.extraSeats) || 0)
  const extraSeats = plan === 'lite' ? 0 : Math.min(extraSeat.maxPerSignup, Math.max(0, seatsRequested))
  const workspaces = [...new Set([...bases.flatMap((key) => commercialBases[key].workspaces), ...planBaseWorkspaces[tier], ...boltOns.flatMap((key) => commercialBoltOns[key].workspaces)])]
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
    // Paid workspaces switch on only when Stripe confirms payment (billing webhook).
    body: JSON.stringify({ email, password, ownerName, businessName, plan: 'lite', workspaces: planBaseWorkspaces.lite, requestedUpgrade: plan === 'lite' ? undefined : { plan, workspaces } }),
  }).catch(() => null)
  const createdBody = await created?.json().catch(() => null) as { data?: { tenantId?: string }; message?: string } | null
  if (!created?.ok || !createdBody?.data?.tenantId) {
    const status = created?.status === 409 || created?.status === 400 ? created.status : 502
    return NextResponse.json({ ok: false, message: createdBody?.message || 'Your account could not be created. Please try again.' }, { status })
  }

  if (plan === 'lite') return NextResponse.json({ ok: true, nextStep: 'signin' }, { status: 201 })
  try {
    const checkoutUrl = await createStripeCheckout({ plan, bases, boltOns, extraSeats, workspaces, email, tenantId: createdBody.data.tenantId, origin: new URL(request.url).origin })
    return NextResponse.json({ ok: true, nextStep: checkoutUrl ? 'checkout' : 'signin', checkoutUrl }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ ok: true, nextStep: 'signin', message: error instanceof Error ? error.message : 'Payment checkout could not be started.' }, { status: 201 })
  }
}
