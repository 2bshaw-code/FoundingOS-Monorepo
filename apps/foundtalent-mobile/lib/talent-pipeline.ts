/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { GROWTH_CONSOLE_URL } from './brand'
import { IS_DEMO_MODE } from '@foundingos/ui/mobile-runtime-mode'

export const STAGES = ['applied', 'screening', 'interview', 'offer', 'hired'] as const
export type Stage = (typeof STAGES)[number]

export const STAGE_LABELS: Record<Stage, string> = {
  applied: 'Applied',
  screening: 'Screening',
  interview: 'Interview',
  offer: 'Offer',
  hired: 'Hired',
}

export type Job = {
  id: string
  title: string
  location: string
  department: string
  openSince: string
  applicantCount: number
  avgMatchScorePct: number
}

export type Candidate = {
  id: string
  name: string
  headline: string
  jobId: string
  jobTitle: string
  stage: Stage
  yearsExperience: number
  skills: string[]
  appliedDaysAgo: number
  matchScorePct: number
}

export type PipelineResponse = {
  mode: 'demo'
  source: string
  generatedAt: string
  reseedWindowHours: number
  seedBucket: number
  stages: readonly Stage[]
  jobs: Job[]
  candidates: Candidate[]
}

// Real, live, publicly-readable candidate pipeline feed — the same deterministic demo-mode
// generator pattern used for FoundCrypto's price feed (apps/crypto-console/app/api/crypto/poll),
// this brand's own equivalent at /api/talent/pipeline. There is no real ATS write-backend behind
// FoundTalent yet, so this is clearly labelled `mode: 'demo'` — deterministic, reseeded
// server-side every 6 hours, no external calls, no secrets.
export async function fetchPipeline(): Promise<PipelineResponse | null> {
  if (IS_DEMO_MODE) return null
  try {
    const response = await fetch(`${GROWTH_CONSOLE_URL}/api/talent/pipeline`)
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}
