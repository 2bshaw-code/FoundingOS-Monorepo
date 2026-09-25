/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import bcrypt from 'bcrypt'
import { AuthService, createAccessMiddleware, createAuthRouter, createPasswordResetWebhook, createPrismaAuthRepository, groupTokenContract, roles } from '@foundingos/service-auth'
import { PrismaClient } from './generated/prisma/index.js'
import { workspaceSlugs } from './platform.js'

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
export const merchantRoles = [roles.founderMaster, roles.businessOwner, roles.businessManager, roles.businessStaff, roles.businessViewer, roles.retailManager, roles.retailStaff]
const resetDelivery = process.env.PASSWORD_RESET_WEBHOOK_URL ? createPasswordResetWebhook(process.env.PASSWORD_RESET_WEBHOOK_URL, 'core_operations') : undefined
export const authRouter = createAuthRouter({ service: authService, production: process.env.NODE_ENV === 'production', allowedRoles: merchantRoles, deliverPasswordReset: resetDelivery })
export const requireMerchantAccess = createAccessMiddleware(authService, merchantRoles)
export const requireOwnerAccess = createAccessMiddleware(authService, [roles.founderMaster, roles.businessOwner, roles.businessManager, roles.retailManager])
export const requireDecisionApprovalAccess = createAccessMiddleware(authService, [roles.founderMaster, roles.businessOwner, roles.businessManager, roles.retailManager])
export const requireExecutionAccess = createAccessMiddleware(authService, [roles.founderMaster, roles.businessOwner])
export const requireTenantOwnerAccess = createAccessMiddleware(authService, [roles.founderMaster, roles.businessOwner])

const ensureDemoRetailUser = async () => {
  const email = process.env.DEMO_RETAIL_EMAIL || 'retail.manager@demo.local'
  // Only hash/set a password when the account doesn't exist yet. Re-hashing and
  // overwriting passwordHash on every cold start/deploy silently reverted any
  // password reset (e.g. via the forgot-password flow) back to this fixed demo
  // value, making manual password changes look like they "didn't stick".
  const passwordHash = await bcrypt.hash(process.env.DEMO_RETAIL_PASSWORD || 'DemoOnly!2026', 12)
  await prisma.authUser.upsert({
    where: { email },
    create: { email, passwordHash, role: roles.retailManager, active: true },
    update: { role: roles.retailManager, active: true },
  })
}

// Seeds a real, working founder account (and a matching tenant) so the app's live
// business data, Actions Queue, and CRM/pipeline paths are actually reachable — a
// bare AuthUser row with no tenantId would sign in fine but show a permanently
// empty Command Deck, since every tenant-scoped query filters by tenantId.
const ensureDemoFounderUser = async () => {
  const email = process.env.DEMO_FOUNDER_EMAIL || 'founder@demo.local'
  // See ensureDemoRetailUser above: passwordHash must only be set on create, not
  // on every update, or any password reset for this account gets silently undone
  // the next time this seeder runs (every cold start while APP_MODE=demo).
  const passwordHash = await bcrypt.hash(process.env.DEMO_FOUNDER_PASSWORD || 'DemoOnly!2026', 12)
  const tenantId = process.env.DEMO_FOUNDER_TENANT_ID || 'demo-founder-tenant'
  const user = await prisma.authUser.upsert({
    where: { email },
    create: { email, passwordHash, role: roles.founderMaster, tenantId, active: true },
    update: { role: roles.founderMaster, active: true },
  })
  const resolvedTenantId = user.tenantId || tenantId
  await prisma.tenantOnboarding.upsert({
    where: { tenantId: resolvedTenantId },
    create: {
      tenantId: resolvedTenantId,
      businessName: process.env.DEMO_FOUNDER_BUSINESS_NAME || 'FoundingOS',
      ownerName: process.env.DEMO_FOUNDER_OWNER_NAME || 'Founder',
      goLiveStatus: 'live',
      completedSteps: { profile: true, billing: true, integrations: true },
      acceptedTermsAt: new Date(),
      completedAt: new Date(),
    },
    update: {},
  })
  // Every workspace (retail, logistics, finance, marketing, talent, health,
  // intelligence) must have an enabled TenantWorkspace row before its generic
  // module records endpoint (/platform/workspaces/:workspace/:module/records)
  // will serve this tenant — bootstrapTenant() does this for brand-new
  // sign-ups, but this seeded demo account predates that flow, so it needs
  // the same entitlements created explicitly here.
  await Promise.all(
    workspaceSlugs.map((workspace) =>
      prisma.tenantWorkspace.upsert({
        where: { tenantId_workspace: { tenantId: resolvedTenantId, workspace } },
        create: { tenantId: resolvedTenantId, workspace, enabled: true, plan: 'growth', modules: [] },
        update: { enabled: true },
      }),
    ),
  )
}

if (process.env.APP_MODE === 'demo') {
  void Promise.all([ensureDemoRetailUser(), ensureDemoFounderUser()]).catch((error) => {
    console.error('[auth] failed to seed Core Operations demo users', error)
  })
}
