// Persists WhatsApp Embedded Signup results for a tenant and drives coexistence chat sync.
import { prisma } from './auth.js'
import { getIntegrationCredentials, saveEmbeddedWhatsAppIntegration } from './platform.js'
import { completeEmbeddedSignup, createGraphCall, embeddedSignupEnv, embeddedSignupPublicConfig, parseEmbeddedSignupInput, runCoexistenceSync, type CoexistenceSyncState } from './whatsapp-embedded-signup.js'

export const whatsAppEmbeddedSignupConfig = () => embeddedSignupPublicConfig()

const syncSummary = (state: CoexistenceSyncState | undefined) => state ? {
  onboardedAt: state.onboardedAt,
  contacts: state.contacts ? { started: Boolean(state.contacts.requestId), error: state.contacts.error } : null,
  history: state.history ? { started: Boolean(state.history.requestId), error: state.history.error } : null,
} : null

async function saveSyncState(tenantId: string, actorId: string, state: CoexistenceSyncState) {
  const record = await prisma.integrationCredential.findUnique({ where: { tenantId_provider: { tenantId, provider: 'whatsapp' } } })
  if (!record) return
  const configuration = { ...(record.configuration as Record<string, unknown> || {}), coexistenceSync: state }
  await prisma.integrationCredential.update({ where: { id: record.id }, data: { configuration: configuration as any, updatedBy: actorId } })
  await prisma.workspaceAuditEvent.create({ data: { tenantId, actorId, action: 'whatsapp.coexistence_sync', metadata: syncSummary(state) as any } })
}

export async function connectWhatsAppWithEmbeddedSignup(tenantId: string, actorId: string, body: unknown, requestId?: string) {
  const env = embeddedSignupEnv()
  const graph = createGraphCall(env.graphVersion)
  const result = await completeEmbeddedSignup(graph, env, parseEmbeddedSignupInput(body))
  const onboardedAt = new Date().toISOString()
  const configuration: Record<string, unknown> = {
    connectionMode: 'embedded_signup',
    wabaId: result.wabaId,
    businessId: result.businessId,
    displayPhoneNumber: result.phone.displayPhoneNumber,
    verifiedName: result.phone.verifiedName,
    coexistence: result.coexistence,
  }
  const integration = await saveEmbeddedWhatsAppIntegration(tenantId, actorId, {
    accessToken: result.accessToken,
    phoneNumberId: result.phone.id,
    wabaId: result.wabaId,
    graphVersion: env.graphVersion,
    connectionMode: 'embedded_signup',
    coexistence: result.coexistence,
    ...(result.twoStepPin ? { twoStepPin: result.twoStepPin } : {}),
  }, { displayName: result.phone.verifiedName || result.phone.displayPhoneNumber || 'WhatsApp', configuration }, requestId)
  let sync: CoexistenceSyncState | undefined
  if (result.coexistence) {
    sync = await runCoexistenceSync(graph, result.accessToken, result.phone.id, { onboardedAt })
    await saveSyncState(tenantId, actorId, sync)
  }
  return { integration, phone: { displayPhoneNumber: result.phone.displayPhoneNumber, verifiedName: result.phone.verifiedName }, coexistence: result.coexistence, sync: syncSummary(sync) }
}

export async function retryWhatsAppCoexistenceSync(tenantId: string, actorId: string) {
  const record = await prisma.integrationCredential.findUnique({ where: { tenantId_provider: { tenantId, provider: 'whatsapp' } } })
  const configuration = (record?.configuration || {}) as Record<string, any>
  if (!record || !configuration.coexistence || !configuration.coexistenceSync) throw Object.assign(new Error('Chat sync is only available after connecting a WhatsApp Business app number.'), { status: 409 })
  const credentials = await getIntegrationCredentials(tenantId, 'whatsapp')
  const env = embeddedSignupEnv()
  const sync = await runCoexistenceSync(createGraphCall(env.graphVersion), String(credentials.accessToken), String(credentials.phoneNumberId), configuration.coexistenceSync)
  await saveSyncState(tenantId, actorId, sync)
  return { sync: syncSummary(sync) }
}
