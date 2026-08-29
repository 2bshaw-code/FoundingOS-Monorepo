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
  founderEmail: 'bobby@founder.master',
})
export const founderRoles = [roles.founderMaster]
export const ecosystemRoles = [roles.founderMaster, roles.retailManager, roles.retailStaff, roles.meatSupplier, roles.meatBuyer, roles.itIntelligence, roles.itDataOps, roles.talentManager, roles.recruiter, roles.applicant, roles.workforceIntel, roles.cryptoTrader, roles.cryptoCharts, roles.cryptoTriggers, roles.cryptoAutoExec, roles.cryptoPortfolio, roles.cryptoWhatsApp]
const resetDelivery = process.env.PASSWORD_RESET_WEBHOOK_URL ? createPasswordResetWebhook(process.env.PASSWORD_RESET_WEBHOOK_URL, 'founder-os') : undefined
export const authRouter = createAuthRouter({ service: authService, production: process.env.NODE_ENV === 'production', allowedRoles: founderRoles, deliverPasswordReset: resetDelivery })
export const talentAuthRouter = createAuthRouter({ service: authService, production: process.env.NODE_ENV === 'production', allowedRoles: ecosystemRoles, deliverPasswordReset: resetDelivery })
export const requireFounderAccess = createAccessMiddleware(authService, founderRoles)
export const requireEcosystemAccess = createAccessMiddleware(authService, ecosystemRoles)

const ensureDefaultFounderUser = async () => {
  const email = 'bobby@founder.master'
  const passwordHash = await bcrypt.hash('Password123!', 12)
  await prisma.authUser.upsert({
    where: { email },
    create: { email, passwordHash, role: roles.founderMaster, active: true },
    update: { passwordHash, role: roles.founderMaster, active: true },
  })
}

const ensureDefaultTalentUser = async () => {
  const email = 'talent.manager@foundtalent.io'
  const passwordHash = await bcrypt.hash('Valid!Password2026', 12)
  await prisma.authUser.upsert({
    where: { email },
    create: { email, passwordHash, role: roles.talentManager, active: true },
    update: { passwordHash, role: roles.talentManager, active: true },
  })
}

void Promise.all([
  ensureDefaultFounderUser(),
  ensureDefaultTalentUser(),
]).catch((error) => {
  console.error('[auth] failed to seed default demo users', error)
})
