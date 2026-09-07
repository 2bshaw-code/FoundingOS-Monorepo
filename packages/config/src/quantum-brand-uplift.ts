/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { brands, type BrandSlug } from './index.ts'

export type QuantumSphereVariant = 'core-orbit' | 'retail-grid' | 'trace-pulse' | 'discovery-flare' | 'talent-helix' | 'crypto-ring' | 'finance-ledger' | 'health-wave' | 'logistics-route'

export type QuantumBrandUplift = {
  brandSlug: BrandSlug
  icon: string
  sphereVariant: QuantumSphereVariant
  story: string
  demo: { images: string[] }
  demoImageRequirements: Array<{ src: string; alt: string; caption: string; requirement: string }>
  demoSteps: string[]
  surveyRefinements: string[]
  surveyQuestions: string[]
  iconographySuggestions: string[]
  quantumSphereNotes: string[]
}

export type QuantumDemoBrandCard = {
  id: string
  sourceBrandSlug: BrandSlug
  route: string
  previewImage: string
  title: string
  description: string
}

function demoImages(brandSlug: BrandSlug, count = 4) {
  return Array.from({ length: count }, (_, index) => `/demo/brands/${brandSlug}/step${index + 1}.png`)
}

function demoRoute(id: string) {
  return `/demo/${id}`
}

export const QUANTUM_BRAND_UPLIFTS: Record<BrandSlug, QuantumBrandUplift> = {
  foundingos: {
    brandSlug: 'foundingos',
    icon: '◈',
    sphereVariant: 'core-orbit',
    story: 'FoundingOS is the unified command layer connecting every brand, console, demo, survey, entitlement, and AI workflow across the ecosystem.',
    demo: { images: demoImages('foundingos') },
    demoImageRequirements: [
      { src: '/demo/brands/foundingos/step1.png', alt: 'FoundingOS founder console with live navigation and brand intelligence header', caption: 'Founder console', requirement: 'Real screenshot of the live founder console — navigation, brand intelligence header, and hero moment.' },
      { src: '/demo/brands/foundingos/step2.png', alt: 'FoundingOS console KPI cards and AI insight, risk, and opportunity panels', caption: 'KPIs and AI insight', requirement: 'Real screenshot of the console KPI row and AI-generated insight/risk/opportunity cards.' },
      { src: '/demo/brands/foundingos/step3.png', alt: 'FoundingOS console quantum forecast and scenario simulation panels', caption: 'Quantum forecast', requirement: 'Real screenshot of the quantum forecast sparkline and scenario simulation section.' },
    ],
    demoSteps: ['Open Superdash from the main menu.', 'Review cross-brand health and AI readiness.', 'Check package access before taking action.', 'Approve a clear recommendation.'],
    surveyRefinements: ['How clear was the unified command layer?', 'Were brand boundaries easy to understand?', 'Did AI recommendations feel safe and useful?'],
    surveyQuestions: ['How clear was the unified command layer?', 'Were brand boundaries easy to understand?', 'Did AI recommendations feel safe and useful?'],
    iconographySuggestions: ['Command diamond icon', 'Connected orbit icon', 'Approval shield icon'],
    quantumSphereNotes: ['QuantumSphere_CoreOrbit should feel calm, premium, and ecosystem-wide without borrowing a single brand identity.'],
  },
  retail: {
    brandSlug: 'retail',
    icon: '◉',
    sphereVariant: 'retail-grid',
    story: 'FoundRetail helps retailers manage inventory, pricing, promotions, and customer engagement with clarity and automation.',
    demo: { images: demoImages('retail') },
    demoImageRequirements: [
      { src: '/demo/brands/retail/step1.png', alt: 'FoundRetail console showing Commerce Pulse header and live KPIs', caption: 'Commerce Pulse console', requirement: 'Real screenshot of the live FoundRetail console header and KPI row.' },
      { src: '/demo/brands/retail/step2.png', alt: 'FoundRetail console AI insight, risk, and opportunity cards', caption: 'AI insight cards', requirement: 'Real screenshot of the AI-generated trend, insight, risk, and opportunity cards.' },
      { src: '/demo/brands/retail/step3.png', alt: 'FoundRetail console quantum forecast and scenario simulation panels', caption: 'Quantum forecast', requirement: 'Real screenshot of the quantum forecast sparkline and scenario simulation section.' },
      { src: '/demo/brands/retail/step4.png', alt: 'Full FoundRetail console page including the Used Car Shop module', caption: 'Full console page', requirement: 'Real full-page screenshot of the FoundRetail console, including the Used Car Shop module.' },
    ],
    demoSteps: ['Open FoundRetail from the main menu.', 'Select Inventory Overview.', 'Review low-stock alerts.', 'Click Create Promotion.', 'Launch promotion with one tap.'],
    surveyRefinements: ['How easy was it to review inventory?', 'Did the promotion flow feel intuitive?', 'Were the visuals clear and helpful?', 'Would you use FoundRetail daily?', 'Rate the overall experience.'],
    surveyQuestions: ['How easy was it to review inventory?', 'Did the promotion flow feel intuitive?', 'Were the visuals clear and helpful?', 'Would you use FoundRetail daily?', 'Rate the overall experience.'],
    iconographySuggestions: ['Barcode icon', 'Shelf icon', 'Price tag icon'],
    quantumSphereNotes: ['QuantumSphere_Retail should use an amber gradient note in demo content while the implemented interface remains locked to existing FoundRetail brand tokens.'],
  },
  meat: {
    brandSlug: 'meat',
    icon: '◆',
    sphereVariant: 'trace-pulse',
    story: 'FoundMeat supports butchers, meat suppliers, and food distributors with traceability, batch management, and compliance workflows.',
    demo: { images: demoImages('meat') },
    demoImageRequirements: [
      { src: '/demo/brands/meat/step1.png', alt: 'FoundMeat console showing Supply Chain Heat header and live KPIs', caption: 'Supply Chain Heat console', requirement: 'Real screenshot of the live FoundMeat console header and KPI row.' },
      { src: '/demo/brands/meat/step2.png', alt: 'FoundMeat console AI insight, risk, and opportunity cards', caption: 'AI insight cards', requirement: 'Real screenshot of the AI-generated trend, insight, risk, and opportunity cards.' },
      { src: '/demo/brands/meat/step3.png', alt: 'FoundMeat console quantum forecast and scenario simulation panels', caption: 'Quantum forecast', requirement: 'Real screenshot of the quantum forecast sparkline and scenario simulation section.' },
      { src: '/demo/brands/meat/step4.png', alt: 'Full FoundMeat console page', caption: 'Full console page', requirement: 'Real full-page screenshot of the FoundMeat console.' },
    ],
    demoSteps: ['Open FoundMeat from the main menu.', 'Select Batch Tracking.', 'Review batch status and temperature logs.', 'Generate a compliance report.', 'Export or share the report.'],
    surveyRefinements: ['Was batch tracking easy to understand?', 'Did compliance reporting feel simple?', 'Were the images helpful?', 'Would you trust FoundMeat for daily operations?', 'Rate the clarity of the demo.'],
    surveyQuestions: ['Was batch tracking easy to understand?', 'Did compliance reporting feel simple?', 'Were the images helpful?', 'Would you trust FoundMeat for daily operations?', 'Rate the clarity of the demo.'],
    iconographySuggestions: ['Meat cut icon', 'Thermometer icon', 'Batch ID icon'],
    quantumSphereNotes: ['QuantumSphere_Meat should use a deep red variant note and preserve the existing FoundMeat brand identity.'],
  },
  foundthat: {
    brandSlug: 'foundthat',
    icon: '✦',
    sphereVariant: 'discovery-flare',
    story: 'FoundThat powers marketplaces and listing platforms with product discovery, listing management, and buyer engagement tools.',
    demo: { images: demoImages('foundthat') },
    demoImageRequirements: [
      { src: '/demo/brands/foundthat/step1.png', alt: 'FoundThat console showing live header and KPIs', caption: 'FoundThat console', requirement: 'Real screenshot of the live FoundThat console header and KPI row.' },
      { src: '/demo/brands/foundthat/step2.png', alt: 'FoundThat console AI insight, risk, and opportunity cards', caption: 'AI insight cards', requirement: 'Real screenshot of the AI-generated trend, insight, risk, and opportunity cards.' },
      { src: '/demo/brands/foundthat/step3.png', alt: 'FoundThat console quantum forecast and scenario simulation panels', caption: 'Quantum forecast', requirement: 'Real screenshot of the quantum forecast sparkline and scenario simulation section.' },
      { src: '/demo/brands/foundthat/step4.png', alt: 'Full FoundThat console page', caption: 'Full console page', requirement: 'Real full-page screenshot of the FoundThat console.' },
    ],
    demoSteps: ['Open FoundThat from the main menu.', 'Click Create Listing.', 'Add product details and images.', 'Publish listing.', 'Review buyer engagement metrics.'],
    surveyRefinements: ['Was listing creation straightforward?', 'Did the demo images help?', 'How clear was the engagement dashboard?', 'Would you use FoundThat for selling?', 'Rate the overall experience.'],
    surveyQuestions: ['Was listing creation straightforward?', 'Did the demo images help?', 'How clear was the engagement dashboard?', 'Would you use FoundThat for selling?', 'Rate the overall experience.'],
    iconographySuggestions: ['Search icon', 'Grid icon', 'Listing icon'],
    quantumSphereNotes: ['QuantumSphere_That should use blue and purple marketplace notes without changing the locked FoundThat brand colour system.'],
  },
  talent: {
    brandSlug: 'talent',
    icon: '⬢',
    sphereVariant: 'talent-helix',
    story: 'FoundTalent helps recruiters and HR teams manage candidates, interviews, and hiring pipelines with intelligence and automation.',
    demo: { images: demoImages('talent') },
    demoImageRequirements: [
      { src: '/demo/brands/talent/step1.png', alt: 'FoundTalent console showing Recruitment Velocity header and live KPIs', caption: 'Recruitment Velocity console', requirement: 'Real screenshot of the live FoundTalent console header and KPI row.' },
      { src: '/demo/brands/talent/step2.png', alt: 'FoundTalent console AI insight, risk, and opportunity cards', caption: 'AI insight cards', requirement: 'Real screenshot of the AI-generated trend, insight, risk, and opportunity cards.' },
      { src: '/demo/brands/talent/step3.png', alt: 'FoundTalent console quantum forecast and scenario simulation panels', caption: 'Quantum forecast', requirement: 'Real screenshot of the quantum forecast sparkline and scenario simulation section.' },
      { src: '/demo/brands/talent/step4.png', alt: 'Full FoundTalent console page', caption: 'Full console page', requirement: 'Real full-page screenshot of the FoundTalent console.' },
    ],
    demoSteps: ['Open FoundTalent from the main menu.', 'Select Candidates.', 'Review candidate profile.', 'Move candidate to next pipeline stage.', 'Schedule an interview.'],
    surveyRefinements: ['Was the candidate flow intuitive?', 'Did the pipeline visuals help?', 'How easy was scheduling?', 'Would you use FoundTalent for hiring?', 'Rate the clarity of the demo.'],
    surveyQuestions: ['Was the candidate flow intuitive?', 'Did the pipeline visuals help?', 'How easy was scheduling?', 'Would you use FoundTalent for hiring?', 'Rate the clarity of the demo.'],
    iconographySuggestions: ['User icon', 'Pipeline icon', 'Calendar icon'],
    quantumSphereNotes: ['QuantumSphere_Talent should use a teal gradient note while preserving the existing FoundTalent identity and flow.'],
  },
  crypto: {
    brandSlug: 'crypto',
    icon: '∞',
    sphereVariant: 'crypto-ring',
    story: 'FoundCrypto provides traders and crypto businesses with portfolio tracking, transaction history, and market insights.',
    demo: { images: demoImages('crypto') },
    demoImageRequirements: [
      { src: '/demo/brands/crypto/step1.png', alt: 'FoundCrypto console showing live header and KPIs', caption: 'FoundCrypto console', requirement: 'Real screenshot of the live FoundCrypto console header and KPI row.' },
      { src: '/demo/brands/crypto/step2.png', alt: 'FoundCrypto console AI insight, risk, and opportunity cards', caption: 'AI insight cards', requirement: 'Real screenshot of the AI-generated trend, insight, risk, and opportunity cards.' },
      { src: '/demo/brands/crypto/step3.png', alt: 'FoundCrypto console quantum forecast and scenario simulation panels', caption: 'Quantum forecast', requirement: 'Real screenshot of the quantum forecast sparkline and scenario simulation section.' },
      { src: '/demo/brands/crypto/step4.png', alt: 'Full FoundCrypto console page', caption: 'Full console page', requirement: 'Real full-page screenshot of the FoundCrypto console.' },
    ],
    demoSteps: ['Open FoundCrypto from the main menu.', 'View your portfolio balance.', 'Review recent transactions.', 'Check market trends.', 'Generate a performance summary.'],
    surveyRefinements: ['Was the portfolio view clear?', 'Did the market chart help?', 'How easy was it to navigate?', 'Would you trust FoundCrypto for tracking?', 'Rate the overall experience.'],
    surveyQuestions: ['Was the portfolio view clear?', 'Did the market chart help?', 'How easy was it to navigate?', 'Would you trust FoundCrypto for tracking?', 'Rate the overall experience.'],
    iconographySuggestions: ['Coin icon', 'Chart icon', 'Ledger icon'],
    quantumSphereNotes: ['QuantumSphere_Crypto should use a neon blue variant note while preserving the existing FoundCrypto brand identity and review-led experience.'],
  },
  finance: {
    brandSlug: 'finance',
    icon: '£',
    sphereVariant: 'finance-ledger',
    story: 'FoundFinance helps businesses manage invoices, payments, cashflow, and financial reporting with clarity and automation.',
    demo: { images: demoImages('finance') },
    demoImageRequirements: [
      { src: '/demo/brands/finance/step1.png', alt: 'FoundFinance console showing Cashflow Stability header and live KPIs', caption: 'Cashflow Stability console', requirement: 'Real screenshot of the live FoundFinance console header and KPI row.' },
      { src: '/demo/brands/finance/step2.png', alt: 'FoundFinance console AI insight, risk, and opportunity cards', caption: 'AI insight cards', requirement: 'Real screenshot of the AI-generated trend, insight, risk, and opportunity cards.' },
      { src: '/demo/brands/finance/step3.png', alt: 'FoundFinance console quantum forecast and scenario simulation panels', caption: 'Quantum forecast', requirement: 'Real screenshot of the quantum forecast sparkline and scenario simulation section.' },
      { src: '/demo/brands/finance/step4.png', alt: 'Full FoundFinance console page', caption: 'Full console page', requirement: 'Real full-page screenshot of the FoundFinance console.' },
    ],
    demoSteps: ['Open FoundFinance from the main menu.', 'Review outstanding invoices.', 'Check payment statuses.', 'View cashflow forecast.', 'Generate monthly financial summary.'],
    surveyRefinements: ['Was the invoice flow easy to follow?', 'Did the cashflow chart help?', 'How clear was the financial summary?', 'Would you use FoundFinance daily?', 'Rate the clarity of the demo.'],
    surveyQuestions: ['Was the invoice flow easy to follow?', 'Did the cashflow chart help?', 'How clear was the financial summary?', 'Would you use FoundFinance daily?', 'Rate the clarity of the demo.'],
    iconographySuggestions: ['Invoice icon', 'Payment icon', 'Cashflow icon'],
    quantumSphereNotes: ['QuantumSphere_Finance should use an emerald green variant note in content only while preserving the locked FoundFinance brand system.'],
  },
  health: {
    brandSlug: 'health',
    icon: '✚',
    sphereVariant: 'health-wave',
    story: 'FoundHealth supports clinics and health providers with patient records, appointment scheduling, and care workflows.',
    demo: { images: demoImages('health') },
    demoImageRequirements: [
      { src: '/demo/brands/health/step1.png', alt: 'FoundHealth console showing Patient Flow Pulse header and live KPIs', caption: 'Patient Flow Pulse console', requirement: 'Real screenshot of the live FoundHealth console header and KPI row.' },
      { src: '/demo/brands/health/step2.png', alt: 'FoundHealth console AI insight, risk, and opportunity cards', caption: 'AI insight cards', requirement: 'Real screenshot of the AI-generated trend, insight, risk, and opportunity cards.' },
      { src: '/demo/brands/health/step3.png', alt: 'FoundHealth console quantum forecast and scenario simulation panels', caption: 'Quantum forecast', requirement: 'Real screenshot of the quantum forecast sparkline and scenario simulation section.' },
      { src: '/demo/brands/health/step4.png', alt: 'Full FoundHealth console page', caption: 'Full console page', requirement: 'Real full-page screenshot of the FoundHealth console.' },
    ],
    demoSteps: ['Open FoundHealth from the main menu.', 'Select Patients.', 'Review patient details.', 'Schedule an appointment.', 'Update care workflow.'],
    surveyRefinements: ['Was the patient flow intuitive?', 'Did the appointment screen feel clear?', 'Were the demo images helpful?', 'Would you trust FoundHealth for care workflows?', 'Rate the overall experience.'],
    surveyQuestions: ['Was the patient flow intuitive?', 'Did the appointment screen feel clear?', 'Were the demo images helpful?', 'Would you trust FoundHealth for care workflows?', 'Rate the overall experience.'],
    iconographySuggestions: ['Heart icon', 'Calendar icon', 'Medical file icon'],
    quantumSphereNotes: ['QuantumSphere_Health should use soft green and blue notes while maintaining FoundHealth care clarity and locked tokens.'],
  },
  logistics: {
    brandSlug: 'logistics',
    icon: '▲',
    sphereVariant: 'logistics-route',
    story: 'FoundLogistics helps logistics teams manage shipments, tracking, delivery routes, and fleet performance.',
    demo: { images: demoImages('logistics') },
    demoImageRequirements: [
      { src: '/demo/brands/logistics/step1.png', alt: 'FoundLogistics console showing Fleet Momentum header and live KPIs', caption: 'Fleet Momentum console', requirement: 'Real screenshot of the live FoundLogistics console header and KPI row.' },
      { src: '/demo/brands/logistics/step2.png', alt: 'FoundLogistics console AI insight, risk, and opportunity cards', caption: 'AI insight cards', requirement: 'Real screenshot of the AI-generated trend, insight, risk, and opportunity cards.' },
      { src: '/demo/brands/logistics/step3.png', alt: 'FoundLogistics console quantum forecast and scenario simulation panels', caption: 'Quantum forecast', requirement: 'Real screenshot of the quantum forecast sparkline and scenario simulation section.' },
      { src: '/demo/brands/logistics/step4.png', alt: 'Full FoundLogistics console page', caption: 'Full console page', requirement: 'Real full-page screenshot of the FoundLogistics console.' },
    ],
    demoSteps: ['Open FoundLogistics from the main menu.', 'Review active shipments.', 'View route map.', 'Check fleet performance.', 'Generate delivery summary.'],
    surveyRefinements: ['Was shipment tracking clear?', 'Did the route map help?', 'How easy was fleet review?', 'Would you use FoundLogistics daily?', 'Rate the clarity of the demo.'],
    surveyQuestions: ['Was shipment tracking clear?', 'Did the route map help?', 'How easy was fleet review?', 'Would you use FoundLogistics daily?', 'Rate the clarity of the demo.'],
    iconographySuggestions: ['Truck icon', 'Map icon', 'Speedometer icon'],
    quantumSphereNotes: ['QuantumSphere_Logistics should use orange and steel notes while preserving the existing FoundLogistics brand shell and route clarity.'],
  },
}

export const MODULE_BRAND_UPLIFT: Record<string, BrandSlug> = {
  'marketing-suite': 'foundingos',
  accounting: 'finance',
  'customer-service': 'retail',
  messaging: 'foundingos',
  'ai-automation': 'foundingos',
  operations: 'logistics',
  sales: 'retail',
  branding: 'foundthat',
  'console-navigation': 'foundingos',
  'superdashboard-demo': 'foundingos',
  finance: 'finance',
  crypto: 'crypto',
  'investor-overview': 'foundingos',
  'buyer-overview': 'retail',
  'customer-overview': 'retail',
  'crm-overview': 'foundingos',
  'foundingos-overview': 'foundingos',
  'admin-overview': 'foundingos',
}

export function getQuantumBrandUplift(slug: BrandSlug) {
  return QUANTUM_BRAND_UPLIFTS[slug]
}

export function getQuantumBrandUpliftForDemo(demoId: string) {
  const brandSlug = MODULE_BRAND_UPLIFT[demoId] ?? 'foundingos'
  return { brand: brands[brandSlug], uplift: QUANTUM_BRAND_UPLIFTS[brandSlug] }
}

export const DEMO_BRAND_CARDS: QuantumDemoBrandCard[] = [
  {
    id: 'foundingos',
    sourceBrandSlug: 'foundingos',
    route: demoRoute('foundingos'),
    previewImage: '/assets/demos/foundingos/preview.png',
    title: 'FoundingOS overview demo',
    description: 'Unified Quantum shell, Superdash, AAL, Package Model D, and multi-brand command context.',
  },
  {
    id: 'retail',
    sourceBrandSlug: 'retail',
    route: demoRoute('retail'),
    previewImage: '/assets/demos/retail/preview.png',
    title: 'FoundRetail demo',
    description: 'Inventory, promotions, customer engagement, and retail automation.',
  },
  {
    id: 'meat',
    sourceBrandSlug: 'meat',
    route: demoRoute('meat'),
    previewImage: '/assets/demos/meat/preview.png',
    title: 'FoundMeat demo',
    description: 'Batch tracking, temperature compliance, and report-ready traceability.',
  },
  {
    id: 'talent',
    sourceBrandSlug: 'talent',
    route: demoRoute('talent'),
    previewImage: '/assets/demos/talent/preview.png',
    title: 'FoundTalent demo',
    description: 'Candidate profiles, pipeline movement, and interview scheduling.',
  },
  {
    id: 'logistics',
    sourceBrandSlug: 'logistics',
    route: demoRoute('logistics'),
    previewImage: '/assets/demos/logistics/preview.png',
    title: 'FoundLogistics demo',
    description: 'Shipments, route maps, fleet performance, and delivery summaries.',
  },
  {
    id: 'crypto',
    sourceBrandSlug: 'crypto',
    route: demoRoute('crypto'),
    previewImage: '/assets/demos/crypto/preview.png',
    title: 'FoundCrypto demo',
    description: 'Portfolio tracking, transaction ledgers, and market trend summaries.',
  },
  {
    id: 'finance',
    sourceBrandSlug: 'finance',
    route: demoRoute('finance'),
    previewImage: '/assets/demos/finance/preview.png',
    title: 'FoundFinance demo',
    description: 'Invoices, payment status, cashflow forecasts, and financial summaries.',
  },
  {
    id: 'health',
    sourceBrandSlug: 'health',
    route: demoRoute('health'),
    previewImage: '/assets/demos/health/preview.png',
    title: 'FoundHealth demo',
    description: 'Patient profiles, appointments, and care workflow updates.',
  },
  {
    id: 'foundthat',
    sourceBrandSlug: 'foundthat',
    route: demoRoute('foundthat'),
    previewImage: '/assets/demos/foundthat/preview.png',
    title: 'FoundThat demo',
    description: 'Marketplace grids, listing creation, and buyer engagement metrics.',
  },
  {
    id: 'foundit',
    sourceBrandSlug: 'foundthat',
    route: demoRoute('foundit'),
    previewImage: '/assets/demos/foundit/preview.png',
    title: 'FoundIt demo',
    description: 'Discovery-led marketplace preview aligned with the FoundThat ecosystem.',
  },
]
