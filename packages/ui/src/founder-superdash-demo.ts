import type { FounderOverview } from './founder-superdash'

const DAY = 86_400_000
const plans = [
  { plan: 'lite', name: 'Lite' },
  { plan: 'starter', name: 'Core' },
  { plan: 'growth', name: 'Complete' },
] as const

const examples: Array<[name: string, plan: 'lite' | 'starter' | 'growth', workspaces: string[], daysAgo: number, activeDaysAgo: number | null, seats: number]> = [
  ['Harbour Cafe', 'growth', ['retail', 'finance', 'marketing', 'hr'], 27, 0, 8],
  ['Willowbrook Bakery', 'growth', ['retail', 'logistics', 'finance'], 23, 1, 6],
  ['North & Co', 'growth', ['talent', 'hr', 'finance'], 19, 2, 5],
  ['Corner Deli', 'starter', ['retail', 'finance'], 15, 0, 3],
  ['Greenway Logistics', 'starter', ['retail', 'intelligence'], 12, 3, 4],
  ['Meadow Studio', 'starter', ['talent'], 8, 1, 2],
  ['Quayside Clinic', 'starter', ['hr', 'finance'], 6, 4, 3],
  ['City Market', 'starter', ['retail'], 4, 1, 2],
  ['Elm Services', 'lite', [], 2, 1, 1],
  ['Bright Ideas', 'lite', [], 1, null, 1],
]

export function founderDemoOverview(live: FounderOverview, now = Date.now()): FounderOverview {
  const today = new Date(now)
  today.setUTCHours(0, 0, 0, 0)
  const tenants: FounderOverview['tenants'] = examples.map(([businessName, plan, workspaces, daysAgo, activeDaysAgo, seats], index) => ({
    tenantId: `demo-${index}`,
    businessName: `${businessName} (example)`,
    ownerName: `Example owner ${index + 1}`,
    ownerEmail: `demo${index + 1}@example.com`,
    plan,
    planName: plans.find((row) => row.plan === plan)?.name ?? plan,
    workspaces,
    seats,
    monthlyValueGbp: plan === 'growth' ? 89 : plan === 'lite' ? 0
      : Math.max(19, workspaces.reduce((sum, workspace) => sum + (workspace === 'retail' || workspace === 'talent' || workspace === 'hr' ? 19 : 0), 0))
        + workspaces.reduce((sum, workspace) => sum + (workspace === 'finance' ? 25 : workspace === 'intelligence' ? 35 : 0), 0),
    status: 'active',
    createdAt: new Date(today.getTime() - daysAgo * DAY).toISOString(),
    lastActiveAt: activeDaysAgo === null ? null : new Date(now - activeDaysAgo * DAY).toISOString(),
  }))
  const paying = tenants.filter((tenant) => tenant.monthlyValueGbp > 0)
  const mrrGbp = tenants.reduce((sum, tenant) => sum + tenant.monthlyValueGbp, 0)
  const workspaces = ['retail', 'logistics', 'finance', 'marketing', 'talent', 'hr', 'health', 'intelligence']
  const boltOnPrices: Record<string, number> = { finance: 25, talent: 19, hr: 19, health: 19, intelligence: 35 }
  const signupsByDay = Array.from({ length: 14 }, (_, index) => {
    const date = new Date(today.getTime() - (13 - index) * DAY).toISOString().slice(0, 10)
    return { date, count: tenants.filter((tenant) => tenant.createdAt.slice(0, 10) === date).length }
  })
  return {
    generatedAt: live.generatedAt,
    subscriptions: {
      customers: tenants.length,
      paying: paying.length,
      free: tenants.length - paying.length,
      new7d: tenants.filter((tenant) => Date.parse(tenant.createdAt) >= now - 7 * DAY).length,
      new30d: tenants.filter((tenant) => Date.parse(tenant.createdAt) >= now - 30 * DAY).length,
      active7d: tenants.filter((tenant) => tenant.lastActiveAt && Date.parse(tenant.lastActiveAt) >= now - 7 * DAY).length,
      byPlan: plans.map(({ plan, name }) => {
        const members = tenants.filter((tenant) => tenant.plan === plan)
        return { plan, name, customers: members.length, mrrGbp: members.reduce((sum, tenant) => sum + tenant.monthlyValueGbp, 0) }
      }),
      workspaceAdoption: workspaces.map((workspace) => ({ workspace, customers: tenants.filter((tenant) => tenant.workspaces.includes(workspace)).length })),
      signupsByDay,
    },
    finance: {
      mrrGbp,
      arrGbp: mrrGbp * 12,
      arpuGbp: Math.round(mrrGbp / paying.length * 100) / 100,
      boltOns: Object.entries(boltOnPrices).map(([workspace, price]) => ({
        workspace,
        customers: tenants.filter((tenant) => tenant.plan === 'starter' && tenant.workspaces.includes(workspace)).length,
        mrrGbp: tenants.filter((tenant) => tenant.plan === 'starter' && tenant.workspaces.includes(workspace)).length * price,
      })),
      billingLive: live.finance.billingLive,
      note: 'Illustrative FoundingOS subscriptions only. These amounts are not collected revenue.',
    },
    monitoring: live.monitoring,
    upgradeRequests: [{
      id: 'demo-upgrade-1',
      tenantId: tenants[8].tenantId,
      business: tenants[8].businessName,
      ownerEmail: tenants[8].ownerEmail,
      requested: ['retail'],
      pending: ['retail'],
      note: 'Example request — actions are disabled in preview.',
      createdAt: new Date(now - DAY).toISOString(),
    }],
    ratings: {
      count: 3,
      average: 4.3,
      distribution: [{ score: 5, count: 2 }, { score: 4, count: 0 }, { score: 3, count: 1 }, { score: 2, count: 0 }, { score: 1, count: 0 }],
      recent: [
        { id: 'demo-rating-1', tenantId: tenants[0].tenantId, business: tenants[0].businessName, score: 5, surface: 'web', page: 'retail/orders', comment: 'Example rating — preview data only.', createdAt: new Date(now - 2 * DAY).toISOString() },
        { id: 'demo-rating-2', tenantId: tenants[1].tenantId, business: tenants[1].businessName, score: 5, surface: 'ios', page: 'talent/pipeline', comment: '', createdAt: new Date(now - 4 * DAY).toISOString() },
        { id: 'demo-rating-3', tenantId: tenants[2].tenantId, business: tenants[2].businessName, score: 3, surface: 'web', page: 'hr/onboarding', comment: 'Example: would like more report exports.', createdAt: new Date(now - 6 * DAY).toISOString() },
      ],
    },
    tenants,
  }
}
