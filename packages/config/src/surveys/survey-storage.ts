/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { SurveyType, SurveyResult, SurveyAnswer } from './survey-engine.ts'

const SURVEY_RESULTS_KEY = 'founderos_survey_results'

export type SurveyResultEntry = SurveyResult & {
  answers: Record<string, SurveyAnswer>
  createdAt: string
}

export type SurveyResultsStore = {
  customer: SurveyResultEntry[]
  buyer: SurveyResultEntry[]
  investor: SurveyResultEntry[]
}

const EMPTY_STORE: SurveyResultsStore = { customer: [], buyer: [], investor: [] }

export function readSurveyResults(): SurveyResultsStore {
  if (typeof window === 'undefined') return EMPTY_STORE
  try {
    const raw = window.localStorage.getItem(SURVEY_RESULTS_KEY)
    if (!raw) return EMPTY_STORE
    const parsed = JSON.parse(raw)
    return {
      customer: Array.isArray(parsed?.customer) ? parsed.customer : [],
      buyer: Array.isArray(parsed?.buyer) ? parsed.buyer : [],
      investor: Array.isArray(parsed?.investor) ? parsed.investor : [],
    }
  } catch {
    return EMPTY_STORE
  }
}

export function appendSurveyResult(type: SurveyType, entry: SurveyResultEntry) {
  if (typeof window === 'undefined') return
  try {
    const current = readSurveyResults()
    current[type] = [...current[type], entry]
    window.localStorage.setItem(SURVEY_RESULTS_KEY, JSON.stringify(current))
  } catch {
    // Ignore write failures (private browsing / storage disabled) — the survey
    // result simply won't persist locally; nothing else depends on it succeeding.
  }
}

export function latestSurveyResult(type: SurveyType): SurveyResultEntry | null {
  const entries = readSurveyResults()[type]
  return entries.length > 0 ? entries[entries.length - 1] : null
}
