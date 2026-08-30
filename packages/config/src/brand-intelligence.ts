/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Per-brand personality layer: KPIs, sparkline, and the three intelligence tiles.
// 'finance' is included because Finance is an internal FounderOS module with its
// own tester survey and signal — it has no standalone console or port.
export type IntelBrandSlug = 'retail' | 'meat' | 'foundthat' | 'talent' | 'crypto' | 'finance' | 'health' | 'logistics'

export type PersonalityKpi = { label: string; value: string; trend?: string }

export type PersonalityLayer = {
  brand: IntelBrandSlug
  name: string
  color: string
  basePulse: number
  microStory: string
  kpis: PersonalityKpi[]
  sparkline: number[]
  insightTile: string
  riskTile: string
  opportunityTile: string
}

export const BRAND_PERSONALITIES: Record<IntelBrandSlug, PersonalityLayer> = {
  retail: {
    brand: 'retail',
    name: 'Commerce Pulse',
    color: '#00FF66',
    basePulse: 62,
    microStory: 'Commerce Pulse: Retail\'s weekend momentum keeps building as repeat shoppers return faster than new ones arrive.',
    kpis: [
      { label: 'Basket size', value: '£38.20', trend: '+4%' },
      { label: 'Repeat purchase rate', value: '31%', trend: '+2%' },
      { label: 'Cart abandonment', value: '18%', trend: '-1%' },
      { label: 'Store conversion', value: '4.6%', trend: '+0.3%' },
    ],
    sparkline: [72, 74, 73, 76, 78, 80],
    insightTile: 'Weekend basket size is climbing faster than the weekday average.',
    riskTile: 'Cart abandonment ticks up on mobile checkout past 6pm.',
    opportunityTile: 'Bundle top repeat-purchase SKUs into a subscription offer.',
  },
  meat: {
    brand: 'meat',
    name: 'Supply Chain Heat',
    color: '#FF0033',
    basePulse: 54,
    microStory: 'Supply Chain Heat: a second supplier lane cooled down lead times just as spoilage risk was creeping up.',
    kpis: [
      { label: 'Cold chain compliance', value: '98.4%', trend: '+0.2%' },
      { label: 'Supplier lead time', value: '2.1 days', trend: '-0.3d' },
      { label: 'Spoilage rate', value: '1.2%', trend: '-0.1%' },
    ],
    sparkline: [90, 91, 89, 92, 93, 94],
    insightTile: "Lead times shortened after the second supplier came online.",
    riskTile: 'One cold-store zone is trending toward its compliance floor.',
    opportunityTile: 'Shift more volume to the faster supplier lane.',
  },
  foundthat: {
    brand: 'foundthat',
    name: 'System Integrity',
    color: '#FFDD00',
    basePulse: 71,
    microStory: "System Integrity: patch compliance snapped back to full health right after last week's rollout.",
    kpis: [
      { label: 'Uptime', value: '99.95%', trend: '+0.01%' },
      { label: 'Open incidents', value: '3', trend: '-2' },
      { label: 'Patch compliance', value: '96%', trend: '+3%' },
      { label: 'Mean time to resolve', value: '42m', trend: '-6m' },
    ],
    sparkline: [96, 97, 95, 98, 99, 99],
    insightTile: "Patch compliance recovered fully after last week's rollout.",
    riskTile: 'One legacy service is still on an unsupported runtime.',
    opportunityTile: 'Automate patch rollout for the remaining manual services.',
  },
  talent: {
    brand: 'talent',
    name: 'Recruitment Velocity',
    color: '#FF8800',
    basePulse: 48,
    microStory: 'Recruitment Velocity: revised comp bands turned hesitant offers into fast acceptances this quarter.',
    kpis: [
      { label: 'Time to hire', value: '19 days', trend: '-3d' },
      { label: 'Open roles', value: '14', trend: '+2' },
      { label: 'Offer acceptance', value: '82%', trend: '+5%' },
    ],
    sparkline: [60, 62, 65, 63, 67, 70],
    insightTile: 'Offer acceptance improved after the revised comp bands.',
    riskTile: 'Two senior roles have been open longer than 45 days.',
    opportunityTile: 'Re-engage the shortlisted candidates from last quarter.',
  },
  crypto: {
    brand: 'crypto',
    name: 'Market Volatility',
    color: '#9933FF',
    basePulse: 83,
    microStory: 'Market Volatility: the last volatility spike brought in the biggest wave of active traders yet.',
    kpis: [
      { label: '24h volatility', value: '6.2%', trend: '+1.1%' },
      { label: 'Wallet health', value: '99.1%', trend: '+0.2%' },
      { label: 'Active traders', value: '312', trend: '+18' },
    ],
    sparkline: [40, 55, 48, 62, 58, 66],
    insightTile: 'Active trader count grew fastest during the last volatility spike.',
    riskTile: 'Volatility is approaching the upper alert band.',
    opportunityTile: 'Surface volatility alerts directly inside the trading view.',
  },
  finance: {
    brand: 'finance',
    name: 'Cashflow Stability',
    color: '#0033AA',
    basePulse: 59,
    microStory: 'Cashflow Stability: automated reminders are quietly pulling DSO down month over month.',
    kpis: [
      { label: 'Cash runway', value: '11.4 months', trend: '+0.6mo' },
      { label: 'DSO', value: '28 days', trend: '-2d' },
      { label: 'Burn multiple', value: '1.3x', trend: '-0.1x' },
    ],
    sparkline: [80, 78, 82, 84, 83, 86],
    insightTile: 'DSO improved after automated invoice reminders launched.',
    riskTile: 'Burn multiple ticked up during the last hiring push.',
    opportunityTile: 'Extend automated reminders to the largest overdue accounts.',
  },
  health: {
    brand: 'health',
    name: 'Patient Flow Pulse',
    color: '#33CCFF',
    basePulse: 66,
    microStory: 'Patient Flow Pulse: the new scheduling rules cut waiting-room overflow during peak hours.',
    kpis: [
      { label: 'Appointment fill rate', value: '91%', trend: '+3%' },
      { label: 'Avg wait time', value: '14 min', trend: '-4m' },
      { label: 'Compliance score', value: '97%', trend: '+1%' },
    ],
    sparkline: [70, 72, 74, 73, 77, 80],
    insightTile: 'Waiting-room overflow dropped after the scheduling rule change.',
    riskTile: 'One clinic is trending close to its compliance floor.',
    opportunityTile: 'Roll the new scheduling rules out to the remaining clinics.',
  },
  logistics: {
    brand: 'logistics',
    name: 'Fleet Momentum',
    color: '#DC143C',
    basePulse: 57,
    microStory: 'Fleet Momentum: route consolidation shaved a full day off average delivery time this month.',
    kpis: [
      { label: 'On-time delivery', value: '94%', trend: '+2%' },
      { label: 'Fleet utilisation', value: '81%', trend: '+4%' },
      { label: 'Avg delivery time', value: '2.3 days', trend: '-0.4d' },
    ],
    sparkline: [58, 60, 63, 62, 66, 69],
    insightTile: 'Delivery time improved after consolidating overlapping routes.',
    riskTile: 'Two depots are nearing peak fleet utilisation.',
    opportunityTile: 'Add a depot in the highest-demand delivery zone.',
  },
}
