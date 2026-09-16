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
  setupHighlight: string
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
    uri: `${demoBaseUrl}/demo/brands/${brandSlug}/step${step}.webp`,
    alt,
    caption,
    requirement,
  }
}

function demoImages(brandSlug: string, count = 4) {
  return Array.from({ length: count }, (_, index) => `/demo/brands/${brandSlug}/step${index + 1}.webp`)
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
    setupHighlight: 'Set up in minutes: connect your brands once, and every console, demo, and AI workflow is unified — no separate logins, no separate setup.',
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
    setupHighlight: 'Set up in minutes: connect your product catalogue once, and FoundRetail tracks stock, prices, and promotions automatically — no spreadsheets, no manual re-entry.',
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
  talent: {
    brandSlug: 'talent',
    icon: '⬢',
    sphereVariant: 'talent-helix',
    story: 'FoundTalent helps recruiters and HR teams manage candidates, interviews, and hiring pipelines with intelligence and automation.',
    setupHighlight: 'Set up in minutes: add your first candidate, and FoundTalent manages the whole pipeline from application to interview — no spreadsheets, no missed follow-ups.',
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
  finance: {
    brandSlug: 'finance',
    icon: '£',
    sphereVariant: 'finance-ledger',
    story: 'FoundFinance helps businesses manage invoices, payments, cashflow, and financial reporting with clarity and automation.',
    setupHighlight: 'Set up in minutes: connect your invoices once, and FoundFinance tracks payments and cashflow automatically — no manual reconciliation, no missed due dates.',
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
    setupHighlight: 'Set up in minutes: add your first patient record, and FoundHealth manages scheduling and care workflows automatically — no separate booking system needed.',
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
    setupHighlight: 'Set up in minutes: add your first shipment, and FoundLogistics tracks routes and fleet performance automatically — no manual dispatch sheets.',
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
  'console-navigation': 'foundingos',
  'superdashboard-demo': 'foundingos',
  finance: 'finance',
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
]
