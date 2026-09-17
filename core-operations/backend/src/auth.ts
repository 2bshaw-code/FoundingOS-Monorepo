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
export const merchantRoles = [roles.founderMaster, roles.retailManager, roles.retailStaff]
const resetDelivery = process.env.PASSWORD_RESET_WEBHOOK_URL ? createPasswordResetWebhook(process.env.PASSWORD_RESET_WEBHOOK_URL, 'core_operations') : undefined
export const authRouter = createAuthRouter({ service: authService, production: process.env.NODE_ENV === 'production', allowedRoles: merchantRoles, deliverPasswordReset: resetDelivery })
export const requireMerchantAccess = createAccessMiddleware(authService, merchantRoles)
export const requireOwnerAccess = createAccessMiddleware(authService, [roles.founderMaster, roles.retailManager])

const ensureDemoRetailUser = async () => {
  const email = process.env.DEMO_RETAIL_EMAIL || 'retail.manager@demo.local'
  const passwordHash = await bcrypt.hash(process.env.DEMO_RETAIL_PASSWORD || 'DemoOnly!2026', 12)
  await prisma.authUser.upsert({
    where: { email },
    create: { email, passwordHash, role: roles.retailManager, active: true },
    update: { passwordHash, role: roles.retailManager, active: true },
  })
}

const ensureDemoFounderUser = async () => {
  const email = process.env.DEMO_FOUNDER_EMAIL || 'founder@demo.local'
  const passwordHash = await bcrypt.hash(process.env.DEMO_FOUNDER_PASSWORD || 'DemoOnly!2026', 12)
  await prisma.authUser.upsert({
    where: { email },
    create: { email, passwordHash, role: roles.founderMaster, active: true },
    update: { passwordHash, role: roles.founderMaster, active: true },
  })
}

if (process.env.APP_MODE === 'demo') {
  void Promise.all([ensureDemoRetailUser(), ensureDemoFounderUser()]).catch((error) => {
    console.error('[auth] failed to seed Core Operations demo users', error)
  })
}
