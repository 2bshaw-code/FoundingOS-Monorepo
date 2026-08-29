/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import bcrypt from 'bcrypt'
import { AuthService, createAccessMiddleware, createAuthRouter, createPasswordResetWebhook, createPrismaAuthRepository, groupTokenContract, roles } from '@founder-os/auth'
import { PrismaClient } from './generated/prisma/index.js'

const required = (name: string) => {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is required`)
  return value
}

export const prisma = new PrismaClient()
export const authService = new AuthService(createPrismaAuthRepository(prisma), {
  accessTokenSecret: required('AUTH_ACCESS_TOKEN_SECRET'),
  refreshTokenSecret: required('AUTH_REFRESH_TOKEN_SECRET'),
  ...groupTokenContract,
})
export const foundMeatRoles = [roles.founderMaster, roles.meatSupplier, roles.meatBuyer]
const resetDelivery = process.env.PASSWORD_RESET_WEBHOOK_URL ? createPasswordResetWebhook(process.env.PASSWORD_RESET_WEBHOOK_URL, 'foundmeat') : undefined
export const authRouter = createAuthRouter({ service: authService, production: process.env.NODE_ENV === 'production', allowedRoles: foundMeatRoles, deliverPasswordReset: resetDelivery })
export const requireFoundMeatAccount = createAccessMiddleware(authService, foundMeatRoles)
export const requireTraderAccess = createAccessMiddleware(authService, [roles.founderMaster, roles.meatBuyer])
export const requireMeatOwnerAccess = createAccessMiddleware(authService, [roles.founderMaster, roles.meatSupplier])

const ensureDefaultMeatUser = async () => {
  const email = 'meat.manager@foundmeat.io'
  const passwordHash = await bcrypt.hash('Valid!Password2026', 12)
  await prisma.authUser.upsert({
    where: { email },
    create: { email, passwordHash, role: roles.meatSupplier, active: true },
    update: { passwordHash, role: roles.meatSupplier, active: true },
  })
}

const ensureDefaultFounderUser = async () => {
  const email = 'bobby@founder.master'
  const passwordHash = await bcrypt.hash('Valid!Password2026', 12)
  await prisma.authUser.upsert({
    where: { email },
    create: { email, passwordHash, role: roles.founderMaster, active: true },
    update: { passwordHash, role: roles.founderMaster, active: true },
  })
}

void Promise.all([ensureDefaultMeatUser(), ensureDefaultFounderUser()]).catch((error) => {
  console.error('[auth] failed to seed meat demo user', error)
})
