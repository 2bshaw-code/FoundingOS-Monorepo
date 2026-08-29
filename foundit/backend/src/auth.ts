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
export const marketplaceRoles = [roles.founderMaster, roles.itIntelligence, roles.itDataOps]
const resetDelivery = process.env.PASSWORD_RESET_WEBHOOK_URL ? createPasswordResetWebhook(process.env.PASSWORD_RESET_WEBHOOK_URL, 'foundit') : undefined
export const authRouter = createAuthRouter({ service: authService, production: process.env.NODE_ENV === 'production', allowedRoles: marketplaceRoles, deliverPasswordReset: resetDelivery })
export const requireMarketplaceAccount = createAccessMiddleware(authService, marketplaceRoles)
export const requireMarketplaceMerchant = createAccessMiddleware(authService, [roles.founderMaster, roles.itDataOps])
export const requireMarketplaceOwner = createAccessMiddleware(authService, [roles.founderMaster, roles.itIntelligence])

const ensureDefaultFoundThisUser = async () => {
  const email = 'it.manager@foundit.io'
  const passwordHash = await bcrypt.hash('Valid!Password2026', 12)
  await prisma.authUser.upsert({
    where: { email },
    create: { email, passwordHash, role: roles.itIntelligence, active: true },
    update: { passwordHash, role: roles.itIntelligence, active: true },
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

void Promise.all([ensureDefaultFoundThisUser(), ensureDefaultFounderUser()]).catch((error) => {
  console.error('[auth] failed to seed foundit demo user', error)
})
