/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { createHash, randomBytes, randomUUID } from 'node:crypto'
import bcrypt from 'bcrypt'
import { put } from '@vercel/blob'
import { roles } from '@foundingos/service-auth'
import { Prisma } from './generated/prisma/index.js'
import { prisma } from './auth.js'
import { publishEvent } from './event-feed.js'
import { assertExpectedVersion, decryptIntegrationCredentials, encryptIntegrationCredentials, isActiveIdempotencyRecord, roleCanAccessWorkspace } from './platform-security.js'

export const workspaceSlugs = ['retail', 'logistics', 'finance', 'marketing', 'talent', 'health', 'intelligence'] as const
export type WorkspaceSlug = typeof workspaceSlugs[number]

const workspaceSet = new Set<string>(workspaceSlugs)
const providerRequirements: Record<string, string[]> = {
  whatsapp: ['accessToken', 'phoneNumberId', 'verifyToken', 'appSecret'],
  stripe: ['secretKey', 'webhookSecret'],
  resend: ['apiKey', 'fromAddress'],
  twilio: ['accountSid', 'authToken', 'fromNumber'],
  aws: ['region', 'bucket', 'accessKeyId', 'secretAccessKey'],
  sentry: ['dsn'],
  clerk: ['secretKey', 'publishableKey'],
  meta: ['pageAccessToken', 'pageId'],
  linkedin: ['accessToken', 'authorUrn'],
}

const json = (value: unknown): Prisma.InputJsonValue => JSON.parse(JSON.stringify(value ?? {})) as Prisma.InputJsonValue
const requiredText = (value: unknown, label: string) => {
  const result = String(value ?? '').trim()
  if (!result) throw Object.assign(new Error(`${label} is required`), { status: 400 })
  return result
}
const optionalText = (value: unknown) => {
  const result = String(value ?? '').trim()
  return result || null
}
const assertWorkspace = (value: unknown): WorkspaceSlug => {
  const workspace = requiredText(value, 'Workspace')
  if (!workspaceSet.has(workspace)) throw Object.assign(new Error(`Unsupported workspace: ${workspace}`), { status: 400 })
  return workspace as WorkspaceSlug
}
const assertModule = (value: unknown) => {
  const module = requiredText(value, 'Module')
  if (!/^[a-z0-9-]{2,64}$/.test(module)) throw Object.assign(new Error('Module must use lowercase letters, numbers, and hyphens'), { status: 400 })
  return module
}

export async function getIntegrationCredentials(tenantId: string, provider: string) {
  const record = await prisma.integrationCredential.findUnique({ where: { tenantId_provider: { tenantId, provider } } })
  if (!record || !['configured', 'ready'].includes(record.status)) throw Object.assign(new Error(`${provider} integration is not configured for this company`), { status: 503 })
  return decryptIntegrationCredentials(record)
}

const audit = (input: { tenantId: string; actorId: string; action: string; workspace?: string; module?: string; entityId?: string; requestId?: string; metadata?: unknown }) =>
  prisma.workspaceAuditEvent.create({ data: { ...input, metadata: json(input.metadata) } })

export async function assertWorkspaceAccess(tenantId: string, userId: string, role: string, workspaceValue: unknown) {
  const workspace = assertWorkspace(workspaceValue)
  const entitlement = await prisma.tenantWorkspace.findUnique({ where: { tenantId_workspace: { tenantId, workspace } } })
  if (!entitlement?.enabled) throw Object.assign(new Error(`${workspace} workspace is not enabled for this company`), { status: 403 })
  if (roleCanAccessWorkspace(role, null, workspace)) return workspace
  const user = await prisma.authUser.findFirst({ where: { id: userId, tenantId, active: true }, select: { permissions: true } })
  if (!roleCanAccessWorkspace(role, user?.permissions, workspace)) throw Object.assign(new Error(`Your role does not include the ${workspace} workspace`), { status: 403 })
  return workspace
}

export async function bootstrapTenant(input: Record<string, unknown>) {
  const email = requiredText(input.email, 'Owner email').toLowerCase()
  const password = requiredText(input.password, 'Owner password')
  if (password.length < 12) throw Object.assign(new Error('Owner password must contain at least 12 characters'), { status: 400 })
  const tenantId = optionalText(input.tenantId) || randomUUID()
  const businessName = requiredText(input.businessName, 'Business name')
  const ownerName = requiredText(input.ownerName, 'Owner name')
  const existing = await prisma.authUser.findUnique({ where: { email } })
  if (existing) throw Object.assign(new Error('An account already exists for this email'), { status: 409 })
  const requestedWorkspaces = Array.isArray(input.workspaces) ? input.workspaces.map(String) : null
  const enabledWorkspaces = new Set(requestedWorkspaces ? workspaceSlugs.filter((workspace) => requestedWorkspaces.includes(workspace)) : workspaceSlugs)
  if (!enabledWorkspaces.size) throw Object.assign(new Error('At least one workspace must be enabled'), { status: 400 })
  const passwordHash = await bcrypt.hash(password, 12)
  return prisma.$transaction(async (tx) => {
    const user = await tx.authUser.create({ data: { email, passwordHash, role: roles.businessOwner, tenantId, permissions: json({ workspaces: workspaceSlugs }) } })
    const onboarding = await tx.tenantOnboarding.create({
      data: { tenantId, businessName, ownerName, industry: optionalText(input.industry), countryCode: String(input.countryCode || 'GB'), currency: String(input.currency || 'GBP'), timezone: String(input.timezone || 'Europe/London'), completedSteps: json(['business', 'owner']), goLiveStatus: 'setup' },
    })
    await tx.tenantWorkspace.createMany({ data: workspaceSlugs.map((workspace) => ({ tenantId, workspace, enabled: enabledWorkspaces.has(workspace), plan: String(input.plan || 'growth'), modules: json([]) })) })
    await tx.workspaceAuditEvent.create({ data: { tenantId, actorId: user.id, action: 'tenant.bootstrapped', metadata: json({ businessName, email, plan: String(input.plan || 'growth'), workspaces: [...enabledWorkspaces] }) } })
    return { tenantId, owner: { id: user.id, email: user.email, role: user.role }, onboarding }
  })
}

export const getOnboarding = (tenantId: string) => prisma.tenantOnboarding.findUnique({ where: { tenantId } })

export async function saveOnboarding(tenantId: string, actorId: string, input: Record<string, unknown>, requestId?: string) {
  const existing = await getOnboarding(tenantId)
  const completedSteps = Array.isArray(input.completedSteps) ? input.completedSteps.map(String) : []
  const goLiveStatus = String(input.goLiveStatus || 'setup')
  const data = {
    businessName: requiredText(input.businessName ?? existing?.businessName, 'Business name'),
    ownerName: requiredText(input.ownerName ?? existing?.ownerName, 'Owner name'),
    industry: input.industry === undefined ? existing?.industry : optionalText(input.industry),
    countryCode: String(input.countryCode || existing?.countryCode || 'GB'),
    currency: String(input.currency || existing?.currency || 'GBP'),
    timezone: String(input.timezone || existing?.timezone || 'Europe/London'),
    completedSteps: json(completedSteps.length ? completedSteps : existing?.completedSteps),
    goLiveStatus,
    acceptedTermsAt: input.acceptTerms ? new Date() : undefined,
    completedAt: goLiveStatus === 'live' ? new Date() : undefined,
  }
  const onboarding = await prisma.tenantOnboarding.upsert({ where: { tenantId }, create: { tenantId, ...data }, update: data })
  await audit({ tenantId, actorId, action: 'onboarding.updated', requestId, metadata: { completedSteps, goLiveStatus } })
  return onboarding
}

export const listTenantWorkspaces = (tenantId: string) => prisma.tenantWorkspace.findMany({ where: { tenantId }, orderBy: { workspace: 'asc' } })

export const getControlSettings = (tenantId: string) => prisma.tenantControlSettings.findUnique({ where: { tenantId } })

export async function saveControlSettings(tenantId: string, actorId: string, input: Record<string, unknown>, requestId?: string) {
  const approvalThresholdPence = Math.max(0, Math.min(100_000_000, Math.round(Number(input.approvalThresholdPence ?? 0))))
  if (!Number.isFinite(approvalThresholdPence)) throw Object.assign(new Error('Approval threshold must be a valid amount'), { status: 400 })
  const notificationChannel = ['whatsapp', 'email', 'both'].includes(String(input.notificationChannel)) ? String(input.notificationChannel) : 'whatsapp'
  const data = {
    notificationChannel,
    notificationEnabled: input.notificationEnabled !== false,
    approvalThresholdPence,
    requireOwnerExecution: input.requireOwnerExecution !== false,
    requireEvidence: input.requireEvidence !== false,
    governanceMode: 'human_approval',
  }
  const settings = await prisma.tenantControlSettings.upsert({ where: { tenantId }, create: { tenantId, ...data }, update: data })
  await audit({ tenantId, actorId, action: 'control-settings.updated', requestId, metadata: data })
  return settings
}

export async function saveTenantWorkspace(tenantId: string, actorId: string, workspaceValue: unknown, input: Record<string, unknown>, requestId?: string) {
  const workspace = assertWorkspace(workspaceValue)
  const data = { enabled: input.enabled !== false, plan: String(input.plan || 'growth'), modules: json(Array.isArray(input.modules) ? input.modules.map(String) : []) }
  const result = await prisma.tenantWorkspace.upsert({ where: { tenantId_workspace: { tenantId, workspace } }, create: { tenantId, workspace, ...data }, update: data })
  await audit({ tenantId, actorId, action: 'workspace.configured', workspace, requestId, metadata: data })
  return result
}

export async function listWorkspaceRecords(tenantId: string, workspaceValue: unknown, moduleValue: unknown, query: Record<string, unknown>) {
  const workspace = assertWorkspace(workspaceValue)
  const module = assertModule(moduleValue)
  const search = optionalText(query.search)
  const status = optionalText(query.status)
  const take = Math.min(200, Math.max(1, Number(query.limit || 100)))
  return prisma.workspaceRecord.findMany({
    where: {
      tenantId, workspace, module, deletedAt: null,
      ...(status ? { status } : {}),
      ...(search ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { reference: { contains: search, mode: 'insensitive' } }] } : {}),
    },
    orderBy: { updatedAt: 'desc' },
    take,
  })
}

export async function createWorkspaceRecord(tenantId: string, actorId: string, workspaceValue: unknown, moduleValue: unknown, input: Record<string, unknown>, idempotencyKey?: string, requestId?: string) {
  const workspace = assertWorkspace(workspaceValue)
  const module = assertModule(moduleValue)
  const operation = `${workspace}.${module}.create`
  if (idempotencyKey) {
    const previous = await prisma.idempotencyRecord.findUnique({ where: { tenantId_key: { tenantId, key: idempotencyKey } } })
    if (isActiveIdempotencyRecord(previous)) return previous!.response
  }
  const record = await prisma.workspaceRecord.create({
    data: {
      tenantId, workspace, module,
      reference: requiredText(input.reference, 'Reference'),
      name: requiredText(input.name, 'Name'),
      status: requiredText(input.status, 'Status'),
      ownerId: optionalText(input.ownerId),
      valuePence: input.valuePence === undefined || input.valuePence === null ? null : Math.round(Number(input.valuePence)),
      data: json(input.data),
      createdBy: actorId,
      updatedBy: actorId,
    },
  })
  if (idempotencyKey) await prisma.idempotencyRecord.create({ data: { tenantId, key: idempotencyKey, operation, response: json(record), expiresAt: new Date(Date.now() + 24 * 60 * 60_000) } })
  await Promise.all([
    audit({ tenantId, actorId, action: 'record.created', workspace, module, entityId: record.id, requestId, metadata: { reference: record.reference, status: record.status } }),
    publishEvent({ tenantId, type: 'workspace.record.created', source: workspace, payload: { module, recordId: record.id, reference: record.reference, status: record.status } }),
  ])
  return record
}

export async function updateWorkspaceRecord(tenantId: string, actorId: string, role: string, id: string, input: Record<string, unknown>, requestId?: string) {
  const existing = await prisma.workspaceRecord.findFirst({ where: { id, tenantId, deletedAt: null } })
  if (!existing) throw Object.assign(new Error('Workspace record not found'), { status: 404 })
  await assertWorkspaceAccess(tenantId, actorId, role, existing.workspace)
  assertExpectedVersion(input.version, existing.version)
  const record = await prisma.workspaceRecord.update({
    where: { id },
    data: {
      ...(input.name !== undefined ? { name: requiredText(input.name, 'Name') } : {}),
      ...(input.status !== undefined ? { status: requiredText(input.status, 'Status') } : {}),
      ...(input.ownerId !== undefined ? { ownerId: optionalText(input.ownerId) } : {}),
      ...(input.valuePence !== undefined ? { valuePence: input.valuePence === null ? null : Math.round(Number(input.valuePence)) } : {}),
      // Merge so partial edits never wipe the activity log, images or contact details.
      ...(input.data !== undefined ? { data: json({ ...(existing.data && typeof existing.data === 'object' && !Array.isArray(existing.data) ? existing.data as Record<string, unknown> : {}), ...(input.data && typeof input.data === 'object' ? input.data as Record<string, unknown> : {}) }) } : {}),
      version: { increment: 1 },
      updatedBy: actorId,
    },
  })
  await Promise.all([
    audit({ tenantId, actorId, action: 'record.updated', workspace: record.workspace, module: record.module, entityId: record.id, requestId, metadata: { status: record.status, version: record.version } }),
    publishEvent({ tenantId, type: 'workspace.record.updated', source: record.workspace, payload: { module: record.module, recordId: record.id, reference: record.reference, status: record.status } }),
  ])
  return record
}

const allowedImageTypes: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'heic',
}

export async function uploadWorkspaceRecordImage(tenantId: string, actorId: string, role: string, id: string, input: { contentType: string; bytes: Buffer }, requestId?: string) {
  const extension = allowedImageTypes[input.contentType]
  if (!extension) throw Object.assign(new Error('Unsupported image type. Use JPEG, PNG, WEBP, or HEIC.'), { status: 400 })
  if (input.bytes.byteLength === 0) throw Object.assign(new Error('Image is empty'), { status: 400 })
  if (input.bytes.byteLength > 15 * 1024 * 1024) throw Object.assign(new Error('Image must be smaller than 15MB'), { status: 400 })

  const existing = await prisma.workspaceRecord.findFirst({ where: { id, tenantId, deletedAt: null } })
  if (!existing) throw Object.assign(new Error('Workspace record not found'), { status: 404 })
  await assertWorkspaceAccess(tenantId, actorId, role, existing.workspace)

  const pathname = `${tenantId}/${existing.workspace}/${existing.module}/${existing.id}/${randomUUID()}.${extension}`
  const blob = await put(pathname, input.bytes, { access: 'public', contentType: input.contentType, addRandomSuffix: false })

  const data = (existing.data && typeof existing.data === 'object' ? existing.data : {}) as Record<string, unknown>
  const images = Array.isArray(data.images) ? [...data.images] : []
  images.push({ url: blob.url, uploadedAt: new Date().toISOString(), uploadedBy: actorId })

  const record = await prisma.workspaceRecord.update({
    where: { id },
    data: { data: json({ ...data, images }), version: { increment: 1 }, updatedBy: actorId },
  })
  await Promise.all([
    audit({ tenantId, actorId, action: 'record.image.uploaded', workspace: record.workspace, module: record.module, entityId: record.id, requestId, metadata: { url: blob.url } }),
    publishEvent({ tenantId, type: 'workspace.record.updated', source: record.workspace, payload: { module: record.module, recordId: record.id, reference: record.reference, status: record.status } }),
  ])
  return { record, url: blob.url }
}

export async function deleteWorkspaceRecord(tenantId: string, actorId: string, role: string, id: string, requestId?: string) {
  const existing = await prisma.workspaceRecord.findFirst({ where: { id, tenantId, deletedAt: null } })
  if (!existing) throw Object.assign(new Error('Workspace record not found'), { status: 404 })
  await assertWorkspaceAccess(tenantId, actorId, role, existing.workspace)
  const record = await prisma.workspaceRecord.update({ where: { id }, data: { deletedAt: new Date(), updatedBy: actorId, version: { increment: 1 } } })
  await audit({ tenantId, actorId, action: 'record.deleted', workspace: record.workspace, module: record.module, entityId: record.id, requestId, metadata: { reference: record.reference } })
  return { id: record.id, deleted: true }
}

export async function recordPaymentCheckout(tenantId: string, actorId: string, input: { workspace: string; module: string; recordId: string; checkoutId: string }, requestId?: string) {
  await Promise.all([
    audit({ tenantId, actorId, action: 'payment.checkout.created', workspace: input.workspace, module: input.module, entityId: input.recordId, requestId, metadata: { checkoutId: input.checkoutId } }),
    publishEvent({ tenantId, type: 'payment.checkout.created', source: input.workspace, payload: { module: input.module, recordId: input.recordId, checkoutId: input.checkoutId } }),
  ])
}

export async function completeStripeCheckout(tenantId: string, event: { id: string; type: string; data?: { object?: { id?: string; metadata?: Record<string, string> } } }) {
  if (event.type !== 'checkout.session.completed') return { processed: false }
  const metadata = event.data?.object?.metadata
  const recordId = String(metadata?.recordId ?? '')
  if (!recordId || metadata?.tenantId !== tenantId) throw Object.assign(new Error('Stripe checkout metadata does not match this tenant'), { status: 400 })
  const key = `stripe-event:${event.id}`
  const previous = await prisma.idempotencyRecord.findUnique({ where: { tenantId_key: { tenantId, key } } })
  if (isActiveIdempotencyRecord(previous)) return previous!.response
  const existing = await prisma.workspaceRecord.findFirst({ where: { id: recordId, tenantId, deletedAt: null } })
  if (!existing) throw Object.assign(new Error('Stripe checkout record was not found'), { status: 404 })
  if (metadata?.workspace !== existing.workspace || metadata?.module !== existing.module) throw Object.assign(new Error('Stripe checkout metadata does not match the payment record'), { status: 400 })
  const record = await prisma.workspaceRecord.update({ where: { id: recordId }, data: { status: 'Paid', version: { increment: 1 }, updatedBy: 'stripe' } })
  const response = { processed: true, recordId: record.id, status: record.status }
  await prisma.idempotencyRecord.create({ data: { tenantId, key, operation: 'stripe.checkout.completed', response: json(response), expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60_000) } })
  await Promise.all([
    audit({ tenantId, actorId: 'stripe', action: 'payment.checkout.completed', workspace: record.workspace, module: record.module, entityId: record.id, metadata: { eventId: event.id, checkoutId: event.data?.object?.id } }),
    publishEvent({ tenantId, type: 'payment.checkout.completed', source: record.workspace, payload: { module: record.module, recordId: record.id, reference: record.reference } }),
  ])
  return response
}

const publicIntegration = (record: { id: string; provider: string; displayName: string; status: string; configuration: unknown; lastCheckedAt: Date | null; lastError: string | null; updatedAt: Date }) => ({
  id: record.id, provider: record.provider, displayName: record.displayName, status: record.status, configuration: record.configuration, lastCheckedAt: record.lastCheckedAt, lastError: record.lastError, updatedAt: record.updatedAt,
})

export async function listIntegrations(tenantId: string) {
  const records = await prisma.integrationCredential.findMany({ where: { tenantId }, orderBy: { provider: 'asc' } })
  return records.map(publicIntegration)
}

export async function saveIntegration(tenantId: string, actorId: string, providerValue: unknown, input: Record<string, unknown>, requestId?: string) {
  const provider = requiredText(providerValue, 'Provider').toLowerCase()
  const requirements = providerRequirements[provider]
  if (!requirements) throw Object.assign(new Error(`Unsupported integration provider: ${provider}`), { status: 400 })
  const credentials = input.credentials && typeof input.credentials === 'object' && !Array.isArray(input.credentials) ? input.credentials as Record<string, unknown> : {}
  const missing = requirements.filter((key) => !String(credentials[key] ?? '').trim())
  if (missing.length) throw Object.assign(new Error(`Missing ${provider} credentials: ${missing.join(', ')}`), { status: 400 })
  const encrypted = encryptIntegrationCredentials(credentials)
  const data = {
    displayName: String(input.displayName || provider),
    status: 'configured',
    configuration: json(input.configuration),
    credentialsCiphertext: encrypted.credentialsCiphertext,
    credentialsIv: encrypted.credentialsIv,
    credentialsTag: encrypted.credentialsTag,
    lastCheckedAt: null,
    lastError: null,
    updatedBy: actorId,
  }
  const record = await prisma.integrationCredential.upsert({ where: { tenantId_provider: { tenantId, provider } }, create: { tenantId, provider, createdBy: actorId, ...data }, update: data })
  if (provider === 'whatsapp') {
    await prisma.messagingChannelConnection.upsert({
      where: { channel_externalAccountId: { channel: 'whatsapp', externalAccountId: String(credentials.phoneNumberId) } },
      create: { tenantId, channel: 'whatsapp', externalAccountId: String(credentials.phoneNumberId), displayName: String(input.displayName || 'WhatsApp'), active: true },
      update: { tenantId, displayName: String(input.displayName || 'WhatsApp'), active: true },
    })
  }
  await audit({ tenantId, actorId, action: 'integration.configured', entityId: record.id, requestId, metadata: { provider, credentialFields: Object.keys(credentials) } })
  return publicIntegration(record)
}

async function verifyProvider(provider: string, credentials: Record<string, unknown>) {
  let url = ''
  let headers: Record<string, string> = {}
  if (provider === 'whatsapp') {
    url = `https://graph.facebook.com/${String(credentials.graphVersion || 'v22.0')}/${encodeURIComponent(String(credentials.phoneNumberId))}?fields=display_phone_number,verified_name`
    headers = { Authorization: `Bearer ${String(credentials.accessToken)}` }
  } else if (provider === 'stripe') {
    url = 'https://api.stripe.com/v1/account'
    headers = { Authorization: `Bearer ${String(credentials.secretKey)}` }
  } else if (provider === 'resend') {
    url = 'https://api.resend.com/domains'
    headers = { Authorization: `Bearer ${String(credentials.apiKey)}` }
  } else if (provider === 'twilio') {
    url = `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(String(credentials.accountSid))}.json`
    headers = { Authorization: `Basic ${Buffer.from(`${String(credentials.accountSid)}:${String(credentials.authToken)}`).toString('base64')}` }
  } else if (provider === 'meta') {
    url = `https://graph.facebook.com/v22.0/${encodeURIComponent(String(credentials.pageId))}?fields=name`
    headers = { Authorization: `Bearer ${String(credentials.pageAccessToken)}` }
  } else if (provider === 'clerk') {
    url = 'https://api.clerk.com/v1/users?limit=1'
    headers = { Authorization: `Bearer ${String(credentials.secretKey)}` }
  } else {
    return { verified: false, detail: 'Credential format validated; provider does not expose a safe generic readiness endpoint.' }
  }
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(10_000) })
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: { message?: string }; message?: string } | null
    throw new Error(body?.error?.message || body?.message || `${provider} returned HTTP ${response.status}`)
  }
  return { verified: true, detail: 'Provider credentials accepted.' }
}

export async function checkIntegration(tenantId: string, actorId: string, providerValue: unknown, requestId?: string) {
  const provider = requiredText(providerValue, 'Provider').toLowerCase()
  const record = await prisma.integrationCredential.findUnique({ where: { tenantId_provider: { tenantId, provider } } })
  if (!record) throw Object.assign(new Error(`${provider} is not configured`), { status: 404 })
  const credentials = decryptIntegrationCredentials(record)
  const missing = (providerRequirements[provider] || []).filter((key) => !String(credentials[key] ?? '').trim())
  if (missing.length) {
    const lastError = `Missing credentials: ${missing.join(', ')}`
    const updated = await prisma.integrationCredential.update({ where: { id: record.id }, data: { status: 'invalid', lastCheckedAt: new Date(), lastError, updatedBy: actorId } })
    await audit({ tenantId, actorId, action: 'integration.checked', entityId: record.id, requestId, metadata: { provider, status: 'invalid' } })
    return publicIntegration(updated)
  }
  try {
    const result = await verifyProvider(provider, credentials)
    const status = result.verified ? 'ready' : 'configured'
    const updated = await prisma.integrationCredential.update({ where: { id: record.id }, data: { status, lastCheckedAt: new Date(), lastError: null, updatedBy: actorId } })
    await audit({ tenantId, actorId, action: 'integration.checked', entityId: record.id, requestId, metadata: { provider, status, detail: result.detail } })
    return publicIntegration(updated)
  } catch (error) {
    const lastError = error instanceof Error ? error.message : `${provider} readiness check failed`
    await prisma.integrationCredential.update({ where: { id: record.id }, data: { status: 'invalid', lastCheckedAt: new Date(), lastError, updatedBy: actorId } })
    await audit({ tenantId, actorId, action: 'integration.checked', entityId: record.id, requestId, metadata: { provider, status: 'invalid' } })
    throw Object.assign(new Error(`${provider} credentials were saved but the provider rejected the readiness check: ${lastError}`), { status: 502 })
  }
}

export const listAuditEvents = (tenantId: string, limitValue: unknown) => prisma.workspaceAuditEvent.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' }, take: Math.min(200, Math.max(1, Number(limitValue || 100))) })

export async function exportGovernanceCsv(tenantId: string) {
  const [actions, auditEvents] = await Promise.all([
    prisma.agentAction.findMany({ where: { tenantId }, orderBy: { createdAt: 'asc' }, take: 1000 }),
    prisma.workspaceAuditEvent.findMany({ where: { tenantId }, orderBy: { createdAt: 'asc' }, take: 1000 }),
  ])
  const quote = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""').replaceAll(/\r?\n/g, ' ')}"`
  const rows = [
    ['recordType', 'id', 'action', 'status', 'actorId', 'valuePence', 'createdAt', 'summary'],
    ...actions.map((action) => ['agent_action', action.id, action.kind, action.status, action.proposedBy, action.estimatedValuePence ?? '', action.createdAt.toISOString(), action.outcomeSummary ?? action.summary]),
    ...auditEvents.map((event) => ['audit_event', event.id, event.action, '', event.actorId, '', event.createdAt.toISOString(), JSON.stringify(event.metadata ?? {})]),
  ]
  return rows.map((row) => row.map(quote).join(',')).join('\n')
}

const teamRoles = new Set<string>([roles.businessOwner, roles.businessManager, roles.businessStaff, roles.businessViewer])

export const listTeam = (tenantId: string) => prisma.authUser.findMany({
  where: { tenantId, role: { in: [...teamRoles] } },
  select: { id: true, email: true, role: true, permissions: true, active: true, createdAt: true, updatedAt: true },
  orderBy: { email: 'asc' },
})

export const listPendingInvitations = (tenantId: string) => prisma.tenantInvitation.findMany({
  where: { tenantId, acceptedAt: null, revokedAt: null, expiresAt: { gt: new Date() } },
  select: { id: true, email: true, role: true, permissions: true, expiresAt: true, createdAt: true },
  orderBy: { createdAt: 'desc' },
})

export async function getInvitationDetails(tokenValue: unknown) {
  const token = requiredText(tokenValue, 'Invitation token')
  const tokenHash = createHash('sha256').update(token).digest('hex')
  const invitation = await prisma.tenantInvitation.findUnique({ where: { tokenHash } })
  if (!invitation || invitation.revokedAt || invitation.acceptedAt || invitation.expiresAt <= new Date()) throw Object.assign(new Error('Invitation is invalid or expired'), { status: 410 })
  const onboarding = await prisma.tenantOnboarding.findUnique({ where: { tenantId: invitation.tenantId }, select: { businessName: true } })
  return { email: invitation.email, role: invitation.role, expiresAt: invitation.expiresAt, tenantName: onboarding?.businessName || 'your FoundingOS workspace' }
}

export async function inviteTeamMember(tenantId: string, actorId: string, input: Record<string, unknown>, requestId?: string) {
  const email = requiredText(input.email, 'Email').toLowerCase()
  const role = String(input.role || roles.businessStaff)
  if (!teamRoles.has(role)) throw Object.assign(new Error('Unsupported team role'), { status: 400 })
  const permissions = { workspaces: Array.isArray(input.workspaces) ? input.workspaces.map(assertWorkspace) : workspaceSlugs }
  const existing = await prisma.authUser.findUnique({ where: { email }, select: { id: true } })
  if (existing) throw Object.assign(new Error('A user with this email already exists'), { status: 409 })
  const pending = await prisma.tenantInvitation.findFirst({ where: { tenantId, email, acceptedAt: null, revokedAt: null, expiresAt: { gt: new Date() } } })
  if (pending) throw Object.assign(new Error('An active invitation already exists for this email'), { status: 409 })
  const token = randomBytes(32).toString('base64url')
  const invitation = await prisma.tenantInvitation.create({
    data: { tenantId, email, role, permissions: json(permissions), tokenHash: createHash('sha256').update(token).digest('hex'), expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000), invitedBy: actorId },
  })
  await audit({ tenantId, actorId, action: 'team.invitation.created', entityId: invitation.id, requestId, metadata: { email, role, workspaces: permissions.workspaces, expiresAt: invitation.expiresAt.toISOString(), delivery: 'simulated' } })
  const baseUrl = String(process.env.FOUNDINGOS_WEB_URL || 'http://localhost:3000').replace(/\/$/, '')
  return { invitation: { id: invitation.id, email, role, permissions, expiresAt: invitation.expiresAt, invitationUrl: `${baseUrl}/invite/${encodeURIComponent(token)}` }, delivery: { status: 'simulated', message: 'Invitation prepared for configured email delivery.' } }
}

export async function acceptTeamInvitation(tokenValue: unknown, passwordValue: unknown) {
  const token = requiredText(tokenValue, 'Invitation token')
  const password = requiredText(passwordValue, 'Password')
  if (password.length < 12) throw Object.assign(new Error('Password must contain at least 12 characters'), { status: 400 })
  const tokenHash = createHash('sha256').update(token).digest('hex')
  return prisma.$transaction(async (tx) => {
    const invitation = await tx.tenantInvitation.findUnique({ where: { tokenHash } })
    if (!invitation || invitation.revokedAt || invitation.acceptedAt || invitation.expiresAt <= new Date()) throw Object.assign(new Error('Invitation is invalid or expired'), { status: 410 })
    const existing = await tx.authUser.findUnique({ where: { email: invitation.email }, select: { id: true } })
    if (existing) throw Object.assign(new Error('A user with this email already exists'), { status: 409 })
    const user = await tx.authUser.create({ data: { email: invitation.email, passwordHash: await bcrypt.hash(password, 12), role: invitation.role, tenantId: invitation.tenantId, active: true, permissions: json(invitation.permissions) } })
    await tx.tenantInvitation.update({ where: { id: invitation.id }, data: { acceptedAt: new Date(), acceptedUserId: user.id } })
    await tx.workspaceAuditEvent.create({ data: { tenantId: invitation.tenantId, actorId: user.id, action: 'team.invitation.accepted', workspace: 'intelligence', entityId: invitation.id, metadata: json({ userId: user.id, email: user.email }) } })
    return { user: { id: user.id, email: user.email, role: user.role, tenantId: user.tenantId, permissions: user.permissions }, nextStep: 'Sign in to complete workspace onboarding.' }
  })
}

export async function revokeTeamInvitation(tenantId: string, actorId: string, id: string, requestId?: string) {
  const invitation = await prisma.tenantInvitation.findFirst({ where: { id, tenantId, acceptedAt: null, revokedAt: null } })
  if (!invitation) throw Object.assign(new Error('Pending invitation not found'), { status: 404 })
  const updated = await prisma.tenantInvitation.update({ where: { id }, data: { revokedAt: new Date() } })
  await audit({ tenantId, actorId, action: 'team.invitation.revoked', entityId: id, requestId, metadata: { email: invitation.email } })
  return { id: updated.id, status: 'revoked' as const }
}

export async function resendTeamInvitation(tenantId: string, actorId: string, id: string, requestId?: string) {
  const invitation = await prisma.tenantInvitation.findFirst({ where: { id, tenantId, acceptedAt: null, revokedAt: null } })
  if (!invitation) throw Object.assign(new Error('Pending invitation not found'), { status: 404 })
  await prisma.tenantInvitation.update({ where: { id }, data: { revokedAt: new Date() } })
  const permissions = invitation.permissions && typeof invitation.permissions === 'object' && !Array.isArray(invitation.permissions) ? invitation.permissions as { workspaces?: unknown } : {}
  return inviteTeamMember(tenantId, actorId, { email: invitation.email, role: invitation.role, workspaces: Array.isArray(permissions.workspaces) ? permissions.workspaces : workspaceSlugs }, requestId)
}

export async function updateTeamMember(tenantId: string, actorId: string, id: string, input: Record<string, unknown>, requestId?: string) {
  const existing = await prisma.authUser.findFirst({ where: { id, tenantId } })
  if (!existing) throw Object.assign(new Error('Team member not found'), { status: 404 })
  const role = input.role === undefined ? existing.role : String(input.role)
  if (!teamRoles.has(role)) throw Object.assign(new Error('Unsupported team role'), { status: 400 })
  const user = await prisma.authUser.update({ where: { id }, data: { role, ...(input.workspaces !== undefined ? { permissions: json({ workspaces: Array.isArray(input.workspaces) ? input.workspaces.map(assertWorkspace) : [] }) } : {}), ...(input.active !== undefined ? { active: Boolean(input.active) } : {}) } })
  await audit({ tenantId, actorId, action: 'team.updated', entityId: user.id, requestId, metadata: { role, active: user.active } })
  return { id: user.id, email: user.email, role: user.role, permissions: user.permissions, active: user.active }
}

export async function platformReadiness(tenantId: string) {
  const [onboarding, workspaces, integrations, recordCount, teamCount] = await Promise.all([
    getOnboarding(tenantId),
    listTenantWorkspaces(tenantId),
    listIntegrations(tenantId),
    prisma.workspaceRecord.count({ where: { tenantId, deletedAt: null } }),
    prisma.authUser.count({ where: { tenantId, active: true } }),
  ])
  const enabledWorkspaces = workspaces.filter((workspace) => workspace.enabled)
  const requiredProviders = (process.env.REQUIRED_INTEGRATIONS || 'whatsapp,stripe').split(',').map((provider) => provider.trim()).filter(Boolean)
  const readyProviders = new Set(integrations.filter((integration) => integration.status === 'ready').map((integration) => integration.provider))
  const missingIntegrations = requiredProviders.filter((provider) => !readyProviders.has(provider))
  return {
    ready: onboarding?.goLiveStatus === 'live' && enabledWorkspaces.length > 0 && missingIntegrations.length === 0,
    onboarding,
    workspaces: { enabled: enabledWorkspaces.map((workspace) => workspace.workspace), total: workspaces.length },
    records: recordCount,
    team: { active: teamCount },
    integrations,
    missingIntegrations,
    environment: {
      database: Boolean(process.env.DATABASE_URL),
      auth: Boolean(process.env.AUTH_ACCESS_TOKEN_SECRET && process.env.AUTH_REFRESH_TOKEN_SECRET),
      credentialEncryption: Boolean(process.env.INTEGRATION_ENCRYPTION_KEY),
      webUrl: Boolean(process.env.FOUNDINGOS_WEB_URL),
    },
  }
}
