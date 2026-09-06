/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/

export type JourneyCohort = 'Small' | 'Medium' | 'Large'

export type JourneyStage = {
  id: string
  label: string
  icon: string
  description: string
  values: Record<JourneyCohort, number>
}

export const JOURNEY_COHORTS: JourneyCohort[] = ['Small', 'Medium', 'Large']

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: 'awareness',
    label: 'Awareness',
    icon: '◎',
    description: 'First touch: ads, referrals, WhatsApp broadcasts, and marketplace discovery.',
    values: { Small: 120, Medium: 840, Large: 5200 },
  },
  {
    id: 'consideration',
    label: 'Consideration',
    icon: '◐',
    description: 'Browsing products, comparing prices, saving favourites, asking questions.',
    values: { Small: 64, Medium: 432, Large: 2600 },
  },
  {
    id: 'engagement',
    label: 'Engagement',
    icon: '◈',
    description: 'Active conversations, quotes requested, demos booked, carts started.',
    values: { Small: 38, Medium: 256, Large: 1500 },
  },
  {
    id: 'purchase',
    label: 'Purchase',
    icon: '◉',
    description: 'Orders placed and payments confirmed across card, mobile money, and crypto.',
    values: { Small: 21, Medium: 148, Large: 860 },
  },
  {
    id: 'retention',
    label: 'Retention',
    icon: '⟡',
    description: 'Repeat purchases, loyalty actions, reviews, and referral generation.',
    values: { Small: 14, Medium: 102, Large: 590 },
  },
]

export function journeyMaxForCohort(cohort: JourneyCohort): number {
  return Math.max(...JOURNEY_STAGES.map((stage) => stage.values[cohort]))
}

export function stageConversion(stage: JourneyStage, cohort: JourneyCohort): string {
  const index = JOURNEY_STAGES.findIndex((entry) => entry.id === stage.id)
  if (index === 0) return '100%'
  const previous = JOURNEY_STAGES[index - 1].values[cohort]
  const current = stage.values[cohort]
  return `${Math.round((current / previous) * 100)}%`
}
