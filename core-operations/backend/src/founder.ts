/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Founder SuperDash: the platform owner's view of every customer company —
// subscriptions and revenue, upgrade requests, platform health, and growth.
import { prisma } from './auth.js'
import { workspaceSlugs } from './platform.js'

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

  const tenantIds = [...new Set([...workspaces.map((row) => row.tenantId), ...onboardings.map((row) => row.tenantId)])].filter((id) => id !== founderTenantId)
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
