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
  setupHighlight: string
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
  return Array.from({ length: count }, (_, index) => `/demo/brands/${brandSlug}/step${index + 1}.webp`)
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
    setupHighlight: 'Set up in minutes: connect your brands once, and every console, demo, and AI workflow is unified — no separate logins, no separate setup.',
    demo: { images: demoImages('foundingos') },
    demoImageRequirements: [
      { src: '/demo/brands/foundingos/step1.webp', alt: 'FoundingOS founder console with live navigation and brand intelligence header', caption: 'Founder console', requirement: 'Real screenshot of the live founder console — navigation, brand intelligence header, and hero moment.' },
      { src: '/demo/brands/foundingos/step2.webp', alt: 'FoundingOS console KPI cards and AI insight, risk, and opportunity panels', caption: 'KPIs and AI insight', requirement: 'Real screenshot of the console KPI row and AI-generated insight/risk/opportunity cards.' },
      { src: '/demo/brands/foundingos/step3.webp', alt: 'FoundingOS console quantum forecast and scenario simulation panels', caption: 'Quantum forecast', requirement: 'Real screenshot of the quantum forecast sparkline and scenario simulation section.' },
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
    setupHighlight: 'Set up in minutes: connect your product catalogue once, and FoundRetail tracks stock, prices, and promotions automatically — no spreadsheets, no manual re-entry.',
    demo: { images: demoImages('retail') },
    demoImageRequirements: [
      { src: '/demo/brands/retail/step1.webp', alt: 'FoundRetail console showing Commerce Pulse header and live KPIs', caption: 'Commerce Pulse console', requirement: 'Real screenshot of the live FoundRetail console header and KPI row.' },
      { src: '/demo/brands/retail/step2.webp', alt: 'FoundRetail console AI insight, risk, and opportunity cards', caption: 'AI insight cards', requirement: 'Real screenshot of the AI-generated trend, insight, risk, and opportunity cards.' },
      { src: '/demo/brands/retail/step3.webp', alt: 'FoundRetail console quantum forecast and scenario simulation panels', caption: 'Quantum forecast', requirement: 'Real screenshot of the quantum forecast sparkline and scenario simulation section.' },
      { src: '/demo/brands/retail/step4.webp', alt: 'Full FoundRetail console page including the Used Car Shop module', caption: 'Full console page', requirement: 'Real full-page screenshot of the FoundRetail console, including the Used Car Shop module.' },
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
    setupHighlight: 'Set up in minutes: log your first batch, and FoundMeat handles traceability and compliance reporting automatically from then on — no paperwork chasing.',
    demo: { images: demoImages('meat') },
    demoImageRequirements: [
      { src: '/demo/brands/meat/step1.webp', alt: 'FoundMeat console showing Supply Chain Heat header and live KPIs', caption: 'Supply Chain Heat console', requirement: 'Real screenshot of the live FoundMeat console header and KPI row.' },
      { src: '/demo/brands/meat/step2.webp', alt: 'FoundMeat console AI insight, risk, and opportunity cards', caption: 'AI insight cards', requirement: 'Real screenshot of the AI-generated trend, insight, risk, and opportunity cards.' },
      { src: '/demo/brands/meat/step3.webp', alt: 'FoundMeat console quantum forecast and scenario simulation panels', caption: 'Quantum forecast', requirement: 'Real screenshot of the quantum forecast sparkline and scenario simulation section.' },
      { src: '/demo/brands/meat/step4.webp', alt: 'Full FoundMeat console page', caption: 'Full console page', requirement: 'Real full-page screenshot of the FoundMeat console.' },
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
    setupHighlight: 'Set up in minutes: publish your first listing, and FoundThat surfaces it to buyers and tracks engagement automatically — no separate marketplace tools needed.',
    demo: { images: demoImages('foundthat') },
    demoImageRequirements: [
      { src: '/demo/brands/foundthat/step1.webp', alt: 'FoundThat console showing live header and KPIs', caption: 'FoundThat console', requirement: 'Real screenshot of the live FoundThat console header and KPI row.' },
      { src: '/demo/brands/foundthat/step2.webp', alt: 'FoundThat console AI insight, risk, and opportunity cards', caption: 'AI insight cards', requirement: 'Real screenshot of the AI-generated trend, insight, risk, and opportunity cards.' },
      { src: '/demo/brands/foundthat/step3.webp', alt: 'FoundThat console quantum forecast and scenario simulation panels', caption: 'Quantum forecast', requirement: 'Real screenshot of the quantum forecast sparkline and scenario simulation section.' },
      { src: '/demo/brands/foundthat/step4.webp', alt: 'Full FoundThat console page', caption: 'Full console page', requirement: 'Real full-page screenshot of the FoundThat console.' },
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
    setupHighlight: 'Set up in minutes: add your first candidate, and FoundTalent manages the whole pipeline from application to interview — no spreadsheets, no missed follow-ups.',
    demo: { images: demoImages('talent') },
    demoImageRequirements: [
      { src: '/demo/brands/talent/step1.webp', alt: 'FoundTalent console showing Recruitment Velocity header and live KPIs', caption: 'Recruitment Velocity console', requirement: 'Real screenshot of the live FoundTalent console header and KPI row.' },
      { src: '/demo/brands/talent/step2.webp', alt: 'FoundTalent console AI insight, risk, and opportunity cards', caption: 'AI insight cards', requirement: 'Real screenshot of the AI-generated trend, insight, risk, and opportunity cards.' },
      { src: '/demo/brands/talent/step3.webp', alt: 'FoundTalent console quantum forecast and scenario simulation panels', caption: 'Quantum forecast', requirement: 'Real screenshot of the quantum forecast sparkline and scenario simulation section.' },
      { src: '/demo/brands/talent/step4.webp', alt: 'Full FoundTalent console page', caption: 'Full console page', requirement: 'Real full-page screenshot of the FoundTalent console.' },
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
    setupHighlight: 'Set up in minutes: connect your wallet or exchange, and FoundCrypto tracks your portfolio and compliance automatically — no manual reconciliation.',
    demo: { images: demoImages('crypto') },
    demoImageRequirements: [
      { src: '/demo/brands/crypto/step1.webp', alt: 'FoundCrypto console showing live header and KPIs', caption: 'FoundCrypto console', requirement: 'Real screenshot of the live FoundCrypto console header and KPI row.' },
      { src: '/demo/brands/crypto/step2.webp', alt: 'FoundCrypto console AI insight, risk, and opportunity cards', caption: 'AI insight cards', requirement: 'Real screenshot of the AI-generated trend, insight, risk, and opportunity cards.' },
      { src: '/demo/brands/crypto/step3.webp', alt: 'FoundCrypto console quantum forecast and scenario simulation panels', caption: 'Quantum forecast', requirement: 'Real screenshot of the quantum forecast sparkline and scenario simulation section.' },
      { src: '/demo/brands/crypto/step4.webp', alt: 'Full FoundCrypto console page', caption: 'Full console page', requirement: 'Real full-page screenshot of the FoundCrypto console.' },
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
    setupHighlight: 'Set up in minutes: connect your invoices once, and FoundFinance tracks payments and cashflow automatically — no manual reconciliation, no missed due dates.',
    demo: { images: demoImages('finance') },
    demoImageRequirements: [
      { src: '/demo/brands/finance/step1.webp', alt: 'FoundFinance console showing Cashflow Stability header and live KPIs', caption: 'Cashflow Stability console', requirement: 'Real screenshot of the live FoundFinance console header and KPI row.' },
      { src: '/demo/brands/finance/step2.webp', alt: 'FoundFinance console AI insight, risk, and opportunity cards', caption: 'AI insight cards', requirement: 'Real screenshot of the AI-generated trend, insight, risk, and opportunity cards.' },
      { src: '/demo/brands/finance/step3.webp', alt: 'FoundFinance console quantum forecast and scenario simulation panels', caption: 'Quantum forecast', requirement: 'Real screenshot of the quantum forecast sparkline and scenario simulation section.' },
      { src: '/demo/brands/finance/step4.webp', alt: 'Full FoundFinance console page', caption: 'Full console page', requirement: 'Real full-page screenshot of the FoundFinance console.' },
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
    setupHighlight: 'Set up in minutes: add your first patient record, and FoundHealth manages scheduling and care workflows automatically — no separate booking system needed.',
    demo: { images: demoImages('health') },
    demoImageRequirements: [
      { src: '/demo/brands/health/step1.webp', alt: 'FoundHealth console showing Patient Flow Pulse header and live KPIs', caption: 'Patient Flow Pulse console', requirement: 'Real screenshot of the live FoundHealth console header and KPI row.' },
      { src: '/demo/brands/health/step2.webp', alt: 'FoundHealth console AI insight, risk, and opportunity cards', caption: 'AI insight cards', requirement: 'Real screenshot of the AI-generated trend, insight, risk, and opportunity cards.' },
      { src: '/demo/brands/health/step3.webp', alt: 'FoundHealth console quantum forecast and scenario simulation panels', caption: 'Quantum forecast', requirement: 'Real screenshot of the quantum forecast sparkline and scenario simulation section.' },
      { src: '/demo/brands/health/step4.webp', alt: 'Full FoundHealth console page', caption: 'Full console page', requirement: 'Real full-page screenshot of the FoundHealth console.' },
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
    setupHighlight: 'Set up in minutes: add your first shipment, and FoundLogistics tracks routes and fleet performance automatically — no manual dispatch sheets.',
    demo: { images: demoImages('logistics') },
    demoImageRequirements: [
      { src: '/demo/brands/logistics/step1.webp', alt: 'FoundLogistics console showing Fleet Momentum header and live KPIs', caption: 'Fleet Momentum console', requirement: 'Real screenshot of the live FoundLogistics console header and KPI row.' },
      { src: '/demo/brands/logistics/step2.webp', alt: 'FoundLogistics console AI insight, risk, and opportunity cards', caption: 'AI insight cards', requirement: 'Real screenshot of the AI-generated trend, insight, risk, and opportunity cards.' },
      { src: '/demo/brands/logistics/step3.webp', alt: 'FoundLogistics console quantum forecast and scenario simulation panels', caption: 'Quantum forecast', requirement: 'Real screenshot of the quantum forecast sparkline and scenario simulation section.' },
      { src: '/demo/brands/logistics/step4.webp', alt: 'Full FoundLogistics console page', caption: 'Full console page', requirement: 'Real full-page screenshot of the FoundLogistics console.' },
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
