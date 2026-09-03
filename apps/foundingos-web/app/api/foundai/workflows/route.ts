/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'

// FoundAI free-mode workflow hints: deterministic guidance, no external AI APIs, no
// secrets, no network calls. Self-contained in this file.
const WORKFLOWS = [
  { step: 1, title: 'Sign in', detail: 'Use the demo-mode sign-in on the landing page — no real account required.' },
  { step: 2, title: 'Complete the survey', detail: 'Answer (or skip) the quick survey question to help tailor your experience.' },
  { step: 3, title: 'Explore onboarding', detail: 'Walk through package tiers and optional QuantumOS/IntelligenceOS add-ons.' },
  { step: 4, title: 'Visit the homepage', detail: 'See the full FounderOS homepage, with links to billing and tester login.' },
]

export async function GET() {
  return NextResponse.json({ mode: 'demo' as const, workflows: WORKFLOWS })
}
