/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { Request } from 'express'
import { opsRequest } from './core-operations-client.js'

// A Recommendation IS the real governed AgentAction record from Core.Operations — the same
// suggestion -> simulation -> approval -> execution -> outcome -> reversal chain, viewed through
// the Intelligence lens. Decisions made here call straight back into Core.Operations so there is
// exactly one governed decision engine and one audit trail, never a second copy.
export type Recommendation = {
  id: string
  kind: string
  title: string
  summary: string
  rationale: string
  status: 'proposed' | 'approved' | 'rejected' | 'completed'
  riskLevel: string
  requiresApproval: boolean
  simulationPreview: unknown
  outcomeSummary: string | null
  outcomeAssessment: unknown
  estimatedValuePence: number | null
  proposedBy: string
  approvedBy: string | null
  approvedAt: string | null
  executedBy: string | null
  executedAt: string | null
  createdAt: string
  updatedAt: string
}

export const listRecommendations = (req: Request, status?: string) =>
  opsRequest<Recommendation[]>(req, `/platform/agent-actions${status ? `?status=${status}` : ''}`)

export const getRecommendationTrail = (req: Request, id: string) =>
  opsRequest<unknown[]>(req, `/platform/agent-actions/${id}/trail`)

export const decideRecommendation = (req: Request, id: string, decision: 'approve' | 'reject') =>
  opsRequest<Recommendation>(req, `/platform/agent-actions/${id}/decision`, { method: 'POST', body: { decision } })

export const executeRecommendation = (req: Request, id: string) =>
  opsRequest<Recommendation>(req, `/platform/agent-actions/${id}/execute`, { method: 'POST' })

export const reverseRecommendation = (req: Request, id: string) =>
  opsRequest<Recommendation>(req, `/platform/agent-actions/${id}/reverse`, { method: 'POST' })

// Outcomes are simply completed recommendations, surfaced with their real economic impact and
// whether they were later reversed — the compounding-value learning loop the founder reviews.
export const listOutcomes = async (req: Request) => {
  const completed = await listRecommendations(req, 'completed')
  return completed
    .filter((action) => action.outcomeSummary || action.executedAt)
    .map((action) => ({
      id: action.id,
      kind: action.kind,
      title: action.title,
      outcomeSummary: action.outcomeSummary,
      outcomeAssessment: action.outcomeAssessment,
      estimatedValuePence: action.estimatedValuePence,
      executedBy: action.executedBy,
      executedAt: action.executedAt,
    }))
}
