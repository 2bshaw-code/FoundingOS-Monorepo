/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'

// FoundAI free-mode contextual assist: deterministic per-route guidance, no external AI
// APIs, no secrets, no network calls. Self-contained in this file.
const ASSIST_BY_CONTEXT: Record<string, { message: string; suggestions: string[] }> = {
  landing: {
    message: 'Welcome to FounderOS. Tap Sign In to continue into the demo experience.',
    suggestions: ['What is FounderOS?', 'How do I sign in?', 'Recommend a package for me'],
  },
  login: {
    message: 'This sign-in is demo mode only — no real account is required.',
    suggestions: ['Is this demo mode?', 'What happens after I sign in?'],
  },
  survey: {
    message: 'Answer the survey question, or skip it — nothing is required to continue.',
    suggestions: ['Why are you asking this?', 'Can I skip this question?'],
  },
  onboarding: {
    message: 'Choose the package tier that best matches your team, then add QuantumOS or IntelligenceOS if you need cross-console intelligence.',
    suggestions: ['What is QuantumOS?', 'What is IntelligenceOS?', 'What is SystemOS?'],
  },
  homepage: {
    message: 'Explore the FounderOS homepage — onboarding, billing, and tester login are all available from here.',
    suggestions: ['What can I do here?', 'Recommend a package for me'],
  },
}

const DEFAULT_ASSIST = {
  message: 'I can help you navigate FounderOS — sign-in, surveys, onboarding, and package recommendations.',
  suggestions: ['What is FounderOS?', 'How do I sign in?'],
}

function assistFor(context: string) {
  return ASSIST_BY_CONTEXT[context] ?? DEFAULT_ASSIST
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const context = typeof body?.context === 'string' ? body.context.toLowerCase() : ''
  return NextResponse.json({ mode: 'demo' as const, context, ...assistFor(context) })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const context = (searchParams.get('context') ?? '').toLowerCase()
  return NextResponse.json({ mode: 'demo' as const, context, ...assistFor(context) })
}
