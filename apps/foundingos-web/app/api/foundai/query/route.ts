/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'

// FoundAI free-mode Q&A: local, deterministic keyword matching only — no external AI APIs,
// no secrets, no network calls. Self-contained in this file.
const PRICING = 'Pricing is modular: a free Lite plan, Core from £19 a month per workspace with optional bolt-ons, Complete at £89 a month for every workspace, and Enterprise on request. See the Pricing page.'

const KNOWLEDGE: { keywords: string[]; answer: string }[] = [
  { keywords: ['founderos', 'foundingos', 'what is'], answer: 'FoundingOS runs your business from one place: Core.Operations (Retail & Logistics, Health), Core.Workforce (Talent, HR) and Core.Intelligence, with FoundAI and WhatsApp built in.' },
  { keywords: ['sign in', 'login', 'log in'], answer: 'Tap Sign In at the top of the page and use the email and password for your workspace.' },
  { keywords: ['survey'], answer: 'The survey is a short, optional set of questions that helps tailor FoundingOS to your business. You can skip any question.' },
  { keywords: ['onboarding'], answer: 'Onboarding helps you pick a plan and the workspaces your business needs.' },
  { keywords: ['package', 'tier', 'pricing', 'plan', 'price', 'cost'], answer: PRICING },
  { keywords: ['whatsapp'], answer: 'Connect WhatsApp Business to handle orders, bookings and customer questions alongside your workspaces.' },
  { keywords: ['billing', 'stripe', 'payment'], answer: 'Subscriptions are billed securely through Stripe. You can change or cancel your plan from your workspace settings.' },
  { keywords: ['privacy', 'gdpr', 'cookie', 'data'], answer: 'See the Privacy & cookies page for what we collect, why, and how to exercise your data rights.' },
]

const FALLBACK = 'I can help with sign-in, pricing, workspaces, WhatsApp and privacy — try asking about one of those.'

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
