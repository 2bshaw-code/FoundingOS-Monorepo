/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// FoundAI Autopilot service. Runs the shared rulebook against a tenant's workspace records:
// routine moves are executed immediately (actor "foundai-autopilot"), human decisions are
// queued as approval requests. The policy and approvals are stored as internal workspace
// records so no schema migration is required.
import { normaliseAutopilotPolicy, planAutopilot, type AutopilotDecision, type AutopilotPolicy } from '@foundingos/config/autopilot'
import { Prisma } from './generated/prisma/index.js'
import { prisma } from './auth.js'
import { publishEvent } from './event-feed.js'
import { deliverOutbound, OutboundBlocked, type OutboundResult } from './outbound.js'
import { publishSocial, type SocialResult } from './social.js'

export const AUTOPILOT_ACTOR = 'foundai-autopilot'
const HOME = 'intelligence'
const POLICY_MODULE = 'autopilot-policy'
const APPROVAL_MODULE = 'autopilot-approvals'
const internalModules = [POLICY_MODULE, APPROVAL_MODULE]

const json = (value: unknown): Prisma.InputJsonValue => JSON.parse(JSON.stringify(value ?? {})) as Prisma.InputJsonValue
const asObject = (value: unknown) => (value && typeof value === 'object' && !Array.isArray(value) ? value : {}) as Record<string, unknown>

export async function getAutopilotPolicy(tenantId: string): Promise<AutopilotPolicy> {
  const record = await prisma.workspaceRecord.findFirst({ where: { tenantId, workspace: HOME, module: POLICY_MODULE, reference: 'policy', deletedAt: null } })
  return normaliseAutopilotPolicy(record?.data)
}

export async function saveAutopilotPolicy(tenantId: string, actorId: string, input: unknown) {
  const policy = normaliseAutopilotPolicy(input)
  await prisma.workspaceRecord.upsert({
    where: { tenantId_workspace_module_reference: { tenantId, workspace: HOME, module: POLICY_MODULE, reference: 'policy' } },
    create: { tenantId, workspace: HOME, module: POLICY_MODULE, reference: 'policy', name: 'FoundAI autopilot policy', status: policy.enabled ? 'On' : 'Off', data: json(policy), createdBy: actorId, updatedBy: actorId },
    update: { status: policy.enabled ? 'On' : 'Off', data: json(policy), updatedBy: actorId, version: { increment: 1 } },
  })
  await prisma.workspaceAuditEvent.create({ data: { tenantId, actorId, action: 'autopilot.policy.updated', workspace: HOME, metadata: json(policy) } })
  return policy
}

async function applyDecision(tenantId: string, actorId: string, decision: AutopilotDecision, approvedBy?: string) {
  const record = await prisma.workspaceRecord.findFirst({ where: { id: decision.recordId, tenantId, deletedAt: null } })
  if (!record || record.status !== decision.from) return false
  const data = asObject(record.data)
  // Outbound actions only move the record once the provider has accepted the message.
  const sent: OutboundResult | null = decision.outbound
    ? await deliverOutbound(tenantId, decision, { reference: record.reference, name: record.name, valuePence: record.valuePence, data })
    : null
  const posted: SocialResult | null = decision.publish === 'social' ? await publishSocial(tenantId, { name: record.name, data }) : null
  const log = Array.isArray(data.log) ? data.log : []
  const via = sent ? ` — ${sent.channel === 'email' ? 'emailed' : 'WhatsApp sent'} to ${sent.to}` : posted ? ` to ${posted.channel === 'linkedin' ? 'LinkedIn' : posted.channel === 'instagram' ? 'Instagram' : 'Facebook'}` : ''
  const note = `FoundAI: ${decision.action}${via}${approvedBy ? ' (approved)' : ''}`
  const messages = Array.isArray(data.messages) ? data.messages : []
  await prisma.workspaceRecord.update({
    where: { id: record.id },
    data: {
      status: decision.to,
      data: json({
        ...data,
        log: [{ time: new Date().toISOString(), note, kind: 'FoundAI' }, ...log].slice(0, 50),
        ...(sent ? { messages: [{ sentAt: new Date().toISOString(), ...sent }, ...messages].slice(0, 20) } : {}),
        ...(posted ? { published: { at: new Date().toISOString(), ...posted } } : {}),
      }),
      version: { increment: 1 },
      updatedBy: actorId,
    },
  })
  await Promise.all([
    prisma.workspaceAuditEvent.create({ data: { tenantId, actorId, action: 'autopilot.executed', workspace: record.workspace, module: record.module, entityId: record.id, metadata: json({ ...decision, approvedBy: approvedBy ?? null, sent, posted }) } }),
    publishEvent({ tenantId, type: 'autopilot.action.executed', source: record.workspace, payload: { module: record.module, recordId: record.id, reference: record.reference, from: decision.from, to: decision.to, action: decision.action, approvedBy: approvedBy ?? null, channel: sent?.channel ?? null } }),
  ])
  return true
}

async function queueApproval(tenantId: string, decision: AutopilotDecision) {
  await prisma.workspaceRecord.create({
    data: { tenantId, workspace: HOME, module: APPROVAL_MODULE, reference: decision.key, name: `${decision.action}: ${decision.recordName}`, status: 'Pending', valuePence: decision.valuePence, data: json(decision), createdBy: AUTOPILOT_ACTOR, updatedBy: AUTOPILOT_ACTOR },
  })
  await publishEvent({ tenantId, type: 'autopilot.approval.requested', source: decision.workspace, payload: { module: decision.module, recordId: decision.recordId, action: decision.action, reason: decision.reason } })
}

export async function runAutopilot(tenantId: string) {
  const policy = await getAutopilotPolicy(tenantId)
  if (!policy.enabled) return { enabled: false, executed: [] as AutopilotDecision[], queued: [] as AutopilotDecision[] }
  const records = await prisma.workspaceRecord.findMany({
    where: { tenantId, deletedAt: null, module: { notIn: internalModules } },
    orderBy: { updatedAt: 'asc' },
    take: 1000,
  })
  const decisions = planAutopilot(records.map((record) => ({
    id: record.id, workspace: record.workspace, module: record.module, name: record.name, status: record.status, valuePence: record.valuePence,
    dueDate: typeof asObject(record.data).dueDate === 'string' ? String(asObject(record.data).dueDate) : null,
  })), policy)
  const executed: AutopilotDecision[] = []
  const queued: AutopilotDecision[] = []
  for (const decision of decisions) {
    // One approval per record step: never re-queue, and respect a previous rejection.
    const existing = await prisma.workspaceRecord.findUnique({ where: { tenantId_workspace_module_reference: { tenantId, workspace: HOME, module: APPROVAL_MODULE, reference: decision.key } }, select: { id: true } })
    if (existing) continue
    if (decision.mode === 'auto') {
      try {
        if (await applyDecision(tenantId, AUTOPILOT_ACTOR, decision)) executed.push(decision)
        continue
      } catch (cause) {
        const reason = cause instanceof OutboundBlocked ? cause.message : `Sending failed: ${cause instanceof Error ? cause.message : 'unknown error'}. Approve to retry.`
        const blocked = { ...decision, mode: 'ask' as const, reason }
        await queueApproval(tenantId, blocked)
        queued.push(blocked)
        continue
      }
    }
    await queueApproval(tenantId, decision)
    queued.push(decision)
  }
  return { enabled: true, executed, queued }
}

export async function listAutopilotApprovals(tenantId: string) {
  const items = await prisma.workspaceRecord.findMany({ where: { tenantId, workspace: HOME, module: APPROVAL_MODULE, deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 100 })
  return items.map((item) => ({ id: item.id, status: item.status, createdAt: item.createdAt, decidedBy: item.status === 'Pending' ? null : item.updatedBy, decision: item.data as unknown as AutopilotDecision }))
}

export async function listAutopilotActivity(tenantId: string) {
  const items = await prisma.workspaceAuditEvent.findMany({ where: { tenantId, action: 'autopilot.executed' }, orderBy: { createdAt: 'desc' }, take: 50 })
  return items.map((item) => ({ id: item.id, createdAt: item.createdAt, decision: item.metadata as unknown as AutopilotDecision & { approvedBy: string | null; sent: OutboundResult | null } }))
}

export async function decideAutopilotApproval(tenantId: string, actorId: string, id: string, approve: boolean) {
  const approval = await prisma.workspaceRecord.findFirst({ where: { id, tenantId, workspace: HOME, module: APPROVAL_MODULE, deletedAt: null } })
  if (!approval) throw Object.assign(new Error('Approval request not found'), { status: 404 })
  if (approval.status !== 'Pending') throw Object.assign(new Error('This request has already been decided'), { status: 409 })
  const decision = approval.data as unknown as AutopilotDecision
  let applied = false
  if (approve) {
    try { applied = await applyDecision(tenantId, actorId, decision, actorId) } catch (cause) {
      throw Object.assign(new Error(cause instanceof Error ? cause.message : 'Action could not be completed'), { status: cause instanceof OutboundBlocked ? 409 : 502 })
    }
  }
  const status = approve ? (applied ? 'Approved' : 'Stale') : 'Rejected'
  await prisma.workspaceRecord.update({ where: { id }, data: { status, updatedBy: actorId, version: { increment: 1 } } })
  await prisma.workspaceAuditEvent.create({ data: { tenantId, actorId, action: approve ? 'autopilot.approved' : 'autopilot.rejected', workspace: decision.workspace, module: decision.module, entityId: decision.recordId, metadata: json(decision) } })
  return { id, status }
}

export async function runAutopilotForAllTenants() {
  const tenants = await prisma.workspaceRecord.findMany({ where: { deletedAt: null }, distinct: ['tenantId'], select: { tenantId: true } })
  const results: Array<{ tenantId: string; executed: number; queued: number; error?: string }> = []
  for (const { tenantId } of tenants) {
    try {
      const result = await runAutopilot(tenantId)
      results.push({ tenantId, executed: result.executed.length, queued: result.queued.length })
    } catch (cause) {
      results.push({ tenantId, executed: 0, queued: 0, error: cause instanceof Error ? cause.message : 'failed' })
    }
  }
  return results
}
