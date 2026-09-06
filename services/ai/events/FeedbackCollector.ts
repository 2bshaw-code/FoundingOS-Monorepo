/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
type FeedbackRecord = {
  aiActionId: string
  rating?: number
  comment?: string
  successMetrics?: Record<string, number>
  timestamp: string
}

const feedbackLedger: FeedbackRecord[] = []

export function recordUserFeedback(aiActionId: string, rating: number, comment = '') {
  const record = { aiActionId, rating, comment, timestamp: new Date().toISOString() }
  feedbackLedger.push(record)
  return record
}

export function recordOutcomeFeedback(aiActionId: string, successMetrics: Record<string, number>) {
  const record = { aiActionId, successMetrics, timestamp: new Date().toISOString() }
  feedbackLedger.push(record)
  return record
}

export function listFeedback() {
  return [...feedbackLedger]
}
