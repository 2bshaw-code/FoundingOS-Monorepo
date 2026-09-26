/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Founder SuperDash: the platform owner's view of every customer company —
// subscriptions and revenue, upgrade requests, platform health, and growth.
import { prisma } from './auth.js'
import { createWorkspaceRecord, workspaceSlugs } from './platform.js'

const PLAN_PRICE: Record<string, number> = { lite: 0, starter: 19, growth: 89, enterprise: 0 }
const PLAN_NAME: Record<string, string> = { lite: 'Lite', starter: 'Core', growth: 'Complete', enterprise: 'Enterprise' }
// Core-plan bolt-ons, priced per enabled workspace (mirrors packages/config/src/commercial.ts).
const BOLT_ON_PRICE: Record<string, number> = { finance: 25, talent: 29, intelligence: 35 }
const DAY = 24 * 60 * 60 * 1000

const monthlyValue = (plan: string, enabled: string[]) =>
  (PLAN_PRICE[plan] ?? 0) + (plan === 'starter' ? enabled.reduce((sum, workspace) => sum + (BOLT_ON_PRICE[workspace] ?? 0), 0) : 0)

export async function founderOverview(founderTenantId?: string | null) {
  const now = Date.now()
  const dbStart = Date.now()
  const [workspaces, onboardings, owners, recentAudit, integrations, upgradeRequests] = await Promise.all([
    prisma.tenantWorkspace.findMany({ select: { tenantId: true, workspace: true, enabled: true, plan: true } }),
    prisma.tenantOnboarding.findMany({ select: { tenantId: true, businessName: true, ownerName: true, industry: true, goLiveStatus: true, createdAt: true } }),
    prisma.authUser.findMany({ where: { tenantId: { not: null } }, select: { tenantId: true, email: true, role: true, active: true, createdAt: true } }),
    prisma.workspaceAuditEvent.findMany({ where: { createdAt: { gte: new Date(now - 30 * DAY) } }, select: { tenantId: true, action: true, createdAt: true } }),
    prisma.integrationCredential.findMany({ select: { tenantId: true, provider: true, status: true } }),
    prisma.workspaceAuditEvent.findMany({ where: { action: 'plan.upgrade_requested' }, orderBy: { createdAt: 'desc' }, take: 25, select: { id: true, tenantId: true, metadata: true, createdAt: true } }),
  ])
  const dbLatencyMs = Date.now() - dbStart

  // Internal @foundingos.com accounts (QA, staff) are not customers.
  const internal = new Set(owners.filter((user) => user.email.toLowerCase().endsWith('@foundingos.com')).map((user) => user.tenantId))
  const tenantIds = [...new Set([...workspaces.map((row) => row.tenantId), ...onboardings.map((row) => row.tenantId)])].filter((id) => id !== founderTenantId && !internal.has(id))
  const onboardingBy = new Map(onboardings.map((row) => [row.tenantId, row]))
  const lastActive = new Map<string, number>()
  for (const event of recentAudit) lastActive.set(event.tenantId, Math.max(lastActive.get(event.tenantId) ?? 0, event.createdAt.getTime()))

  const tenants = tenantIds.map((tenantId) => {
    const rows = workspaces.filter((row) => row.tenantId === tenantId)
    const enabled = rows.filter((row) => row.enabled).map((row) => row.workspace)
    const plan = rows[0]?.plan || 'lite'
    const onboarding = onboardingBy.get(tenantId)
    const owner = owners.find((user) => user.tenantId === tenantId && user.role === 'business_owner') || owners.find((user) => user.tenantId === tenantId)
    const seats = owners.filter((user) => user.tenantId === tenantId && user.active).length
    const last = lastActive.get(tenantId)
    return {
      tenantId,
      businessName: onboarding?.businessName || tenantId,
      ownerName: onboarding?.ownerName || '',
      ownerEmail: owner?.email || '',
      industry: onboarding?.industry || null,
      plan,
      planName: PLAN_NAME[plan] || plan,
      workspaces: enabled,
      seats,
      monthlyValueGbp: monthlyValue(plan, enabled),
      status: onboarding?.goLiveStatus || 'setup',
      createdAt: (onboarding?.createdAt || owner?.createdAt || new Date(0)).toISOString(),
      lastActiveAt: last ? new Date(last).toISOString() : null,
    }
  }).sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const mrr = tenants.reduce((sum, tenant) => sum + tenant.monthlyValueGbp, 0)
  const paying = tenants.filter((tenant) => tenant.monthlyValueGbp > 0)
  const byPlan = Object.keys(PLAN_NAME).map((plan) => {
    const list = tenants.filter((tenant) => tenant.plan === plan)
    return { plan, name: PLAN_NAME[plan], customers: list.length, mrrGbp: list.reduce((sum, tenant) => sum + tenant.monthlyValueGbp, 0) }
  })
  const boltOns = Object.keys(BOLT_ON_PRICE).map((workspace) => {
    const list = tenants.filter((tenant) => tenant.plan === 'starter' && tenant.workspaces.includes(workspace))
    return { workspace, customers: list.length, mrrGbp: list.length * BOLT_ON_PRICE[workspace] }
  })
  const workspaceAdoption = workspaceSlugs.map((workspace) => ({ workspace, customers: tenants.filter((tenant) => tenant.workspaces.includes(workspace)).length }))

  const signupsByDay = Array.from({ length: 14 }, (_, index) => {
    const start = new Date(now - (13 - index) * DAY)
    start.setHours(0, 0, 0, 0)
    const end = start.getTime() + DAY
    return { date: start.toISOString().slice(0, 10), count: tenants.filter((tenant) => { const at = Date.parse(tenant.createdAt); return at >= start.getTime() && at < end }).length }
  })
  const count = (action: string, days: number) => recentAudit.filter((event) => event.action === action && event.createdAt.getTime() >= now - days * DAY && event.tenantId !== founderTenantId).length
  const lastAutopilot = recentAudit.filter((event) => event.action === 'autopilot.executed').reduce((max, event) => Math.max(max, event.createdAt.getTime()), 0)
  const tenantNames = new Map(tenants.map((tenant) => [tenant.tenantId, tenant.businessName]))

  return {
    generatedAt: new Date(now).toISOString(),
    subscriptions: {
      customers: tenants.length,
      paying: paying.length,
      free: tenants.length - paying.length,
      new7d: tenants.filter((tenant) => Date.parse(tenant.createdAt) >= now - 7 * DAY).length,
      new30d: tenants.filter((tenant) => Date.parse(tenant.createdAt) >= now - 30 * DAY).length,
      active7d: tenants.filter((tenant) => tenant.lastActiveAt && Date.parse(tenant.lastActiveAt) >= now - 7 * DAY).length,
      byPlan,
      workspaceAdoption,
      signupsByDay,
    },
    finance: {
      mrrGbp: mrr,
      arrGbp: mrr * 12,
      arpuGbp: paying.length ? Math.round((mrr / paying.length) * 100) / 100 : 0,
      boltOns,
      billingLive: Boolean(process.env.STRIPE_SECRET_KEY?.trim()),
      note: 'Estimated from each company’s plan and switched-on workspaces. Becomes collected revenue once Stripe billing is connected.',
    },
    monitoring: {
      apiOk: true,
      dbLatencyMs,
      aiConfigured: Boolean(process.env.ANTHROPIC_API_KEY?.trim()),
      emailConfigured: Boolean(process.env.RESEND_API_KEY?.trim()),
      upgradeEmailsConfigured: Boolean(process.env.RESEND_API_KEY?.trim() && process.env.SALES_NOTIFY_EMAIL?.trim()),
      lastAutopilotRunAt: lastAutopilot ? new Date(lastAutopilot).toISOString() : null,
      aiRequests24h: count('ai.asked', 1),
      autopilotActions24h: count('autopilot.executed', 1),
      recordsCreated24h: count('record.created', 1),
      integrationsConnected: integrations.filter((row) => ['configured', 'ready'].includes(row.status) && row.tenantId !== founderTenantId).length,
      integrationsFailing: integrations.filter((row) => !['configured', 'ready'].includes(row.status) && row.tenantId !== founderTenantId).map((row) => ({ business: tenantNames.get(row.tenantId) || row.tenantId, provider: row.provider, status: row.status })),
    },
    upgradeRequests: upgradeRequests.filter((row) => row.tenantId !== founderTenantId).map((row) => {
      const metadata = (row.metadata || {}) as { workspaces?: string[]; note?: string }
      const tenant = tenants.find((item) => item.tenantId === row.tenantId)
      const pending = (metadata.workspaces || []).filter((workspace) => !tenant?.workspaces.includes(workspace))
      return { id: row.id, tenantId: row.tenantId, business: tenant?.businessName || row.tenantId, ownerEmail: tenant?.ownerEmail || '', requested: metadata.workspaces || [], pending, note: metadata.note || '', createdAt: row.createdAt.toISOString() }
    }),
    tenants: tenants.slice(0, 100),
  }
}

// Switches workspaces on or off for a customer company (e.g. to fulfil an upgrade request).
export async function founderSetTenantWorkspaces(founderId: string, tenantId: string, input: Record<string, unknown>) {
  const requested = (Array.isArray(input.workspaces) ? input.workspaces : []).map(String).filter((workspace) => (workspaceSlugs as readonly string[]).includes(workspace))
  if (!requested.length) throw Object.assign(new Error('Choose at least one workspace.'), { status: 400 })
  const enabled = input.enabled !== false
  const existing = await prisma.tenantWorkspace.findMany({ where: { tenantId } })
  if (!existing.length) throw Object.assign(new Error('Company not found.'), { status: 404 })
  const plan = typeof input.plan === 'string' && PLAN_NAME[input.plan] ? input.plan : existing[0].plan
  await prisma.$transaction([
    ...requested.map((workspace) => prisma.tenantWorkspace.upsert({
      where: { tenantId_workspace: { tenantId, workspace } },
      create: { tenantId, workspace, enabled, plan, modules: [] },
      update: { enabled },
    })),
    prisma.tenantWorkspace.updateMany({ where: { tenantId }, data: { plan } }),
    prisma.workspaceAuditEvent.create({ data: { tenantId, actorId: founderId, action: 'plan.workspaces_changed', metadata: { workspaces: requested, enabled, plan } } }),
  ])
  return { tenantId, workspaces: requested, enabled, plan }
}

// Paid entitlements come only from a signature-verified Stripe subscription event
// (relayed by the web billing webhook). Cancelled/unpaid subscriptions drop back to Lite.
const LITE_WORKSPACES = ['retail']
export async function applyBillingEntitlements(input: Record<string, unknown>) {
  const tenantId = typeof input.tenantId === 'string' ? input.tenantId.trim() : ''
  if (!tenantId) throw Object.assign(new Error('tenantId required'), { status: 400 })
  const existing = await prisma.tenantWorkspace.findMany({ where: { tenantId } })
  if (!existing.length) throw Object.assign(new Error('Company not found.'), { status: 404 })
  const active = input.active === true
  const plan = active && typeof input.plan === 'string' && PLAN_NAME[input.plan] ? input.plan : 'lite'
  const paid = (Array.isArray(input.workspaces) ? input.workspaces : []).map(String).filter((workspace) => (workspaceSlugs as readonly string[]).includes(workspace))
  const enabled = new Set(active ? [...LITE_WORKSPACES, ...paid] : LITE_WORKSPACES)
  await prisma.$transaction([
    ...workspaceSlugs.map((workspace) => prisma.tenantWorkspace.upsert({
      where: { tenantId_workspace: { tenantId, workspace } },
      create: { tenantId, workspace, enabled: enabled.has(workspace), plan, modules: [] },
      update: { enabled: enabled.has(workspace), plan },
    })),
    prisma.workspaceAuditEvent.create({ data: { tenantId, actorId: 'billing', action: 'plan.billing_synced', metadata: { plan, active, workspaces: [...enabled] } } }),
  ])
  return { tenantId, plan, workspaces: [...enabled] }
}

// ---- SuperDash Finance: FoundingOS's own books -----------------------------------------
// Ledger entries live as workspace records in the founder's own company (finance/founder-ledger),
// so they also appear in the founder's Finance workspace and the audit trail.
const LEDGER = { workspace: 'finance', module: 'founder-ledger' } as const
const LEDGER_KINDS = ['expense', 'income', 'cash'] as const
export const FOUNDER_COST_CATEGORIES = ['Hosting & infrastructure', 'AI & APIs', 'App stores & developer', 'Email & messaging', 'Software & tools', 'Advertising', 'Salaries & contractors', 'Legal & accounting', 'Other'] as const
const monthKey = (date: Date) => date.toISOString().slice(0, 7)
const requireFounderTenant = (tenantId?: string | null) => {
  if (!tenantId) throw Object.assign(new Error('Your founder account needs a company to keep FoundingOS books in.'), { status: 400 })
  return tenantId
}

export async function founderFinance(founderTenantId?: string | null) {
  const tenantId = requireFounderTenant(founderTenantId)
  const [overview, rows] = await Promise.all([
    founderOverview(tenantId),
    prisma.workspaceRecord.findMany({ where: { tenantId, ...LEDGER, deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 500 }),
  ])
  const entries = rows.map((row) => {
    const data = (row.data || {}) as Record<string, unknown>
    return { id: row.id, label: row.name, kind: String(data.kind || 'expense'), category: String(data.category || 'Other'), recurring: data.recurring === true, date: String(data.date || row.createdAt.toISOString().slice(0, 10)), amountGbp: (row.valuePence || 0) / 100, note: String(data.note || '') }
  })
  const now = new Date()
  const months = Array.from({ length: 6 }, (_, index) => { const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (5 - index), 1)); return monthKey(d) })
  const tenants = overview.tenants
  const pnl = months.map((month) => {
    const end = new Date(`${month}-01T00:00:00Z`); end.setUTCMonth(end.getUTCMonth() + 1)
    // Subscription revenue is estimated from each company's current plan for the months it existed.
    const subscriptions = tenants.filter((tenant) => Date.parse(tenant.createdAt) < end.getTime()).reduce((sum, tenant) => sum + tenant.monthlyValueGbp, 0)
    const started = (entry: typeof entries[number]) => entry.date.slice(0, 7) <= month
    const inMonth = (entry: typeof entries[number]) => entry.date.slice(0, 7) === month
    const costs = entries.filter((entry) => entry.kind === 'expense' && (entry.recurring ? started(entry) : inMonth(entry))).reduce((sum, entry) => sum + entry.amountGbp, 0)
    const otherIncome = entries.filter((entry) => entry.kind === 'income' && (entry.recurring ? started(entry) : inMonth(entry))).reduce((sum, entry) => sum + entry.amountGbp, 0)
    const revenue = subscriptions + otherIncome
    return { month, subscriptions, otherIncome, revenue, costs, net: Math.round((revenue - costs) * 100) / 100 }
  })
  const current = pnl[pnl.length - 1]
  const recurringCosts = entries.filter((entry) => entry.kind === 'expense' && entry.recurring).reduce((sum, entry) => sum + entry.amountGbp, 0)
  const cashEntry = entries.filter((entry) => entry.kind === 'cash').sort((a, b) => b.date.localeCompare(a.date))[0]
  const burn = Math.max(0, recurringCosts - overview.finance.mrrGbp)
  const byCategory = FOUNDER_COST_CATEGORIES.map((category) => ({ category, monthlyGbp: entries.filter((entry) => entry.kind === 'expense' && entry.category === category && (entry.recurring || entry.date.slice(0, 7) === current.month)).reduce((sum, entry) => sum + entry.amountGbp, 0) })).filter((row) => row.monthlyGbp > 0)
  return {
    generatedAt: new Date().toISOString(),
    mrrGbp: overview.finance.mrrGbp,
    arrGbp: overview.finance.arrGbp,
    arpuGbp: overview.finance.arpuGbp,
    payingCustomers: overview.subscriptions.paying,
    billingLive: overview.finance.billingLive,
    recurringCostsGbp: recurringCosts,
    thisMonth: current,
    cashGbp: cashEntry ? cashEntry.amountGbp : null,
    cashAsOf: cashEntry?.date || null,
    monthlyBurnGbp: burn,
    runwayMonths: cashEntry && burn > 0 ? Math.round((cashEntry.amountGbp / burn) * 10) / 10 : null,
    pnl,
    byCategory,
    topCustomers: [...tenants].filter((tenant) => tenant.monthlyValueGbp > 0).sort((a, b) => b.monthlyValueGbp - a.monthlyValueGbp).slice(0, 8).map((tenant) => ({ business: tenant.businessName, plan: tenant.planName, monthlyGbp: tenant.monthlyValueGbp })),
    entries,
    categories: FOUNDER_COST_CATEGORIES,
    note: overview.finance.note,
  }
}

export async function founderAddLedgerEntry(founderTenantId: string | null | undefined, actorId: string, input: Record<string, unknown>) {
  const tenantId = requireFounderTenant(founderTenantId)
  const kind = LEDGER_KINDS.includes(String(input.kind) as typeof LEDGER_KINDS[number]) ? String(input.kind) : 'expense'
  const label = String(input.label || '').trim().slice(0, 120)
  const amount = Number(input.amountGbp)
  if (!label) throw Object.assign(new Error('Give the entry a name, e.g. "Vercel Pro".'), { status: 400 })
  if (!Number.isFinite(amount) || amount < 0 || amount > 10_000_000) throw Object.assign(new Error('Enter an amount in pounds.'), { status: 400 })
  const date = /^\d{4}-\d{2}-\d{2}$/.test(String(input.date)) ? String(input.date) : new Date().toISOString().slice(0, 10)
  const category = kind === 'expense' ? (FOUNDER_COST_CATEGORIES as readonly string[]).includes(String(input.category)) ? String(input.category) : 'Other' : kind === 'cash' ? 'Cash balance' : 'Other income'
  return createWorkspaceRecord(tenantId, actorId, LEDGER.workspace, LEDGER.module, {
    reference: `FL-${Date.now().toString(36).toUpperCase()}`,
    name: label,
    status: kind === 'cash' ? 'Balance' : input.recurring === true ? 'Recurring' : 'One-off',
    valuePence: Math.round(amount * 100),
    data: { kind, category, recurring: kind !== 'cash' && input.recurring === true, date, note: String(input.note || '').slice(0, 300), secondary: `${category} · £${amount.toFixed(2)}${input.recurring === true ? ' / month' : ''}` },
  })
}

export async function founderDeleteRecord(founderTenantId: string | null | undefined, id: string, module: string) {
  const tenantId = requireFounderTenant(founderTenantId)
  const result = await prisma.workspaceRecord.updateMany({ where: { id, tenantId, module, deletedAt: null }, data: { deletedAt: new Date() } })
  if (!result.count) throw Object.assign(new Error('Entry not found.'), { status: 404 })
  return { id, deleted: true }
}

// ---- SuperDash Marketing: growing FoundingOS itself ------------------------------------
// Posts are marketing/content records in the founder's company: FoundAI drafts them, the
// hourly autopilot publishes Approved posts once their dueDate arrives, and Publish now works.
export async function founderMarketing(founderTenantId?: string | null) {
  const tenantId = requireFounderTenant(founderTenantId)
  const [overview, content, campaigns, integrations, signupAudits] = await Promise.all([
    founderOverview(tenantId),
    prisma.workspaceRecord.findMany({ where: { tenantId, workspace: 'marketing', module: 'content', deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 300 }),
    prisma.workspaceRecord.findMany({ where: { tenantId, workspace: 'marketing', module: 'campaigns', deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 50 }),
    prisma.integrationCredential.findMany({ where: { tenantId, provider: { in: ['meta', 'linkedin'] } }, select: { provider: true, status: true } }),
    prisma.workspaceAuditEvent.findMany({ where: { action: 'plan.upgrade_requested', createdAt: { gte: new Date(Date.now() - 90 * DAY) } }, select: { tenantId: true } }),
  ])
  const tenants = overview.tenants
  const weeks = Array.from({ length: 12 }, (_, index) => {
    const end = Date.now() - (11 - index) * 7 * DAY
    const start = end - 7 * DAY
    return { weekOf: new Date(start).toISOString().slice(0, 10), signups: tenants.filter((tenant) => { const at = Date.parse(tenant.createdAt); return at >= start && at < end }).length }
  })
  const connected = (provider: string) => integrations.some((row) => row.provider === provider && ['configured', 'ready'].includes(row.status))
  const posts = content.map((row) => {
    const data = (row.data || {}) as Record<string, unknown>
    const published = (data.published || null) as { url?: string | null; at?: string } | null
    return { id: row.id, title: row.name, status: row.status, channel: String(data.channel || ''), text: String(data.postText || data.secondary || ''), hashtags: String(data.hashtags || ''), dueDate: typeof data.dueDate === 'string' ? data.dueDate : null, campaign: String(data.campaign || ''), publishedUrl: published?.url || null, publishedAt: published?.at || null, updatedAt: row.updatedAt.toISOString() }
  })
  return {
    generatedAt: new Date().toISOString(),
    funnel: {
      signups30d: overview.subscriptions.new30d,
      signups7d: overview.subscriptions.new7d,
      customers: overview.subscriptions.customers,
      paying: overview.subscriptions.paying,
      conversionPct: overview.subscriptions.customers ? Math.round((overview.subscriptions.paying / overview.subscriptions.customers) * 1000) / 10 : 0,
      upgradeRequests90d: signupAudits.filter((row) => row.tenantId !== tenantId).length,
      active7d: overview.subscriptions.active7d,
      signupsByWeek: weeks,
    },
    channels: { facebookInstagram: connected('meta'), linkedin: connected('linkedin') },
    posts,
    campaigns: campaigns.map((row) => ({ id: row.id, name: row.name, status: row.status, summary: String(((row.data || {}) as Record<string, unknown>).secondary || ''), updatedAt: row.updatedAt.toISOString() })),
  }
}

export async function founderSavePost(founderTenantId: string | null | undefined, actorId: string, input: Record<string, unknown>) {
  const tenantId = requireFounderTenant(founderTenantId)
  const title = String(input.title || '').trim().slice(0, 160)
  const text = String(input.text || '').trim().slice(0, 2900)
  if (!title || !text) throw Object.assign(new Error('A post needs a headline and some text.'), { status: 400 })
  const channel = ['Instagram', 'Facebook', 'LinkedIn', 'Email', 'TikTok', 'Blog'].includes(String(input.channel)) ? String(input.channel) : 'LinkedIn'
  const due = input.dueDate ? new Date(String(input.dueDate)) : null
  const dueDate = due && !Number.isNaN(due.getTime()) ? due.toISOString() : null
  const status = input.status === 'Draft' ? 'Draft' : 'Approved'
  const hashtags = String(input.hashtags || '').slice(0, 300)
  return createWorkspaceRecord(tenantId, actorId, 'marketing', 'content', {
    reference: `FOS-POST-${Date.now().toString(36).toUpperCase()}`,
    name: title,
    status,
    data: { channel, postText: [title, text, hashtags].filter(Boolean).join('\n\n'), hashtags, dueDate, campaign: String(input.campaign || '').slice(0, 120), secondary: `${channel} · ${text.slice(0, 140)}` },
  })
}

export async function founderUpdatePost(founderTenantId: string | null | undefined, id: string, input: Record<string, unknown>) {
  const tenantId = requireFounderTenant(founderTenantId)
  const existing = await prisma.workspaceRecord.findFirst({ where: { id, tenantId, workspace: 'marketing', module: 'content', deletedAt: null } })
  if (!existing) throw Object.assign(new Error('Post not found.'), { status: 404 })
  const data = { ...((existing.data || {}) as Record<string, unknown>) }
  if ('dueDate' in input) { const due = input.dueDate ? new Date(String(input.dueDate)) : null; data.dueDate = due && !Number.isNaN(due.getTime()) ? due.toISOString() : null }
  const status = ['Draft', 'Approved', 'Published'].includes(String(input.status)) ? String(input.status) : existing.status
  return prisma.workspaceRecord.update({ where: { id }, data: { status, data: data as object, version: { increment: 1 } } })
}
