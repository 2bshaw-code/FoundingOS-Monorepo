/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { AALDomain } from './event-bus.ts'
import { listFeedback } from './FeedbackCollector.ts'

export function aggregateFeedback(domain: AALDomain, action: string) {
  const scoped = listFeedback().filter((record) => record.aiActionId.includes(`${domain}-${action}`))
  const ratings = scoped.map((record) => record.rating).filter((rating): rating is number => typeof rating === 'number')
  const averageRating = ratings.length ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : null
  return { domain, action, count: scoped.length, averageRating }
}

export function suggestModelAdjustments(domain: AALDomain, action: string) {
  const feedback = aggregateFeedback(domain, action)
  if (feedback.averageRating !== null && feedback.averageRating < 3) {
    return { domain, action, recommendation: 'Increase human review threshold and simplify generated next actions.' }
  }
  return { domain, action, recommendation: 'Maintain current deterministic policy and continue monitoring outcomes.' }
}
