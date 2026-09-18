/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { Request } from 'express'
import { opsRequest } from './core-operations-client.js'

// Signals, Risks, and Anomalies are the Insight rows Core.Operations already generates from
// real business events (inventory, orders, invoices, messaging intents, etc). Core.Intelligence
// classifies the same real feed into the three Intelligence surfaces rather than inventing data.
export type Insight = {
  id: string
  tenantId: string | null
  type: 'prediction' | 'risk' | 'anomaly' | 'suggestion'
  source: string
  eventId: string | null
  payload: Record<string, unknown>
  createdAt: string
}

const fetchInsights = (req: Request, type: string) => opsRequest<Insight[]>(req, `/insights?type=${type}`)

export const listSignals = (req: Request) => fetchInsights(req, 'prediction')
export const listRecommendationSignals = (req: Request) => fetchInsights(req, 'suggestion')
export const listRisks = (req: Request) => fetchInsights(req, 'risk')
export const listAnomalies = (req: Request) => fetchInsights(req, 'anomaly')
