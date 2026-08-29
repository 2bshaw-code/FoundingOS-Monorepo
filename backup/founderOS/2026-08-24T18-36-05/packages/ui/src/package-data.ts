export type BrandPackageSummary = { slug: string; name: string }

const packageCatalog: Record<string, BrandPackageSummary[]> = {
  FounderOS: [
    { slug: 'quantumos', name: 'QuantumOS' },
    { slug: 'intelligenceos', name: 'IntelligenceOS' },
    { slug: 'systemos', name: 'SystemOS' },
  ],
  FoundRetail: [
    { slug: 'standard', name: 'Standard' },
    { slug: 'pro', name: 'Pro' },
    { slug: 'enterprise', name: 'Enterprise' },
    { slug: 'owneros', name: 'OwnerOS' },
  ],
  FoundMeat: [
    { slug: 'butcheros', name: 'ButcherOS' },
    { slug: 'factoryos', name: 'FactoryOS' },
    { slug: 'distributionos', name: 'DistributionOS' },
  ],
  FoundIT: [
    { slug: 'supportos', name: 'SupportOS' },
    { slug: 'networkos', name: 'NetworkOS' },
    { slug: 'enterpriseos', name: 'EnterpriseOS' },
  ],
  FoundTalent: [
    { slug: 'recruiteros', name: 'RecruiterOS' },
    { slug: 'agencyos', name: 'AgencyOS' },
    { slug: 'hrproos', name: 'HRProOS' },
  ],
  FoundCrypto: [
    { slug: 'traderos', name: 'TraderOS' },
    { slug: 'investoros', name: 'InvestorOS' },
    { slug: 'whaleos', name: 'WhaleOS' },
  ],
}

export function packageCatalogForBrand(name: string) {
  return packageCatalog[name] ?? packageCatalog.FounderOS
}
