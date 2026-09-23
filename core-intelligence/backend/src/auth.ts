/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import bcrypt from 'bcrypt'
import { AuthService, createAccessMiddleware, createAuthRouter, createPasswordResetWebhook, createPrismaAuthRepository, groupTokenContract, roles } from '@foundingos/service-auth'
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
const resetDelivery = process.env.PASSWORD_RESET_WEBHOOK_URL ? createPasswordResetWebhook(process.env.PASSWORD_RESET_WEBHOOK_URL, 'core_intelligence') : undefined
export const authRouter = createAuthRouter({ service: authService, production: process.env.NODE_ENV === 'production', allowedRoles: marketplaceRoles, deliverPasswordReset: resetDelivery })
export const requireMarketplaceAccount = createAccessMiddleware(authService, marketplaceRoles)
export const requireMarketplaceMerchant = createAccessMiddleware(authService, [roles.founderMaster, roles.itDataOps])
export const requireMarketplaceOwner = createAccessMiddleware(authService, [roles.founderMaster, roles.itIntelligence])

const ensureDemoIntelligenceUser = async () => {
  const email = process.env.DEMO_INTELLIGENCE_EMAIL || 'intelligence.manager@demo.local'
  // passwordHash must only be set on create — see ensureDemoFounderUser below.
  const passwordHash = await bcrypt.hash(process.env.DEMO_INTELLIGENCE_PASSWORD || 'DemoOnly!2026', 12)
  await prisma.authUser.upsert({
    where: { email },
    create: { email, passwordHash, role: roles.itIntelligence, active: true },
    update: { role: roles.itIntelligence, active: true },
  })
}

const ensureDemoFounderUser = async () => {
  const email = process.env.DEMO_FOUNDER_EMAIL || 'founder@demo.local'
  // Only hash/set a password when the account doesn't exist yet. Re-hashing and
  // overwriting passwordHash on every cold start/deploy silently reverted any
  // password reset (e.g. via the forgot-password flow) back to this fixed demo
  // value, making manual password changes look like they "didn't stick".
  const passwordHash = await bcrypt.hash(process.env.DEMO_FOUNDER_PASSWORD || 'DemoOnly!2026', 12)
  await prisma.authUser.upsert({
    where: { email },
    create: { email, passwordHash, role: roles.founderMaster, active: true },
    update: { role: roles.founderMaster, active: true },
  })
}

if (process.env.APP_MODE === 'demo') {
  void Promise.all([ensureDemoIntelligenceUser(), ensureDemoFounderUser()]).catch((error) => {
    console.error('[auth] failed to seed Core Intelligence demo users', error)
  })
}
