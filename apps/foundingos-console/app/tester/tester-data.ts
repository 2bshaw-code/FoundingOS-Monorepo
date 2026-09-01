/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Server-only tester program config. Never import this from a 'use client' file —
// it holds the pre-issued access codes and must not reach the browser bundle.

export type ModuleId =
  | 'marketing-suite'
  | 'accounting'
  | 'customer-service'
  | 'messaging'
  | 'ai-automation'
  | 'operations'
  | 'sales'
  | 'branding'
  | 'console-navigation'
  | 'superdashboard-demo'
  | 'finance'
  | 'crypto'
  | 'investor-overview'
  | 'buyer-overview'
  | 'customer-overview'

export type SurveyId = 'survey-a' | 'survey-b' | 'survey-c' | 'survey-d' | 'survey-e' | 'survey-f' | 'survey-g' | 'survey-h' | 'survey-i' | 'survey-j' | 'survey-k' | 'survey-l' | 'survey-investor' | 'survey-buyer' | 'survey-customer'

export type Credential = {
  id: string
  password: string
  moduleId: ModuleId
  moduleLabel: string
  surveyId: SurveyId
}

export const CREDENTIALS: Credential[] = [
  { id: 'alpha', password: 'alpha-4921', moduleId: 'marketing-suite', moduleLabel: 'Marketing Suite', surveyId: 'survey-a' },
  { id: 'bravo', password: 'bravo-5832', moduleId: 'accounting', moduleLabel: 'Accounting', surveyId: 'survey-b' },
  { id: 'charlie', password: 'charlie-6733', moduleId: 'customer-service', moduleLabel: 'Customer Service', surveyId: 'survey-c' },
  { id: 'delta', password: 'delta-7844', moduleId: 'messaging', moduleLabel: 'Messaging', surveyId: 'survey-d' },
  { id: 'echo', password: 'echo-8955', moduleId: 'ai-automation', moduleLabel: 'AI Automation', surveyId: 'survey-e' },
  { id: 'foxtrot', password: 'foxtrot-9066', moduleId: 'operations', moduleLabel: 'Operations', surveyId: 'survey-f' },
  { id: 'golf', password: 'golf-0177', moduleId: 'sales', moduleLabel: 'Sales', surveyId: 'survey-g' },
  { id: 'hotel', password: 'hotel-1288', moduleId: 'branding', moduleLabel: 'Branding', surveyId: 'survey-h' },
  { id: 'india', password: 'india-2399', moduleId: 'console-navigation', moduleLabel: 'Console Navigation', surveyId: 'survey-i' },
  { id: 'juliet', password: 'juliet-3410', moduleId: 'superdashboard-demo', moduleLabel: 'SuperDashboard Demo (read-only)', surveyId: 'survey-j' },
  { id: 'finance', password: 'finance-5511', moduleId: 'finance', moduleLabel: 'Finance', surveyId: 'survey-k' },
  { id: 'crypto', password: 'crypto-6622', moduleId: 'crypto', moduleLabel: 'Crypto', surveyId: 'survey-l' },

  // Tester access codes (batch 2) — reuse the existing module/survey pairs above (survey-a
  // through survey-j) rather than inventing new, unpopulated surveys. Each password is an
  // independent access code into the same real, working tester experience.
  { id: 'tester-1', password: 'TST-91XQ', moduleId: 'marketing-suite', moduleLabel: 'Marketing Suite', surveyId: 'survey-a' },
  { id: 'tester-2', password: 'TST-44MZ', moduleId: 'accounting', moduleLabel: 'Accounting', surveyId: 'survey-b' },
  { id: 'tester-3', password: 'TST-77PL', moduleId: 'customer-service', moduleLabel: 'Customer Service', surveyId: 'survey-c' },
  { id: 'tester-4', password: 'TST-20RB', moduleId: 'messaging', moduleLabel: 'Messaging', surveyId: 'survey-d' },
  { id: 'tester-5', password: 'TST-63KV', moduleId: 'ai-automation', moduleLabel: 'AI Automation', surveyId: 'survey-e' },
  { id: 'tester-6', password: 'TST-85NJ', moduleId: 'operations', moduleLabel: 'Operations', surveyId: 'survey-f' },
  { id: 'tester-7', password: 'TST-52WA', moduleId: 'sales', moduleLabel: 'Sales', surveyId: 'survey-g' },
  { id: 'tester-8', password: 'TST-18CY', moduleId: 'branding', moduleLabel: 'Branding', surveyId: 'survey-h' },
  { id: 'tester-9', password: 'TST-39HF', moduleId: 'console-navigation', moduleLabel: 'Console Navigation', surveyId: 'survey-i' },
  { id: 'tester-10', password: 'TST-04DS', moduleId: 'superdashboard-demo', moduleLabel: 'SuperDashboard Demo (read-only)', surveyId: 'survey-j' },

  // Investor access — a dedicated business-plan-aligned briefing (the existing, real
  // /investor page) plus its own comprehension survey (survey-investor), distinct from the
  // generic SuperDashboard demo tier. Lawyer review keeps the original read-only tier.
  { id: 'investor-alpha', password: 'INV-ALPHA', moduleId: 'investor-overview', moduleLabel: 'Investor Briefing', surveyId: 'survey-investor' },
  { id: 'investor-omega', password: 'INV-OMEGA', moduleId: 'investor-overview', moduleLabel: 'Investor Briefing', surveyId: 'survey-investor' },
  { id: 'lawyer-review', password: 'LAW-REVIEW', moduleId: 'superdashboard-demo', moduleLabel: 'SuperDashboard Demo (read-only)', surveyId: 'survey-j' },

  // Tester access codes (batch 3) — plain, memorable "SURVEY-*" passwords for the
  // email+password login flow. Reuse the existing module/survey pairs above rather than
  // inventing new, unpopulated surveys; these coexist with every earlier batch through
  // the same findCredentialByPassword lookup, so access-code-only login is unaffected.
  { id: 'survey-1', password: 'SURVEY-1', moduleId: 'marketing-suite', moduleLabel: 'Marketing Suite', surveyId: 'survey-a' },
  { id: 'survey-2', password: 'SURVEY-2', moduleId: 'accounting', moduleLabel: 'Accounting', surveyId: 'survey-b' },
  { id: 'survey-3', password: 'SURVEY-3', moduleId: 'customer-service', moduleLabel: 'Customer Service', surveyId: 'survey-c' },
  { id: 'survey-4', password: 'SURVEY-4', moduleId: 'messaging', moduleLabel: 'Messaging', surveyId: 'survey-d' },
  { id: 'survey-5', password: 'SURVEY-5', moduleId: 'ai-automation', moduleLabel: 'AI Automation', surveyId: 'survey-e' },
  { id: 'survey-6', password: 'SURVEY-6', moduleId: 'operations', moduleLabel: 'Operations', surveyId: 'survey-f' },
  { id: 'survey-7', password: 'SURVEY-7', moduleId: 'sales', moduleLabel: 'Sales', surveyId: 'survey-g' },
  { id: 'survey-8', password: 'SURVEY-8', moduleId: 'branding', moduleLabel: 'Branding', surveyId: 'survey-h' },
  { id: 'survey-9', password: 'SURVEY-9', moduleId: 'console-navigation', moduleLabel: 'Console Navigation', surveyId: 'survey-i' },
  { id: 'survey-fin', password: 'SURVEY-FIN', moduleId: 'finance', moduleLabel: 'Finance', surveyId: 'survey-k' },
  { id: 'survey-crypto', password: 'SURVEY-CRYPTO', moduleId: 'crypto', moduleLabel: 'Crypto', surveyId: 'survey-l' },
  { id: 'survey-demo', password: 'SURVEY-DEMO', moduleId: 'superdashboard-demo', moduleLabel: 'SuperDashboard Demo (read-only)', surveyId: 'survey-j' },

  // Buyer / Customer access — real, dedicated tiers (own module, own survey), mirroring the
  // tester program exactly: demo -> survey -> submit, gated by the same demo-viewed status.
  // "Buyer" previews the real end-consumer experience of a live brand website; "Customer"
  // previews the real Customer Service module a brand uses to support that same buyer.
  { id: 'buyer-1', password: 'BUYER-1', moduleId: 'buyer-overview', moduleLabel: 'Buyer Overview', surveyId: 'survey-buyer' },
  { id: 'buyer-2', password: 'BUYER-2', moduleId: 'buyer-overview', moduleLabel: 'Buyer Overview', surveyId: 'survey-buyer' },
  { id: 'customer-1', password: 'CUSTOMER-1', moduleId: 'customer-overview', moduleLabel: 'Customer Overview', surveyId: 'survey-customer' },
  { id: 'customer-2', password: 'CUSTOMER-2', moduleId: 'customer-overview', moduleLabel: 'Customer Overview', surveyId: 'survey-customer' },
]

export function findCredentialByPassword(password: string): Credential | null {
  return CREDENTIALS.find((credential) => credential.password === password) ?? null
}

// Post-login destination category, keyed off the real credential id — not the moduleId,
// since juliet/tester-10/survey-demo/investor-*/lawyer-review all currently share the same
// 'superdashboard-demo' moduleId but must route to different real destinations from the
// root-domain (www.foundingos.com) login gate.
// 'admin' is a distinct category from the real credential pool above — never returned by
// categorizeCredential (which only classifies real CREDENTIALS ids). It's assigned directly,
// by page-level code, only for the real Super Founder Admin identity (id === 'super-founder-
// admin'), never for the separate passcode-only /tester/admin reviewer (id === 'admin', which
// keeps its original, unchanged, review-only access).
export type CredentialCategory = 'survey' | 'tester' | 'investor' | 'buyer' | 'customer' | 'lawyer' | 'free-roam' | 'admin'

const FREE_ROAM_IDS = new Set(['juliet', 'tester-10', 'survey-demo'])

export function categorizeCredential(id: string): CredentialCategory {
  if (id === 'investor-alpha' || id === 'investor-omega') return 'investor'
  if (id.startsWith('buyer-')) return 'buyer'
  if (id.startsWith('customer-')) return 'customer'
  if (id === 'lawyer-review') return 'lawyer'
  if (FREE_ROAM_IDS.has(id)) return 'free-roam'
  if (id.startsWith('survey-')) return 'survey'
  return 'tester'
}

// Admin's own per-module progress lives in a distinct, namespaced pseudo-tester id
// ("admin-<moduleId>") — never collides with any real credential id (none start with
// "admin-"), so admin running/replaying every demo and survey never touches or overwrites a
// single real tester's row. Each one carries the admin's own real email, so it shows up
// exactly like tester activity for monitoring (see store.server.ts's getOrCreateAdminTester).
export function adminTesterId(moduleId: string): string {
  return `admin-${moduleId}`
}

// Super Founder Admin — full-access account, bypasses the tester credential pool above.
// Password is intentionally kept out of source (env var only, dev fallback for local testing).
export const SUPER_FOUNDER_ADMIN_EMAIL = '2bshaw@gmail.com'
const SUPER_FOUNDER_ADMIN_PASSWORD = process.env.SUPER_FOUNDER_ADMIN_PASSWORD ?? 'founderos-super-admin-dev-only'

export function isSuperFounderAdmin(email: string, password: string): boolean {
  return email.trim().toLowerCase() === SUPER_FOUNDER_ADMIN_EMAIL && password === SUPER_FOUNDER_ADMIN_PASSWORD
}

// Every module a tester can be (re)assigned to, derived from the credential catalog
// so admin reassignment can never point a tester at a module/survey pair that doesn't exist.
export type ModuleOption = { moduleId: ModuleId; moduleLabel: string; surveyId: SurveyId }

export const MODULE_OPTIONS: ModuleOption[] = Array.from(
  new Map(CREDENTIALS.map((credential) => [credential.moduleId, {
    moduleId: credential.moduleId,
    moduleLabel: credential.moduleLabel,
    surveyId: credential.surveyId,
  }])).values(),
)

export function findModuleOption(moduleId: string): ModuleOption | null {
  return MODULE_OPTIONS.find((option) => option.moduleId === moduleId) ?? null
}

export type SectionKind = 'module' | 'businessplan' | 'legal' | 'website' | 'console' | 'pos' | 'intelligence'
export type SurveyQuestion = { id: string; prompt: string; section?: string; sectionKind?: SectionKind; target?: string }
export type Survey = { id: SurveyId; title: string; moduleLabel: string; questions: SurveyQuestion[] }

// Appended to every module survey (survey-a through survey-l) so each one — not just the
// dedicated investor survey — also evaluates comprehension of the business plan concepts
// covered in the demo narration: multi-brand architecture, IntelligenceOS/SystemOS, Guardian,
// Autonomous intelligence, SuperDash, and adaptive (Package Model D) pricing.
export const BUSINESS_PLAN_QUESTIONS: SurveyQuestion[] = [
  { id: 'bp1', prompt: 'Based on the demo, how would you describe the multi-brand FoundingOS ecosystem (26 interconnected apps, each with its own console) in your own words?' },
  { id: 'bp2', prompt: 'Did the demo make it clear how IntelligenceOS and SystemOS work together, and how Guardian and Autonomous intelligence react to real engagement data?' },
  { id: 'bp3', prompt: 'How clearly did SuperDash, real-time engagement ingestion, and the adaptive Package Model D pricing come across as one connected system, rather than separate features?' },
]

// Real, existing brand websites/consoles/POS-style flows in this codebase — no invented
// brands. "Marketplace" maps to the real FoundThat app (this ecosystem's actual
// marketplace-style brand); there is no separate "Marketplace" app. POS/ATS/compliance flows
// and Intelligence Systems (SuperDash/Guardian/Autonomous/BrandMetric) share ONE combined
// macro-section (keeping the survey at 6 macro-sections total, per the explicit breakdown) —
// all four intelligence systems are real systems inside foundingos-console, labelled honestly
// as such rather than implied to be standalone apps.
const COMBINED_POS_INTELLIGENCE_SECTION = 'POS/ATS/Compliance + Intelligence Systems'
const BRAND_WEBSITE_TARGETS = [
  'Retail website', 'Meat website', 'Logistics website', 'Talent website', 'Crypto website',
  'Finance website', 'Health website', 'FoundThat (Marketplace) website', 'FoundingOS website',
  'WhatsApp OS landing pages',
]
const CONSOLE_TARGETS = [
  'Retail console', 'Meat console', 'Logistics console', 'Talent console', 'Crypto console',
  'Finance console', 'Health console', 'Messaging module', 'Customer Service module',
]
const POS_TARGETS = [
  'Retail POS', 'Meat POS', 'Logistics POS', 'Talent ATS', 'FoundThat seller flow', 'Crypto compliance flow',
]
const INTELLIGENCE_TARGETS = [
  'SuperDash', 'Guardian (system safety layer)', 'Autonomous (auto-optimize/auto-coach)', 'BrandMetric (live brand data)',
]

function slugify(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function buildWebsiteQuestions(label: string): SurveyQuestion[] {
  const slug = slugify(label)
  return [
    { id: `web-${slug}-1`, prompt: `${label}: Is the message clear?`, section: 'Websites', sectionKind: 'website', target: label },
    { id: `web-${slug}-2`, prompt: `${label}: Is the purpose easy to understand?`, section: 'Websites', sectionKind: 'website', target: label },
    { id: `web-${slug}-3`, prompt: `${label}: Is navigation simple?`, section: 'Websites', sectionKind: 'website', target: label },
    { id: `web-${slug}-4`, prompt: `${label}: Would someone in a developing country understand this easily?`, section: 'Websites', sectionKind: 'website', target: label },
    { id: `web-${slug}-5`, prompt: `${label}: Does it feel like part of the Quantum WhatsApp OS?`, section: 'Websites', sectionKind: 'website', target: label },
  ]
}

function buildConsoleQuestions(label: string): SurveyQuestion[] {
  const slug = slugify(label)
  return [
    { id: `con-${slug}-1`, prompt: `${label}: Is it easy to use?`, section: 'Consoles', sectionKind: 'console', target: label },
    { id: `con-${slug}-2`, prompt: `${label}: Are buttons and labels clear?`, section: 'Consoles', sectionKind: 'console', target: label },
    { id: `con-${slug}-3`, prompt: `${label}: Does the layout feel simple and familiar?`, section: 'Consoles', sectionKind: 'console', target: label },
    { id: `con-${slug}-4`, prompt: `${label}: Does it feel WhatsApp-like?`, section: 'Consoles', sectionKind: 'console', target: label },
    { id: `con-${slug}-5`, prompt: `${label}: Would someone with low digital literacy understand it?`, section: 'Consoles', sectionKind: 'console', target: label },
  ]
}

function buildPosQuestions(label: string): SurveyQuestion[] {
  const slug = slugify(label)
  return [
    { id: `pos-${slug}-1`, prompt: `${label}: Is the workflow simple?`, section: COMBINED_POS_INTELLIGENCE_SECTION, sectionKind: 'pos', target: label },
    { id: `pos-${slug}-2`, prompt: `${label}: Are the steps easy to follow?`, section: COMBINED_POS_INTELLIGENCE_SECTION, sectionKind: 'pos', target: label },
    { id: `pos-${slug}-3`, prompt: `${label}: Does it feel intuitive?`, section: COMBINED_POS_INTELLIGENCE_SECTION, sectionKind: 'pos', target: label },
    { id: `pos-${slug}-4`, prompt: `${label}: Would someone in a developing country understand it?`, section: COMBINED_POS_INTELLIGENCE_SECTION, sectionKind: 'pos', target: label },
  ]
}

function buildIntelligenceQuestions(label: string): SurveyQuestion[] {
  const slug = slugify(label)
  return [
    { id: `int-${slug}-1`, prompt: `${label}: Is it easy to understand?`, section: COMBINED_POS_INTELLIGENCE_SECTION, sectionKind: 'intelligence', target: label },
    { id: `int-${slug}-2`, prompt: `${label}: Are its labels and signals clear?`, section: COMBINED_POS_INTELLIGENCE_SECTION, sectionKind: 'intelligence', target: label },
    { id: `int-${slug}-3`, prompt: `${label}: Does it feel simple and familiar rather than intimidating?`, section: COMBINED_POS_INTELLIGENCE_SECTION, sectionKind: 'intelligence', target: label },
    { id: `int-${slug}-4`, prompt: `${label}: Does it feel WhatsApp-like?`, section: COMBINED_POS_INTELLIGENCE_SECTION, sectionKind: 'intelligence', target: label },
    { id: `int-${slug}-5`, prompt: `${label}: Would someone with low digital literacy understand it?`, section: COMBINED_POS_INTELLIGENCE_SECTION, sectionKind: 'intelligence', target: label },
  ]
}

// Legal comprehension — was the legal text itself clear and globally accessible? Appended
// first, ahead of the ecosystem-validation targets, since legal understanding is asked about
// before anything else in this section grouping.
export const LEGAL_QUESTIONS: SurveyQuestion[] = [
  { id: 'legal-1', prompt: 'Was the legal text clear?', section: 'Legal', sectionKind: 'legal' },
  { id: 'legal-2', prompt: 'Would someone in a developing country understand it?', section: 'Legal', sectionKind: 'legal' },
  { id: 'legal-3', prompt: 'Was the language simple?', section: 'Legal', sectionKind: 'legal' },
]

// Appended to every survey (module, buyer, customer, and investor alike) so every real tester
// validates clarity, messaging, ease of use, and global/low-literacy accessibility across every
// real brand website, console, POS-style flow, and intelligence system in the ecosystem — not
// just their own assigned module. These are opinion/impression questions grounded in what the
// narrator explained about the wider ecosystem, not a claim that the tester has hands-on used
// every single one of these (only their own assigned module demo is hands-on).
export const ECOSYSTEM_VALIDATION_QUESTIONS: SurveyQuestion[] = [
  ...LEGAL_QUESTIONS,
  ...BRAND_WEBSITE_TARGETS.flatMap(buildWebsiteQuestions),
  ...CONSOLE_TARGETS.flatMap(buildConsoleQuestions),
  ...POS_TARGETS.flatMap(buildPosQuestions),
  ...INTELLIGENCE_TARGETS.flatMap(buildIntelligenceQuestions),
]

// One mini-demo-intro narrator line per broad section kind, shown once (in a full Quantum
// frame) at the start of that section — explains what the user is about to evaluate and why.
export const SECTION_NARRATOR_LINES: Record<SectionKind, string> = {
  module: "Alright, let's start with your assigned module — quick and easy.",
  businessplan: "Now a few quick ones about the bigger picture — the business plan itself.",
  legal: "Quick legal bit — short and global. We keep this clear so anyone, anywhere understands how the OS works.",
  website: "Alright, this part is quick — let's look at some brand websites.",
  console: "Next up, a tiny console check. Super simple.",
  pos: "Okay, this part covers POS/ATS/compliance flows and the intelligence systems together — don't worry, still bite-sized.",
  intelligence: "Now let's peek at one of the intelligence systems — this one's fun.",
}

// Narrator reassurance, rotated section-by-section so the survey never feels overwhelming —
// includes the "OS breathing moments" (subtle companion lines meant to appear sparingly, once
// per macro-section, which this rotation already does by design).
export const PACING_REASSURANCE_LINES = [
  "You're doing great — these sections are small.",
  "Short answers are perfect.",
  "This isn't a test — it's feedback.",
  "We keep everything bite-sized so it's easy.",
  "I'm right here with you.",
  "Take your time — the OS isn't rushing.",
  "This system grows with every person who touches it.",
]

// Micro-break narrator line shown once at every section boundary — after the previous
// section's last question, before the next section's Quantum-framed header. Rotated so it
// never repeats back-to-back across a typical survey's six sections. Includes the "user
// belonging" lines for the end of each survey section.
export const MICRO_BREAK_LINES = [
  "Nice, that section's done — quick breather.",
  "Grab a sip of water if you want — next part is tiny.",
  "Alright, ready for the next bit? It's easy.",
  "You're flying through this — let's keep going.",
  "Short answers are perfect — let's jump to the next part.",
  "This OS is huge, but I promise the sections stay small.",
  "Great progress — this OS is huge, but you're moving through it smoothly.",
  "People like you shape this OS.",
  "Your perspective matters here.",
]

// Developing-country / low-digital-literacy accessibility reminders, rotated for the
// website/console/pos/intelligence sections (the sections this actually applies to).
export const ACCESSIBILITY_REMINDER_LINES = [
  "Imagine someone using this on a low-end phone — would it make sense?",
  "Would someone with low digital literacy understand this?",
  "Does this feel WhatsApp-simple?",
]

// One-off short, reactive quips for specific named targets — a light, human reaction rather
// than a scripted paragraph, grounded honestly in what each one actually is (POS/ATS/compliance
// flows are explicitly still conceptual — no live screens exist for them yet).
export const TARGET_JOKES: Record<string, string> = {
  'Guardian (system safety layer)': "Guardian gets dramatic here — don't mind it.",
  'Autonomous (auto-optimize/auto-coach)': 'Autonomous is thinking… it does that.',
  'BrandMetric (live brand data)': "BrandMetric is basically the OS's heartbeat.",
  'SuperDash': 'SuperDash loves showing off.',
  'Retail POS': "Conceptual for now — no live checkout yet.",
  'Meat POS': 'Conceptual for now — weights and cuts, not SKUs.',
  'Logistics POS': 'Conceptual for now — parcel in, parcel out.',
  'Talent ATS': 'Conceptual for now — tracks application to hire.',
  'FoundThat seller flow': 'Conceptual for now — list it, sell it.',
  'Crypto compliance flow': 'Conceptual for now — careful, checks-first by design.',
}

// Shown once, at the very top of the survey (before any question) — the mission framing that
// explains why this ecosystem-wide survey exists at all.
export const SURVEY_MISSION_NARRATOR_LINE = "You're helping shape a global OS. Short, honest answers are perfect."

export const SURVEYS: Record<SurveyId, Survey> = {
  'survey-a': {
    id: 'survey-a',
    title: 'Survey A — Marketing Suite',
    moduleLabel: 'Marketing Suite',
    questions: [
      { id: 'a1', prompt: 'How intuitive was the campaign builder for creating a new promotion?' },
      { id: 'a2', prompt: 'Which marketing metric matters most to you day-to-day (reach, conversion, ROI, engagement)?' },
      { id: 'a3', prompt: 'Did the marketing dashboard load fast enough for daily use?' },
      { id: 'a4', prompt: 'What is one marketing workflow you wish was automated?' },
      ...BUSINESS_PLAN_QUESTIONS,
      ...ECOSYSTEM_VALIDATION_QUESTIONS,
    ],
  },
  'survey-b': {
    id: 'survey-b',
    title: 'Survey B — Accounting',
    moduleLabel: 'Accounting',
    questions: [
      { id: 'b1', prompt: 'How clear were the invoice and reconciliation views?' },
      { id: 'b2', prompt: 'Did the accounting health indicators match what you expected for your business?' },
      { id: 'b3', prompt: 'What financial report do you check most often?' },
      { id: 'b4', prompt: 'Any friction points when exporting accounting data?' },
      ...BUSINESS_PLAN_QUESTIONS,
      ...ECOSYSTEM_VALIDATION_QUESTIONS,
    ],
  },
  'survey-c': {
    id: 'survey-c',
    title: 'Survey C — Customer Service',
    moduleLabel: 'Customer Service',
    questions: [
      { id: 'c1', prompt: 'How well did the ticket queue reflect real customer urgency?' },
      { id: 'c2', prompt: 'Was the service load indicator useful for staffing decisions?' },
      { id: 'c3', prompt: 'What is missing from the customer service workflow today?' },
      ...BUSINESS_PLAN_QUESTIONS,
      ...ECOSYSTEM_VALIDATION_QUESTIONS,
    ],
  },
  'survey-d': {
    id: 'survey-d',
    title: 'Survey D — Messaging',
    moduleLabel: 'Messaging',
    questions: [
      { id: 'd1', prompt: 'How reliable did message delivery feel during testing?' },
      { id: 'd2', prompt: 'Was message routing to the right team member clear?' },
      { id: 'd3', prompt: 'What messaging volume would break this system in your view?' },
      { id: 'd4', prompt: 'Did you notice any delay between sending and delivery?' },
      ...BUSINESS_PLAN_QUESTIONS,
      ...ECOSYSTEM_VALIDATION_QUESTIONS,
    ],
  },
  'survey-e': {
    id: 'survey-e',
    title: 'Survey E — AI Automation',
    moduleLabel: 'AI Automation',
    questions: [
      { id: 'e1', prompt: "Did FoundAI's suggested actions feel relevant to your brand?" },
      { id: 'e2', prompt: 'How much would you trust an autonomous AI action without manual review?' },
      { id: 'e3', prompt: "What's one task you'd want FoundAI to fully automate?" },
      { id: 'e4', prompt: 'Did any AI suggestion feel wrong or risky?' },
      ...BUSINESS_PLAN_QUESTIONS,
      ...ECOSYSTEM_VALIDATION_QUESTIONS,
    ],
  },
  'survey-f': {
    id: 'survey-f',
    title: 'Survey F — Operations',
    moduleLabel: 'Operations',
    questions: [
      { id: 'f1', prompt: 'How clear was the operational health view across teams?' },
      { id: 'f2', prompt: 'Which operational bottleneck shows up most in your day?' },
      { id: 'f3', prompt: 'Did the operations dashboard reflect real-time state accurately?' },
      ...BUSINESS_PLAN_QUESTIONS,
      ...ECOSYSTEM_VALIDATION_QUESTIONS,
    ],
  },
  'survey-g': {
    id: 'survey-g',
    title: 'Survey G — Sales',
    moduleLabel: 'Sales',
    questions: [
      { id: 'g1', prompt: 'How easy was it to track a deal from lead to close?' },
      { id: 'g2', prompt: 'What sales metric do you check first each morning?' },
      { id: 'g3', prompt: 'Was pipeline forecasting believable based on your own numbers?' },
      { id: 'g4', prompt: "What's missing from the sales workflow?" },
      ...BUSINESS_PLAN_QUESTIONS,
      ...ECOSYSTEM_VALIDATION_QUESTIONS,
    ],
  },
  'survey-h': {
    id: 'survey-h',
    title: 'Survey H — Branding',
    moduleLabel: 'Branding',
    questions: [
      { id: 'h1', prompt: 'Did the brand accent colors and identity feel consistent across screens?' },
      { id: 'h2', prompt: 'How important is per-brand visual customization to you?' },
      { id: 'h3', prompt: 'Any place where branding felt inconsistent or off-brand?' },
      ...BUSINESS_PLAN_QUESTIONS,
      ...ECOSYSTEM_VALIDATION_QUESTIONS,
    ],
  },
  'survey-i': {
    id: 'survey-i',
    title: 'Survey I — Console Navigation',
    moduleLabel: 'Console Navigation',
    questions: [
      { id: 'i1', prompt: 'How quickly could you find the module you were looking for?' },
      { id: 'i2', prompt: 'Was the sidebar grouping (Core/Operations/Analytics/Settings) intuitive?' },
      { id: 'i3', prompt: "What's one navigation shortcut you wish existed?" },
      { id: 'i4', prompt: 'Did any page take too long to load while navigating?' },
      ...BUSINESS_PLAN_QUESTIONS,
      ...ECOSYSTEM_VALIDATION_QUESTIONS,
    ],
  },
  'survey-j': {
    id: 'survey-j',
    title: 'Survey J — SuperDashboard Demo (read-only)',
    moduleLabel: 'SuperDashboard Demo (read-only)',
    questions: [
      { id: 'j1', prompt: 'How useful is a single cross-brand view for a founder or operator?' },
      { id: 'j2', prompt: 'Which SuperDashboard module (marketing, accounting, service, messaging, AI, system health) matters most to you?' },
      { id: 'j3', prompt: 'Did the real-time Quantum Sync indicator feel meaningful or just decorative?' },
      { id: 'j4', prompt: "What's one metric missing from the cross-brand view?" },
      ...BUSINESS_PLAN_QUESTIONS,
      ...ECOSYSTEM_VALIDATION_QUESTIONS,
    ],
  },
  'survey-k': {
    id: 'survey-k',
    title: 'Survey K — Finance',
    moduleLabel: 'Finance',
    questions: [
      { id: 'k1', prompt: 'What accounting tools do you use?' },
      { id: 'k2', prompt: 'How often do you review cashflow?' },
      { id: 'k3', prompt: 'What slows down your finance team?' },
      ...BUSINESS_PLAN_QUESTIONS,
      ...ECOSYSTEM_VALIDATION_QUESTIONS,
    ],
  },
  'survey-l': {
    id: 'survey-l',
    title: 'Survey L — Crypto',
    moduleLabel: 'Crypto',
    questions: [
      { id: 'l1', prompt: 'Do you trade crypto?' },
      { id: 'l2', prompt: 'What platforms do you use?' },
      { id: 'l3', prompt: 'What is your biggest challenge in crypto operations?' },
      ...BUSINESS_PLAN_QUESTIONS,
      ...ECOSYSTEM_VALIDATION_QUESTIONS,
    ],
  },
  'survey-investor': {
    id: 'survey-investor',
    title: 'Investor Survey — FoundingOS Business Plan',
    moduleLabel: 'Investor Briefing',
    questions: [
      { id: 'inv1', prompt: 'In your own words, what is the multi-brand SaaS ecosystem FoundingOS operates (the 26 interconnected apps and multi-console structure)?' },
      { id: 'inv2', prompt: 'How would you describe the difference between the IntelligenceOS and SystemOS layers?' },
      { id: 'inv3', prompt: 'What did the demo show you about Autonomous intelligence (auto-optimize / auto-coach) reacting to high or low engagement?' },
      { id: 'inv4', prompt: "What is Guardian's role in enforcing category-level isolation and brand consistency across the ecosystem?" },
      { id: 'inv5', prompt: 'How useful is SuperDash as a single, unified cross-brand intelligence view for an investor or operator?' },
      { id: 'inv6', prompt: 'How would you describe the adaptive pricing model (Package Model D — SystemOS tiers, industry packs, hardware packs, QuantumOS/IntelligenceOS add-ons)?' },
      { id: 'inv7', prompt: 'In your own words, how does real user behaviour on each brand website feed data back into the OS (scrapers, anomaly detection, brand signals)?' },
      { id: 'inv8', prompt: 'Did the real-time engagement ingestion and Quantum visuals feel credible as evidence of a live, working system?' },
      { id: 'inv9', prompt: 'What is the single strongest signal from this briefing that FoundingOS is a real, differentiated platform rather than a collection of separate brand sites?' },
      ...ECOSYSTEM_VALIDATION_QUESTIONS,
    ],
  },
  'survey-buyer': {
    id: 'survey-buyer',
    title: 'Survey — Buyer Overview',
    moduleLabel: 'Buyer Overview',
    questions: [
      { id: 'buy1', prompt: 'As a buyer, how clear and trustworthy did the brand website feel to shop or browse on?' },
      { id: 'buy2', prompt: 'Was anything confusing or slow in the buying experience you just saw?' },
      { id: 'buy3', prompt: 'What would make you more likely to return to this brand?' },
      ...BUSINESS_PLAN_QUESTIONS,
      ...ECOSYSTEM_VALIDATION_QUESTIONS,
    ],
  },
  'survey-customer': {
    id: 'survey-customer',
    title: 'Survey — Customer Overview',
    moduleLabel: 'Customer Overview',
    questions: [
      { id: 'cust1', prompt: 'How confident would you feel getting support through this Customer Service experience?' },
      { id: 'cust2', prompt: 'Did the ticket/response flow feel fast and human, or slow and robotic?' },
      { id: 'cust3', prompt: 'What is the one thing that would most improve how a brand supports you as a customer?' },
      ...BUSINESS_PLAN_QUESTIONS,
      ...ECOSYSTEM_VALIDATION_QUESTIONS,
    ],
  },
}

// Shown once, as a short bullet list (not a paragraph) in its own "Business plan, in short"
// card — the substantive context every survey needs, since BUSINESS_PLAN_QUESTIONS asks every
// tester/buyer/customer/investor about Guardian, Autonomous, SuperDash, and Package Model D
// pricing, regardless of their assigned module. Grounded in what the ecosystem actually does
// today, not invented claims. Each fact is its own short line — no paragraph, no long text
// block, consistent with the narrator's micro-line-only rule.
export const BUSINESS_PLAN_FACTS = [
  'Eight-plus brands, each with its own website and console.',
  'Guardian keeps every brand in its own lane.',
  'Autonomous auto-optimizes or auto-coaches modules on its own.',
  'SuperDash brings every brand into one live view.',
  'Pricing (Package Model D) adapts on top of it.',
]
// Joined form, used only for narrator audio (spoken, never rendered as visible paragraph text).
export const BUSINESS_PLAN_NARRATION = BUSINESS_PLAN_FACTS.join(' ')

const MODULE_NARRATION_DETAIL: Partial<Record<ModuleId, string>> = {
  'marketing-suite': 'Plan, launch, and track campaigns across the ecosystem, feeding engagement signals straight into SuperDash.',
  'accounting': 'Invoices, revenue, and financial health in one streamlined view, powering the adaptive pricing and finance layers above it.',
  'customer-service': 'Tickets, service-level agreements, and customer happiness — support quality as another live signal the OS can measure.',
  'messaging': 'Conversations, notifications, and outreach across every channel a brand uses, so nothing falls outside the intelligence layer.',
  'ai-automation': "FoundAI — AI-powered workflows and suggestions tailored to this console, turning raw signals into recommended actions.",
  'finance': 'A real, working view of cash flow and financial operations — one of the core inputs the OS uses to score brand health.',
  'crypto': 'Brand-specific crypto operations and market exposure as their own real, live data stream inside the ecosystem.',
  'superdashboard-demo': 'SuperDash itself: every module — marketing, accounting, service, messaging, AI, and system health — rolled up into one live view.',
  'buyer-overview': "The buyer's-eye view — the real brand website a customer lands on, browses, and buys from.",
  'customer-overview': 'Customer Service from the other side of the counter — the real support experience a customer gets.',
}

// Real action names surfaced inside each module's own workbench UI (see app/brand-config.ts) —
// used to ground "how to use it" and "a real example" in genuinely real, clickable actions
// rather than invented ones. Modules without a checked action list fall back to a generic,
// still-honest phrasing in buildNarratorSteps below.
const MODULE_REAL_ACTIONS: Partial<Record<ModuleId, string[]>> = {
  'marketing-suite': ['Launch Campaign', 'Schedule Send', 'Review Analytics'],
  'accounting': ['Create Invoice', 'Reconcile Accounts', 'Review Overdue'],
  'messaging': ['Open Inbox', 'Create Template', 'Assign Conversation'],
  'customer-service': ['Open Ticket Queue', 'Reply to Customer', 'Review CSAT'],
}

export type NarratorStep = { step: string; text: string; detail: string }

// The AI narrator's personality: warm, human, reactive — a short (3–10 word) spoken reaction
// for every beat, never a long scripted paragraph. The practical substance (what the module
// does, how to use it, what happens, what the OS does behind the scenes, a real example, and a
// short summary) lives in "detail" and renders as the card's own body copy; "text" is only the
// narrator's own short reaction to that beat, read aloud by the same voice everywhere.
function buildNarratorSteps(moduleLabel: string, moduleDetail: string, moduleId?: ModuleId): NarratorStep[] {
  const actions = (moduleId && MODULE_REAL_ACTIONS[moduleId]) || null
  return [
    {
      step: '1 · What it does',
      text: 'Alright, here\'s the fun part.',
      detail: `${moduleLabel}: ${moduleDetail}`,
    },
    {
      step: '2 · How to use it',
      text: 'Let me walk you through it.',
      detail: actions
        ? `Try ${actions[0]} below, then ${actions[1].toLowerCase()} — that's the whole flow.`
        : `Open ${moduleLabel} below and try whatever's on screen — it's all real and clickable.`,
    },
    {
      step: '3 · What happens',
      text: 'Watch what happens next.',
      detail: `Every action in ${moduleLabel} updates its numbers live — nothing here is a static screenshot.`,
    },
    {
      step: '4 · Behind the scenes',
      text: "Here's the clever part.",
      detail: 'That same activity becomes a BrandMetric signal — Guardian keeps it in its own lane, Autonomous reacts to it, and SuperDash rolls it up live.',
    },
    {
      step: '5 · A real example',
      text: 'Nice — that worked perfectly.',
      detail: actions
        ? `Try ${actions[2]} now — you'll see it reflected the moment you use it.`
        : `Try one real action in ${moduleLabel} now — you'll see it reflected the moment you use it.`,
    },
    {
      step: '6 · Summary',
      text: "That's the gist — nice work.",
      detail: `That's ${moduleLabel}, in short. Your survey's up next.`,
    },
  ]
}

export const MODULE_NARRATOR_STEPS: Partial<Record<ModuleId, NarratorStep[]>> = Object.fromEntries(
  Object.entries(MODULE_NARRATION_DETAIL).map(([id, detail]) => {
    const label = MODULE_OPTIONS.find((option) => option.moduleId === id)?.moduleLabel ?? id
    return [id, buildNarratorSteps(label, detail, id as ModuleId)]
  }),
) as Partial<Record<ModuleId, NarratorStep[]>>

// Marketing Suite gets its own dedicated 8-step walkthrough (rather than the generic six-beat
// template) — same short reactive-narrator voice, but with steps that map onto its real,
// checked actions (Launch Campaign → Draft/Approve/Publish, Schedule Send, Review Analytics)
// and its place in the wider OS (IntelligenceOS/Guardian/Autonomous), not invented functionality.
const MARKETING_SUITE_NARRATOR_STEPS: NarratorStep[] = [
  { step: '1 · Overview', text: 'This is your marketing command center.', detail: 'Plan, launch, and track campaigns — 12 live right now, reaching 48.2k people.' },
  { step: '2 · Campaign creation', text: "Let's build one together.", detail: 'Launch Campaign starts one, then it moves through Draft → Approve → Publish.' },
  { step: '3 · IntelligenceOS reaction', text: 'Watch the system think in real time.', detail: 'The moment a campaign publishes, its engagement becomes a live BrandMetric signal.' },
  { step: '4 · Engagement flows', text: "Here's where the audience moves.", detail: 'Reach and conversion update live as real people interact with the campaign.' },
  { step: '5 · Category insights', text: 'Guardian gets loud here — check it out.', detail: "Guardian watches this module's data to keep it safely inside its own brand lane." },
  { step: '6 · Autonomous reactions', text: 'The OS makes smart decisions instantly.', detail: 'If a campaign surges or dips, Autonomous auto-optimizes or auto-coaches — no human needed.' },
  { step: '7 · Real promo example', text: "Let's fire off a quick promo.", detail: 'Try Schedule Send on a real campaign row — that\'s the whole promo flow, end to end.' },
  { step: '8 · Summary + next steps', text: "Nice — you're ready to explore more.", detail: "That's Marketing Suite. Your survey's up next, then Free Roam." },
]
MODULE_NARRATOR_STEPS['marketing-suite'] = MARKETING_SUITE_NARRATOR_STEPS

// Full, joined script per module — what the "Play narration" button reads aloud in one go
// (narrator lines only; the practical "detail" copy is read on-screen, not spoken).
export const MODULE_NARRATION: Partial<Record<ModuleId, string>> = Object.fromEntries(
  Object.entries(MODULE_NARRATOR_STEPS).map(([id, steps]) => [id, (steps as NarratorStep[]).map((s) => s.text).join(' ')]),
) as Partial<Record<ModuleId, string>>

export const INVESTOR_NARRATOR_STEPS = buildNarratorSteps(
  'Investor Briefing',
  'The live, cross-brand engagement data behind FoundingOS — the same numbers SuperDash uses, read-only, exactly as an investor should see them.',
)
export const INVESTOR_NARRATION = INVESTOR_NARRATOR_STEPS.map((s) => s.text).join(' ')

// Shown once, at the very first moment a real tester/investor/buyer/customer session enters
// the OS (the top of their first demo/briefing page) — before DEMO_INTRO's more instructional
// copy. The narrator's own personal greeting, distinct from the business-y walkthrough intro.
export const OPENING_NARRATOR_LINE = "Welcome to the Quantum WhatsApp OS. Let's jump in — it's simple and fun."

// Shown alongside OPENING_NARRATOR_LINE, only on a genuine first visit (status ===
// 'registered') — a plain, honest orientation card. The login-details line is worded
// generically ("may differ depending on your assigned role") rather than claiming a single
// universal password, since the real system still uses distinct per-role credentials.
export const TESTER_INSTRUCTION_CARD = {
  title: 'Welcome Tester',
  lines: [
    'Thanks for helping test the Quantum WhatsApp OS.',
    'Your login details may differ depending on your assigned role.',
    "Once you're inside, you don't need to log out to see other modules.",
    "Use the 'Explore Another Part of the OS' panel to jump between demos and surveys.",
    "After each demo, you'll get a short, bite-sized survey.",
    'Free Roam unlocks after your first survey.',
  ],
  narratorLine: "I'll guide you through everything — it's simple.",
}

// Shown instead of OPENING_NARRATOR_LINE whenever a session returns after making real
// progress (status !== 'registered' — i.e. the demo has been viewed and/or a survey run
// exists) — never shown on a genuine first visit. There is no real visit-counter anywhere in
// this data model (TesterStatus has no such field, and adding one would be a schema change),
// so "returning after real progress but before finishing a full survey" is the honest signal
// used here — WELCOME_BACK_SOFT_LINE below is the equally-honest proxy for "returning after
// having finished at least one full survey", using tester.status === 'complete' as the real,
// already-existing milestone rather than an exact (unavailable) visit count.
export const WELCOME_BACK_NARRATOR_LINE =
  "Welcome back — the Quantum WhatsApp OS remembers you. Let's pick up right where you left off."

// Shown instead of WELCOME_BACK_NARRATOR_LINE once a session has completed at least one full
// survey run and returns to the demo/briefing page again (tester.status === 'complete') — a
// real, existing milestone standing in honestly for "a later revisit", since no exact visit
// counter exists to fire this on precisely the second visit and never again.
export const WELCOME_BACK_SOFT_LINE = "Good to see you again — the OS grows every time you return."

// Micro-celebration: shown on the survey page's intro, since reaching the survey always means
// the demo gate was just cleared.
export const DEMO_COMPLETE_CELEBRATION_LINE = "Nice — you just unlocked a new part of the OS."

// Micro-celebration: shown alongside the "end of demo" belonging moment on the demo page's
// final "Ready for your survey?" card.
export const DEMO_END_BELONGING_LINE = "Thanks for being part of this."

// Micro-celebration: shown in the survey's completed state, alongside SURVEY_COMPLETE_NARRATOR_LINE.
export const SURVEY_COMPLETE_CELEBRATION_LINE = "You did it — that was a big one. Thanks for helping shape the OS."

// Shown as a caption directly on the Quantum Free Roam box itself — the closest real,
// honest placement for an "entering Free Roam" moment, since Free Roam links out to a real
// destination page this system doesn't control (so nothing can fire "after" that navigation).
export const FREE_ROAM_ENTERED_LINE = "Alright, explorer — the OS is yours now."

// Shown alongside the Free Roam box as the closing/farewell note — the honest placement for
// "end of Free Roam or extended exploration," for the same reason as FREE_ROAM_ENTERED_LINE.
export const EMOTIONAL_CLOSING_LINE =
  "That's the full Quantum WhatsApp OS — alive, evolving, and built for real people everywhere. Thanks for exploring. Whenever you're ready, I'll be here to guide you through whatever comes next."

// Once-in-a-lifetime signature moment: shown only in the transient client-side "just
// submitted" completion state (SurveyEngine), gated on hasCompletedSurveyBefore === false —
// i.e. tester.runs.length was genuinely 0 before this exact submission. This is a real "only
// once, ever" trigger (unlike a page-revisit-based check) because that client state only ever
// exists as a direct result of the completing action itself, never on a later page load.
export const SIGNATURE_MOMENT_LINE =
  "You've just helped shape the Quantum WhatsApp OS. Most people never get to see a system being born — but you did. Thanks for being part of the beginning."

// Free Roam "first step" moment — shown alongside SIGNATURE_MOMENT_LINE, in the same
// hasCompletedSurveyBefore === false gate, since that is genuinely the first time this session
// could ever reach the Free Roam box (it never rendered before their first completion).
export const FREE_ROAM_FIRST_STEP_LINE = "Go explore — nothing you click can break anything. The OS is yours."

// Universal intro copy shown once, before any demo/briefing content and before any survey,
// for every real tester/investor/buyer/customer session — identical wording everywhere per the
// consistency requirement.
export const DEMO_INTRO = "Quick preview of how this part of the OS works. Demo first, then a short survey."

export const SURVEY_INTRO = "Thanks for the demo — a few quick thoughts next. Short, honest answers are perfect."

// Shown the moment a survey run is submitted — the narrator's own line, followed by the
// Quantum Free Roam invitation. Same voice, carried through from the demo into the survey step.
export const NARRATOR_SURVEY_LINE = "Thanks for sticking with me — now let's see what you thought."

export const SURVEY_COMPLETE_NARRATOR_LINE =
  "You've done your part — now the OS evolves. Want to explore the system live? Free Roam is waiting."

export const FREE_ROAM_INVITE_LINES = [
  "Alright, ready to explore the OS in 360°? Free Roam is your playground — nothing you click can break anything.",
  "Go ahead, jump in. I'll be right here if you need me.",
  "If you want to see how everything connects, Free Roam is where the magic is.",
]

export const FREE_ROAM_TIPS = [
  "Check out SuperDash — it's the brain of the whole OS.",
  "Guardian gets dramatic, but it's worth a look.",
  "Autonomous reacts to real engagement in real time — go see it.",
  "BrandMetric shows you the heartbeat of every brand.",
]

// Short, reactive line shown once above the brand-cards row (FoundingOS, FoundRetail,
// FoundMeat, FoundTalent, FoundCrypto, FoundThat, FoundFinance, FoundHealth,
// FoundLogistics) on demo/survey/investor/dashboard screens — introduces the real brands
// without altering the row/cards themselves.
export const BRAND_ROW_NARRATOR_LINE = 'Eight real brands, one OS.'

// "Free Roam" for a tester/investor/buyer/customer session means real, read-only revisiting of
// whatever real page their module already unlocks — there is no separate /free-roam route.
// Shared so the demo page and the post-survey completion state always agree on the destination.
export function getFreeRoamHref(moduleId: string): string {
  if (moduleId === 'superdashboard-demo') return '/superdashboard?readOnly=1'
  if (moduleId === 'finance') return '/finance'
  if (moduleId === 'crypto') return '/crypto'
  if (moduleId === 'marketing-suite') return '/modules/marketing'
  if (moduleId === 'accounting') return '/modules/accounting'
  if (moduleId === 'customer-service' || moduleId === 'customer-overview') return '/modules/customer-service'
  if (moduleId === 'messaging') return '/modules/messaging'
  if (moduleId === 'ai-automation') return '/modules/foundai-demo'
  if (moduleId === 'buyer-overview') return 'https://retail.foundingos.com'
  if (moduleId === 'investor-overview') return '/investor'
  return `/tester/demo/${moduleId}`
}

// Demo & Survey Switcher — a pure navigation aid: no backend mutation, no role change,
// no bypass of any existing gate. Every option links to a genuinely real, already-existing
// destination (never a fabricated one), and is only marked "available" when the CURRENT
// session's real category/moduleId can actually reach it without hitting an existing gate:
// - Retail Demo / Messaging Console Demo: real, ungated pages any authenticated session can
//   already reach (confirmed: /modules/* carries no per-tester moduleId check, only
//   /tester/demo/[moduleId] does).
// - Guardian / Autonomous / BrandMetric Demo: middleware.ts explicitly redirects
//   tester/survey/buyer/customer sessions away from /superdashboard and /system/guardian to
//   /tester/survey — only admin/free-roam/investor/lawyer are actually let in. Shown honestly
//   as unavailable (informational only) for everyone else, never a broken/misleading link.
// - Tester/Buyer/Customer/Investor Survey: /tester/survey always renders the CURRENT session's
//   own SURVEYS[tester.surveyId] — there is no way to view a different role's distinct survey
//   without actually being that role. Only the option matching the session's real category is
//   ever marked available; the other three are shown as informational only.
// - Admin (the real Super Founder Admin identity only): every option is unlocked, exactly as
//   requested — nothing hidden, nothing gated. The S1/S2/S3 survey shortcuts carry a
//   moduleId so /tester/survey knows which one to render (admin has no single assigned
//   module the way a real tester does); admin's own full module-by-module grid on
//   /tester/dashboard covers every other module beyond these 9 quick shortcuts.
export const SWITCHER_PANEL_TITLE = 'Explore Another Part of the OS'
export const SWITCHER_PANEL_NARRATOR_LINE =
  'Jump anywhere you like — everything here is safe, guided, and read-only.'

// Shown directly above the Free Roam box on the survey-completion screen — the "unlocked a
// new level" framing for reaching Free Roam.
export const FREE_ROAM_UNLOCK_LINE =
  "Nice work — you've completed the demo and survey. You've just unlocked a new level: Free Roam."

export type SwitcherOption = { code: string; label: string; href: string; available: boolean; note?: string }

export function buildSwitcherOptions(category: CredentialCategory): SwitcherOption[] {
  const isAdmin = category === 'admin'
  const superDashAllowed = isAdmin || category === 'free-roam' || category === 'investor' || category === 'lawyer'
  const superDashNote = 'Read-only for admin, free-roam, and investor sessions — conceptual for yours right now.'
  return [
    { code: 'R1', label: 'Retail Demo', href: 'https://retail.foundingos.com', available: true },
    { code: 'M1', label: 'Messaging Console Demo', href: '/modules/messaging', available: true },
    { code: 'G1', label: 'Guardian Demo', href: '/system/guardian', available: superDashAllowed, note: superDashAllowed ? undefined : superDashNote },
    { code: 'A1', label: 'Autonomous Demo', href: '/superdashboard?readOnly=1', available: superDashAllowed, note: superDashAllowed ? undefined : superDashNote },
    { code: 'B1', label: 'BrandMetric Demo', href: '/superdashboard?readOnly=1', available: superDashAllowed, note: superDashAllowed ? undefined : superDashNote },
    { code: 'S1', label: 'Tester Survey', href: isAdmin ? '/tester/survey?moduleId=marketing-suite' : '/tester/survey', available: isAdmin || category === 'tester' || category === 'survey', note: 'Only available while signed in with a tester access code.' },
    { code: 'S2', label: 'Buyer Survey', href: isAdmin ? '/tester/survey?moduleId=buyer-overview' : '/tester/survey', available: isAdmin || category === 'buyer', note: 'Only available while signed in with a buyer access code.' },
    { code: 'S3', label: 'Customer Survey', href: isAdmin ? '/tester/survey?moduleId=customer-overview' : '/tester/survey', available: isAdmin || category === 'customer', note: 'Only available while signed in with a customer access code.' },
    { code: 'S4', label: 'Investor Survey', href: '/investor', available: isAdmin || category === 'investor', note: 'Only available while signed in with an investor access code.' },
    { code: 'S5', label: 'Lawyer Survey', href: isAdmin ? '/tester/survey?moduleId=superdashboard-demo' : '/tester/survey', available: isAdmin || category === 'lawyer', note: 'Only available while signed in with a lawyer access code.' },
  ]
}

// Shared, no-new-file client script for the switcher's optional code box: looks up the typed
// code among the rendered options (via data attributes) and either navigates to a real,
// available destination or shows the honest "not available for your session" note inline —
// never a silent failure, never a fabricated destination.
export const SWITCHER_CODE_SCRIPT = `
(function () {
  function run() {
    var form = document.querySelector('[data-switcher-form]');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('[data-switcher-code]');
      var code = ((input && input.value) || '').trim().toUpperCase();
      var msg = form.querySelector('[data-switcher-message]');
      var target = form.querySelector('[data-code="' + code + '"]');
      if (!target) {
        if (msg) msg.textContent = code ? 'Code not recognized — try one from the list above.' : 'Type a code first (e.g. R1, M1, S1).';
        return;
      }
      if (target.getAttribute('data-available') === 'true') {
        window.location.href = target.getAttribute('data-href');
        return;
      }
      if (msg) msg.textContent = target.getAttribute('data-note') || "That part of the OS isn't available for your current session.";
    });
  }
  if (document.readyState === 'complete' || document.readyState === 'interactive') run();
  else document.addEventListener('DOMContentLoaded', run);
})();
`

// Shared, no-new-file audio narration engine — reads only the short, visible micro-line text
// sitting on each narrator/step card (never a long-form concatenated script) aloud via the
// browser's built-in speech synthesis (works on desktop and mobile with zero external audio
// assets). Every play is a direct result of a click on that card's own small narrate button —
// there is no auto-play anywhere; ON/OFF only controls whether the narrator (panels + narrate
// buttons) is visible/usable at all. Rendered once per page via a plain <script> tag.
export const NARRATION_PLAYER_SCRIPT = `
(function () {
  function speak(text, onEnd) {
    try {
      if (!text || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      var utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.98;
      if (onEnd) utter.onend = onEnd;
      window.speechSynthesis.speak(utter);
    } catch (err) {}
  }
  function narrationFor(el) { return el ? el.getAttribute('data-narration') : ''; }
  function setButtonLabel(btn, label) { if (btn) btn.textContent = label; }

  // Play / Stop toggle, scoped to the button's own nearest [data-narration] card — each button
  // only ever speaks that one card's own short micro-line, never a joined multi-step script.
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-narrate-btn]');
    if (!btn || btn.disabled) return;
    var idleLabel = btn.getAttribute('data-idle-label') || '▶ Play narration';
    var playingLabel = btn.getAttribute('data-playing-label') || '■ Stop narration';
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setButtonLabel(btn, idleLabel);
      return;
    }
    speak(narrationFor(btn.closest('[data-narration]')), function () { setButtonLabel(btn, idleLabel); });
    setButtonLabel(btn, playingLabel);
  });

  document.addEventListener('change', function (e) {
    if (e.target && e.target.id === 'narrator-enabled-toggle') {
      setNarratorEnabled(e.target.checked);
    }
  });

  // Narrator ON/OFF — OFF hides every narrator panel AND every narrate button on the page
  // entirely (not just mutes audio) and stops any speech in progress; persisted so it stays
  // off across pages. ON never plays anything by itself — every line only ever plays from a
  // direct click on its own button.
  function setNarratorEnabled(enabled) {
    var panels = document.querySelectorAll('.quantum-narrator-panel');
    for (var i = 0; i < panels.length; i += 1) panels[i].style.display = enabled ? '' : 'none';
    var buttons = document.querySelectorAll('[data-narrate-btn]');
    for (var j = 0; j < buttons.length; j += 1) {
      buttons[j].style.display = enabled ? '' : 'none';
      buttons[j].disabled = !enabled;
    }
    if (!enabled) { try { window.speechSynthesis.cancel(); } catch (err) {} }
    try { localStorage.setItem('fo-narrator-enabled', enabled ? '1' : '0'); } catch (err) {}
  }

  var narratorToggle = document.getElementById('narrator-enabled-toggle');
  var narratorEnabled = true;
  try { narratorEnabled = localStorage.getItem('fo-narrator-enabled') !== '0'; } catch (err) {}
  if (narratorToggle) narratorToggle.checked = narratorEnabled;
  setNarratorEnabled(narratorEnabled);
})();
`
