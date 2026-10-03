import { objectAt, textAt } from './pro/shared'
import type { ProductionWorkspaceRecord } from './workspace-production-client'

export type LegalArea = 'subscriptions' | 'privacy' | 'markets' | 'company'
export const legalAreas: Array<[LegalArea, string]> = [
  ['subscriptions', 'Subscription readiness'], ['privacy', 'Privacy & data'],
  ['markets', 'Country launch reviews'], ['company', 'Company obligations'],
]
export const legalObligations: Array<{ id: string; area: LegalArea; title: string; review: string }> = [
  { id: 'subscription-terms', area: 'subscriptions', title: 'Customer subscription agreement', review: 'Identify the UK seller and customer, B2B or consumer scope, plan features, seats, currency, taxes, billing frequency and governing law. Have liability, warranties, dispute resolution and local mandatory rights reviewed.' },
  { id: 'renewals', area: 'subscriptions', title: 'Renewals, cancellations & refunds', review: 'Review auto-renewal disclosures, price-change notices, cancellation route, refunds, failed-payment handling, suspension and data export/deletion after termination. Test the actual checkout and cancellation experience.' },
  { id: 'acceptance', area: 'subscriptions', title: 'Versioned terms acceptance', review: 'Retain the terms version, accepting business/person, authority, timestamp and acceptance evidence. A paid or active account is not evidence of accepted terms; this dashboard does not yet verify checkout acceptance.' },
  { id: 'service-scope', area: 'subscriptions', title: 'AI, messaging & service commitments', review: 'Define acceptable use, AI limitations and human review, support/service commitments, and third-party WhatsApp/Telegram/payment dependencies. Check provider terms and opt-in rules; do not promise unavailable functionality.' },
  { id: 'privacy-notices', area: 'privacy', title: 'Privacy, cookies & marketing permissions', review: 'Map customer, staff and messaging data; review privacy notices, lawful bases, retention, cookies, marketing opt-ins and suppression. Assess ICO registration/fee and whether additional local notices are needed.' },
  { id: 'processors', area: 'privacy', title: 'Data processing & international transfers', review: 'Document controller/processor roles, customer DPA, subprocessors, hosting and AI-provider access. Review UK restricted transfers and destination-country requirements with appropriate safeguards and risk assessments where applicable.' },
  { id: 'security-response', area: 'privacy', title: 'Security, rights requests & incidents', review: 'Assign responsibility for access/deletion requests, security controls, retention/deletion and breach response. Record applicable notification deadlines by jurisdiction; test the response process rather than assume compliance.' },
  { id: 'local-privacy', area: 'markets', title: 'Country privacy & regulatory review', review: 'For one named country, confirm applicable privacy law, commencement dates, registration/representation, cross-border processing and any sector-specific restrictions. India needs its own DPDP review; each African country needs its own assessment.' },
  { id: 'local-tax', area: 'markets', title: 'Country tax, payments & invoicing', review: 'Ask a tax adviser to review VAT/GST or digital-service taxes, withholding, registration thresholds, invoicing, payment/currency rules and UK treatment for this country and customer type. Do not assume one tax rule across Africa.' },
  { id: 'local-contract', area: 'markets', title: 'Country contract & launch decision', review: 'Review enforceability, mandatory customer rights, language, e-signature, complaints and dispute routes. Assess sanctions/export restrictions and local representation if relevant. Record a named adviser and the exact scope before launch.' },
  { id: 'company-filings', area: 'company', title: 'UK company filings & tax calendar', review: 'Record the actual legal entity, registered details, Companies House accounts/confirmation statement, identity-verification duties where applicable, Corporation Tax and VAT/PAYE obligations. Set deadlines from the company records, not generic dates.' },
  { id: 'ip-people', area: 'company', title: 'IP ownership, people & supplier agreements', review: 'Check founder/contractor IP assignments, open-source licences, trademarks, NDAs, employment/contractor agreements and supplier terms. Keep evidence ready for a buyer without exposing secrets.' },
  { id: 'insurance', area: 'company', title: 'Insurance, complaints & legal ownership', review: 'Assign legal/compliance owners, review suitable professional/cyber and any compulsory insurance, maintain complaints handling, and arrange qualified UK and local advice. Schedule periodic reviews when law, providers or plans change.' },
]

export const legalReviewStates = ['Not started', 'In review', 'Evidence recorded'] as const
export type LegalReviewState = typeof legalReviewStates[number]
export type LegalReview = {
  obligationId: string; country: string; state: LegalReviewState
  reviewer: string; nextReview: string; evidence: string
}
export const legalReviewModule = 'founder-compliance'
export const legalMarketCountries = [
  'India', 'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi',
  'Cabo Verde', 'Cameroon', 'Central African Republic', 'Chad', 'Comoros',
  'Cote d\'Ivoire', 'Democratic Republic of the Congo', 'Djibouti', 'Egypt',
  'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon', 'Gambia',
  'Ghana', 'Guinea', 'Guinea-Bissau', 'Kenya', 'Lesotho', 'Liberia', 'Libya',
  'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco',
  'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Republic of the Congo',
  'Rwanda', 'Sao Tome and Principe', 'Senegal', 'Seychelles', 'Sierra Leone',
  'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Togo',
  'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe',
]
export function validateLegalReview(review: LegalReview): string {
  const obligation = legalObligations.find((item) => item.id === review.obligationId)
  if (!obligation) return 'Choose a recognised legal review.'
  if (!legalReviewStates.includes(review.state)) return 'Choose a recognised review state.'
  if (!review.reviewer.trim()) return 'Name the responsible reviewer.'
  if (!review.evidence.trim()) return 'Add review notes or an evidence reference.'
  if (!/^\d{4}-\d{2}-\d{2}$/.test(review.nextReview) || Number.isNaN(Date.parse(`${review.nextReview}T00:00:00Z`)) || new Date(`${review.nextReview}T00:00:00Z`).toISOString().slice(0, 10) !== review.nextReview) return 'Set a valid next-review date.'
  if (obligation.area === 'markets' && !legalMarketCountries.includes(review.country)) return 'Choose one country from the launch-market list, not a continent or a group of markets.'
  return ''
}
export function readLegalReview(record: ProductionWorkspaceRecord): LegalReview | null {
  const data = objectAt(record.data?.founderLegalReview)
  const state = textAt(data.state)
  if (!legalReviewStates.some((value) => value === state)) return null
  const review: LegalReview = {
    obligationId: textAt(data.obligationId), country: textAt(data.country),
    state: state as LegalReviewState, reviewer: textAt(data.reviewer),
    nextReview: textAt(data.nextReview), evidence: textAt(data.evidence),
  }
  return validateLegalReview(review) ? null : review
}
