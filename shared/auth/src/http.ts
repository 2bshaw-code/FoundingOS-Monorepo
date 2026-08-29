/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { AuthFailure, LoginSuccess } from './core.js'

export const authSuccess = (result: LoginSuccess) => ({ success: true as const, user: result.user, token: result.token, refreshToken: result.refreshToken })
export const authFailure = (message: string): AuthFailure => ({ success: false, message })

export const refreshCookie = {
  name: 'founder_os_refresh',
  options: (production: boolean) => ({ httpOnly: true, secure: production, sameSite: production ? 'none' as const : 'lax' as const, path: '/api/v1/auth', maxAge: 30 * 24 * 60 * 60 * 1000 }),
}

export const getDeviceFingerprint = (headers: Record<string, string | string[] | undefined>) => {
  const value = headers['x-device-fingerprint']
  return Array.isArray(value) ? value[0] || '' : value || ''
}