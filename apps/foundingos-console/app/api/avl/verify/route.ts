/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'
import { runVerificationLoop } from '../../../superdashboard/server/verification-layer.server'

// Force dynamic — this handler runs real checks + real (scoped, reversible) writes on every
// call and must never be statically cached/prerendered.
export const dynamic = 'force-dynamic'

// Internal-only AVL trigger. No UI, no auth (matches the existing brand-console scraper
// cron pattern — Vercel Cron requests carry no browser session), no external calls beyond
// this ecosystem's own 26 apps. Only ever invoked by Vercel Cron (see vercel.json).
export async function POST() {
  const result = await runVerificationLoop()
  return NextResponse.json(result)
}

// Vercel Cron sends GET by default unless configured otherwise — accept both so the cron
// entry doesn't need a non-default method override.
export async function GET() {
  return POST()
}
