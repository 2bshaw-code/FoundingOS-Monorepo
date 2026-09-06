/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { AALDomain, AALIntent } from '../events/event-bus.ts'

export type ComplexityLevel = 'low' | 'medium' | 'high'

export function selectModel(domain: AALDomain, action: AALIntent, complexityLevel: ComplexityLevel = 'medium') {
  const mode = action === 'automate' || action === 'approve' || complexityLevel === 'high' ? 'guarded-autonomy' : 'deterministic-advisor'
  return {
    provider: 'foundingos-policy-engine',
    model: `${domain}-${mode}`,
    streaming: action === 'draft',
    creditSafe: true,
  }
}
