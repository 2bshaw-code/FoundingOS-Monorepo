/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Demo-only currency simulation — used ONLY by the tester guided-demo walkthrough
// (/tester/demo/[moduleId], and the investor briefing which shares the same narrator-step
// system). Never imported by any real module (CRM, Subscriptions, the SuperDash scraping/
// pipeline dashboard, or any brand console's real pages) — those continue showing whatever
// plain numbers they already show, untouched. Pure, frontend-only, no backend calls, no
// persistence, no real FX data: every rate here is a fixed, clearly-labeled synthetic
// multiplier, not a live conversion.
export type DemoCurrencyCode = 'USD' | 'GBP' | 'EUR' | 'AUD' | 'CAD' | 'ZAR' | 'JPY' | 'CNY' | 'INR' | 'CHF' | 'SEK' | 'NOK' | 'MXN' | 'BRL' | 'SGD' | 'HKD'

type DemoCurrencyMeta = { code: DemoCurrencyCode; locale: string; name: string; syntheticRateFromUsd: number }

// Fixed, synthetic-only multipliers (NOT real FX rates — this is a demo simulation, never
// used for any real money calculation anywhere in the OS). Locale chosen only so
// Intl.NumberFormat renders each currency's normal symbol/grouping.
export const DEMO_CURRENCIES: DemoCurrencyMeta[] = [
  { code: 'USD', locale: 'en-US', name: 'US Dollar', syntheticRateFromUsd: 1 },
  { code: 'GBP', locale: 'en-GB', name: 'British Pound', syntheticRateFromUsd: 0.79 },
  { code: 'EUR', locale: 'de-DE', name: 'Euro', syntheticRateFromUsd: 0.92 },
  { code: 'AUD', locale: 'en-AU', name: 'Australian Dollar', syntheticRateFromUsd: 1.53 },
  { code: 'CAD', locale: 'en-CA', name: 'Canadian Dollar', syntheticRateFromUsd: 1.36 },
  { code: 'ZAR', locale: 'en-ZA', name: 'South African Rand', syntheticRateFromUsd: 18.4 },
  { code: 'JPY', locale: 'ja-JP', name: 'Japanese Yen', syntheticRateFromUsd: 149.5 },
  { code: 'CNY', locale: 'zh-CN', name: 'Chinese Yuan', syntheticRateFromUsd: 7.24 },
  { code: 'INR', locale: 'en-IN', name: 'Indian Rupee', syntheticRateFromUsd: 83.1 },
  { code: 'CHF', locale: 'de-CH', name: 'Swiss Franc', syntheticRateFromUsd: 0.88 },
  { code: 'SEK', locale: 'sv-SE', name: 'Swedish Krona', syntheticRateFromUsd: 10.4 },
  { code: 'NOK', locale: 'nb-NO', name: 'Norwegian Krone', syntheticRateFromUsd: 10.6 },
  { code: 'MXN', locale: 'es-MX', name: 'Mexican Peso', syntheticRateFromUsd: 17.0 },
  { code: 'BRL', locale: 'pt-BR', name: 'Brazilian Real', syntheticRateFromUsd: 5.4 },
  { code: 'SGD', locale: 'en-SG', name: 'Singapore Dollar', syntheticRateFromUsd: 1.34 },
  { code: 'HKD', locale: 'en-HK', name: 'Hong Kong Dollar', syntheticRateFromUsd: 7.82 },
]

function findCurrency(code: DemoCurrencyCode): DemoCurrencyMeta {
  return DEMO_CURRENCIES.find((c) => c.code === code) ?? DEMO_CURRENCIES[0]
}

// Real Intl.NumberFormat formatting (genuinely correct symbols/grouping per currency) applied
// to a synthetic amount — the formatting is real, the underlying number is demo-only.
export function formatDemoCurrency(amountUsd: number, code: DemoCurrencyCode): string {
  const currency = findCurrency(code)
  const converted = amountUsd * currency.syntheticRateFromUsd
  try {
    return new Intl.NumberFormat(currency.locale, { style: 'currency', currency: code, maximumFractionDigits: code === 'JPY' ? 0 : 2 }).format(converted)
  } catch {
    return `${code} ${converted.toFixed(2)}`
  }
}

// Deterministic (not random) "simulated locale" pick per module — same module always shows
// the same primary currency, so the demo feels consistent rather than flickering between
// reloads. This never touches real locale detection anywhere else in the OS.
export function pickDemoPrimaryCurrency(moduleId: string): DemoCurrencyCode {
  let hash = 0
  for (let i = 0; i < moduleId.length; i += 1) hash = (hash * 31 + moduleId.charCodeAt(i)) % DEMO_CURRENCIES.length
  return DEMO_CURRENCIES[Math.abs(hash) % DEMO_CURRENCIES.length].code
}

// One deterministic "synthetic scrape" value per module (a stand-in for the kind of number a
// real scraper might have returned) — same rules as every other synthetic value in this app:
// clearly demo-only, never presented as real.
export function syntheticDemoAmount(moduleId: string): number {
  let hash = 0
  for (let i = 0; i < moduleId.length; i += 1) hash = (hash * 17 + moduleId.charCodeAt(i)) % 97
  return 1200 + Math.abs(hash) * 42
}

export type DemoCurrencyPanelData = {
  moduleId: string
  amountUsd: number
  primary: { code: DemoCurrencyCode; name: string; formatted: string }
  secondary: Array<{ code: DemoCurrencyCode; name: string; formatted: string }>
}

// Builds the full primary + secondary display set for one module — 1 primary (simulated
// locale) + 3 secondary currencies, always including USD unless USD is already primary.
export function buildDemoCurrencyPanel(moduleId: string): DemoCurrencyPanelData {
  const amountUsd = syntheticDemoAmount(moduleId)
  const primaryCode = pickDemoPrimaryCurrency(moduleId)
  const primaryMeta = findCurrency(primaryCode)
  const secondaryCodes: DemoCurrencyCode[] = (primaryCode === 'USD' ? (['EUR', 'GBP', 'JPY'] as const) : (['USD', 'EUR', 'GBP'] as const)).filter((code) => code !== primaryCode).slice(0, 3)
  return {
    moduleId,
    amountUsd,
    primary: { code: primaryCode, name: primaryMeta.name, formatted: formatDemoCurrency(amountUsd, primaryCode) },
    secondary: secondaryCodes.map((code) => ({ code, name: findCurrency(code).name, formatted: formatDemoCurrency(amountUsd, code) })),
  }
}
