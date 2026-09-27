import type { FounderOverview } from './founder-superdash'
import type { FounderFinance, FounderMarketing } from './founder-superdash-modules'

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

// Used when live figures are unavailable (offline preview or backend unreachable).
const offlineMonitoring: FounderOverview['monitoring'] = { apiOk: false, dbLatencyMs: 0, aiConfigured: false, emailConfigured: false, upgradeEmailsConfigured: false, lastAutopilotRunAt: null, aiRequests24h: 0, autopilotActions24h: 0, recordsCreated24h: 0, integrationsConnected: 0, integrationsFailing: [] }

export function founderDemoOverview(live: FounderOverview | null, now = Date.now()): FounderOverview {
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
    generatedAt: live?.generatedAt ?? new Date(now).toISOString(),
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
      billingLive: live?.finance.billingLive ?? false,
      note: 'Illustrative FoundingOS subscriptions only. These amounts are not collected revenue.',
    },
    monitoring: live?.monitoring ?? offlineMonitoring,
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

const monthKeys = (now: number, count: number) => Array.from({ length: count }, (_, index) => {
  const date = new Date(now)
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() - (count - 1 - index), 1)).toISOString().slice(0, 7)
})
const money = (value: number) => Math.round(value * 100) / 100

// Twelve months of example FoundingOS books that end at the demo subscribers' current MRR.
export function founderDemoFinance(overview: FounderOverview, now = Date.now()): FounderFinance {
  const months = monthKeys(now, 12)
  const mrr = overview.finance.mrrGbp
  const recurring: Array<[label: string, category: string, amount: number, startMonth: number]> = [
    ['Vercel Pro', 'Hosting & infrastructure', 20, 0],
    ['Postgres database', 'Hosting & infrastructure', 19, 0],
    ['Anthropic API (FoundAI)', 'AI & APIs', 85, 2],
    ['Resend email', 'Email & messaging', 20, 3],
    ['Expo EAS builds', 'App stores & developer', 29, 4],
    ['Google Workspace', 'Software & tools', 14, 0],
    ['Accounting software', 'Legal & accounting', 15, 6],
  ]
  const oneOffs: Array<[label: string, category: string, amount: number, month: number, kind: 'expense' | 'income']> = [
    ['Apple Developer Program', 'App stores & developer', 79, 1, 'expense'],
    ['LinkedIn launch ads', 'Advertising', 150, 8, 'expense'],
    ['Privacy policy legal review', 'Legal & accounting', 450, 9, 'expense'],
    ['Onboarding setup fee (example)', 'Other', 250, 7, 'income'],
    ['Onboarding setup fee (example)', 'Other', 400, 10, 'income'],
  ]
  const pnl = months.map((month, index) => {
    const subscriptions = money(mrr / Math.pow(1.14, 11 - index))
    const otherIncome = oneOffs.filter(([, , , at, kind]) => kind === 'income' && at === index).reduce((sum, [, , amount]) => sum + amount, 0)
    const costs = recurring.filter(([, , , start]) => start <= index).reduce((sum, [, , amount]) => sum + amount, 0)
      + oneOffs.filter(([, , , at, kind]) => kind === 'expense' && at === index).reduce((sum, [, , amount]) => sum + amount, 0)
    const revenue = money(subscriptions + otherIncome)
    return { month, subscriptions, otherIncome, revenue, costs, net: money(revenue - costs) }
  })
  const recurringCostsGbp = recurring.reduce((sum, [, , amount]) => sum + amount, 0)
  const cashGbp = 14_500
  const monthlyBurnGbp = Math.max(0, recurringCostsGbp - mrr)
  const entries: FounderFinance['entries'] = [
    ...recurring.map(([label, category, amountGbp, start], index) => ({ id: `demo-cost-${index}`, label, kind: 'expense', category, recurring: true, date: `${months[start]}-01`, amountGbp, note: '' })),
    ...oneOffs.map(([label, category, amountGbp, at, kind], index) => ({ id: `demo-once-${index}`, label, kind, category: kind === 'income' ? 'Other' : category, recurring: false, date: `${months[at]}-15`, amountGbp, note: '' })),
    { id: 'demo-cash', label: 'Business bank account (example)', kind: 'cash', category: 'Other', recurring: false, date: new Date(now).toISOString().slice(0, 10), amountGbp: cashGbp, note: '' },
  ].sort((a, b) => b.date.localeCompare(a.date))
  const categories = ['Hosting & infrastructure', 'AI & APIs', 'App stores & developer', 'Email & messaging', 'Software & tools', 'Advertising', 'Salaries & contractors', 'Legal & accounting', 'Other']
  const current = pnl[pnl.length - 1]
  return {
    mrrGbp: mrr,
    arrGbp: overview.finance.arrGbp,
    arpuGbp: overview.finance.arpuGbp,
    payingCustomers: overview.subscriptions.paying,
    billingLive: false,
    recurringCostsGbp,
    thisMonth: current,
    cashGbp,
    cashAsOf: new Date(now).toISOString().slice(0, 10),
    monthlyBurnGbp,
    runwayMonths: monthlyBurnGbp > 0 ? money(cashGbp / monthlyBurnGbp) : null,
    pnl,
    byCategory: categories.map((category) => ({ category, monthlyGbp: recurring.filter(([, c]) => c === category).reduce((sum, [, , amount]) => sum + amount, 0) })).filter((row) => row.monthlyGbp > 0),
    topCustomers: overview.tenants.filter((tenant) => tenant.monthlyValueGbp > 0).sort((a, b) => b.monthlyValueGbp - a.monthlyValueGbp).slice(0, 8).map((tenant) => ({ business: tenant.businessName, plan: tenant.planName, monthlyGbp: tenant.monthlyValueGbp })),
    entries,
    categories,
    note: 'Example FoundingOS books for the preview. Nothing here is your real revenue or spending.',
  }
}

export function founderDemoMarketing(overview: FounderOverview, now = Date.now()): FounderMarketing {
  const s = overview.subscriptions
  const at = (days: number, hour = 10) => { const date = new Date(now + days * DAY); date.setHours(hour, 0, 0, 0); return date.toISOString() }
  const signupsByWeek = Array.from({ length: 12 }, (_, index) => ({ weekOf: new Date(now - (11 - index) * 7 * DAY).toISOString().slice(0, 10), signups: Math.round(2 + index * 1.1 + (index % 3)) }))
  const posts: FounderMarketing['posts'] = [
    ['Stop juggling five apps to run your shop', 'Published', 'LinkedIn', -9, 'Lite launch'],
    ['How Harbour Cafe answers WhatsApp orders in seconds', 'Published', 'Instagram', -6, 'Lite launch'],
    ['Your first month on FoundingOS Lite is free', 'Published', 'Facebook', -3, 'Lite launch'],
    ['Five signs your small business needs one system', 'Approved', 'LinkedIn', 1, 'Autumn growth'],
    ['Health clinics: bookings and follow-ups in one place', 'Approved', 'Instagram', 3, 'Autumn growth'],
    ['Hiring this winter? Meet FoundingOS Talent', 'Approved', 'LinkedIn', 6, 'Autumn growth'],
    ['Behind the scenes: how FoundAI drafts your replies', 'Draft', 'LinkedIn', 10, ''],
  ].map(([title, status, channel, days, campaign], index) => ({
    id: `demo-post-${index}`,
    title: String(title),
    status: String(status),
    channel: String(channel),
    text: 'Example post for the preview — switch back to live figures to write and schedule real posts.',
    hashtags: '#SmallBusiness #FoundingOS',
    dueDate: at(Number(days)),
    campaign: String(campaign),
    publishedUrl: null,
    publishedAt: status === 'Published' ? at(Number(days)) : null,
    updatedAt: at(Math.min(0, Number(days))),
  }))
  return {
    funnel: {
      signups30d: s.new30d,
      signups7d: s.new7d,
      customers: s.customers,
      paying: s.paying,
      conversionPct: s.customers ? Math.round((s.paying / s.customers) * 100) : 0,
      upgradeRequests90d: 4,
      active7d: s.active7d,
      signupsByWeek,
    },
    channels: { facebookInstagram: true, linkedin: true },
    posts,
    campaigns: [
      { id: 'demo-campaign-1', name: 'Lite launch', status: 'Completed', summary: 'Three posts introducing the free Lite plan to UK shops and cafes.', updatedAt: at(-3) },
      { id: 'demo-campaign-2', name: 'Autumn growth', status: 'Active', summary: 'Health, Talent and Retail stories to move Lite users onto Core.', updatedAt: at(0) },
    ],
  }
}
