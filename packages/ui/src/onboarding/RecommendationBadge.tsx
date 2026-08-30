/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { Recommendation } from '@foundingos/config/quantum-recommendation'

// Shown on both the package selection page and the onboarding form, per spec.
export function RecommendationBadge({ recommendation }: { recommendation: Recommendation }) {
  if (recommendation.style === 'none') return null

  return (
    <div className={`quantum-recommendation quantum-recommendation-${recommendation.style}`}>
      <span className="quantum-recommendation-icon" aria-hidden="true">◈</span>
      <div>
        <strong>{recommendation.headline}</strong>
        <p>{recommendation.reason}</p>
      </div>
    </div>
  )
}

export default RecommendationBadge
