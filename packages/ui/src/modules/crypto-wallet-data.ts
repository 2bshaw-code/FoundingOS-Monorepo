/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Shared, synthetic demo data for the six real Crypto Wallet views (Wallets/Portfolio/
// Transactions/Exchange/Charts/Analytics) — applies the genuinely good product ideas behind
// "invisible crypto" UX (plain-language actions, risk-first design, a narrative activity feed,
// goal-based pots) as honest, clearly-labeled DEMO interface polish. There is no real wallet,
// no real blockchain integration, no real money movement anywhere here — every balance is
// synthetic, every "risk" rating is illustrative, and every page says so.

export type RiskLevel = 'Low' | 'Medium' | 'High'

export type Pod = {
  id: string
  name: string
  kind: 'stablecoin' | 'reputation' | 'task'
  balance: number
  currency: string
  plainDescription: string
  explainLikeImTwelve: string
  risk: RiskLevel
  riskReason: string
}

export const DEMO_PODS: Pod[] = [
  {
    id: 'main',
    name: 'Main Pod',
    kind: 'stablecoin',
    balance: 482.5,
    currency: 'GBP',
    plainDescription: 'Your everyday spending money — always worth £1 per pod, never goes up or down.',
    explainLikeImTwelve: 'It\u2019s like a digital £1 coin that\u2019s always worth exactly £1 — so your money never randomly changes value.',
    risk: 'Low',
    riskReason: 'Backed 1:1 by GBP, held in the lowest-risk pod type.',
  },
  {
    id: 'holiday',
    name: 'Holiday Fund',
    kind: 'stablecoin',
    balance: 214.0,
    currency: 'GBP',
    plainDescription: 'A pot you and others can add to for a shared goal — nobody can spend it by accident.',
    explainLikeImTwelve: 'It\u2019s like a piggy bank everyone can see and add to, but nobody can take money out except for the holiday.',
    risk: 'Low',
    riskReason: 'Same stable pod type as Main Pod — value never moves.',
  },
  {
    id: 'rugby-tour',
    name: 'Rugby Tour Fund',
    kind: 'stablecoin',
    balance: 96.0,
    currency: 'GBP',
    plainDescription: 'The club\u2019s shared pot for the end-of-season tour — every contribution is tracked.',
    explainLikeImTwelve: 'Everyone on the team puts a bit in, and you can all see exactly how much is there for the trip.',
    risk: 'Low',
    riskReason: 'Same stable pod type — value never moves.',
  },
  {
    id: 'growth',
    name: 'Growth Pot',
    kind: 'stablecoin',
    balance: 150.0,
    currency: 'GBP',
    plainDescription: 'Money set aside to try to grow slowly over time, in a vetted low-risk source.',
    explainLikeImTwelve: 'It\u2019s a bit like a savings account that can go up a little over time — but unlike Main Pod, it can also dip slightly.',
    risk: 'Medium',
    riskReason: 'Allocated into a vetted yield source — can gain or lose a small amount, never dramatically.',
  },
  {
    id: 'reputation',
    name: 'Reputation Points',
    kind: 'reputation',
    balance: 68,
    currency: 'REP',
    plainDescription: 'Earned by good behaviour (on-time payments, positive reviews) — can\u2019t be sent to anyone or sold.',
    explainLikeImTwelve: 'It\u2019s like a trust score — you earn it by being reliable, and it can unlock better limits, but you can never give it away.',
    risk: 'Low',
    riskReason: 'Non-transferable — nothing to lose, since it can\u2019t be sent, sold, or stolen.',
  },
  {
    id: 'task-credits',
    name: 'Task Credits',
    kind: 'task',
    balance: 12,
    currency: 'HRS',
    plainDescription: 'Represents hours of work or services owed to you — redeemable with whoever issued them.',
    explainLikeImTwelve: 'It\u2019s like an IOU for hours of help — if someone owes you 12 hours of work, that\u2019s tracked here.',
    risk: 'Medium',
    riskReason: 'Only as reliable as the person/business who issued it — redemption isn\u2019t instant like a pod.',
  },
]

export type ActivityEntry = {
  id: string
  narrative: string
  amount: string
  direction: 'out' | 'in'
  pod: string
  timestamp: string
  category: string
}

export const DEMO_ACTIVITY: ActivityEntry[] = [
  { id: 'act-1', narrative: 'You paid Reece £20 for lunch.', amount: '£20.00', direction: 'out', pod: 'Main Pod', timestamp: '2026-09-02 12:41', category: 'Split & pay' },
  { id: 'act-2', narrative: 'You received £50 from Sam for the group gift.', amount: '£50.00', direction: 'in', pod: 'Main Pod', timestamp: '2026-09-01 18:20', category: 'Received' },
  { id: 'act-3', narrative: 'You added £30 to Holiday Fund.', amount: '£30.00', direction: 'out', pod: 'Holiday Fund', timestamp: '2026-08-30 09:05', category: 'Savings' },
  { id: 'act-4', narrative: 'You earned 4 Reputation Points for an on-time payment.', amount: '+4 REP', direction: 'in', pod: 'Reputation Points', timestamp: '2026-08-29 14:00', category: 'Reputation' },
  { id: 'act-5', narrative: 'You split a £45 dinner bill three ways with Priya and Tom.', amount: '£15.00', direction: 'out', pod: 'Main Pod', timestamp: '2026-08-28 20:12', category: 'Split & pay' },
  { id: 'act-6', narrative: 'You redeemed 3 Task Credits with Northside Group.', amount: '-3 HRS', direction: 'out', pod: 'Task Credits', timestamp: '2026-08-26 11:30', category: 'Task credits' },
]

export function totalBalanceGbp(): number {
  return DEMO_PODS.filter((pod) => pod.kind === 'stablecoin').reduce((sum, pod) => sum + pod.balance, 0)
}

export const RISK_BADGE_COLOR: Record<RiskLevel, string> = {
  Low: '#00E676',
  Medium: '#FFB300',
  High: '#FF3B30',
}
