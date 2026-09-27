/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Top-down growth scenario for investor conversations. Market facts are sourced; everything else
// is an explicit, editable assumption. This is a projection, never traction.
export const MARKET_FACTS = {
  ukSmallBusinesses: 5_640_000,
  ukSmallBusinessesSource: 'FSB UK small business statistics, start of 2025 (0–49 employees)',
  whatsappBusinessMonthlyUsers: 200_000_000,
  whatsappBusinessSource: 'Meta, 2024: WhatsApp Business app has over 200 million monthly users worldwide',
} as const

export type ScenarioInputs = {
  businesses: number
  whatsappSharePct: number
  reachPct: number
  paidConversionPct: number
  arpuGbp: number
  arrMultiple: number
}
export type ScenarioName = 'conservative' | 'base' | 'ambitious' | 'breakout'

export const SCENARIOS: Record<ScenarioName, { label: string; summary: string; inputs: ScenarioInputs }> = {
  conservative: { label: 'Conservative', summary: 'Slow organic growth with little marketing spend.', inputs: { businesses: MARKET_FACTS.ukSmallBusinesses, whatsappSharePct: 30, reachPct: 0.1, paidConversionPct: 15, arpuGbp: 35, arrMultiple: 4 } },
  base: { label: 'Base', summary: 'Steady marketing and word of mouth.', inputs: { businesses: MARKET_FACTS.ukSmallBusinesses, whatsappSharePct: 30, reachPct: 0.25, paidConversionPct: 25, arpuGbp: 45, arrMultiple: 6 } },
  ambitious: { label: 'Ambitious', summary: 'Strong marketing and referral loops.', inputs: { businesses: MARKET_FACTS.ukSmallBusinesses, whatsappSharePct: 30, reachPct: 0.5, paidConversionPct: 35, arpuGbp: 55, arrMultiple: 8 } },
  breakout: { label: 'Breakout', summary: 'Upside case: very effective sales and marketing, and the WhatsApp-native operating system is recognised as unique — 2% of WhatsApp-first UK businesses sign up, most upgrade to several workspaces, and it earns a category-leader multiple.', inputs: { businesses: MARKET_FACTS.ukSmallBusinesses, whatsappSharePct: 30, reachPct: 2, paidConversionPct: 40, arpuGbp: 65, arrMultiple: 10 } },
}

export type ScenarioMonth = { month: number; accounts: number; paying: number; mrrGbp: number }
export type ScenarioResult = {
  whatsappBusinesses: number
  accountsAt24: number
  months: ScenarioMonth[]
  milestones: Array<{ label: string; paying: number; mrrGbp: number; arrGbp: number }>
  illustrativeValuationGbp: number
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, Number.isFinite(value) ? value : 0))

// Accounts ramp along a quadratic curve to the month-24 target: slow early, faster as word of
// mouth and WhatsApp referrals compound.
export function whatsappScenario(raw: ScenarioInputs, horizon = 24): ScenarioResult {
  const inputs = {
    businesses: clamp(raw.businesses, 0, 1e9),
    whatsappSharePct: clamp(raw.whatsappSharePct, 0, 100),
    reachPct: clamp(raw.reachPct, 0, 100),
    paidConversionPct: clamp(raw.paidConversionPct, 0, 100),
    arpuGbp: clamp(raw.arpuGbp, 0, 10_000),
    arrMultiple: clamp(raw.arrMultiple, 0, 50),
  }
  const whatsappBusinesses = Math.round(inputs.businesses * inputs.whatsappSharePct / 100)
  const accountsAt24 = Math.round(whatsappBusinesses * inputs.reachPct / 100)
  const months = Array.from({ length: horizon }, (_, index) => {
    const month = index + 1
    const accounts = Math.round(accountsAt24 * Math.pow(month / horizon, 2))
    const paying = Math.round(accounts * inputs.paidConversionPct / 100)
    return { month, accounts, paying, mrrGbp: paying * inputs.arpuGbp }
  })
  const milestones = [6, 12, 18, 24].filter((month) => month <= horizon).map((month) => {
    const row = months[month - 1]
    return { label: `Month ${month}`, paying: row.paying, mrrGbp: row.mrrGbp, arrGbp: row.mrrGbp * 12 }
  })
  const finalArr = (months[months.length - 1]?.mrrGbp ?? 0) * 12
  return { whatsappBusinesses, accountsAt24, months, milestones, illustrativeValuationGbp: Math.round(finalArr * inputs.arrMultiple) }
}
