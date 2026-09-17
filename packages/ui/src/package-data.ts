/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export type BrandPackageSummary = { slug: string; name: string }

const packageCatalog: Record<string, BrandPackageSummary[]> = {
  FoundingOS: [
    { slug: 'quantumos', name: 'QuantumOS' },
    { slug: 'intelligenceos', name: 'IntelligenceOS' },
    { slug: 'systemos', name: 'SystemOS' },
  ],
  'Core.Operations': [
    { slug: 'standard', name: 'Standard' },
    { slug: 'pro', name: 'Pro' },
    { slug: 'enterprise', name: 'Enterprise' },
    { slug: 'owneros', name: 'OwnerOS' },
  ],
  'Core.Intelligence': [
    { slug: 'supportos', name: 'SupportOS' },
    { slug: 'networkos', name: 'NetworkOS' },
    { slug: 'enterpriseos', name: 'EnterpriseOS' },
  ],
  'Core.Workforce': [
    { slug: 'recruiteros', name: 'RecruiterOS' },
    { slug: 'agencyos', name: 'AgencyOS' },
    { slug: 'hrproos', name: 'HRProOS' },
  ],
}

export function packageCatalogForBrand(name: string) {
  return packageCatalog[name] ?? packageCatalog.FoundingOS
}
