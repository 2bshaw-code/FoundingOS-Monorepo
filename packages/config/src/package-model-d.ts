/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { BrandSlug } from './index.ts'

// ---------------------------------------------------------------------------
// Package Model D — demo/front-end package catalog. No payment processor or
// live database is wired to this; activation is tracked client-side (see
// activation-state in @foundingos/ui/onboarding) for demo/prototype purposes.
// ---------------------------------------------------------------------------

export type BaseTierName = 'Starter' | 'Standard' | 'Premium' | 'Enterprise'

export type BaseTier = {
  name: BaseTierName
  price: string
  monthlyPrice: number
  description: string
  features: string[]
}

// SystemOS base tiers — the foundation every account starts on.
export const BASE_TIERS: BaseTier[] = [
  { name: 'Starter', price: '£29/mo', monthlyPrice: 29, description: 'A lean SystemOS setup for a single console and small team.', features: ['1 console', 'Core modules', 'Email support'] },
  { name: 'Standard', price: '£79/mo', monthlyPrice: 79, description: 'Room to grow — more consoles, more automation.', features: ['Up to 3 consoles', 'Core + workflow modules', 'Priority support'] },
  { name: 'Premium', price: '£159/mo', monthlyPrice: 159, description: 'Full SystemOS control for scaling teams.', features: ['Up to 8 consoles', 'All modules', 'Dedicated support', 'Advanced permissions'] },
  { name: 'Enterprise', price: 'Custom', monthlyPrice: 0, description: 'Tailored SystemOS for the full ecosystem.', features: ['Unlimited consoles', 'All modules', 'White-glove onboarding', 'Custom SLAs'] },
]

export type IndustryPack = {
  brand: BrandSlug
  name: string
  price: string
  monthlyPrice: number
  description: string
}

// Industry Packs — one per real ecosystem brand. The source request named 7 of
// the 8 real brands (FoundThat had no named pack); FoundThatOS is added here
// so every real brand has a corresponding pack, keeping this consistent with
// the actual 8-brand ecosystem rather than leaving one brand uncovered.
export const INDUSTRY_PACKS: IndustryPack[] = [
  { brand: 'retail', name: 'RetailOS', price: '£39/mo', monthlyPrice: 39, description: 'Inventory, orders, and customer workflows for retail.' },
  { brand: 'meat', name: 'MeatOS', price: '£39/mo', monthlyPrice: 39, description: 'Suppliers, stock, and traceability for meat trade.' },
  { brand: 'foundthat', name: 'FoundThatOS', price: '£39/mo', monthlyPrice: 39, description: 'Core operating workflows for FoundThat.' },
  { brand: 'talent', name: 'TalentOS', price: '£39/mo', monthlyPrice: 39, description: 'Applicant, recruiter, and workforce intelligence workflows.' },
  { brand: 'crypto', name: 'CryptoOS', price: '£49/mo', monthlyPrice: 49, description: 'Market signals, automation, and risk monitoring.' },
  { brand: 'finance', name: 'FinanceOS', price: '£49/mo', monthlyPrice: 49, description: 'Client, portfolio, and compliance workflows.' },
  { brand: 'health', name: 'HealthOS', price: '£45/mo', monthlyPrice: 45, description: 'Patient, appointment, and compliance workflows.' },
  { brand: 'logistics', name: 'LogisticsOS', price: '£45/mo', monthlyPrice: 45, description: 'Fleet, route, and delivery workflows.' },
]

export type HardwarePack = {
  slug: string
  name: string
  price: string
  monthlyPrice: number
  relevantBrands: BrandSlug[]
}

export const HARDWARE_PACKS: HardwarePack[] = [
  { slug: 'pos-terminals', name: 'POS Terminals', price: '£19/mo per unit', monthlyPrice: 19, relevantBrands: ['retail', 'meat'] },
  { slug: 'qr-menus', name: 'QR Menus', price: '£9/mo per location', monthlyPrice: 9, relevantBrands: ['retail', 'meat'] },
  { slug: 'inventory-scanners', name: 'Inventory Scanners', price: '£15/mo per unit', monthlyPrice: 15, relevantBrands: ['retail', 'meat', 'logistics'] },
  { slug: 'crypto-hardware-wallets', name: 'Crypto Hardware Wallets', price: '£25/mo per unit', monthlyPrice: 25, relevantBrands: ['crypto'] },
  { slug: 'fleet-trackers', name: 'Fleet Trackers', price: '£12/mo per vehicle', monthlyPrice: 12, relevantBrands: ['logistics'] },
  { slug: 'health-tablets', name: 'Health Tablets', price: '£22/mo per unit', monthlyPrice: 22, relevantBrands: ['health'] },
]

export type PricingModel = 'A' | 'B' | 'C'

export const PRICING_MODEL_LABELS: Record<PricingModel, string> = {
  A: 'Flat pricing',
  B: 'Tier-dependent pricing',
  C: 'Usage-based pricing',
}
