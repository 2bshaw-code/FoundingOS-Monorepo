/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { ConsoleIdentity } from '@foundingos/ui/console-identity'

/**
 * Declarative console identities for FoundCrypto. Does not change feature
 * flags or RBAC — see console-identity.ts for the contract.
 */
export const CONSOLE_IDENTITIES: ConsoleIdentity[] = [
  {
    id: 'crypto-kyc',
    brand: 'crypto',
    role: 'kyc',
    label: 'KYC Console',
    features: ['kyc', 'crm', 'messaging', 'quantum'],
    routes: ['/console/kyc', '/console'],
    landing: '/console/kyc',
  },
  {
    id: 'crypto-aml',
    brand: 'crypto',
    role: 'aml',
    label: 'AML Console',
    features: ['aml', 'messaging', 'quantum'],
    routes: ['/console/aml'],
    landing: '/console/aml',
  },
  {
    id: 'crypto-compliance',
    brand: 'crypto',
    role: 'compliance',
    label: 'Compliance Console',
    features: ['compliance', 'messaging'],
    routes: ['/console/compliance'],
    landing: '/console/compliance',
  },
]
