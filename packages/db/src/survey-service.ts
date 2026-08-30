/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { getPrismaClient } from './index.ts'
import { isCommercialMode } from '@foundingos/config/commercial-mode'
import type { SurveyType, SurveyResult, SurveyAnswer } from '@foundingos/config/surveys/survey-engine'

export type SaveSurveyResultResult = { ok: true; id: string } | { ok: false; reason: 'not_configured' }

// Dormant until Commercial Mode is active — Demo Mode never calls this at all
// (the survey pages write to localStorage directly), so this only matters once
// DATABASE_URL/NEXTAUTH_SECRET/STRIPE keys are all supplied.
export async function saveSurveyResultToDb(params: {
  type: SurveyType
  answers: Record<string, SurveyAnswer>
  result: SurveyResult
  userId?: string
  subscriptionId?: string
}): Promise<SaveSurveyResultResult> {
  const prisma = getPrismaClient()
  if (!prisma || !isCommercialMode()) return { ok: false, reason: 'not_configured' }

  const record = await prisma.surveyResult.create({
    data: {
      type: params.type,
      answers: params.answers as any,
      score: params.result.score,
      insight: params.result.insight,
      risk: params.result.risk,
      opportunity: params.result.opportunity,
      sentiment: params.result.sentiment,
      userId: params.userId,
      subscriptionId: params.subscriptionId,
    },
  })

  return { ok: true, id: record.id }
}
