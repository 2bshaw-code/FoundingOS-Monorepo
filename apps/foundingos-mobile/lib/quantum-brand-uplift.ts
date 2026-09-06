/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { BRANDS, type Brand } from './brands'

export type MobileQuantumBrandUplift = {
  brandSlug: string
  icon: string
  sphereVariant: string
  story: string
  demo: { images: string[] }
  demoImageRequirements: Array<{ uri: string; alt: string; caption: string; requirement: string }>
  demoSteps: string[]
  surveyRefinements: string[]
  surveyQuestions: string[]
  iconographySuggestions: string[]
  quantumSphereNotes: string[]
}

export type MobileDemoBrandCard = {
  id: string
  sourceBrandSlug: string
  route: string
  previewImage: string
  title: string
  description: string
}

const foundingOSBrand = BRANDS.find((brand) => brand.slug === 'foundingos') ?? BRANDS[0]
const brandBySlug = Object.fromEntries(BRANDS.map((brand) => [brand.slug, brand]))

const demoBaseUrl = 'https://console.foundingos.com'

function image(brandSlug: string, step: number, alt: string, caption: string, requirement: string) {
  return {
    uri: `${demoBaseUrl}/demo/brands/${brandSlug}/step${step}.png`,
    alt,
    caption,
    requirement,
  }
}

function demoImages(brandSlug: string, count = 4) {
  return Array.from({ length: count }, (_, index) => `/demo/brands/${brandSlug}/step${index + 1}.png`)
}

function demoRoute(id: string) {
  return `/demo/${id}`
}

const uplifts: Record<string, MobileQuantumBrandUplift> = {
  foundingos: {
    brandSlug: 'foundingos',
    icon: '◈',
    sphereVariant: 'core-orbit',
    story: 'FoundingOS is the unified command layer connecting every brand, console, demo, survey, entitlement, and AI workflow across the ecosystem.',
    demo: { images: demoImages('foundingos') },
    demoImageRequirements: [
      image('foundingos', 1, 'FoundingOS unified Superdash command center', 'Unified command center', 'Show Superdash with cross-brand cards, Package Model D visibility, and AI command states.'),
      image('foundingos', 2, 'FoundingOS brand selector with Quantum shell', 'Brand selector', 'Show brand switching while preserving each locked brand identity.'),
      image('foundingos', 3, 'FoundingOS AI recommendations panel', 'AI recommendations', 'Show approval-ready AI suggestions across Marketing, Sales, CRM, and Finance.'),
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
      image('retail', 1, 'Clean product shelves in a premium retail environment', 'Clean product shelves', 'Show clear product shelves with a premium Quantum retail treatment.'),
      image('retail', 2, 'POS terminal close-up for FoundRetail checkout flow', 'POS terminal close-up', 'Show a modern POS terminal with retail workflow context.'),
      image('retail', 3, 'FoundRetail inventory dashboard screenshot', 'Inventory dashboard', 'Show inventory status, low-stock alerts, and product visibility.'),
      image('retail', 4, 'QuantumSphere retail variant with soft amber glow', 'QuantumSphere retail variant', 'Show the retail QuantumSphere variant with a soft amber glow note while preserving brand-locked UI tokens.'),
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
      image('meat', 1, 'Clean butcher counter prepared for FoundMeat operations', 'Clean butcher counter', 'Show a clean butcher counter with premium operational clarity.'),
      image('meat', 2, 'FoundMeat batch tracking dashboard', 'Batch tracking dashboard', 'Show batch IDs, traceability state, and stock context.'),
      image('meat', 3, 'FoundMeat temperature compliance chart', 'Temperature compliance chart', 'Show temperature logs and compliance status clearly.'),
      image('meat', 4, 'QuantumSphere meat variant with deep red gradient', 'QuantumSphere meat variant', 'Show the meat QuantumSphere variant with deep red gradient notes.'),
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
      image('foundthat', 1, 'Marketplace grid for FoundThat product discovery', 'Marketplace grid', 'Show marketplace listings in a clear Quantum-consistent grid.'),
      image('foundthat', 2, 'FoundThat listing creation form', 'Listing creation form', 'Show product details, image fields, and publishing readiness.'),
      image('foundthat', 3, 'FoundThat buyer engagement dashboard', 'Buyer engagement dashboard', 'Show views, enquiries, buyer signals, and listing performance.'),
      image('foundthat', 4, 'QuantumSphere marketplace variant with blue and purple notes', 'QuantumSphere marketplace variant', 'Show the marketplace QuantumSphere variant with blue and purple notes while preserving FoundThat tokens.'),
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
      image('talent', 1, 'FoundTalent candidate profile screenshot', 'Candidate profile screenshot', 'Show candidate details, skills, role fit, and recruiter context.'),
      image('talent', 2, 'FoundTalent hiring pipeline board', 'Pipeline board', 'Show candidates moving through hiring stages clearly.'),
      image('talent', 3, 'FoundTalent interview scheduling screen', 'Interview scheduling screen', 'Show interview timing, participants, and confirmation action.'),
      image('talent', 4, 'QuantumSphere talent variant with teal gradient', 'QuantumSphere talent variant', 'Show the talent QuantumSphere variant with teal gradient notes.'),
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
      image('crypto', 1, 'FoundCrypto portfolio dashboard', 'Portfolio dashboard', 'Show portfolio balances and tracked assets with clear status.'),
      image('crypto', 2, 'FoundCrypto transaction ledger', 'Transaction ledger', 'Show transaction history, timestamps, and review state.'),
      image('crypto', 3, 'FoundCrypto market trend chart', 'Market trend chart', 'Show market trend insights and readable performance context.'),
      image('crypto', 4, 'QuantumSphere crypto variant with neon blue notes', 'QuantumSphere crypto variant', 'Show the crypto QuantumSphere variant with neon blue notes while preserving FoundCrypto tokens.'),
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
      image('finance', 1, 'FoundFinance invoice list', 'Invoice list', 'Show outstanding invoices, due dates, and payment readiness.'),
      image('finance', 2, 'FoundFinance payment status dashboard', 'Payment status dashboard', 'Show paid, pending, overdue, and review states clearly.'),
      image('finance', 3, 'FoundFinance cashflow chart', 'Cashflow chart', 'Show cashflow forecast and financial summary context.'),
      image('finance', 4, 'QuantumSphere finance variant with emerald green notes', 'QuantumSphere finance variant', 'Show the finance QuantumSphere variant with emerald green notes while preserving FoundFinance tokens.'),
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
      image('health', 1, 'FoundHealth patient profile', 'Patient profile', 'Show patient details and care context in a calm Quantum surface.'),
      image('health', 2, 'FoundHealth appointment calendar', 'Appointment calendar', 'Show appointment scheduling and availability clearly.'),
      image('health', 3, 'FoundHealth care workflow screen', 'Care workflow screen', 'Show care tasks, ownership, and workflow status.'),
      image('health', 4, 'QuantumSphere health variant with soft green and blue notes', 'QuantumSphere health variant', 'Show the health QuantumSphere variant with soft green and blue notes while preserving FoundHealth tokens.'),
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
      image('logistics', 1, 'FoundLogistics shipment list', 'Shipment list', 'Show active shipments, status, and delivery ownership clearly.'),
      image('logistics', 2, 'FoundLogistics route map', 'Route map', 'Show route path, delivery stops, and route status.'),
      image('logistics', 3, 'FoundLogistics fleet performance dashboard', 'Fleet performance dashboard', 'Show fleet health, driver status, and performance metrics.'),
      image('logistics', 4, 'QuantumSphere logistics variant with orange and steel notes', 'QuantumSphere logistics variant', 'Show the logistics QuantumSphere variant with orange and steel notes while preserving FoundLogistics tokens.'),
    ],
    demoSteps: ['Open FoundLogistics from the main menu.', 'Review active shipments.', 'View route map.', 'Check fleet performance.', 'Generate delivery summary.'],
    surveyRefinements: ['Was shipment tracking clear?', 'Did the route map help?', 'How easy was fleet review?', 'Would you use FoundLogistics daily?', 'Rate the clarity of the demo.'],
    surveyQuestions: ['Was shipment tracking clear?', 'Did the route map help?', 'How easy was fleet review?', 'Would you use FoundLogistics daily?', 'Rate the clarity of the demo.'],
    iconographySuggestions: ['Truck icon', 'Map icon', 'Speedometer icon'],
    quantumSphereNotes: ['QuantumSphere_Logistics should use orange and steel notes while preserving the existing FoundLogistics brand shell and route clarity.'],
  },
}

const moduleBrand: Record<string, string> = {
  'marketing-suite': 'foundingos',
  accounting: 'finance',
  'customer-service': 'retail',
  messaging: 'foundingos',
  'ai-automation': 'foundingos',
  operations: 'logistics',
  sales: 'retail',
  branding: 'foundthat',
  foundit: 'foundthat',
  'console-navigation': 'foundingos',
  'superdashboard-demo': 'foundingos',
  finance: 'finance',
  crypto: 'crypto',
  'buyer-overview': 'retail',
  'customer-overview': 'retail',
  'crm-overview': 'foundingos',
}

export function getMobileQuantumBrandUpliftForDemo(demoId: string) {
  const brandSlug = moduleBrand[demoId] ?? demoId
  const brand = brandBySlug[brandSlug] ?? foundingOSBrand
  const uplift = uplifts[brand.slug] ?? uplifts.foundingos
  return { brand, uplift }
}

export const MOBILE_DEMO_BRAND_CARDS: MobileDemoBrandCard[] = [
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
