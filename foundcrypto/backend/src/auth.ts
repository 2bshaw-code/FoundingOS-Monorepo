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
export const merchantRoles = [roles.founderMaster, roles.cryptoTrader, roles.cryptoCharts, roles.cryptoTriggers, roles.cryptoAutoExec, roles.cryptoPortfolio, roles.cryptoWhatsApp]
const resetDelivery = process.env.PASSWORD_RESET_WEBHOOK_URL ? createPasswordResetWebhook(process.env.PASSWORD_RESET_WEBHOOK_URL, 'foundcrypto') : undefined
export const authRouter = createAuthRouter({ service: authService, production: process.env.NODE_ENV === 'production', allowedRoles: merchantRoles, deliverPasswordReset: resetDelivery })
export const requireMerchantAccess = createAccessMiddleware(authService, merchantRoles)
export const requireOwnerAccess = createAccessMiddleware(authService, [roles.founderMaster, roles.cryptoTrader, roles.cryptoCharts, roles.cryptoTriggers, roles.cryptoAutoExec, roles.cryptoPortfolio, roles.cryptoWhatsApp])

const ensureDefaultCryptoUser = async () => {
  const email = 'crypto.manager@foundcrypto.io'
  const passwordHash = await bcrypt.hash('Valid!Password2026', 12)
  await prisma.authUser.upsert({
    where: { email },
    create: { email, passwordHash, role: roles.cryptoTrader, active: true },
    update: { passwordHash, role: roles.cryptoTrader, active: true },
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

void Promise.all([ensureDefaultCryptoUser(), ensureDefaultFounderUser()]).catch((error) => {
  console.error('[auth] failed to seed crypto demo user', error)
})
