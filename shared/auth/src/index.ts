/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export const roles = {
  founderMaster: 'founder_master',
  retailManager: 'retail_manager',
  retailStaff: 'retail_staff',
  meatSupplier: 'meat_supplier',
  meatBuyer: 'meat_buyer',
  itIntelligence: 'it_intelligence',
  itDataOps: 'it_dataops',
  talentManager: 'talent_manager',
  recruiter: 'recruiter',
  applicant: 'applicant',
  workforceIntel: 'workforce_intel',
  cryptoTrader: 'crypto_trader',
  cryptoCharts: 'crypto_charts',
  cryptoTriggers: 'crypto_triggers',
  cryptoAutoExec: 'crypto_autoexec',
  cryptoPortfolio: 'crypto_portfolio',
  cryptoWhatsApp: 'crypto_whatsapp',
} as const

export type Role = (typeof roles)[keyof typeof roles]

export interface AuthIdentity {
  id: string
  email: string
  role: Role
  tenantId?: string
}

export const founderRoles = [roles.founderMaster] as const
const founderRoleSet = new Set<string>(founderRoles)
export const canAccessFounderOs = (identity: AuthIdentity) => founderRoleSet.has(identity.role)
export const canAccessTenant = (identity: AuthIdentity, tenantId: string) => founderRoleSet.has(identity.role) || identity.tenantId === tenantId

export * from './core.js'
export * from './http.js'
export * from './prisma.js'
export * from './express.js'
export * from './AuthWrapper.js'
export * from './ProtectedRoute.js'
export * from './AuthGuard.js'
