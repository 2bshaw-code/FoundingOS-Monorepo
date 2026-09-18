'use client'

export type ProductionUser = { id: string; email: string; role: string; tenantId?: string }
export type ProductionSession = { accessToken: string; refreshToken: string; user: ProductionUser }
export type ProductionWorkspaceRecord = {
  id: string
  reference: string
  name: string
  status: string
  ownerId?: string | null
  valuePence?: number | null
  data: Record<string, unknown>
  version: number
  updatedAt: string
}

const SESSION_KEY = 'foundingos-platform-session-v1'
const configuredRoot = process.env.NEXT_PUBLIC_FOUNDINGOS_API_URL
  || process.env.NEXT_PUBLIC_CORE_OPERATIONS_API_URL?.replace(/\/ops\/?$/, '')
  || ''

export const productionModeEnabled = process.env.NEXT_PUBLIC_APP_MODE === 'production'
export const productionApiConfigured = Boolean(configuredRoot)

const apiRoot = () => {
  if (!configuredRoot) throw new Error('NEXT_PUBLIC_FOUNDINGOS_API_URL is required in production')
  return configuredRoot.replace(/\/+$/, '')
}

const readBody = async (response: Response) => {
  const body = await response.json().catch(() => ({ success: false, message: 'Invalid server response' })) as { success?: boolean; message?: string; data?: unknown }
  if (!response.ok || body.success === false) throw new Error(body.message || `Request failed with status ${response.status}`)
  return body
}

export const getProductionSession = (): ProductionSession | null => {
  if (typeof window === 'undefined') return null
  const stored = window.localStorage.getItem(SESSION_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored) as ProductionSession
  } catch {
    window.localStorage.removeItem(SESSION_KEY)
    return null
  }
}

const saveSession = (session: ProductionSession | null) => {
  if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  else window.localStorage.removeItem(SESSION_KEY)
}

export async function loginToProduction(email: string, password: string) {
  const response = await fetch(`${apiRoot()}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'X-Device-Fingerprint': crypto.randomUUID() },
    body: JSON.stringify({ email, password }),
  })
  const body = await readBody(response) as { accessToken?: string; token?: string; refreshToken?: string; user?: ProductionUser }
  const accessToken = body.accessToken || body.token
  if (!accessToken || !body.refreshToken || !body.user) throw new Error('Authentication response did not include a complete session')
  const session = { accessToken, refreshToken: body.refreshToken, user: body.user }
  saveSession(session)
  return session
}

export async function bootstrapProduction(input: Record<string, unknown>, bootstrapToken: string) {
  const response = await fetch(`${apiRoot()}/ops/platform/bootstrap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Bootstrap-Token': bootstrapToken },
    body: JSON.stringify(input),
  })
  return readBody(response)
}

export async function logoutProduction() {
  const session = getProductionSession()
  try {
    if (session) await fetch(`${apiRoot()}/auth/logout`, { method: 'POST', credentials: 'include', headers: { 'X-Refresh-Token': session.refreshToken } })
  } finally {
    saveSession(null)
  }
}

async function refreshSession(session: ProductionSession) {
  const response = await fetch(`${apiRoot()}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'X-Refresh-Token': session.refreshToken, 'X-Device-Fingerprint': crypto.randomUUID() },
    body: '{}',
  })
  const body = await readBody(response) as { accessToken?: string; token?: string; refreshToken?: string; user?: ProductionUser }
  const accessToken = body.accessToken || body.token
  if (!accessToken || !body.refreshToken || !body.user) throw new Error('Session refresh failed')
  const refreshed = { accessToken, refreshToken: body.refreshToken, user: body.user }
  saveSession(refreshed)
  return refreshed
}

export async function productionRequest<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const session = getProductionSession()
  if (!session) throw new Error('Sign in to continue')
  const headers = new Headers(init.headers)
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  headers.set('Authorization', `Bearer ${session.accessToken}`)
  const response = await fetch(`${apiRoot()}/ops${path}`, { ...init, credentials: 'include', headers })
  if (response.status === 401 && retry) {
    await refreshSession(session)
    return productionRequest<T>(path, init, false)
  }
  const body = await readBody(response) as { data: T }
  return body.data
}

export const productionRecords = {
  list: (workspace: string, module: string) => productionRequest<ProductionWorkspaceRecord[]>(`/platform/workspaces/${workspace}/${module}/records`),
  create: (workspace: string, module: string, input: Record<string, unknown>) => productionRequest<ProductionWorkspaceRecord>(`/platform/workspaces/${workspace}/${module}/records`, { method: 'POST', headers: { 'Idempotency-Key': crypto.randomUUID() }, body: JSON.stringify(input) }),
  update: (id: string, input: Record<string, unknown>) => productionRequest<ProductionWorkspaceRecord>(`/platform/records/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),
}
