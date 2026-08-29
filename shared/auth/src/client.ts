/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { startAuthentication, startRegistration } from '@simplewebauthn/browser'

export interface ClientUser {
  id: string
  email: string
  role: string
  tenantId?: string
}

export interface ClientAuthSuccess {
  success: true
  user: ClientUser
  token: string
  accessToken: string
  refreshToken: string
}

export interface AuthClient {
  login(email: string, password: string): Promise<ClientAuthSuccess>
  refresh(): Promise<ClientAuthSuccess>
  logout(): Promise<void>
  request<T>(path: string, init?: RequestInit): Promise<T>
  getAccessToken(): string | null
  getRefreshToken(): string | null
  getUser(): ClientUser | null
  registerPasskey(): Promise<void>
  loginWithPasskey(email: string): Promise<ClientAuthSuccess>
}

export interface CreateAuthClientOptions {
  baseUrl: string
  authBaseUrl?: string
  founderAuthUrl?: string
  fallbackAuthUrl?: string
  founderEmail?: string
  storageKey: string
}

export type PendingPackageApplication = {
  app: 'foundretail' | 'foundcrypto' | 'foundit' | 'foundmeat' | 'foundtalent'
  plan: 'staff' | 'manager' | 'large' | 'recruiter' | 'trader' | 'operator' | 'vault' | 'buyer' | 'supplier' | 'business' | 'premium';
  businessName: string
  contactName: string
  email: string
  requirements: string
  phone?: string
  location?: string
  businessType?: string
}

export const storePendingApplication = (storageKey: string, application: PendingPackageApplication) => sessionStorage.setItem(`${storageKey}:pending-application`, JSON.stringify(application))

export const submitPendingApplication = async (storageKey: string, founderApiUrl: string, accessToken: string) => {
  const key = `${storageKey}:pending-application`
  const pending = sessionStorage.getItem(key)
  if (!pending) return null
  const response = await fetch(`${founderApiUrl.replace(/\/+$/, '')}/applications`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` }, body: pending })
  const body = await parseJson(response)
  sessionStorage.removeItem(key)
  return body
}

const parseJson = async (response: Response) => {
  const body = await response.json().catch(() => ({ success: false, message: 'Invalid server response' }))
  if (!response.ok || body.success === false) throw new Error(body.message || 'Authentication failed')
  return body
}

const normalizeSession = (result: Omit<ClientAuthSuccess, 'accessToken'> & { accessToken?: string }): ClientAuthSuccess => {
  const accessToken = result.accessToken || result.token
  if (!accessToken || !result.refreshToken) throw new Error('Authentication tokens missing')
  return { ...result, token: accessToken, accessToken }
}

const accessTokenIsValid = (token: string) => {
  try {
    const encodedPayload = token.split('.')[1]
    if (!encodedPayload) return false
    const payload = JSON.parse(atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/'))) as { exp?: number; type?: string }
    return payload.type === 'access' && typeof payload.exp === 'number' && payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

export const createAuthClient = ({ baseUrl, authBaseUrl, founderAuthUrl, fallbackAuthUrl, founderEmail = 'bobby@founder.master', storageKey }: CreateAuthClientOptions): AuthClient => {
  if (!baseUrl) throw new Error('VITE_API_URL is required')
  const root = baseUrl.replace(/\/+$/, '')
  const authRootBase = (authBaseUrl || founderAuthUrl || baseUrl).replace(/\/+$/, '')
  const passkeyRoot = (authBaseUrl || founderAuthUrl || baseUrl).replace(/\/+$/, '')
  const tokenKey = `${storageKey}:access-token`
  const refreshTokenKey = `${storageKey}:refresh-token`
  const userKey = `${storageKey}:user`
  const authRootKey = `${storageKey}:auth-root`
  const deviceKey = 'founder-os:device-fingerprint'
  let refreshInFlight: Promise<ClientAuthSuccess> | null = null

  const deviceFingerprint = () => {
    let fingerprint = localStorage.getItem(deviceKey)
    if (!fingerprint) {
      fingerprint = crypto.randomUUID()
      localStorage.setItem(deviceKey, fingerprint)
    }
    return fingerprint
  }

  const storeSession = (result: ClientAuthSuccess) => {
    localStorage.setItem(tokenKey, result.accessToken)
    localStorage.setItem(refreshTokenKey, result.refreshToken)
    localStorage.setItem(userKey, JSON.stringify(result.user))
  }

  const clearSession = () => {
    localStorage.removeItem(tokenKey)
    localStorage.removeItem(refreshTokenKey)
    localStorage.removeItem(userKey)
    localStorage.removeItem(authRootKey)
  }

  const authRequest = async (path: string, init: RequestInit = {}, authRoot = localStorage.getItem(authRootKey) || authRootBase) => fetch(`${authRoot}/auth${path}`, {
    ...init,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'X-Device-Fingerprint': deviceFingerprint(), ...(localStorage.getItem(refreshTokenKey) ? { 'X-Refresh-Token': localStorage.getItem(refreshTokenKey)! } : {}), ...init.headers },
  })

  const refresh = async () => {
    refreshInFlight ||= authRequest('/refresh', { method: 'POST', body: '{}' })
      .then(parseJson)
      .then((result) => normalizeSession(result))
      .then((result) => {
        storeSession(result)
        return result
      })
      .finally(() => { refreshInFlight = null })
    return refreshInFlight
  }

  const request = async <T>(path: string, init: RequestInit = {}, retry = true): Promise<T> => {
    const token = getAccessToken()
    const headers = new Headers(init.headers)
    if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
    if (token) headers.set('Authorization', `Bearer ${token}`)
    const response = await fetch(`${root}${path}`, {
      ...init,
      credentials: 'include',
      headers,
    })
    if (response.status === 401 && retry) {
      await refresh()
      return request<T>(path, init, false)
    }
    return parseJson(response) as Promise<T>
  }

  const getAccessToken = () => {
    const token = localStorage.getItem(tokenKey)
    if (token && accessTokenIsValid(token)) return token
    if (token) localStorage.removeItem(tokenKey)
    return null
  }

  return {
    async login(email, password) {
      const normalizedEmail = email.trim().toLowerCase()
      const loginRoot = normalizedEmail === founderEmail && founderAuthUrl
        ? founderAuthUrl.replace(/\/+$/, '')
        : authBaseUrl
          ? authBaseUrl.replace(/\/+$/, '')
          : root
      let activeRoot = loginRoot
      if (fallbackAuthUrl && activeRoot === root) {
        const lookup = await authRequest('/lookup', { method: 'POST', body: JSON.stringify({ email }) }, root)
        const identity = await lookup.json().catch(() => ({ local: true })) as { local?: boolean }
        if (identity.local === false) activeRoot = fallbackAuthUrl.replace(/\/+$/, '')
      }
      let response = await authRequest('/login', { method: 'POST', body: JSON.stringify({ email, password }) }, activeRoot)
      if (!response.ok && fallbackAuthUrl && activeRoot === root) {
        activeRoot = fallbackAuthUrl.replace(/\/+$/, '')
        response = await authRequest('/login', { method: 'POST', body: JSON.stringify({ email, password }) }, activeRoot)
      }
      const result = normalizeSession(await parseJson(response))
      localStorage.setItem(authRootKey, activeRoot)
      storeSession(result)
      return result
    },
    refresh,
    async logout() {
      try { await authRequest('/logout', { method: 'POST', body: '{}' }) } finally { clearSession() }
    },
    async registerPasskey() {
      const token = getAccessToken()
      if (!token) throw new Error('Sign in before registering a passkey')
      const options = await parseJson(await fetch(`${passkeyRoot}/passkeys/registration/options`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'X-Device-Fingerprint': deviceFingerprint() }, body: '{}' }))
      const response = await startRegistration({ optionsJSON: options.data })
      await parseJson(await fetch(`${passkeyRoot}/passkeys/registration/verify`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'X-Device-Fingerprint': deviceFingerprint() }, body: JSON.stringify({ response }) }))
    },
    async loginWithPasskey(email) {
      const normalizedEmail = email.trim().toLowerCase()
      if (!normalizedEmail) throw new Error('Enter your email before using a passkey')
      const options = await parseJson(await fetch(`${passkeyRoot}/passkeys/authentication/options`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Device-Fingerprint': deviceFingerprint() }, body: JSON.stringify({ email: normalizedEmail }) }))
      const response = await startAuthentication({ optionsJSON: options.data })
      const result = normalizeSession(await parseJson(await fetch(`${passkeyRoot}/passkeys/authentication/verify`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Device-Fingerprint': deviceFingerprint() }, body: JSON.stringify({ email: normalizedEmail, response }) })))
      localStorage.setItem(authRootKey, passkeyRoot)
      storeSession(result)
      return result
    },
    request,
    getAccessToken,
    getRefreshToken: () => localStorage.getItem(refreshTokenKey),
    getUser: () => {
      try { return JSON.parse(localStorage.getItem(userKey) || 'null') as ClientUser | null } catch { return null }
    },
  }
}