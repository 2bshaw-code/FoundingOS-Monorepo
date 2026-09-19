/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
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

export const workforceRoles = [
  roles.founderMaster,
  roles.businessOwner,
  roles.businessManager,
  roles.businessStaff,
  roles.businessViewer,
  roles.talentManager,
  roles.recruiter,
  roles.workforceIntel,
]

const resetDelivery = process.env.PASSWORD_RESET_WEBHOOK_URL
  ? createPasswordResetWebhook(process.env.PASSWORD_RESET_WEBHOOK_URL, 'core_workforce')
  : undefined

export const authRouter = createAuthRouter({
  service: authService,
  production: process.env.NODE_ENV === 'production',
  allowedRoles: workforceRoles,
  deliverPasswordReset: resetDelivery,
})

export const requireWorkforceAccess = createAccessMiddleware(authService, workforceRoles)
export const requireDecisionApprovalAccess = createAccessMiddleware(authService, [
  roles.founderMaster,
  roles.businessOwner,
  roles.businessManager,
  roles.talentManager,
  roles.workforceIntel,
])
export const requireExecutionAccess = createAccessMiddleware(authService, [
  roles.founderMaster,
  roles.businessOwner,
  roles.talentManager,
])
