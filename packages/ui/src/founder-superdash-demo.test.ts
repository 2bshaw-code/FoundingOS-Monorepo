import assert from 'node:assert/strict'
import { test } from 'node:test'
import { founderDemoOverview } from './founder-superdash-demo'
import type { FounderOverview } from './founder-superdash'

const live: FounderOverview = {
  generatedAt: '2026-09-26T12:00:00.000Z',
  subscriptions: { customers: 1, paying: 1, free: 0, new7d: 0, new30d: 0, active7d: 0, byPlan: [], workspaceAdoption: [], signupsByDay: [] },
  finance: { mrrGbp: 100, arrGbp: 1200, arpuGbp: 100, boltOns: [], billingLive: false, note: 'Live' },
  monitoring: {
    apiOk: true, dbLatencyMs: 12, aiConfigured: true, emailConfigured: false, upgradeEmailsConfigured: false,
    lastAutopilotRunAt: null, aiRequests24h: 0, autopilotActions24h: 0, recordsCreated24h: 0,
    integrationsConnected: 0, integrationsFailing: [],
  },
  upgradeRequests: [{ id: 'real-request', tenantId: 'real-tenant', business: 'Real Business', ownerEmail: 'real@example.com', requested: ['retail'], pending: ['retail'], note: '', createdAt: '2026-09-25T12:00:00.000Z' }],
  tenants: [{ tenantId: 'real-tenant', businessName: 'Real Business', ownerName: 'Real Owner', ownerEmail: 'real@example.com', plan: 'growth', planName: 'Complete', workspaces: ['retail'], seats: 1, monthlyValueGbp: 100, status: 'active', createdAt: '2026-09-25T12:00:00.000Z', lastActiveAt: null }],
}

test('founder demo replaces only subscriber data and keeps live platform health', () => {
  const demo = founderDemoOverview(live, Date.parse('2026-09-26T12:00:00.000Z'))
  assert.equal(demo.subscriptions.customers, 10)
  assert.equal(demo.subscriptions.paying, 8)
  assert.equal(demo.subscriptions.free, 2)
  assert.equal(demo.finance.mrrGbp, 447)
  assert.equal(demo.finance.arrGbp, 5364)
  assert.equal(demo.finance.arpuGbp, 55.88)
  assert.equal(demo.finance.mrrGbp, demo.tenants.reduce((sum, tenant) => sum + tenant.monthlyValueGbp, 0))
  assert.equal(demo.subscriptions.byPlan.reduce((sum, plan) => sum + plan.mrrGbp, 0), demo.finance.mrrGbp)
  assert.equal(demo.subscriptions.signupsByDay.reduce((sum, day) => sum + day.count, 0), 6)
  assert.equal(demo.monitoring, live.monitoring)
  assert.equal(demo.finance.billingLive, live.finance.billingLive)
  assert.ok(demo.tenants.every((tenant) => tenant.tenantId.startsWith('demo-') && tenant.ownerEmail.endsWith('@example.com')))
  assert.ok(demo.upgradeRequests.every((request) => request.tenantId.startsWith('demo-')))
  assert.equal(live.tenants[0].tenantId, 'real-tenant')
})
