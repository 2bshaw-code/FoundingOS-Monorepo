/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import bcrypt from 'bcrypt'
import { scryptSync, timingSafeEqual } from 'node:crypto'
import { AuthService, createAccessMiddleware, createAuthRouter, createPasswordResetWebhook, createPrismaAuthRepository, groupTokenContract, roles } from '@foundingos/service-auth'
import { PrismaClient } from './generated/prisma/index.js'
import { workspaceSlugs } from './platform.js'

const required = (name: string) => {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is required`)
  return value
}

// Every serverless instance opens its own pool, so the default pool size (cpus * 2 + 1) multiplied
// by the instances a busy minute creates exhausts the database's connection limit and turns
// ordinary reads into 500s. One connection per instance is plenty for request-scoped queries.
const pooledDatabaseUrl = () => {
  const url = process.env.DATABASE_URL
  if (!url || !/^postgres(ql)?:\/\//.test(url)) return undefined
  try {
    const parsed = new URL(url)
    if (!parsed.searchParams.has('connection_limit')) parsed.searchParams.set('connection_limit', '1')
    if (!parsed.searchParams.has('pool_timeout')) parsed.searchParams.set('pool_timeout', '20')
    return parsed.toString()
  } catch {
    return undefined
  }
}

const prismaCache = globalThis as unknown as { foundingosPrisma?: PrismaClient }
const datasourceUrl = pooledDatabaseUrl()
export const prisma = prismaCache.foundingosPrisma ?? (datasourceUrl ? new PrismaClient({ datasourceUrl }) : new PrismaClient())
prismaCache.foundingosPrisma = prisma
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
// The demo founder address only counts when the demo seeder actually owns it.
const founderEmails = () => new Set([process.env.FOUNDER_EMAILS, process.env.APP_MODE === 'demo' ? process.env.DEMO_FOUNDER_EMAIL : ''].filter(Boolean).join(',').split(',').map((email) => email.trim().toLowerCase()).filter(Boolean))
// Founder addresses can never be claimed through public signup or team invitations.
export const isReservedFounderEmail = (email: string) => founderEmails().has(email.trim().toLowerCase())
// The platform owner: the founder_master role, or an existing account listed in FOUNDER_EMAILS.
export const isFounderIdentity = (identity?: { role?: string; email?: string }) =>
  identity?.role === roles.founderMaster || founderEmails().has(String(identity?.email || '').toLowerCase())
// Investors listed in INVESTOR_EMAILS get the read-only SuperDash preview with example figures; no founder data or routes.
const investorEmails = () => new Set(String(process.env.INVESTOR_EMAILS || '').split(',').map((email) => email.trim().toLowerCase()).filter(Boolean))
export const isInvestorIdentity = (identity?: { email?: string }) => investorEmails().has(String(identity?.email || '').toLowerCase())

// Access codes are held as `role:scrypt$<saltHex>$<hashHex>` entries joined by `;`.
// INVESTOR_ACCESS_HASH entries prefixed `partner:` give full founder access (trusted partners);
// `investor:` (or unprefixed) entries give the view-only SuperDash. TESTER_ACCESS_HASH entries
// sign people in to an ordinary workspace.
export const INVESTOR_GRANT_ACTION = 'investor.access_granted'
export const PARTNER_GRANT_ACTION = 'partner.access_granted'
export type AccessCodeRole = 'partner' | 'investor' | 'tester'
const matchingCodeRoles = (configured: string | undefined, code: unknown) => {
  const candidate = String(code ?? '').trim()
  if (!candidate || candidate.length > 200) return []
  // Every entry is checked (no short-circuit) so timing does not reveal which one matched.
  return String(configured || '').split(';').map((entry) => entry.trim()).filter(Boolean).flatMap((entry) => {
    const prefixed = /^([a-z]+):(scrypt\$.*)$/.exec(entry)
    const [prefix, hash] = prefixed ? [prefixed[1], prefixed[2]] : ['investor', entry]
    const [scheme, saltHex, hashHex] = hash.split('$')
    if (scheme !== 'scrypt' || !saltHex || !hashHex) return []
    const expected = Buffer.from(hashHex, 'hex')
    const actual = scryptSync(candidate, Buffer.from(saltHex, 'hex'), expected.length)
    return expected.length > 0 && timingSafeEqual(actual, expected) ? [prefix] : []
  })
}
export const accessCodeRole = (code: unknown): AccessCodeRole | null => {
  const matches = matchingCodeRoles(process.env.INVESTOR_ACCESS_HASH, code)
  const tester = matchingCodeRoles(process.env.TESTER_ACCESS_HASH, code).length > 0
  return matches.includes('partner') ? 'partner' : matches.length ? 'investor' : tester ? 'tester' : null
}
export const verifyInvestorCode = (code: unknown) => {
  const role = accessCodeRole(code)
  return role === 'partner' || role === 'investor'
}
export const hasInvestorAccess = async (identity?: { id?: string; email?: string }) => {
  if (isInvestorIdentity(identity)) return true
  if (!identity?.id) return false
  return Boolean(await prisma.workspaceAuditEvent.findFirst({ where: { actorId: identity.id, action: INVESTOR_GRANT_ACTION }, select: { id: true } }))
}
const verifyAny = createAccessMiddleware(authService)
export const requireFounderAccess = (req: Parameters<typeof verifyAny>[0], res: Parameters<typeof verifyAny>[1], next: Parameters<typeof verifyAny>[2]) =>
  verifyAny(req, res, () => (isFounderIdentity(res.locals.auth) ? next() : res.status(403).json({ success: false, message: 'Founder access only' })))
export const requireSignedIn = verifyAny
// SuperDash is readable by the founder and by admins/investors unlocked with an access code;
// every change (ledger, posts, switching tenant workspaces) stays founder-only.
export const requireFounderOrInvestorRead = (req: Parameters<typeof verifyAny>[0], res: Parameters<typeof verifyAny>[1], next: Parameters<typeof verifyAny>[2]) =>
  verifyAny(req, res, () => {
    if (isFounderIdentity(res.locals.auth)) return next()
    hasInvestorAccess(res.locals.auth).then((allowed) => (allowed ? next() : res.status(403).json({ success: false, message: 'Founder access only' })), next)
  })

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
