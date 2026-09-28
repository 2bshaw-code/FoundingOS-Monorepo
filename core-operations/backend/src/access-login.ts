/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { randomBytes } from 'node:crypto'
import type { NextFunction, Request, Response } from 'express'
import { accessCodeRole, authService, hasInvestorAccess, INVESTOR_GRANT_ACTION, isReservedFounderEmail, prisma } from './auth.js'
import { PREVIEW_BUSINESS_NAME, TESTER_BUSINESS_NAME } from './founder.js'
import { bootstrapTenant } from './platform.js'

const httpError = (message: string, status: number) => Object.assign(new Error(message), { status })

// Signs in someone holding an admin/investor or tester code, creating their account the first
// time. Investors are also granted the view-only founder SuperDash.
export async function accessCodeSession(input: { email: string; role: 'investor' | 'tester'; via: string; deviceFingerprint: string; ipAddress?: string }) {
  const { email, role } = input
  if (isReservedFounderEmail(email)) throw httpError('Sign in with your founder password.', 403)
  if (!input.deviceFingerprint) throw httpError('Device fingerprint is required', 400)
  let user = await prisma.authUser.findUnique({ where: { email } })
  if (!user) {
    await bootstrapTenant({ email, password: randomBytes(24).toString('base64url'), businessName: role === 'tester' ? TESTER_BUSINESS_NAME : PREVIEW_BUSINESS_NAME, ownerName: email.split('@')[0], plan: 'growth' })
    user = await prisma.authUser.findUnique({ where: { email } })
  }
  if (!user?.active) throw httpError('This account is not active.', 403)
  if (role === 'investor' && !(await hasInvestorAccess({ id: user.id, email }))) {
    await prisma.workspaceAuditEvent.create({ data: { tenantId: user.tenantId || 'platform', actorId: user.id, action: INVESTOR_GRANT_ACTION, metadata: { email, via: input.via } } })
  }
  const session = await authService.loginWithVerifiedIdentity(email, { deviceFingerprint: input.deviceFingerprint, ipAddress: input.ipAddress })
  return { success: true as const, user: session.user, token: session.token, refreshToken: session.refreshToken }
}

// Runs before the normal /auth/login so admins and testers can type their code into any
// "Sign in" box (website, SuperDash, app) as their password. Real passwords fall through.
export async function accessCodeLoginFallback(req: Request, res: Response, next: NextFunction) {
  try {
    const email = String(req.body?.email ?? '').trim().toLowerCase()
    if (!email || isReservedFounderEmail(email)) return next()
    const role = accessCodeRole(req.body?.password)
    if (!role) return next()
    res.json(await accessCodeSession({ email, role, via: 'sign-in', deviceFingerprint: String(req.header('x-device-fingerprint') || ''), ipAddress: req.ip }))
  } catch (error) { next(error) }
}
