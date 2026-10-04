// Meta WhatsApp Embedded Signup (v4) for Tech Providers, including WhatsApp Business app coexistence.
import { randomInt } from 'node:crypto'

export type EmbeddedSignupEnv = { appId: string; appSecret: string; configId: string; graphVersion: string }

export const embeddedSignupEnv = (env: NodeJS.ProcessEnv = process.env): EmbeddedSignupEnv => ({
  appId: String(env.WHATSAPP_APP_ID || env.META_APP_ID || '').trim(),
  appSecret: String(env.WHATSAPP_APP_SECRET || '').trim(),
  configId: String(env.WHATSAPP_EMBEDDED_SIGNUP_CONFIG_ID || '').trim(),
  graphVersion: String(env.WHATSAPP_EMBEDDED_SIGNUP_GRAPH_VERSION || 'v25.0').trim(),
})

export const embeddedSignupPublicConfig = (env = embeddedSignupEnv()) => {
  const enabled = Boolean(env.appId && env.appSecret && env.configId)
  return { enabled, appId: enabled ? env.appId : null, configId: enabled ? env.configId : null, graphVersion: env.graphVersion }
}

export type EmbeddedSignupInput = { code: string; event?: string; wabaId?: string; phoneNumberId?: string; businessId?: string }

export const parseEmbeddedSignupInput = (body: unknown): EmbeddedSignupInput => {
  const value = body && typeof body === 'object' ? body as Record<string, unknown> : {}
  const id = (key: string) => {
    const raw = String(value[key] ?? '').trim()
    if (raw && !/^\d{5,30}$/.test(raw)) throw Object.assign(new Error(`${key} is not a valid Meta ID.`), { status: 400 })
    return raw || undefined
  }
  const code = String(value.code ?? '').trim()
  if (!code || code.length > 2048) throw Object.assign(new Error('Meta did not return a sign-up code. Start the connection again.'), { status: 400 })
  const event = String(value.event ?? '').trim().toUpperCase()
  return { code, event: /^[A-Z_]{1,64}$/.test(event) ? event : undefined, wabaId: id('wabaId'), phoneNumberId: id('phoneNumberId'), businessId: id('businessId') }
}

export type GraphCall = (method: 'GET' | 'POST', path: string, options?: { token?: string; query?: Record<string, string>; body?: Record<string, unknown> }) => Promise<any>

export const createGraphCall = (graphVersion: string, fetcher: typeof fetch = fetch): GraphCall => async (method, path, options = {}) => {
  const url = new URL(`https://graph.facebook.com/${graphVersion}/${path.replace(/^\//, '')}`)
  for (const [key, value] of Object.entries(options.query || {})) url.searchParams.set(key, value)
  const response = await fetcher(url, {
    method,
    headers: { ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}), ...(options.body ? { 'Content-Type': 'application/json' } : {}) },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  const payload = await response.json().catch(() => ({})) as any
  if (!response.ok || payload?.error) {
    const message = payload?.error?.error_user_msg || payload?.error?.message || `Meta request failed with status ${response.status}`
    throw Object.assign(new Error(String(message)), { status: 502, metaCode: payload?.error?.code })
  }
  return payload
}

export type OnboardedPhone = { id: string; displayPhoneNumber: string | null; verifiedName: string | null; platformType: string | null; isOnBizApp: boolean }

export type EmbeddedSignupResult = {
  accessToken: string
  wabaId: string
  businessId: string | null
  phone: OnboardedPhone
  coexistence: boolean
  registered: boolean
  twoStepPin: string | null
}

const findWabaId = async (graph: GraphCall, env: EmbeddedSignupEnv, accessToken: string) => {
  const debug = await graph('GET', 'debug_token', { query: { input_token: accessToken, access_token: `${env.appId}|${env.appSecret}` } })
  const scopes: any[] = Array.isArray(debug?.data?.granular_scopes) ? debug.data.granular_scopes : []
  const targets = scopes.find((scope) => scope?.scope === 'whatsapp_business_management')?.target_ids
  return Array.isArray(targets) && targets.length ? String(targets[targets.length - 1]) : ''
}

export async function completeEmbeddedSignup(graph: GraphCall, env: EmbeddedSignupEnv, input: EmbeddedSignupInput, pin: () => string = () => String(randomInt(0, 1_000_000)).padStart(6, '0')): Promise<EmbeddedSignupResult> {
  if (!embeddedSignupPublicConfig(env).enabled) throw Object.assign(new Error('WhatsApp quick connect is not enabled yet. Use the manual setup guide.'), { status: 503 })
  const exchanged = await graph('GET', 'oauth/access_token', { query: { client_id: env.appId, client_secret: env.appSecret, code: input.code } })
  const accessToken = String(exchanged?.access_token || '')
  if (!accessToken) throw Object.assign(new Error('Meta did not return an access token. Start the connection again.'), { status: 502 })
  const wabaId = input.wabaId || await findWabaId(graph, env, accessToken)
  if (!wabaId) throw Object.assign(new Error('Meta did not share a WhatsApp Business Account. Start again and select your business account.'), { status: 400 })
  const listed = await graph('GET', `${wabaId}/phone_numbers`, { token: accessToken, query: { fields: 'id,display_phone_number,verified_name,platform_type,is_on_biz_app' } })
  const phones: OnboardedPhone[] = (Array.isArray(listed?.data) ? listed.data : []).map((phone: any) => ({
    id: String(phone.id), displayPhoneNumber: phone.display_phone_number ?? null, verifiedName: phone.verified_name ?? null, platformType: phone.platform_type ?? null, isOnBizApp: phone.is_on_biz_app === true,
  }))
  const appOnboarding = input.event === 'FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING'
  const candidates = appOnboarding ? phones.filter((item) => item.isOnBizApp) : phones
  const phone = input.phoneNumberId ? phones.find((item) => item.id === input.phoneNumberId) : candidates.length === 1 ? candidates[0] : undefined
  if (!phone) throw Object.assign(new Error(input.phoneNumberId ? 'That phone number does not belong to the WhatsApp Business Account you selected.' : 'Meta did not identify a single phone number. Start again and choose one number.'), { status: 400 })
  await graph('POST', `${wabaId}/subscribed_apps`, { token: accessToken })
  const coexistence = appOnboarding || phone.isOnBizApp
  let twoStepPin: string | null = null
  if (!coexistence) {
    twoStepPin = pin()
    await graph('POST', `${phone.id}/register`, { token: accessToken, body: { messaging_product: 'whatsapp', pin: twoStepPin } })
  }
  return { accessToken, wabaId, businessId: input.businessId || null, phone, coexistence, registered: !coexistence, twoStepPin }
}

export type SyncStep = { requestId: string | null; error: string | null; at: string }
export type CoexistenceSyncState = { onboardedAt: string; contacts?: SyncStep; history?: SyncStep }

export const COEXISTENCE_SYNC_WINDOW_MS = 24 * 60 * 60 * 1000

// Each sync may only succeed once, and only within 24 hours of onboarding.
export async function runCoexistenceSync(graph: GraphCall, accessToken: string, phoneNumberId: string, state: CoexistenceSyncState, now = new Date()): Promise<CoexistenceSyncState> {
  if (now.getTime() - new Date(state.onboardedAt).getTime() > COEXISTENCE_SYNC_WINDOW_MS) throw Object.assign(new Error('Meta only allows chat sync within 24 hours of connecting. New messages still arrive normally.'), { status: 409 })
  const next: CoexistenceSyncState = { ...state }
  for (const [key, syncType] of [['contacts', 'smb_app_state_sync'], ['history', 'history']] as const) {
    if (next[key]?.requestId) continue
    try {
      const response = await graph('POST', `${phoneNumberId}/smb_app_data`, { token: accessToken, body: { messaging_product: 'whatsapp', sync_type: syncType } })
      next[key] = { requestId: String(response?.request_id || 'accepted'), error: null, at: now.toISOString() }
    } catch (error) {
      next[key] = { requestId: null, error: error instanceof Error ? error.message : 'Sync request failed', at: now.toISOString() }
    }
  }
  return next
}
