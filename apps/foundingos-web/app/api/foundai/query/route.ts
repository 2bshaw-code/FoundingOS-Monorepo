/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'

// FoundAI free-mode Q&A: local, deterministic keyword matching only — no external AI APIs,
// no secrets, no network calls. Self-contained in this file.
const KNOWLEDGE: { keywords: string[]; answer: string }[] = [
  { keywords: ['founderos', 'foundingos', 'what is'], answer: 'FounderOS is one ecosystem connecting every brand console — retail, meat, talent, crypto, finance, health, and logistics — under a single command layer.' },
  { keywords: ['sign in', 'login', 'log in'], answer: 'Tap Sign In from the landing page — this is demo mode, so no real account or password is required.' },
  { keywords: ['survey'], answer: 'The survey is a quick, optional set of questions that helps tailor your FounderOS experience. You can skip any question.' },
  { keywords: ['onboarding'], answer: 'Onboarding walks you through choosing a SystemOS tier, and optionally QuantumOS or IntelligenceOS add-ons, based on your answers.' },
  { keywords: ['package', 'tier', 'pricing', 'plan'], answer: 'I can recommend a package tier once I know your team size and which brand consoles you need — try the onboarding flow for a tailored recommendation.' },
  { keywords: ['quantumos'], answer: 'QuantumOS is the cross-console intelligence add-on: scenario simulations, confidence scoring, and forecasting on top of your SystemOS base.' },
  { keywords: ['intelligenceos'], answer: 'IntelligenceOS adds sharper analytics and automated context so your team spends less time on manual review.' },
  { keywords: ['systemos'], answer: 'SystemOS is the foundation tier — workspace setup, access governance, and the core modules every account starts on.' },
  { keywords: ['billing', 'stripe', 'payment'], answer: 'Billing uses Stripe checkout, but stays dormant in demo mode until real keys are configured — nothing is charged here.' },
  { keywords: ['demo'], answer: 'You’re in demo mode: no real database, no real payments, no persistent data — everything here is safe to explore.' },
]

const FALLBACK = 'I can help with sign-in, surveys, onboarding, package recommendations, and the FounderOS modules — try asking about one of those.'

function answerFor(question: string): string {
  const normalized = question.toLowerCase()
  const match = KNOWLEDGE.find((entry) => entry.keywords.some((keyword) => normalized.includes(keyword)))
  return match?.answer ?? FALLBACK
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const question = typeof body?.question === 'string' ? body.question : ''
  return NextResponse.json({ mode: 'demo' as const, question, answer: answerFor(question) })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const question = searchParams.get('q') ?? ''
  return NextResponse.json({ mode: 'demo' as const, question, answer: answerFor(question) })
}
