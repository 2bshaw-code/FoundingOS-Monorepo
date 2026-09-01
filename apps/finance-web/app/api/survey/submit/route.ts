/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Free Roam (+ investor/lawyer) sessions are read-only across the whole ecosystem — block
// this write even though the page gate above already keeps them off most of the site.
const FREE_ROAM_IDS = new Set(['juliet', 'tester-10', 'survey-demo', 'investor-alpha', 'investor-omega', 'lawyer-review'])
const SESSION_SECRET = process.env.TESTER_SESSION_SECRET ?? 'founderos-tester-program-dev-secret'
const encoder = new TextEncoder()
const decoder = new TextDecoder()
function fromBase64Url(value: string): Uint8Array {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes
}
async function isFreeRoamSession(): Promise<boolean> {
  const token = cookies().get('fo_tester_session')?.value
  if (!token) return false
  const [payloadPart, signaturePart] = token.split('.')
  if (!payloadPart || !signaturePart) return false
  try {
    const payload = decoder.decode(fromBase64Url(payloadPart))
    const key = await crypto.subtle.importKey('raw', encoder.encode(SESSION_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'])
    const valid = await crypto.subtle.verify('HMAC', key, fromBase64Url(signaturePart) as BufferSource, encoder.encode(payload))
    if (!valid) return false
    const [scope, id] = payload.split(':')
    return scope === 'tester' && FREE_ROAM_IDS.has(id)
  } catch {
    return false
  }
}

import { promises as fs } from 'fs'
import path from 'path'

// Local, best-effort survey log for FoundFinance's tester survey page — mirrors the
// dormant-safe pattern used across the ecosystem (retail-web, foundingos-console).
const LOG_PATH = path.join(process.cwd(), 'app', 'survey', 'data', 'survey-log.json')

async function appendEntry(entry: Record<string, unknown>) {
  try {
    const raw = await fs.readFile(LOG_PATH, 'utf-8').catch(() => '[]')
    const entries = JSON.parse(raw)
    entries.push(entry)
    await fs.writeFile(LOG_PATH, JSON.stringify(entries, null, 2))
  } catch {
    // Best-effort only — a logging failure must never block the tester's submission.
  }
}

// Universal SuperDash survey feed call — forwards this submission to foundingos-console
// (server-to-server, so it's never subject to browser CORS) so SuperDash/BrandMetric can
// show real cross-app tester activity for FoundFinance.
//
// Deliberately reads the raw env var (not @foundingos/config's `brands`) — that helper
// wraps cross-app URLs in a Proxy that rewrites any "localhost" URL down to a bare "/" in
// production builds, which is wrong for a server-to-server fetch that needs a real
// absolute URL in every environment, local or deployed.
async function forwardToSuperDashSurveyFeed(entry: { category: string; email: string | null; answers: string[] }) {
  try {
    const base = (process.env.NEXT_PUBLIC_FOUNDINGOS_CONSOLE_URL || 'http://localhost:8000').replace(/\/+$/, '')
    await fetch(`${base}/api/superdash/survey-feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brand: 'finance',
        category: entry.category,
        tester: entry.email,
        responses: entry.answers,
        timestamp: Date.now(),
      }),
    })
  } catch {
    // Best-effort only — SuperDash visibility is additive, never a requirement for submission.
  }
}

export async function POST(request: Request) {
  if (await isFreeRoamSession()) return NextResponse.json({ error: 'Read-only session — write access is disabled.' }, { status: 403 })

  const body = await request.json().catch(() => null)
  const category = typeof body?.category === 'string' ? body.category : null
  const answers = Array.isArray(body?.answers) ? body.answers : []
  const email = typeof body?.email === 'string' ? body.email : null
  if (!category) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })

  await appendEntry({ email, category, answers, submittedAt: new Date().toISOString() })
  await forwardToSuperDashSurveyFeed({ category, email, answers })

  return NextResponse.json({ ok: true })
}
