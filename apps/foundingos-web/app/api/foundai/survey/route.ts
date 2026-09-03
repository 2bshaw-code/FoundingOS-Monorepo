/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse } from 'next/server'

// FoundAI free-mode survey guidance: deterministic hints only, no external AI APIs, no
// secrets, no network calls. Self-contained in this file.
const SURVEY_HINTS: Record<string, string> = {
  default: 'There’s no wrong answer here — just tell me what brought you to FounderOS today.',
  role: 'Pick the option that best matches how you’ll use FounderOS day to day.',
  'team-size': 'A rough estimate is fine — this only helps tailor a package recommendation.',
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const questionId = typeof body?.questionId === 'string' ? body.questionId : 'default'
  const hint = SURVEY_HINTS[questionId] ?? SURVEY_HINTS.default
  return NextResponse.json({ mode: 'demo' as const, questionId, hint })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const questionId = searchParams.get('questionId') ?? 'default'
  const hint = SURVEY_HINTS[questionId] ?? SURVEY_HINTS.default
  return NextResponse.json({ mode: 'demo' as const, questionId, hint })
}
