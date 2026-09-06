/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export type BrandSlug = 'foundingos' | 'retail' | 'meat' | 'foundthat' | 'talent' | 'crypto' | 'finance' | 'health' | 'logistics'
export { getQuantumBrandUplift, getQuantumBrandUpliftForDemo, QUANTUM_BRAND_UPLIFTS, MODULE_BRAND_UPLIFT, DEMO_BRAND_CARDS, type QuantumBrandUplift, type QuantumSphereVariant, type QuantumDemoBrandCard } from './quantum-brand-uplift'

export type BrandTypography = { heading: string; body: string }

export type BrandDefinition = {
  id?: BrandSlug
  slug: BrandSlug
  name: string
  default?: boolean
  legalName: string
  marketingName: string
  tagline: string
  description: string
  accent: string
  brandColors: { primary: string; accent: string }
  logo: string
  typography: BrandTypography
  socialHandle: string
  webUrl: string
  consoleUrl: string
  starterConsoleUrl: string
  dashboardUrl: string
  modules: string[]
  summary: string
  theme?: {
    background: string
    surface: string
    accent: string
    glow: string
    quantumLines: 'enabled'
  }
}

export const FOUNDINGOS_BASE = '#001B3D'
export const FOUNDINGOS_SURFACE = '#002455'
export const FOUNDINGOS_SURFACE_GRADIENT = 'linear-gradient(180deg, #002455 0%, #001B3D 100%)'
export const FOUNDINGOS_GLOW = 'rgba(76, 201, 255, 0.45)'

export const LOCKED_BRAND_COLORS: Record<BrandSlug, string> = {
  foundingos: '#4CC9FF',
  retail: '#00A651',
  meat: '#FF3B3B',
  foundthat: '#FFD300',
  talent: '#FF7A00',
  crypto: '#9D00FF',
  finance: '#A8A8A8',
  health: '#4FC3F7',
  logistics: '#DC143C',
}

const RAW_BRANDS: Record<BrandSlug, BrandDefinition> = {
  foundingos: {
    id: 'foundingos',
    slug: 'foundingos',
    name: 'FoundingOS',
    default: true,
    legalName: 'FoundingOS',
    marketingName: 'FoundingOS',
    tagline: 'One ecosystem. Every brand connected.',
    description: 'The core command layer for the multi-brand SaaS ecosystem — govern every brand website, console, and subscription from one place.',
    accent: LOCKED_BRAND_COLORS.foundingos,
    brandColors: { primary: FOUNDINGOS_BASE, accent: LOCKED_BRAND_COLORS.foundingos },
    theme: {
      background: FOUNDINGOS_BASE,
      surface: FOUNDINGOS_SURFACE_GRADIENT,
      accent: LOCKED_BRAND_COLORS.foundingos,
      glow: FOUNDINGOS_GLOW,
      quantumLines: 'enabled',
    },
    webUrl: process.env.NEXT_PUBLIC_FOUNDINGOS_WEB_URL || 'http://localhost:1000',
    consoleUrl: process.env.NEXT_PUBLIC_FOUNDINGOS_CONSOLE_URL || 'http://localhost:8000',
    starterConsoleUrl: process.env.NEXT_PUBLIC_FOUNDINGOS_CONSOLE_URL || 'http://localhost:8000',
    dashboardUrl: `${process.env.NEXT_PUBLIC_FOUNDINGOS_CONSOLE_URL || 'http://localhost:8000'}/console`,
    logo: '⌂',
    typography: { heading: 'Inter', body: 'Inter' },
    socialHandle: 'foundingos',
    modules: ['Brand Registry', 'Subscriptions', 'Activity', 'Access Control', 'Quantum', 'CRM', 'Billing', 'Deliveries', 'Advanced Marketing Suite'],
    summary: 'The core command layer for the multi-brand SaaS ecosystem.',
  },
  retail: {
    slug: 'retail',
    name: 'FoundRetail',
    legalName: 'FoundRetail',
    marketingName: 'FoundRetail',
    tagline: 'Retail operations, connected.',
    description: 'FoundRetail helps growing businesses guide product discovery, support customers, and manage messaging-first retail workflows with more clarity and less manual effort.',
    accent: LOCKED_BRAND_COLORS.retail,
    brandColors: { primary: LOCKED_BRAND_COLORS.retail, accent: LOCKED_BRAND_COLORS.retail },
    webUrl: process.env.NEXT_PUBLIC_RETAIL_WEB_URL || 'http://localhost:1001',
    consoleUrl: process.env.NEXT_PUBLIC_RETAIL_CONSOLE_URL || 'http://localhost:8017',
    starterConsoleUrl: process.env.NEXT_PUBLIC_RETAIL_CONSOLE_STARTER_URL || 'http://localhost:8001',
    dashboardUrl: `${process.env.NEXT_PUBLIC_RETAIL_CONSOLE_URL || 'http://localhost:8017'}/dashboard`,
    logo: '◉',
    typography: { heading: 'Inter', body: 'Inter' },
    socialHandle: 'foundretail',
    modules: ['Customers', 'Inventory', 'Orders', 'Products'],
    summary: 'Retail operations for catalogues, customers, orders, and teams.',
  },
  meat: {
    slug: 'meat',
    name: 'FoundMeat',
    legalName: 'FoundMeat',
    marketingName: 'FoundMeat',
    tagline: 'Supply chain clarity, cut to order.',
    description: 'Trade and supply chain operating software for meat businesses — suppliers, stock, traceability, and orders in one operating layer.',
    accent: LOCKED_BRAND_COLORS.meat,
    brandColors: { primary: LOCKED_BRAND_COLORS.meat, accent: LOCKED_BRAND_COLORS.meat },
    webUrl: process.env.NEXT_PUBLIC_MEAT_WEB_URL || 'http://localhost:1002',
    consoleUrl: process.env.NEXT_PUBLIC_MEAT_CONSOLE_URL || 'http://localhost:8018',
    starterConsoleUrl: process.env.NEXT_PUBLIC_MEAT_CONSOLE_STARTER_URL || 'http://localhost:8002',
    dashboardUrl: `${process.env.NEXT_PUBLIC_MEAT_CONSOLE_URL || 'http://localhost:8018'}/dashboard`,
    logo: '◆',
    typography: { heading: 'Inter', body: 'Inter' },
    socialHandle: 'foundmeat',
    modules: ['Suppliers', 'Stock', 'Traceability', 'Orders'],
    summary: 'Trade and supply chain operating software for meat businesses.',
  },
  talent: {
    slug: 'talent',
    name: 'FoundTalent',
    legalName: 'FoundTalent',
    marketingName: 'FoundTalent',
    tagline: 'Hiring intelligence, made human.',
    description: 'Hiring analytics and workforce intelligence for modern teams — applicants, recruiters, jobs, and workforce intel in one place.',
    accent: LOCKED_BRAND_COLORS.talent,
    brandColors: { primary: LOCKED_BRAND_COLORS.talent, accent: LOCKED_BRAND_COLORS.talent },
    webUrl: process.env.NEXT_PUBLIC_TALENT_WEB_URL || 'http://localhost:1004',
    consoleUrl: process.env.NEXT_PUBLIC_TALENT_CONSOLE_URL || 'http://localhost:8020',
    starterConsoleUrl: process.env.NEXT_PUBLIC_TALENT_CONSOLE_STARTER_URL || 'http://localhost:8004',
    dashboardUrl: `${process.env.NEXT_PUBLIC_TALENT_CONSOLE_URL || 'http://localhost:8020'}/dashboard`,
    logo: '⬢',
    typography: { heading: 'Inter', body: 'Inter' },
    socialHandle: 'foundtalent',
    modules: ['Applicants', 'Recruiters', 'Jobs', 'Workforce Intel'],
    summary: 'Hiring analytics and workforce intelligence for modern teams.',
  },
  crypto: {
    slug: 'crypto',
    name: 'FoundCrypto',
    legalName: 'FoundCrypto',
    marketingName: 'FoundCrypto',
    tagline: 'Market intelligence, always on.',
    description: 'Crypto intelligence, monitoring, and automation control — charts, signals, automation, and risk in one console.',
    accent: LOCKED_BRAND_COLORS.crypto,
    brandColors: { primary: LOCKED_BRAND_COLORS.crypto, accent: LOCKED_BRAND_COLORS.crypto },
    webUrl: process.env.NEXT_PUBLIC_CRYPTO_WEB_URL || 'http://localhost:1005',
    consoleUrl: process.env.NEXT_PUBLIC_CRYPTO_CONSOLE_URL || 'http://localhost:8021',
    starterConsoleUrl: process.env.NEXT_PUBLIC_CRYPTO_CONSOLE_STARTER_URL || 'http://localhost:8005',
    dashboardUrl: `${process.env.NEXT_PUBLIC_CRYPTO_CONSOLE_URL || 'http://localhost:8021'}/dashboard`,
    logo: '∞',
    typography: { heading: 'Inter', body: 'Inter' },
    socialHandle: 'foundcrypto',
    modules: ['Charts', 'Signals', 'Automation', 'Risk'],
    summary: 'Crypto intelligence, monitoring, and automation control.',
  },
  finance: {
    slug: 'finance',
    name: 'FoundFinance',
    legalName: 'FoundFinance',
    marketingName: 'FoundFinance',
    tagline: 'Cashflow clarity, every day.',
    description: 'Finance operations, cashflow visibility, and reconciliation tooling — invoicing, reconciliation, and reporting in one console.',
    accent: LOCKED_BRAND_COLORS.finance,
    brandColors: { primary: LOCKED_BRAND_COLORS.finance, accent: LOCKED_BRAND_COLORS.finance },
    webUrl: process.env.NEXT_PUBLIC_FINANCE_WEB_URL || 'http://localhost:1006',
    consoleUrl: process.env.NEXT_PUBLIC_FINANCE_CONSOLE_URL || 'http://localhost:8022',
    starterConsoleUrl: process.env.NEXT_PUBLIC_FINANCE_CONSOLE_STARTER_URL || 'http://localhost:8006',
    dashboardUrl: `${process.env.NEXT_PUBLIC_FINANCE_CONSOLE_URL || 'http://localhost:8022'}/dashboard`,
    logo: '£',
    typography: { heading: 'Inter', body: 'Inter' },
    socialHandle: 'foundfinance',
    modules: ['Cashflow', 'Invoicing', 'Reconciliation', 'Reporting'],
    summary: 'Finance operations, cashflow visibility, and reconciliation tooling.',
  },
  health: {
    slug: 'health',
    name: 'FoundHealth',
    legalName: 'FoundHealth',
    marketingName: 'FoundHealth',
    tagline: 'Care operations, coordinated.',
    description: 'Health operations, scheduling, and compliance tracking — patients, scheduling, records, and compliance in one console.',
    accent: LOCKED_BRAND_COLORS.health,
    brandColors: { primary: LOCKED_BRAND_COLORS.health, accent: LOCKED_BRAND_COLORS.health },
    webUrl: process.env.NEXT_PUBLIC_HEALTH_WEB_URL || 'http://localhost:1007',
    consoleUrl: process.env.NEXT_PUBLIC_HEALTH_CONSOLE_URL || 'http://localhost:8023',
    starterConsoleUrl: process.env.NEXT_PUBLIC_HEALTH_CONSOLE_STARTER_URL || 'http://localhost:8007',
    dashboardUrl: `${process.env.NEXT_PUBLIC_HEALTH_CONSOLE_URL || 'http://localhost:8023'}/dashboard`,
    logo: '✡',
    typography: { heading: 'Inter', body: 'Inter' },
    socialHandle: 'foundhealth',
    modules: ['Patients', 'Scheduling', 'Records', 'Compliance'],
    summary: 'Health operations, scheduling, and compliance tracking.',
  },
  logistics: {
    slug: 'logistics',
    name: 'FoundLogistics',
    legalName: 'FoundLogistics',
    marketingName: 'FoundLogistics',
    tagline: 'Fleet and freight, in flow.',
    description: 'Logistics operations, fleet tracking, and delivery orchestration — fleet, routes, warehousing, and deliveries in one console.',
    accent: LOCKED_BRAND_COLORS.logistics,
    brandColors: { primary: LOCKED_BRAND_COLORS.logistics, accent: LOCKED_BRAND_COLORS.logistics },
    webUrl: process.env.NEXT_PUBLIC_LOGISTICS_WEB_URL || 'http://localhost:1008',
    consoleUrl: process.env.NEXT_PUBLIC_LOGISTICS_CONSOLE_URL || 'http://localhost:8024',
    starterConsoleUrl: process.env.NEXT_PUBLIC_LOGISTICS_CONSOLE_STARTER_URL || 'http://localhost:8008',
    dashboardUrl: `${process.env.NEXT_PUBLIC_LOGISTICS_CONSOLE_URL || 'http://localhost:8024'}/dashboard`,
    logo: '▲',
    typography: { heading: 'Inter', body: 'Inter' },
    socialHandle: 'foundlogistics',
    modules: ['Fleet', 'Routes', 'Warehousing', 'Deliveries'],
    summary: 'Logistics operations, fleet tracking, and delivery orchestration.',
  },
  foundthat: {
    slug: 'foundthat',
    name: 'FoundThat',
    legalName: 'FoundThat',
    marketingName: 'FoundThat',
    tagline: 'Discovery intelligence, on demand.',
    description: 'Discovery intelligence and data operations for local markets — market intel, lead capture, and data quality in one console.',
    accent: LOCKED_BRAND_COLORS.foundthat,
    brandColors: { primary: LOCKED_BRAND_COLORS.foundthat, accent: LOCKED_BRAND_COLORS.foundthat },
    webUrl: process.env.NEXT_PUBLIC_FOUNDTHAT_WEB_URL || 'http://localhost:1003',
    consoleUrl: process.env.NEXT_PUBLIC_FOUNDTHAT_CONSOLE_URL || 'http://localhost:8019',
    starterConsoleUrl: process.env.NEXT_PUBLIC_FOUNDTHAT_CONSOLE_STARTER_URL || 'http://localhost:8003',
    dashboardUrl: `${process.env.NEXT_PUBLIC_FOUNDTHAT_CONSOLE_URL || 'http://localhost:8019'}/dashboard`,
    logo: '✦',
    typography: { heading: 'Inter', body: 'Inter' },
    socialHandle: 'foundthat',
    modules: ['Market Intel', 'Lead Capture', 'Data Quality', 'Reports'],
    summary: 'Discovery intelligence and data operations for local markets.',
  },
}

// Deployment safety net: these cross-app links (webUrl/consoleUrl/starterConsoleUrl/dashboardUrl)
// point at a DIFFERENT app/origin, so they need a real NEXT_PUBLIC_*_URL env var set per deployed
// app to work correctly in production. If a deployment forgets to set one, this wrapper avoids
// ever emitting a dead http://localhost:XXXX link in a production build — it falls back to a
// relative path instead. Local dev is completely unaffected.
//
// Deliberately keyed on process.env.NODE_ENV (inlined identically into both the server-rendered
// HTML and the client bundle at build time) rather than window.location.hostname — the latter
// would differ between the server render pass (no `window`) and the client hydration pass,
// causing a React hydration mismatch. NODE_ENV is consistent across both, so this is safe.
const CROSS_APP_URL_KEYS = new Set(['webUrl', 'consoleUrl', 'starterConsoleUrl', 'dashboardUrl'])

function isProductionBuild() {
  return process.env.NODE_ENV === 'production'
}

function toSafeUrl(value: string): string {
  if (!value.includes('localhost') || !isProductionBuild()) return value
  try {
    const parsed = new URL(value)
    return `${parsed.pathname}${parsed.search}${parsed.hash}` || '/'
  } catch {
    return '/'
  }
}

function wrapBrandUrls(definition: BrandDefinition): BrandDefinition {
  return new Proxy(definition, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver)
      if (typeof value === 'string' && CROSS_APP_URL_KEYS.has(String(prop))) return toSafeUrl(value)
      return value
    },
  })
}

export const brands: Record<BrandSlug, BrandDefinition> = Object.fromEntries(
  (Object.entries(RAW_BRANDS) as [BrandSlug, BrandDefinition][]).map(([slug, definition]) => [slug, wrapBrandUrls(definition)]),
) as Record<BrandSlug, BrandDefinition>

export const brandList = Object.values(brands)

export function getBrand(slug: BrandSlug) {
  return brands[slug]
}

// Geo-based currency/locale/accessibility formatting — shared across every brand website,
// console, and intelligence system (not just foundingos-console's founder section, which had
// its own equivalent, app-local copy of this same real logic). Client-side only
// (navigator/Intl), zero new dependencies, matches the existing real currency-mapping pattern.
const LOCALE_CURRENCY_MAP: Record<string, string> = {
  'en-GB': 'GBP', 'en-US': 'USD', 'en-ZA': 'ZAR', 'en-AU': 'AUD', 'en-CA': 'CAD',
  'en-NG': 'NGN', 'en-KE': 'KES', 'en-IN': 'INR', 'en-PH': 'PHP', 'en-GH': 'GHS',
  'pt-BR': 'BRL', 'es-MX': 'MXN', 'fr-FR': 'EUR', 'es-ES': 'EUR', 'ur-PK': 'PKR',
  default: 'USD',
}

// Regions this ecosystem explicitly targets for simplified, WhatsApp-style, fewer-words
// copy (lower-typical-bandwidth / low-end-device markets) — a short, honest, non-exhaustive
// starting set, not an exact market-research list.
const SIMPLIFIED_REGIONS = new Set(['NG', 'KE', 'IN', 'ZA', 'GH', 'PK', 'BD', 'PH'])

export function detectLocale(): string {
  if (typeof navigator === 'undefined') return 'en-US'
  return navigator.languages?.[0] || navigator.language || 'en-US'
}

export function regionForLocale(locale: string): string {
  try {
    return new Intl.Locale(locale).region || locale.split('-')[1] || 'US'
  } catch {
    return locale.split('-')[1] || 'US'
  }
}

export function currencyForLocale(locale: string): string {
  return LOCALE_CURRENCY_MAP[locale] || LOCALE_CURRENCY_MAP.default
}

export function formatCurrency(amount: number, locale?: string): string {
  const resolvedLocale = locale || detectLocale()
  try {
    return new Intl.NumberFormat(resolvedLocale, { style: 'currency', currency: currencyForLocale(resolvedLocale) }).format(amount)
  } catch {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }
}

export function formatLocaleNumber(amount: number, locale?: string): string {
  const resolvedLocale = locale || detectLocale()
  try {
    return new Intl.NumberFormat(resolvedLocale).format(amount)
  } catch {
    return new Intl.NumberFormat('en-US').format(amount)
  }
}

// Whether the detected/given locale is one of the regions this OS treats as needing simpler,
// WhatsApp-style copy — real signal any component can use to swap in a shorter label, not a
// claim of a fully translated experience.
export function isSimplifiedRegion(locale?: string): boolean {
  return SIMPLIFIED_REGIONS.has(regionForLocale(locale || detectLocale()))
}

// Minimal locale-string wrapper for UI labels: returns a real translation only if one is
// actually supplied, otherwise always falls back to the given English label. There are no real
// translated dictionaries anywhere in this codebase yet — this establishes the seam any caller
// can pass real translations through later without fabricating unverified translated text now.
export function t(englishLabel: string, translations?: Partial<Record<string, string>>, locale?: string): string {
  const resolvedLocale = locale || detectLocale()
  return translations?.[resolvedLocale] ?? translations?.[resolvedLocale.split('-')[0]] ?? englishLabel
}

// No-new-file client script covering the two things a server component genuinely cannot do
// with real navigator.language detection (the server has no navigator):
// 1. Reformats any element marked data-locale-number="<raw value>" (optionally
//    data-locale-currency="true") using the visitor's real locale/currency — for
//    server-rendered numeric tables (SuperDash/investor/BrandMetric-style displays).
// 2. Swaps any element marked data-simple-label="<short text>" to that shorter, WhatsApp-style
//    label when the visitor's region is one of SIMPLIFIED_REGIONS, and flags
//    documentElement[data-accessibility-simplified] so CSS can react (larger tap targets, etc).
// Embedded once per page via a plain <script> tag — same pattern as the narration player.
export const GLOBAL_ACCESSIBILITY_SCRIPT = `
(function () {
  function run() {
    var currencyMap = ${JSON.stringify(LOCALE_CURRENCY_MAP)};
    var simplifiedRegions = ${JSON.stringify(Array.from(SIMPLIFIED_REGIONS))};
    var locale = (navigator.languages && navigator.languages[0]) || navigator.language || 'en-US';
    var region = locale.split('-')[1] || '';
    try { region = (new Intl.Locale(locale)).region || region; } catch (e) {}
    var isSimplified = simplifiedRegions.indexOf(region) !== -1;

    var numberEls = document.querySelectorAll('[data-locale-number]');
    for (var i = 0; i < numberEls.length; i++) {
      var el = numberEls[i];
      var raw = Number(el.getAttribute('data-locale-number'));
      if (isNaN(raw)) continue;
      try {
        if (el.getAttribute('data-locale-currency') === 'true') {
          var currency = currencyMap[locale] || currencyMap['default'];
          el.textContent = new Intl.NumberFormat(locale, { style: 'currency', currency: currency }).format(raw);
        } else {
          el.textContent = new Intl.NumberFormat(locale).format(raw);
        }
      } catch (err) {}
    }

    if (isSimplified) {
      var simpleEls = document.querySelectorAll('[data-simple-label]');
      for (var j = 0; j < simpleEls.length; j++) {
        var simpleLabel = simpleEls[j].getAttribute('data-simple-label');
        if (simpleLabel) simpleEls[j].textContent = simpleLabel;
      }
      document.documentElement.setAttribute('data-accessibility-simplified', 'true');
    }
  }
  if (document.readyState === 'complete' || document.readyState === 'interactive') run();
  else document.addEventListener('DOMContentLoaded', run);
})();
`