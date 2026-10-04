/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Router, raw, type RequestHandler } from 'express'
import { createBobRouter } from '@foundingos/bob'
import { createModuleAccessMiddleware } from '@foundingos/service-auth'
import { randomBytes, timingSafeEqual } from 'node:crypto'
import { askFoundAi, isAiConfigured } from './ai.js'
import { draftMarketingPost, planMarketingCampaign } from './marketing-ai.js'
import { publishSocial, type SocialChannel } from './social.js'
import { OutboundBlocked } from './outbound.js'
import { listWhatsAppTemplateStatus, submitWhatsAppTemplates } from './whatsapp-templates.js'
import { decideAutopilotApproval, getAutopilotPolicy, listAutopilotActivity, listAutopilotApprovals, runAutopilot, runAutopilotForAllTenants, saveAutopilotPolicy } from './autopilot.js'
import { accessCodeRole, prisma, requireDecisionApprovalAccess, requireExecutionAccess, requireMerchantAccess, requireOwnerAccess, requireTenantOwnerAccess, requireFounderAccess, requireSignedIn, requireFounderOrInvestorRead, isFounderIdentity, isReservedFounderEmail, hasInvestorAccess, verifyInvestorCode, INVESTOR_GRANT_ACTION, authService } from './auth.js'
import { accessCodeSession, grantPartnerAccess } from './access-login.js'
import { founderOverview, founderSetTenantWorkspaces, applyBillingEntitlements, founderFinance, founderAddLedgerEntry, founderDeleteRecord, founderMarketing, founderSavePost, founderUpdatePost, saveProductRating } from './founder.js'
import { sendWhatsAppText, verifyWebhook, verifyWebhookSignature, whatsappReadiness } from './whatsapp.js'
import { convertLead, createCustomer, createLead, deleteCustomer, getCustomer, listCustomers, pipelineSummary, updateCustomer, updateLeadStage } from './pipeline.js'
import { assignDelivery, createCampaign, createDeliveryOperator, createDeliveryVehicle, createDeliveryZone, createInventoryItem, createInvoice, createOrder, createSocialPost, deleteInventoryItem, detectLocation, generateMedia, getBrandProfile, invoiceDocument, operationsSummary, orderDocument, saveBrandProfile, saveLocationProfile, searchInventory, sendInvoice, updateCampaign, updateDeliveryAssignment, updateDeliveryNotification, updateDeliveryOperator, updateDeliveryVehicle, updateDeliveryZone, updateInventoryItem, updateInvoice, updateOrder, updateSocialPost, weatherAt } from './operations.js'
import { addMerchantStaff, merchantWorkspace, ownerMerchantSummary, removeMerchantStaff, resetMerchantPassword, reviewMerchantChange, submitMerchantChange, updateMerchantStaff } from './merchant.js'
import { listEvents, predictEventPattern, publishEvent, queryEvents, registerEventStreamClient, summarizeEventPattern } from './event-feed.js'
import { generateInsightsFromRecentEvents, listInsights, registerInsightStreamClient } from './insights.js'
import { listMessagingConnections, listMessagingParticipants, messagingReadiness, processWhatsAppWebhook, saveMessagingConnection, saveMessagingParticipant, sendMessagingIntelligenceBrief } from './messaging-core.js'
import { inboxThread, listInboxConversations, replyToInbox, whatsAppDiagnostics } from './inbox.js'
import { connectWhatsAppWithEmbeddedSignup, retryWhatsAppCoexistenceSync, whatsAppEmbeddedSignupConfig } from './whatsapp-embedded-signup-service.js'
import { acceptTeamInvitation, assertWorkspaceAccess, bootstrapTenant, checkIntegration, completeStripeCheckout, createWorkspaceRecord, deleteWorkspaceRecord, exportGovernanceCsv, getControlSettings, getIntegrationCredentials, getInvitationDetails, getOnboarding, importWorkspaceRecords, inviteTeamMember, listAuditEvents, listIntegrations, listPendingInvitations, listTeam, listTenantWorkspaces, listWorkspaceRecords, platformReadiness, requestWorkspaceUpgrade, ensureFounderEntitlements, recordPaymentCheckout, revokeTeamInvitation, resendTeamInvitation, saveControlSettings, saveIntegration, saveOnboarding, saveTenantWorkspace, updateTeamMember, updateWorkspaceRecord, uploadWorkspaceRecordImage } from './platform.js'
import { verifyBootstrapToken } from './platform-security.js'
import { createTenantCheckout, verifyStripeWebhookSignature } from './stripe.js'
import { decideAgentAction, executeAgentAction, getAgentActionTrail, getAgentIntelligenceSummary, listAgentActions, proposeAgentAction, proposeReplenishmentAction, reverseAgentActionExecution } from './agent-actions.js'
import { isSuiteLicensed, listTenantSuiteLicenses, setTenantSuiteLicense } from './licensing.js'
import { createTelemetryRateLimiter, emitBackendTelemetry, ingestTelemetryEvents, parseTelemetryBatch, queryTelemetryEvents, queryTelemetrySummary, resolveOptionalTenantId } from './telemetry.js'
import { listFeatureFlags, upsertFeatureFlag, validateFeatureFlagInput, validateFeatureFlagKey } from './feature-flags.js'

const requireTenant: RequestHandler = (_req, res, next) => {
  if (res.locals.auth?.role === 'founder_master') return next()
  if (!res.locals.auth?.tenantId) return res.status(403).json({ success: false, message: 'Tenant context required' })
  next()
}
const requireCoreOperationsModule = createModuleAccessMiddleware('core_operations')
// A founder_master names the tenant they are inspecting with x-tenant-id. When they are simply
// using their own workspace there is no header to send, so fall back to their own tenant instead
// of refusing every request.
const readTenant = (req: { header(name: string): string | undefined }, res: { locals: Record<string, any> }) => res.locals.auth?.role === 'founder_master' ? req.header('x-tenant-id') || res.locals.auth?.tenantId || undefined : res.locals.auth?.tenantId
const writeTenant = (req: { body?: Record<string, unknown>; header(name: string): string | undefined }, res: { locals: Record<string, any> }) => readTenant(req, res) || String(req.body?.tenantId || '')
// Phase 34 — FeatureFlag rows are global (not tenant-scoped: `key` is
// unique across the whole deployment), so this is an internal/FoundingOS
// staff admin surface, not a tenant-owner one — gated more strictly than
// requireOwnerAccess (which authorizes tenant owners over their own tenant).
const requireFounderMaster: RequestHandler = (_req, res, next) => {
  if (res.locals.auth?.role !== 'founder_master') return res.status(403).json({ success: false, message: 'Internal access required' })
  next()
}
const telemetryRateLimit = createTelemetryRateLimiter()
export const apiRouter = Router()
apiRouter.get('/status', (_req, res) => res.json({ app: 'core_operations', status: 'operational' }))
apiRouter.get('/ai/status', requireMerchantAccess, requireTenant, (_req, res) => res.json({ success: true, data: { enabled: isAiConfigured() } }))
// FoundAI Autopilot — the scheduler calls /autopilot/cron with the Vercel CRON_SECRET; tenants
// read their policy/approvals/activity and owners change the policy and decide approvals.
apiRouter.post('/ai/marketing/post', requireMerchantAccess, requireTenant, async (req, res, next) => {
  try { res.json({ success: true, data: await draftMarketingPost(readTenant(req, res)!, req.body ?? {}) }) } catch (error) { next(error) }
})
apiRouter.post('/ai/marketing/campaign', requireMerchantAccess, requireTenant, async (req, res, next) => {
  try { res.json({ success: true, data: await planMarketingCampaign(readTenant(req, res)!, req.body ?? {}) }) } catch (error) { next(error) }
})
// Publish a content record to its social channel right now (owner-triggered "Publish now").
apiRouter.post('/social/publish', requireOwnerAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)!
    const record = await prisma.workspaceRecord.findFirst({ where: { id: String(req.body?.recordId ?? ''), tenantId, deletedAt: null } })
    if (!record) return res.status(404).json({ success: false, error: 'Post not found' })
    const data = (record.data && typeof record.data === 'object' && !Array.isArray(record.data) ? record.data : {}) as Record<string, unknown>
    const channel = ['facebook', 'instagram', 'linkedin'].includes(String(req.body?.channel)) ? String(req.body.channel) as SocialChannel : undefined
    let posted
    try { posted = await publishSocial(tenantId, { name: record.name, data }, channel) } catch (cause) {
      return res.status(cause instanceof OutboundBlocked ? 409 : 502).json({ success: false, error: cause instanceof Error ? cause.message : 'Publishing failed' })
    }
    const log = Array.isArray(data.log) ? data.log : []
    const where = posted.channel === 'linkedin' ? 'LinkedIn' : posted.channel === 'instagram' ? 'Instagram' : 'Facebook'
    const updated = await prisma.workspaceRecord.update({ where: { id: record.id }, data: { status: 'Published', data: JSON.parse(JSON.stringify({ ...data, published: { at: new Date().toISOString(), ...posted }, log: [{ time: new Date().toISOString(), note: `Published to ${where}`, kind: 'FoundAI' }, ...log].slice(0, 50) })) } })
    res.json({ success: true, data: { record: updated, posted } })
  } catch (error) { next(error) }
})
apiRouter.get('/autopilot/cron', async (req, res, next) => {
  try {
    const secret = process.env.CRON_SECRET
    const supplied = Buffer.from(req.header('authorization') ?? '')
    const expected = Buffer.from(`Bearer ${secret ?? ''}`)
    if (!secret || supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return res.status(401).json({ success: false, message: 'Unauthorized' })
    res.json({ success: true, data: await runAutopilotForAllTenants() })
  } catch (error) { next(error) }
})
apiRouter.get('/autopilot', requireMerchantAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)!
    const [policy, approvals, activity] = await Promise.all([getAutopilotPolicy(tenantId), listAutopilotApprovals(tenantId), listAutopilotActivity(tenantId)])
    res.json({ success: true, data: { policy, approvals, activity } })
  } catch (error) { next(error) }
})
apiRouter.put('/autopilot/policy', requireOwnerAccess, requireTenant, async (req, res, next) => {
  try { res.json({ success: true, data: await saveAutopilotPolicy(readTenant(req, res)!, res.locals.auth.id, req.body) }) } catch (error) { next(error) }
})
apiRouter.post('/autopilot/run', requireMerchantAccess, requireTenant, async (req, res, next) => {
  try { res.json({ success: true, data: await runAutopilot(readTenant(req, res)!) }) } catch (error) { next(error) }
})
apiRouter.get('/autopilot/whatsapp-templates', requireOwnerAccess, requireTenant, async (req, res, next) => {
  try { res.json({ success: true, data: await listWhatsAppTemplateStatus(readTenant(req, res)!) }) } catch (error) { next(error) }
})
apiRouter.post('/autopilot/whatsapp-templates', requireOwnerAccess, requireTenant, async (req, res, next) => {
  try { res.json({ success: true, data: await submitWhatsAppTemplates(readTenant(req, res)!, res.locals.auth.id) }) } catch (error) { next(error) }
})
apiRouter.post('/autopilot/approvals/:id/decision', requireOwnerAccess, requireTenant, async (req, res, next) => {
  try { res.json({ success: true, data: await decideAutopilotApproval(readTenant(req, res)!, res.locals.auth.id, String(req.params.id), req.body?.approve === true) }) } catch (error) { next(error) }
})
apiRouter.post('/ai/ask', requireMerchantAccess, requireTenant, async (req, res, next) => {
  try {
    // A founder signed in to SuperDash has no x-tenant-id header to give, so fall back to
    // their own tenant rather than refusing the question outright.
    const tenantId = readTenant(req, res) || res.locals.auth?.tenantId
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({
      success: true,
      data: await askFoundAi({
        tenantId,
        actorId: res.locals.auth.id,
        question: req.body?.question,
        workspace: req.body?.workspace,
        module: req.body?.module,
        customerId: req.body?.customerId,
        scope: req.body?.scope,
        history: req.body?.history,
        requestId: res.locals.requestId,
      }),
    })
  } catch (error) {
    next(error)
  }
})
// Real, cross-suite suite-licensing gate. Core.Workforce and
// Core.Intelligence call this over HTTP (via FOUNDER_API_URL +
// createModuleAccessMiddleware); Core.Operations checks it locally for
// its own gated routes too, so there is exactly one TenantSuiteLicense
// source of truth across all three backends.
apiRouter.get('/module-access/:tenantId/:module', requireMerchantAccess, async (req, res, next) => {
  try {
    const tenantId = String(req.params.tenantId)
    const module = String(req.params.module)
    if (res.locals.auth?.role !== 'founder_master' && res.locals.auth?.tenantId !== tenantId) return res.status(403).json({ success: false, allowed: false })
    res.json({ success: true, allowed: await isSuiteLicensed(tenantId, module) })
  } catch (error) { next(error) }
})
apiRouter.get('/platform/suite-licenses', requireOwnerAccess, requireTenant, async (req, res, next) => {
  try { res.json({ success: true, data: await listTenantSuiteLicenses(readTenant(req, res) || '') }) } catch (error) { next(error) }
})
apiRouter.put('/platform/suite-licenses/:suite', requireFounderAccess, requireTenant, async (req, res, next) => {
  try { res.json({ success: true, data: await setTenantSuiteLicense(readTenant(req, res) || '', String(req.params.suite), Boolean(req.body?.enabled)) }) } catch (error) { next(error) }
})
apiRouter.post('/platform/bootstrap', async (req, res, next) => {
  if (!verifyBootstrapToken(req.header('x-bootstrap-token'))) return res.status(401).json({ success: false, message: 'Valid bootstrap token required' })
  try { res.status(201).json({ success: true, data: await bootstrapTenant(req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.get('/whatsapp/webhook', (req, res) => verifyWebhook(req.query['hub.mode'], req.query['hub.verify_token']) ? res.send(String(req.query['hub.challenge'] || '')) : res.status(403).json({ success: false, message: 'Webhook verification failed' }))
apiRouter.post('/whatsapp/webhook', async (req, res, next) => {
  const rawBody = (req as typeof req & { rawBody?: Buffer }).rawBody || Buffer.from(JSON.stringify(req.body || {}))
  if (!verifyWebhookSignature(rawBody, req.get('x-hub-signature-256'))) return res.status(401).json({ success: false, message: 'Invalid webhook signature' })
  try {
    const data = await processWhatsAppWebhook(req.body)
    res.status(200).json({ success: true, data })
  } catch (error) {
    next(error)
  }
})
apiRouter.get('/whatsapp/webhook/:tenantId', async (req, res, next) => {
  try {
    const tenantId = String(req.params.tenantId)
    const credentials = await getIntegrationCredentials(tenantId, 'whatsapp')
    if (!verifyWebhook(req.query['hub.mode'], req.query['hub.verify_token'], credentials)) return res.status(403).json({ success: false, message: 'Webhook verification failed' })
    await prisma.workspaceAuditEvent.create({ data: { tenantId, actorId: 'meta-webhook', action: 'whatsapp.webhook_verified', metadata: { phoneNumberId: String(credentials.phoneNumberId) } } })
    return res.send(String(req.query['hub.challenge'] || ''))
  } catch (error) { next(error) }
})
apiRouter.post('/whatsapp/webhook/:tenantId', async (req, res, next) => {
  try {
    const credentials = await getIntegrationCredentials(String(req.params.tenantId), 'whatsapp')
    const rawBody = (req as typeof req & { rawBody?: Buffer }).rawBody || Buffer.from(JSON.stringify(req.body || {}))
    if (!verifyWebhookSignature(rawBody, req.get('x-hub-signature-256'), credentials)) return res.status(401).json({ success: false, message: 'Invalid webhook signature' })
    const messages = await processWhatsAppWebhook(req.body, { tenantId: String(req.params.tenantId), phoneNumberId: String(credentials.phoneNumberId) })
    res.status(200).json({ success: true, data: messages })
  } catch (error) { next(error) }
})
apiRouter.post('/stripe/webhook/:tenantId', async (req, res, next) => {
  try {
    const tenantId = String(req.params.tenantId)
    const credentials = await getIntegrationCredentials(tenantId, 'stripe')
    const rawBody = (req as typeof req & { rawBody?: Buffer }).rawBody || Buffer.from(JSON.stringify(req.body || {}))
    if (!verifyStripeWebhookSignature(rawBody, req.get('stripe-signature'), credentials)) return res.status(401).json({ success: false, message: 'Invalid Stripe webhook signature' })
    res.json({ success: true, data: await completeStripeCheckout(tenantId, req.body || {}) })
  } catch (error) { next(error) }
})
apiRouter.get('/whatsapp/status', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    const credentials = await getIntegrationCredentials(tenantId, 'whatsapp')
    res.json({ success: true, data: whatsappReadiness(credentials) })
  } catch (error) { next(error) }
})
apiRouter.post('/whatsapp/messages', requireMerchantAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    const credentials = await getIntegrationCredentials(tenantId, 'whatsapp')
    res.status(202).json({ success: true, data: await sendWhatsAppText(req.body?.to, req.body?.text, undefined, credentials) })
  } catch (error) { next(error) }
})
apiRouter.get('/messaging/connections', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await listMessagingConnections(tenantId) })
  } catch (error) {
    next(error)
  }
})
apiRouter.get('/messaging/readiness', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await messagingReadiness(tenantId) })
  } catch (error) {
    next(error)
  }
})
apiRouter.get('/messaging/inbox', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { res.json({ success: true, data: await listInboxConversations(readTenant(req, res)!) }) } catch (error) { next(error) }
})
apiRouter.get('/messaging/inbox/:id', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { res.json({ success: true, data: await inboxThread(readTenant(req, res)!, String(req.params.id)) }) } catch (error) { next(error) }
})
apiRouter.post('/messaging/inbox/:id/replies', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { res.status(202).json({ success: true, data: await replyToInbox(readTenant(req, res)!, String(req.params.id), req.body || {}, req.get('Idempotency-Key') || '') }) } catch (error) { next(error) }
})
apiRouter.get('/messaging/whatsapp-diagnostics', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { res.json({ success: true, data: await whatsAppDiagnostics(readTenant(req, res)!) }) } catch (error) { next(error) }
})
apiRouter.get('/messaging/whatsapp/embedded-signup/config', requireOwnerAccess, requireTenant, requireCoreOperationsModule, (_req, res) => {
  res.json({ success: true, data: whatsAppEmbeddedSignupConfig() })
})
apiRouter.post('/messaging/whatsapp/embedded-signup', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await connectWhatsAppWithEmbeddedSignup(readTenant(req, res)!, res.locals.auth.id, req.body || {}, req.get('X-Request-Id') || undefined) }) } catch (error) { next(error) }
})
apiRouter.post('/messaging/whatsapp/embedded-signup/sync', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { res.json({ success: true, data: await retryWhatsAppCoexistenceSync(readTenant(req, res)!, res.locals.auth.id) }) } catch (error) { next(error) }
})
apiRouter.put('/messaging/connections/:channel', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try {
    const tenantId = writeTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await saveMessagingConnection(tenantId, String(req.params.channel), req.body || {}) })
  } catch (error) {
    next(error)
  }
})
apiRouter.get('/messaging/participants', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await listMessagingParticipants(tenantId) })
  } catch (error) {
    next(error)
  }
})
apiRouter.put('/messaging/participants', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try {
    const tenantId = writeTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await saveMessagingParticipant(tenantId, req.body || {}) })
  } catch (error) {
    next(error)
  }
})
apiRouter.use('/bob', requireMerchantAccess, requireTenant, requireCoreOperationsModule, createBobRouter('core_operations'))
apiRouter.get('/platform/readiness', requireOwnerAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await platformReadiness(tenantId) })
  } catch (error) { next(error) }
})
apiRouter.get('/platform/onboarding', requireOwnerAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await getOnboarding(tenantId) })
  } catch (error) { next(error) }
})
apiRouter.put('/platform/onboarding', requireOwnerAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = writeTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await saveOnboarding(tenantId, res.locals.auth.id, req.body || {}, res.locals.requestId) })
  } catch (error) { next(error) }
})
apiRouter.get('/platform/control-settings', requireOwnerAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await getControlSettings(tenantId) })
  } catch (error) { next(error) }
})
apiRouter.get('/platform/governance/export', requireTenantOwnerAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    const csv = await exportGovernanceCsv(tenantId)
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename="foundingos-governance-export.csv"')
    res.send(csv)
  } catch (error) { next(error) }
})
apiRouter.put('/platform/control-settings', requireTenantOwnerAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = writeTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await saveControlSettings(tenantId, res.locals.auth.id, req.body || {}, res.locals.requestId) })
  } catch (error) { next(error) }
})
apiRouter.get('/platform/workspaces', requireMerchantAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await listTenantWorkspaces(tenantId) })
  } catch (error) { next(error) }
})
apiRouter.get('/founder/access', requireSignedIn, async (_req, res, next) => {
  try {
    res.json({ success: true, data: { founder: isFounderIdentity(res.locals.auth), investor: await hasInvestorAccess(res.locals.auth) } })
  } catch (error) { next(error) }
})
// One-step sign-in for admins/investors: their access code signs them in (creating a preview
// account the first time) and unlocks SuperDash. The website calls this server-to-server with the
// bootstrap token after its own access gate has verified the code, so visitors only enter it once.
const codeLoginAttempts = new Map<string, { count: number; resetAt: number }>()
apiRouter.post('/access/code-login', async (req, res, next) => {
  try {
    const email = String(req.body?.email ?? '').trim().toLowerCase()
    const trusted = verifyBootstrapToken(req.header('x-bootstrap-token'))
    const key = trusted ? `web:${email}` : String(req.ip || 'unknown')
    const now = Date.now()
    const attempts = codeLoginAttempts.get(key)
    if (!trusted && attempts && attempts.resetAt > now && attempts.count >= 8) return res.status(429).json({ success: false, message: 'Too many attempts. Try again in 15 minutes.' })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return res.status(400).json({ success: false, message: 'Enter a valid email address.' })
    // The website has already checked the code itself; it passes the role it verified.
    const requested = String(req.body?.role || '')
    const role = trusted ? (requested === 'tester' || requested === 'partner' ? requested : 'investor') : accessCodeRole(req.body?.code)
    if (!role) {
      codeLoginAttempts.set(key, attempts && attempts.resetAt > now ? { count: attempts.count + 1, resetAt: attempts.resetAt } : { count: 1, resetAt: now + 15 * 60_000 })
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }
    codeLoginAttempts.delete(key)
    const deviceFingerprint = String(req.header('x-device-fingerprint') || '')
    res.json(await accessCodeSession({ email, role, via: trusted ? 'web' : 'app-login', deviceFingerprint, ipAddress: req.ip }))
  } catch (error) { next(error) }
})
// Five wrong codes per account per 15 minutes, then a cool-off — the codes are short and shared by hand.
const investorUnlockAttempts = new Map<string, { count: number; resetAt: number }>()
apiRouter.post('/founder/investor-unlock', requireSignedIn, async (req, res, next) => {
  try {
    const auth = res.locals.auth
    const now = Date.now()
    const attempts = investorUnlockAttempts.get(auth.id)
    if (attempts && attempts.resetAt > now && attempts.count >= 5) return res.status(429).json({ success: false, message: 'Too many attempts. Try again in 15 minutes.' })
    if (!verifyInvestorCode(req.body?.code)) {
      const updated = attempts && attempts.resetAt > now ? { count: attempts.count + 1, resetAt: attempts.resetAt } : { count: 1, resetAt: now + 15 * 60_000 }
      investorUnlockAttempts.set(auth.id, updated)
      return res.status(403).json({ success: false, message: 'That access code is not recognised.' })
    }
    investorUnlockAttempts.delete(auth.id)
    if (accessCodeRole(req.body?.code) === 'partner' && !isReservedFounderEmail(String(auth.email || ''))) {
      await grantPartnerAccess(auth.id, 'app')
      return res.json({ success: true, data: { founder: true, investor: true, reSignIn: true } })
    }
    if (!(await hasInvestorAccess(auth))) {
      await prisma.workspaceAuditEvent.create({ data: { tenantId: auth.tenantId || 'platform', actorId: auth.id, action: INVESTOR_GRANT_ACTION, metadata: { email: auth.email ?? null, via: 'app' } } })
    }
    res.json({ success: true, data: { founder: isFounderIdentity(auth), investor: true } })
  } catch (error) { next(error) }
})
apiRouter.get('/founder/overview', requireFounderOrInvestorRead, async (_req, res, next) => {
  try {
    if (isFounderIdentity(res.locals.auth)) await ensureFounderEntitlements(res.locals.auth?.tenantId)
    res.json({ success: true, data: await founderOverview(res.locals.auth?.tenantId) })
  } catch (error) { next(error) }
})
apiRouter.get('/founder/finance', requireFounderOrInvestorRead, async (_req, res, next) => {
  try { res.json({ success: true, data: await founderFinance(res.locals.auth?.tenantId) }) } catch (error) { next(error) }
})
apiRouter.post('/founder/ledger', requireFounderAccess, async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await founderAddLedgerEntry(res.locals.auth?.tenantId, res.locals.auth.id, req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.delete('/founder/ledger/:id', requireFounderAccess, async (req, res, next) => {
  try { res.json({ success: true, data: await founderDeleteRecord(res.locals.auth?.tenantId, String(req.params.id), 'founder-ledger') }) } catch (error) { next(error) }
})
apiRouter.get('/founder/marketing', requireFounderOrInvestorRead, async (_req, res, next) => {
  try { res.json({ success: true, data: await founderMarketing(res.locals.auth?.tenantId) }) } catch (error) { next(error) }
})
apiRouter.post('/founder/marketing/posts', requireFounderAccess, async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await founderSavePost(res.locals.auth?.tenantId, res.locals.auth.id, req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.patch('/founder/marketing/posts/:id', requireFounderAccess, async (req, res, next) => {
  try { res.json({ success: true, data: await founderUpdatePost(res.locals.auth?.tenantId, String(req.params.id), req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.delete('/founder/marketing/posts/:id', requireFounderAccess, async (req, res, next) => {
  try { res.json({ success: true, data: await founderDeleteRecord(res.locals.auth?.tenantId, String(req.params.id), 'content') }) } catch (error) { next(error) }
})
apiRouter.post('/founder/tenants/:tenantId/workspaces', requireFounderAccess, async (req, res, next) => {
  try {
    res.json({ success: true, data: await founderSetTenantWorkspaces(res.locals.auth.id, String(req.params.tenantId), req.body || {}) })
  } catch (error) { next(error) }
})
// Called by the web billing webhook after Stripe verifies a subscription change.
apiRouter.post('/platform/billing/entitlements', async (req, res, next) => {
  if (!verifyBootstrapToken(req.header('x-bootstrap-token'))) return res.status(401).json({ success: false, message: 'Valid bootstrap token required' })
  try { res.json({ success: true, data: await applyBillingEntitlements(req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.post('/platform/feedback/rating', requireMerchantAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = writeTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.status(201).json({ success: true, data: await saveProductRating(tenantId, res.locals.auth.id, req.body || {}, res.locals.requestId) })
  } catch (error) { next(error) }
})

apiRouter.post('/platform/upgrade-request', requireOwnerAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = writeTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await requestWorkspaceUpgrade(tenantId, res.locals.auth.id, req.body || {}, res.locals.requestId) })
  } catch (error) { next(error) }
})
apiRouter.put('/platform/workspaces/:workspace', requireOwnerAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = writeTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    const data = await saveTenantWorkspace(tenantId, res.locals.auth.id, req.params.workspace, req.body || {}, res.locals.requestId, { canChangeEntitlement: isFounderIdentity(res.locals.auth) })
    emitBackendTelemetry(tenantId, 'workspace.access', { workspace: req.params.workspace })
    res.json({ success: true, data })
  } catch (error) { next(error) }
})
apiRouter.get('/platform/workspaces/:workspace/:module/records', requireMerchantAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    await assertWorkspaceAccess(tenantId, res.locals.auth.id, res.locals.auth.role, req.params.workspace)
    res.json({ success: true, data: await listWorkspaceRecords(tenantId, req.params.workspace, req.params.module, req.query) })
  } catch (error) { next(error) }
})
apiRouter.post('/platform/workspaces/:workspace/:module/records', requireMerchantAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = writeTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    await assertWorkspaceAccess(tenantId, res.locals.auth.id, res.locals.auth.role, req.params.workspace)
    const data = await createWorkspaceRecord(tenantId, res.locals.auth.id, req.params.workspace, req.params.module, req.body || {}, req.header('idempotency-key'), res.locals.requestId)
    emitBackendTelemetry(tenantId, 'record.created', { workspace: req.params.workspace, module: req.params.module })
    res.status(201).json({ success: true, data })
  } catch (error) { next(error) }
})
apiRouter.post('/platform/workspaces/:workspace/:module/records/import', requireMerchantAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = writeTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    await assertWorkspaceAccess(tenantId, res.locals.auth.id, res.locals.auth.role, req.params.workspace)
    const data = await importWorkspaceRecords(tenantId, res.locals.auth.id, req.params.workspace, req.params.module, req.body || {}, res.locals.requestId)
    emitBackendTelemetry(tenantId, 'records.imported', { workspace: req.params.workspace, module: req.params.module, created: data.created })
    res.status(201).json({ success: true, data })
  } catch (error) { next(error) }
})
apiRouter.post('/platform/payments/checkout', requireMerchantAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    const workspace = await assertWorkspaceAccess(tenantId, res.locals.auth.id, res.locals.auth.role, req.body?.workspace)
    const recordId = String(req.body?.recordId || '')
    const record = await prisma.workspaceRecord.findFirst({ where: { id: recordId, tenantId, workspace, deletedAt: null } })
    if (!record) return res.status(404).json({ success: false, message: 'Payment record not found' })
    if (record.module !== 'payments') return res.status(400).json({ success: false, message: 'Stripe Checkout can only be created for payment records' })
    const credentials = await getIntegrationCredentials(tenantId, 'stripe')
    const checkout = await createTenantCheckout({
      tenantId,
      workspace,
      module: record.module,
      recordId: record.id,
      reference: record.reference,
      name: record.name,
      amountPence: record.valuePence ?? 0,
      currency: String(req.body?.currency || 'GBP'),
      credentials,
      idempotencyKey: String(req.header('idempotency-key') || `${tenantId}:${record.id}:${record.version}`),
    })
    await recordPaymentCheckout(tenantId, res.locals.auth.id, { workspace, module: record.module, recordId: record.id, checkoutId: checkout.id }, res.locals.requestId)
    res.status(201).json({ success: true, data: checkout })
  } catch (error) { next(error) }
})
apiRouter.patch('/platform/records/:id', requireMerchantAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    const data = await updateWorkspaceRecord(tenantId, res.locals.auth.id, res.locals.auth.role, String(req.params.id), req.body || {}, res.locals.requestId)
    emitBackendTelemetry(tenantId, 'record.status_change', { recordId: String(req.params.id) })
    res.json({ success: true, data })
  } catch (error) { next(error) }
})
apiRouter.post('/platform/records/:id/images', requireMerchantAccess, requireTenant, raw({ type: 'image/*', limit: '15mb' }), async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    const contentType = String(req.headers['content-type'] || '')
    if (!Buffer.isBuffer(req.body)) return res.status(400).json({ success: false, message: 'Send the image as a raw binary body with an image/* Content-Type header' })
    const result = await uploadWorkspaceRecordImage(tenantId, res.locals.auth.id, res.locals.auth.role, String(req.params.id), { contentType, bytes: req.body }, res.locals.requestId)
    res.status(201).json({ success: true, data: result })
  } catch (error) { next(error) }
})
apiRouter.delete('/platform/records/:id', requireOwnerAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await deleteWorkspaceRecord(tenantId, res.locals.auth.id, res.locals.auth.role, String(req.params.id), res.locals.requestId) })
  } catch (error) { next(error) }
})
apiRouter.get('/platform/integrations', requireOwnerAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await listIntegrations(tenantId) })
  } catch (error) { next(error) }
})
apiRouter.put('/platform/integrations/:provider', requireOwnerAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = writeTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await saveIntegration(tenantId, res.locals.auth.id, req.params.provider, req.body || {}, res.locals.requestId) })
  } catch (error) { next(error) }
})
apiRouter.post('/platform/integrations/:provider/check', requireOwnerAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await checkIntegration(tenantId, res.locals.auth.id, req.params.provider, res.locals.requestId) })
  } catch (error) { next(error) }
})
apiRouter.get('/platform/audit', requireOwnerAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await listAuditEvents(tenantId, req.query.limit) })
  } catch (error) { next(error) }
})
apiRouter.get('/platform/events', requireMerchantAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await queryEvents(tenantId, req.query) })
  } catch (error) { next(error) }
})
apiRouter.get('/platform/event-patterns', requireMerchantAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    const kind = String(req.query.kind || '').trim()
    if (!kind) return res.status(400).json({ success: false, message: 'Agent action kind is required' })
    const [historicalContext, predictiveSignals] = await Promise.all([
      summarizeEventPattern(tenantId, kind, typeof req.query.sku === 'string' ? req.query.sku : undefined),
      predictEventPattern(tenantId, kind),
    ])
    res.json({ success: true, data: { historicalContext, predictiveSignals } })
  } catch (error) { next(error) }
})
apiRouter.post('/platform/events', requireMerchantAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = writeTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    if (req.body?.source && String(req.body.source) !== 'system') await assertWorkspaceAccess(tenantId, res.locals.auth.id, res.locals.auth.role, req.body.source)
    res.status(201).json({ success: true, data: await publishEvent({ tenantId, type: String(req.body?.type || 'workspace.event'), source: String(req.body?.source || 'system'), payload: req.body?.payload }) })
  } catch (error) { next(error) }
})
// Phase 28 — telemetry ingestion. Intentionally reachable without auth (see
// resolveOptionalTenantId) so pre-login/marketing-site events can be sent;
// an invalid bearer token is still rejected rather than silently ignored.
apiRouter.post('/platform/telemetry', async (req, res, next) => {
  try {
    const decision = telemetryRateLimit(req.header('x-tenant-id') || `ip:${req.ip}`)
    res.setHeader('RateLimit-Limit', '60')
    res.setHeader('RateLimit-Remaining', String(decision.remaining))
    res.setHeader('RateLimit-Reset', String(Math.ceil(decision.resetAt / 1000)))
    if (!decision.allowed) return res.status(429).json({ success: false, message: 'Too many telemetry events' })
    const authenticatedTenantId = resolveOptionalTenantId(req.header('authorization'))
    const events = parseTelemetryBatch(req.body).map((event) => ({ ...event, tenantId: authenticatedTenantId ?? undefined }))
    const count = await ingestTelemetryEvents(events)
    res.status(201).json({ success: true, data: { accepted: count } })
  } catch (error) { next(error) }
})
apiRouter.get('/platform/telemetry', requireOwnerAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await queryTelemetryEvents(tenantId, req.query) })
  } catch (error) { next(error) }
})
// Phase 36 — cross-tenant aggregate for the internal telemetry dashboard.
// Internal-only (founder_master), unlike the tenant-scoped route above.
apiRouter.get('/platform/telemetry/summary', requireFounderMaster, async (req, res, next) => {
  try {
    res.json({ success: true, data: await queryTelemetrySummary(req.query) })
  } catch (error) { next(error) }
})
// Phase 35 — cross-tenant *raw* event read, internal-only. Reuses
// queryTelemetryEvents with an undefined tenantId (buildTelemetryQuery
// already treats that as "no tenant filter", not "no results") so
// internal/demo tooling with no real tenant to scope to — e.g. the
// migrated BrandMetric replacement, see docs/single-schema-migration.md
// §6 — can read its own events back without a fake tenantId. Distinct
// from /summary above (aggregate counts) since some callers need the raw
// `properties` payload (e.g. per-brand categoryBreakdown JSON).
apiRouter.get('/platform/telemetry/events', requireFounderMaster, async (req, res, next) => {
  try {
    res.json({ success: true, data: await queryTelemetryEvents(undefined, req.query) })
  } catch (error) { next(error) }
})
// Phase 34 — feature flag admin. Internal/FoundingOS-staff only (see
// requireFounderMaster) since FeatureFlag rows are global, not per-tenant.
apiRouter.get('/platform/feature-flags', requireFounderMaster, async (_req, res, next) => {
  try {
    res.json({ success: true, data: await listFeatureFlags() })
  } catch (error) { next(error) }
})
apiRouter.put('/platform/feature-flags/:key', requireFounderMaster, async (req, res, next) => {
  try {
    const key = validateFeatureFlagKey(req.params.key)
    const input = validateFeatureFlagInput(req.body || {})
    const data = await upsertFeatureFlag(key, input, res.locals.auth.id)
    res.json({ success: true, data })
  } catch (error) { next(error) }
})
apiRouter.get('/platform/agent-actions', requireMerchantAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await listAgentActions(tenantId, typeof req.query.status === 'string' ? req.query.status : undefined) })
  } catch (error) { next(error) }
})
apiRouter.get('/platform/agent-actions-intelligence', requireMerchantAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await getAgentIntelligenceSummary(tenantId) })
  } catch (error) { next(error) }
})
apiRouter.post('/platform/agent-actions-intelligence/message', requireOwnerAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await sendMessagingIntelligenceBrief(tenantId, String(req.body?.participantId || ''), req.body?.actionId ? String(req.body.actionId) : undefined) })
  } catch (error) { next(error) }
})
apiRouter.post('/platform/agent-actions/replenishment', requireMerchantAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = writeTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    await assertWorkspaceAccess(tenantId, res.locals.auth.id, res.locals.auth.role, 'retail')
    res.status(201).json({ success: true, data: await proposeReplenishmentAction(tenantId, res.locals.auth.id, req.body || {}, res.locals.requestId) })
  } catch (error) { next(error) }
})
apiRouter.post('/platform/agent-actions/proposals', requireMerchantAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = writeTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    const kind = String(req.body?.kind || '')
    const requiredWorkspace = ['finance.receivables.collection', 'finance.expense.approval', 'finance.budget.reallocation'].includes(kind) ? 'finance' : kind === 'logistics.delivery.recovery' ? 'logistics' : kind === 'marketing.campaign.launch' ? 'marketing' : 'retail'
    await assertWorkspaceAccess(tenantId, res.locals.auth.id, res.locals.auth.role, requiredWorkspace)
    res.status(201).json({ success: true, data: await proposeAgentAction(tenantId, res.locals.auth.id, kind, req.body?.input || {}, res.locals.requestId) })
  } catch (error) { next(error) }
})
apiRouter.post('/platform/agent-actions/:id/decision', requireDecisionApprovalAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    const data = await decideAgentAction(tenantId, res.locals.auth.id, String(req.params.id), req.body?.decision, res.locals.requestId)
    emitBackendTelemetry(tenantId, 'agent_action.decision', { actionId: String(req.params.id), decision: String(req.body?.decision || '') })
    res.json({ success: true, data })
  } catch (error) { next(error) }
})
apiRouter.post('/platform/agent-actions/:id/execute', requireExecutionAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await executeAgentAction(tenantId, res.locals.auth.id, String(req.params.id), res.locals.requestId) })
  } catch (error) { next(error) }
})
apiRouter.post('/platform/agent-actions/:id/reverse', requireExecutionAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await reverseAgentActionExecution(tenantId, res.locals.auth.id, String(req.params.id), res.locals.requestId) })
  } catch (error) { next(error) }
})
apiRouter.get('/platform/agent-actions/:id/trail', requireMerchantAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await getAgentActionTrail(tenantId, String(req.params.id)) })
  } catch (error) { next(error) }
})
apiRouter.get('/platform/team', requireTenantOwnerAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await listTeam(tenantId) })
  } catch (error) { next(error) }
})
apiRouter.get('/platform/team/invitations', requireTenantOwnerAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await listPendingInvitations(tenantId) })
  } catch (error) { next(error) }
})
apiRouter.post('/platform/team', requireTenantOwnerAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = writeTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.status(201).json({ success: true, data: await inviteTeamMember(tenantId, res.locals.auth.id, req.body || {}, res.locals.requestId) })
  } catch (error) { next(error) }
})
apiRouter.post('/platform/team/invitations/accept', async (req, res, next) => {
  try {
    res.status(201).json({ success: true, data: await acceptTeamInvitation(req.body?.token, req.body?.password) })
  } catch (error) { next(error) }
})
apiRouter.get('/platform/team/invitations/inspect', async (req, res, next) => {
  try { res.json({ success: true, data: await getInvitationDetails(req.query.token) }) } catch (error) { next(error) }
})
apiRouter.post('/platform/team/invitations/:id/revoke', requireTenantOwnerAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await revokeTeamInvitation(tenantId, res.locals.auth.id, String(req.params.id), res.locals.requestId) })
  } catch (error) { next(error) }
})
apiRouter.post('/platform/team/invitations/:id/resend', requireTenantOwnerAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = writeTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.status(201).json({ success: true, data: await resendTeamInvitation(tenantId, res.locals.auth.id, String(req.params.id), res.locals.requestId) })
  } catch (error) { next(error) }
})
apiRouter.patch('/platform/team/:id', requireTenantOwnerAccess, requireTenant, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await updateTeamMember(tenantId, res.locals.auth.id, String(req.params.id), req.body || {}, res.locals.requestId) })
  } catch (error) { next(error) }
})
apiRouter.get('/console/products', requireMerchantAccess, requireTenant, requireCoreOperationsModule, async (_req, res, next) => { try { const data = await merchantWorkspace(res.locals.auth.tenantId, res.locals.auth.id); res.json({ products: data.inventory }) } catch (error) { next(error) } })
apiRouter.get('/console/orders', requireMerchantAccess, requireTenant, requireCoreOperationsModule, async (_req, res, next) => { try { const data = await merchantWorkspace(res.locals.auth.tenantId, res.locals.auth.id); res.json({ orders: data.orders }) } catch (error) { next(error) } })
apiRouter.get('/console/customers', requireMerchantAccess, requireTenant, requireCoreOperationsModule, async (_req, res, next) => { try { const data = await pipelineSummary(res.locals.auth.tenantId); res.json({ customers: data.customers }) } catch (error) { next(error) } })
apiRouter.get('/console/reports', requireMerchantAccess, requireTenant, requireCoreOperationsModule, async (_req, res, next) => { try { const [pipeline, operations] = await Promise.all([pipelineSummary(res.locals.auth.tenantId), operationsSummary(res.locals.auth.tenantId)]); res.json({ reports: { pipeline: pipeline.metrics, operations: operations.metrics } }) } catch (error) { next(error) } })
apiRouter.get('/merchant/workspace', requireMerchantAccess, requireTenant, requireCoreOperationsModule, async (_req, res, next) => {
  try { res.json({ success: true, data: await merchantWorkspace(res.locals.auth.tenantId, res.locals.auth.id) }) } catch (error) { next(error) }
})
apiRouter.post('/merchant/changes', requireMerchantAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await submitMerchantChange(res.locals.auth.tenantId, res.locals.auth.id, req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.get('/merchants/:id', requireMerchantAccess, requireTenant, requireCoreOperationsModule, (req, res) => res.json({ merchant: { id: req.params.id, tenantId: res.locals.auth.tenantId } }))
apiRouter.get('/consoles/:id', requireMerchantAccess, requireTenant, requireCoreOperationsModule, (req, res) => res.json({ console: { id: req.params.id, tenantId: res.locals.auth.tenantId } }))
apiRouter.get('/packages/:id', requireOwnerAccess, requireTenant, requireCoreOperationsModule, (req, res) => res.json({ package: { id: req.params.id, tenantId: res.locals.auth.tenantId } }))
apiRouter.get('/owner/overview', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { res.json(await pipelineSummary(readTenant(req, res))) } catch (error) { next(error) }
})
apiRouter.get('/owner/pipeline', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { res.json({ success: true, data: await pipelineSummary(readTenant(req, res)) }) } catch (error) { next(error) }
})
apiRouter.get('/customers', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { res.json({ success: true, data: await listCustomers(readTenant(req, res)) }) } catch (error) { next(error) }
})
apiRouter.get('/customers/:id', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { res.json({ success: true, data: await getCustomer(String(req.params.id), readTenant(req, res)) }) } catch (error) { next(error) }
})
apiRouter.post('/customers', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { const tenantId = writeTenant(req, res); if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' }); res.status(201).json({ success: true, data: await createCustomer(tenantId, req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.patch('/customers/:id', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { res.json({ success: true, data: await updateCustomer(String(req.params.id), readTenant(req, res), req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.delete('/customers/:id', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { res.json({ success: true, data: await deleteCustomer(String(req.params.id), readTenant(req, res)) }) } catch (error) { next(error) }
})
apiRouter.post('/leads', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await createLead(req.body || {}, writeTenant(req, res) || undefined) }) } catch (error) { next(error) }
})
apiRouter.patch('/leads/:id', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { res.json({ success: true, data: await updateLeadStage(String(req.params.id), req.body?.stage, readTenant(req, res)) } ) } catch (error) { next(error) }
})
apiRouter.post('/leads/:id/convert', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { res.json({ success: true, data: await convertLead(String(req.params.id), readTenant(req, res)) }) } catch (error) { next(error) }
})
apiRouter.get('/owner/operations', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { res.json({ success: true, data: await operationsSummary(readTenant(req, res)) }) } catch (error) { next(error) }
})
apiRouter.get('/brand-profile', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await getBrandProfile(tenantId) })
  } catch (error) {
    next(error)
  }
})
apiRouter.put('/brand-profile', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try {
    const tenantId = writeTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await saveBrandProfile(tenantId, req.body || {}) })
  } catch (error) {
    next(error)
  }
})
apiRouter.get('/marketing/workspace', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try {
    const operations = await operationsSummary(readTenant(req, res))
    res.json({
      success: true,
      data: {
        campaigns: operations.campaigns,
        socialPosts: operations.socialPosts,
        media: operations.media,
        metrics: {
          campaigns: operations.metrics.campaigns,
          scheduledPosts: operations.metrics.scheduledPosts,
          impressions: operations.campaigns.reduce((sum, campaign) => sum + campaign.impressions, 0),
          conversions: operations.campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0),
          revenuePence: operations.campaigns.reduce((sum, campaign) => sum + campaign.revenuePence, 0),
        },
      },
    })
  } catch (error) {
    next(error)
  }
})
apiRouter.get('/owner/merchants', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { const tenantId=readTenant(req,res); if(!tenantId)return res.status(400).json({success:false,message:'Select a company to manage merchants'}); res.json({success:true,data:await ownerMerchantSummary(tenantId)}) } catch(error){next(error)}
})
apiRouter.post('/owner/merchants/staff', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req,res,next)=>{
  try{const tenantId=writeTenant(req,res);if(!tenantId)return res.status(400).json({success:false,message:'Tenant context required'});res.status(201).json({success:true,data:await addMerchantStaff(tenantId,req.body||{})})}catch(error){next(error)}
})
apiRouter.patch('/owner/merchants/staff/:id', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req,res,next)=>{
  try{const tenantId=readTenant(req,res);if(!tenantId)return res.status(400).json({success:false,message:'Tenant context required'});res.json({success:true,data:await updateMerchantStaff(String(req.params.id),tenantId,req.body||{})})}catch(error){next(error)}
})
apiRouter.delete('/owner/merchants/staff/:id', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req,res,next)=>{
  try{const tenantId=readTenant(req,res);if(!tenantId)return res.status(400).json({success:false,message:'Tenant context required'});res.json({success:true,data:await removeMerchantStaff(String(req.params.id),tenantId)})}catch(error){next(error)}
})
apiRouter.post('/owner/merchants/staff/:id/reset-password', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req,res,next)=>{
  try{const tenantId=readTenant(req,res);if(!tenantId)return res.status(400).json({success:false,message:'Tenant context required'});res.json({success:true,data:await resetMerchantPassword(String(req.params.id),tenantId)})}catch(error){next(error)}
})
apiRouter.patch('/owner/merchants/changes/:id', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req,res,next)=>{
  try{const tenantId=readTenant(req,res);if(!tenantId)return res.status(400).json({success:false,message:'Tenant context required'});res.json({success:true,data:await reviewMerchantChange(String(req.params.id),tenantId,res.locals.auth.id,String(req.body?.status||'rejected'),req.body?.note)})}catch(error){next(error)}
})
apiRouter.get('/inventory', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { res.json({ success: true, data: await searchInventory(readTenant(req, res), req.query) }) } catch (error) { next(error) }
})
apiRouter.post('/inventory', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { const tenantId = writeTenant(req, res); if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' }); res.status(201).json({ success: true, data: await createInventoryItem(tenantId, req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.patch('/inventory/:id', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { res.json({ success: true, data: await updateInventoryItem(String(req.params.id), readTenant(req, res), req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.delete('/inventory/:id', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { res.json({ success: true, data: await deleteInventoryItem(String(req.params.id), readTenant(req, res)) }) } catch (error) { next(error) }
})
apiRouter.post('/orders', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { const tenantId = writeTenant(req, res); if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' }); res.status(201).json({ success: true, data: await createOrder(tenantId, req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.patch('/orders/:id', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { res.json({ success: true, data: await updateOrder(String(req.params.id), readTenant(req, res), req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.post('/invoices', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { const tenantId = writeTenant(req, res); if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' }); res.status(201).json({ success: true, data: await createInvoice(tenantId, req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.patch('/invoices/:id', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { res.json({ success: true, data: await updateInvoice(String(req.params.id), readTenant(req, res), req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.post('/invoices/:id/send', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { res.json({ success: true, data: await sendInvoice(String(req.params.id), readTenant(req, res)) }) } catch (error) { next(error) }
})
apiRouter.get('/invoices/:id/download', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { const tenantId = readTenant(req, res); const invoice = await (await import('./auth.js')).prisma.invoice.findFirstOrThrow({ where: { id: String(req.params.id), ...(tenantId ? { tenantId } : {}) } }); res.json({ success: true, data: { filename: `${invoice.number}.txt`, content: `Invoice ${invoice.number}\nStatus: ${invoice.status}\nTotal: GBP ${(invoice.totalPence / 100).toFixed(2)}\n` } }) } catch (error) { next(error) }
})
apiRouter.get('/invoices/:id/document', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await invoiceDocument(String(req.params.id), tenantId) })
  } catch (error) {
    next(error)
  }
})
apiRouter.get('/orders/:id/document', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try {
    const tenantId = readTenant(req, res)
    if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' })
    res.json({ success: true, data: await orderDocument(String(req.params.id), tenantId) })
  } catch (error) {
    next(error)
  }
})
apiRouter.post('/marketing/campaigns', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { const tenantId = writeTenant(req, res); if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' }); res.status(201).json({ success: true, data: await createCampaign(tenantId, req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.patch('/marketing/campaigns/:id', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { res.json({ success: true, data: await updateCampaign(String(req.params.id), readTenant(req, res), req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.post('/social/posts', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { const tenantId = writeTenant(req, res); if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' }); res.status(201).json({ success: true, data: await createSocialPost(tenantId, req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.patch('/social/posts/:id', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { res.json({ success: true, data: await updateSocialPost(String(req.params.id), readTenant(req, res), req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.post('/media/generate', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { const tenantId = writeTenant(req, res); if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' }); const [pipeline, operations] = await Promise.all([pipelineSummary(readTenant(req, res) || tenantId), operationsSummary(readTenant(req, res) || tenantId)]); res.status(201).json({ success: true, data: await generateMedia(tenantId, req.body || {}, { sales: pipeline.metrics, customers: pipeline.customers.slice(0, 20), products: operations.inventory.slice(0, 20), campaigns: operations.campaigns.slice(0, 10), system: { generatedAt: new Date().toISOString() } }) }) } catch (error) { next(error) }
})
apiRouter.post('/delivery/operators', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { const tenantId = writeTenant(req, res); if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' }); res.status(201).json({ success: true, data: await createDeliveryOperator(tenantId, req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.patch('/delivery/operators/:id', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { res.json({ success: true, data: await updateDeliveryOperator(String(req.params.id), readTenant(req, res), req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.post('/delivery/vehicles', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { const tenantId = writeTenant(req, res); if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' }); res.status(201).json({ success: true, data: await createDeliveryVehicle(tenantId, req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.patch('/delivery/vehicles/:id', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { res.json({ success: true, data: await updateDeliveryVehicle(String(req.params.id), readTenant(req, res), req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.post('/delivery/zones', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { const tenantId = writeTenant(req, res); if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' }); res.status(201).json({ success: true, data: await createDeliveryZone(tenantId, req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.patch('/delivery/zones/:id', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { res.json({ success: true, data: await updateDeliveryZone(String(req.params.id), readTenant(req, res), req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.post('/delivery/assignments', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { const tenantId = writeTenant(req, res); if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' }); res.status(201).json({ success: true, data: await assignDelivery(tenantId, req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.patch('/delivery/assignments/:id', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { res.json({ success: true, data: await updateDeliveryAssignment(String(req.params.id), readTenant(req, res), req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.patch('/delivery/notifications/:id', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { res.json({ success: true, data: await updateDeliveryNotification(String(req.params.id), readTenant(req, res), String(req.body?.status || 'sent')) }) } catch (error) { next(error) }
})
apiRouter.post('/delivery/notifications/:id/send', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { const tenantId = readTenant(req, res); const notification = await (await import('./auth.js')).prisma.deliveryNotification.findFirstOrThrow({ where: { id: String(req.params.id), ...(tenantId ? { tenantId } : {}) } }); if (notification.channel === 'whatsapp') await sendWhatsAppText(notification.recipient, notification.message); res.json({ success: true, data: await updateDeliveryNotification(notification.id, tenantId, 'sent') }) } catch (error) { next(error) }
})
apiRouter.post('/location/detect', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { res.json({ success: true, data: await detectLocation(req.body || {}, req.ip) }) } catch (error) { next(error) }
})
apiRouter.put('/location/profile', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { const tenantId = writeTenant(req, res); if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' }); res.json({ success: true, data: await saveLocationProfile(tenantId, req.body || {}) }) } catch (error) { next(error) }
})
apiRouter.get('/location/weather', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { const location = await detectLocation(req.query, req.ip); res.json({ success: true, data: { location, weather: await weatherAt(location.latitude, location.longitude, location.timezone) } }) } catch (error) { next(error) }
})
apiRouter.get('/owner/staff', requireOwnerAccess, requireTenant, requireCoreOperationsModule, (_req, res) => res.json({ staff: [] }))
apiRouter.get('/owner/settings', requireOwnerAccess, requireTenant, requireCoreOperationsModule, (_req, res) => res.json({ settings: {} }))
apiRouter.post('/media', requireMerchantAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { const tenantId = writeTenant(req, res); if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant context required' }); const [pipeline, operations] = await Promise.all([pipelineSummary(tenantId), operationsSummary(tenantId)]); res.status(201).json({ success: true, data: await generateMedia(tenantId, req.body || {}, { sales: pipeline.metrics, customers: pipeline.customers.slice(0, 20), products: operations.inventory.slice(0, 20), campaigns: operations.campaigns.slice(0, 10), system: { generatedAt: new Date().toISOString() } }) }) } catch (error) { next(error) }
})
apiRouter.post('/events/publish', requireMerchantAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try {
    const type = String(req.body?.type || '').trim()
    const source = String(req.body?.source || '').trim()
    if (!type || !source) return res.status(400).json({ success: false, message: 'Event type and source are required' })
    res.status(201).json({ success: true, data: await publishEvent({ tenantId: readTenant(req, res), type, source, payload: req.body?.payload }) })
  } catch (error) { next(error) }
})
apiRouter.get('/events', requireMerchantAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { res.json({ success: true, data: await listEvents(readTenant(req, res), typeof req.query.source === 'string' ? req.query.source : undefined) }) } catch (error) { next(error) }
})
apiRouter.get('/events/stream', requireMerchantAccess, requireTenant, requireCoreOperationsModule, (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()
  res.write('retry: 10000\n\n')
  const unregister = registerEventStreamClient(res)
  req.on('close', unregister)
})
apiRouter.get('/insights', requireMerchantAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try {
    const type = typeof req.query.type === 'string' ? req.query.type : undefined
    const source = typeof req.query.source === 'string' ? req.query.source : undefined
    res.json({ success: true, data: await listInsights(readTenant(req, res), type, source) })
  } catch (error) { next(error) }
})
apiRouter.get('/insights/stream', requireMerchantAccess, requireTenant, requireCoreOperationsModule, (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()
  res.write('retry: 10000\n\n')
  const unregister = registerInsightStreamClient(res)
  req.on('close', unregister)
})
apiRouter.post('/insights/generate', requireOwnerAccess, requireTenant, requireCoreOperationsModule, async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await generateInsightsFromRecentEvents(readTenant(req, res)) }) } catch (error) { next(error) }
})
