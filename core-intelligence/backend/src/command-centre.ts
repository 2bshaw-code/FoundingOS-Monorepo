/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { Request } from 'express'
import { opsRequest } from './core-operations-client.js'
import { listRecommendations } from './recommendations.js'

// The Command Centre is a real-time aggregate view over Core.Operations' governed-action
// engine: decision health, accuracy trend, emerging cross-action signals, and the live audit
// trail. Nothing here is computed independently of Core.Operations' own real numbers.
type AgentActionIntelligence = {
  interactions: unknown[]
  health: {
    totalAssessedOutcomes: number
    averagePredictionAccuracy: number
    refinedPatterns: number
    confidenceImprovement: number
    averageReliability: number
    activePatterns: number
    interactionCount: number
    recurringDeviation: unknown
    narrative: string
  }
  snapshot: {
    totalAssessedOutcomes: number
    refinedPatterns: number
    activeInteractions: number
    recentAccuracyTrend: { current: number; previous: number; change: number; assessmentWindow: number; narrative: string }
  }
  emergingSignals: unknown[]
  auditTrail: unknown[]
}

export async function getCommandCentreSummary(req: Request) {
  const [intelligence, proposed, approved, completed] = await Promise.all([
    opsRequest<AgentActionIntelligence>(req, '/platform/agent-actions-intelligence'),
    listRecommendations(req, 'proposed'),
    listRecommendations(req, 'approved'),
    listRecommendations(req, 'completed'),
  ])

  const economicValueCapturedPence = completed.reduce((sum, action) => sum + (action.estimatedValuePence || 0), 0)

  return {
    decisionQueue: {
      awaitingApproval: proposed.length,
      approvedNotYetExecuted: approved.length,
      executed: completed.length,
    },
    accuracy: intelligence.snapshot.recentAccuracyTrend,
    health: intelligence.health,
    emergingSignals: intelligence.emergingSignals,
    auditTrail: intelligence.auditTrail,
    economicValueCapturedPence,
  }
}
