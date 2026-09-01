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
export type CredentialCategory = 'survey' | 'tester' | 'investor' | 'buyer' | 'customer' | 'lawyer' | 'free-roam'

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

export type SectionKind = 'module' | 'businessplan' | 'website' | 'console' | 'pos' | 'intelligence'
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
// marketplace-style brand); there is no separate "Marketplace" app. Intelligence Systems
// (SuperDash/Guardian/Autonomous/BrandMetric) get their own bite-sized section, separate from
// the brand consoles, per the explicit section breakdown — all four are real systems inside
// foundingos-console, labelled honestly as such rather than implied to be standalone apps.
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
    { id: `pos-${slug}-1`, prompt: `${label}: Is the workflow simple?`, section: 'POS/ATS/Compliance Flows', sectionKind: 'pos', target: label },
    { id: `pos-${slug}-2`, prompt: `${label}: Are the steps easy to follow?`, section: 'POS/ATS/Compliance Flows', sectionKind: 'pos', target: label },
    { id: `pos-${slug}-3`, prompt: `${label}: Does it feel intuitive?`, section: 'POS/ATS/Compliance Flows', sectionKind: 'pos', target: label },
    { id: `pos-${slug}-4`, prompt: `${label}: Would someone in a developing country understand it?`, section: 'POS/ATS/Compliance Flows', sectionKind: 'pos', target: label },
  ]
}

function buildIntelligenceQuestions(label: string): SurveyQuestion[] {
  const slug = slugify(label)
  return [
    { id: `int-${slug}-1`, prompt: `${label}: Is it easy to understand?`, section: 'Intelligence Systems', sectionKind: 'intelligence', target: label },
    { id: `int-${slug}-2`, prompt: `${label}: Are its labels and signals clear?`, section: 'Intelligence Systems', sectionKind: 'intelligence', target: label },
    { id: `int-${slug}-3`, prompt: `${label}: Does it feel simple and familiar rather than intimidating?`, section: 'Intelligence Systems', sectionKind: 'intelligence', target: label },
    { id: `int-${slug}-4`, prompt: `${label}: Does it feel WhatsApp-like?`, section: 'Intelligence Systems', sectionKind: 'intelligence', target: label },
    { id: `int-${slug}-5`, prompt: `${label}: Would someone with low digital literacy understand it?`, section: 'Intelligence Systems', sectionKind: 'intelligence', target: label },
  ]
}

// Appended to every survey (module, buyer, customer, and investor alike) so every real tester
// validates clarity, messaging, ease of use, and global/low-literacy accessibility across every
// real brand website, console, POS-style flow, and intelligence system in the ecosystem — not
// just their own assigned module. These are opinion/impression questions grounded in what the
// narrator explained about the wider ecosystem, not a claim that the tester has hands-on used
// every single one of these (only their own assigned module demo is hands-on).
export const ECOSYSTEM_VALIDATION_QUESTIONS: SurveyQuestion[] = [
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
  website: "Alright, this part is quick — let's look at some brand websites.",
  console: "Next up, a tiny console check. Super simple.",
  pos: "Okay, POS time. Don't worry, this is bite-sized.",
  intelligence: "Now let's peek at one of the intelligence systems — this one's fun.",
}

// Narrator reassurance, rotated section-by-section so the survey never feels overwhelming.
export const PACING_REASSURANCE_LINES = [
  "You're doing great — these sections are small.",
  "Short answers are perfect.",
  "This isn't a test — it's feedback.",
  "We keep everything bite-sized so it's easy.",
]

// Developing-country / low-digital-literacy accessibility reminders, rotated for the
// website/console/pos/intelligence sections (the sections this actually applies to).
export const ACCESSIBILITY_REMINDER_LINES = [
  "Imagine someone using this on a low-end phone — would it make sense?",
  "Would someone with low digital literacy understand this?",
  "Does this feel WhatsApp-simple?",
]

// One-off humour lines for specific targets, shown alongside that target's own short intro —
// not every target gets a joke, just the ones with real personality.
export const TARGET_JOKES: Record<string, string> = {
  'Guardian (system safety layer)': "Guardian gets dramatic here, but we love it.",
  'Autonomous (auto-optimize/auto-coach)': "Autonomous is about to make a decision — don't blink.",
  'Retail POS': "Retail POS is the diva of the group — let's see how it behaves.",
}

// Shown once, at the very top of the survey (before any question) — the mission framing that
// explains why this ecosystem-wide survey exists at all.
export const SURVEY_MISSION_NARRATOR_LINE =
  "This isn't a normal survey — you're helping shape a global operating system. We're building the Quantum WhatsApp OS, designed to be simple enough for anyone, anywhere, even on low-end devices. That's why we ask about every website, every console, and every POS flow. Your answers don't need to be long — just honest."

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

// A single, shared narration voice/storyline used across every module demo and the investor
// briefing — grounded in what each module actually does today, not invented claims. Every
// module's narration begins with the same BUSINESS_PLAN_NARRATION story (so the "single
// narrator" storyline is identical everywhere), followed by a module-specific detail sentence.
export const BUSINESS_PLAN_NARRATION =
  'FoundingOS is a multi-brand SaaS ecosystem — twenty-six interconnected apps across eight-plus brands, each with its own public website and its own console, all sharing one architecture. ' +
  'Two layers sit underneath every brand: SystemOS, which handles tiers, industry packs, and hardware packs; and IntelligenceOS, the layer that reads live signals and turns them into decisions. ' +
  'Every brand website feeds real user behaviour back into the OS — engagement events are ingested in real time, scored, and watched for anomalies by real scrapers and brand-signal feeds. ' +
  'Guardian is the safety layer: it enforces category-level isolation, lockdown, and brand consistency, so no brand can bleed into another and every UI boundary stays intact. ' +
  'Autonomous intelligence watches that same engagement data and reacts on its own — auto-optimizing a module that is surging, and auto-coaching one that is degrading, without a human in the loop. ' +
  'SuperDash brings all of it together in one unified, cross-brand dashboard, so an operator can see every brand, every module, and every anomaly in a single live view. ' +
  'Pricing adapts to match: Package Model D layers SystemOS tiers, industry packs, hardware packs, and QuantumOS and IntelligenceOS add-ons on top of a SuperDash view that always stays unrestricted. ' +
  'The quantum-styled visuals across the ecosystem are not decoration — they are the live representation of that same real-time engagement and anomaly data moving through the system right now.'

const MODULE_NARRATION_DETAIL: Partial<Record<ModuleId, string>> = {
  'marketing-suite': 'This module, Marketing Suite, lets a brand plan, launch, and track campaigns across the ecosystem, feeding engagement signals straight into SuperDash.',
  'accounting': 'This module, Accounting, brings invoices, revenue, and financial health into one streamlined view for each brand, powering the adaptive pricing and finance layers above it.',
  'customer-service': 'This module, Customer Service, tracks tickets, service-level agreements, and customer happiness, so support quality becomes another live signal the OS can measure.',
  'messaging': 'This module, Messaging, unifies conversations, notifications, and outreach across every channel a brand uses, so nothing falls outside the intelligence layer.',
  'ai-automation': 'This module is FoundAI — AI-powered workflows and suggestions tailored to this console, the automation layer that turns raw signals into recommended actions.',
  'finance': 'This module, Finance, gives each brand a real, working view of cash flow and financial operations, one of the core inputs the OS uses to score brand health.',
  'crypto': 'This module, Crypto, tracks brand-specific crypto operations and market exposure as its own real, live data stream inside the ecosystem.',
  'superdashboard-demo': 'This module is SuperDash itself: every module — marketing, accounting, service, messaging, AI, and system health — rolled up into one live intelligence layer for a founder or operator.',
  'buyer-overview': "This is the buyer's-eye view — the real brand website a customer actually lands on, browses, and buys from, which is where all of this real engagement data starts.",
  'customer-overview': 'This is Customer Service from the other side of the counter — the real support experience a customer gets, and another live signal the OS folds straight into brand health.',
}

export type NarratorStep = { step: string; text: string }

// The AI narrator's personality, applied identically everywhere: warm, confident, a little
// funny, talks like a founder who genuinely loves this product and knows every corner of it —
// speaking as part of the Quantum WhatsApp OS itself. Every demo — every tester module, the
// investor briefing, buyer, customer — gets the same six beats, so the guided, step-by-step
// feel (and the voice) never changes, only the module detail slotted into "Explanation".
function buildNarratorSteps(moduleLabel: string, moduleDetail: string): NarratorStep[] {
  return [
    {
      step: '1 · Intro',
      text: `Welcome inside the Quantum WhatsApp OS — let me show you around. Alright, let me show you something cool about ${moduleLabel}.`,
    },
    {
      step: '2 · Explanation',
      text: `${BUSINESS_PLAN_NARRATION} ${moduleDetail}`,
    },
    {
      step: '3 · Humour',
      text: "This module is one of my favourites. Don't tell Guardian. Watch how IntelligenceOS reacts here — it's like magic, but with maths. Guardian gets a little dramatic about isolation and lockdown sometimes, but honestly? We love that about it.",
    },
    {
      step: '4 · Insight',
      text: "You're inside the OS now. Everything you see is live, real, and reactive — every click, every message flows straight into a BrandMetric signal, scored, watched for anomalies by real scrapers, and rolled into SuperDash in real time. No vanity numbers, no guesswork.",
    },
    {
      step: '5 · Mission',
      text: "And here's the whole point of it, honestly: we're building the WhatsApp OS — the operating system for real human engagement. Everything you see here is designed to understand people, react to behaviour, and help brands operate in real time.",
    },
    {
      step: '6 · Wrap-up',
      text: `That's ${moduleLabel}, in a nutshell. Take your time exploring, and when you're ready, I'll walk you into a quick survey — thanks for sticking with me this far.`,
    },
  ]
}

export const MODULE_NARRATOR_STEPS: Partial<Record<ModuleId, NarratorStep[]>> = Object.fromEntries(
  Object.entries(MODULE_NARRATION_DETAIL).map(([id, detail]) => {
    const label = MODULE_OPTIONS.find((option) => option.moduleId === id)?.moduleLabel ?? id
    return [id, buildNarratorSteps(label, detail)]
  }),
) as Partial<Record<ModuleId, NarratorStep[]>>

// Full, joined script per module — what the "Play narration" button reads aloud in one go.
export const MODULE_NARRATION: Partial<Record<ModuleId, string>> = Object.fromEntries(
  Object.entries(MODULE_NARRATOR_STEPS).map(([id, steps]) => [id, (steps as NarratorStep[]).map((s) => s.text).join(' ')]),
) as Partial<Record<ModuleId, string>>

export const INVESTOR_NARRATOR_STEPS = buildNarratorSteps(
  'Investor Briefing',
  'This briefing walks you through the live, cross-brand engagement data behind FoundingOS — the same numbers SuperDash uses, read-only, exactly as an investor should see them.',
)
export const INVESTOR_NARRATION = INVESTOR_NARRATOR_STEPS.map((s) => s.text).join(' ')

// Universal intro copy shown once, before any demo/briefing content and before any survey,
// for every real tester/investor/buyer/customer session — identical wording everywhere per the
// consistency requirement.
export const DEMO_INTRO =
  "Welcome to your guided module demo. This walkthrough gives you a clear, simple preview of how this part of the FoundingOS ecosystem works. You'll see how real engagement, real behaviour, and real intelligence flow through the OS — exactly as described in our business plan. Once you finish the demo, you'll move straight into a short survey so we can understand your reactions, expectations, and insights."

export const SURVEY_INTRO =
  "Thanks for completing the demo. Before we jump into Free Roam, let's get your thoughts — they help shape the Quantum WhatsApp OS. This survey now covers your module plus every brand website, console, and POS flow across the ecosystem, so quick, honest answers are perfect — no need to write an essay for each one."

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

// Shared, no-new-file audio narration engine: reads MODULE_NARRATION / INVESTOR_NARRATION text
// aloud via the browser's built-in speech synthesis (works on desktop and mobile with zero
// external audio assets). One "Play narration" click always works; the auto-play checkbox is a
// best-effort convenience (mobile browsers may still block audio without a user gesture — the
// manual button is always the reliable path). Rendered once per page via a plain <script> tag.
export const NARRATION_PLAYER_SCRIPT = `
(function () {
  function speak(text) {
    try {
      if (!text || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      var utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.98;
      window.speechSynthesis.speak(utter);
    } catch (err) {}
  }
  function narrationFor(el) { return el ? el.getAttribute('data-narration') : ''; }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-narrate-btn]');
    if (!btn) return;
    speak(narrationFor(btn.closest('[data-narration]')));
  });
  document.addEventListener('change', function (e) {
    if (e.target && e.target.id === 'demo-autoplay-toggle') {
      try { localStorage.setItem('fo-demo-autoplay', e.target.checked ? '1' : '0'); } catch (err) {}
    }
  });
  var toggle = document.getElementById('demo-autoplay-toggle');
  var wantsAutoplay = false;
  try { wantsAutoplay = localStorage.getItem('fo-demo-autoplay') === '1'; } catch (err) {}
  if (toggle) toggle.checked = wantsAutoplay;
  if (wantsAutoplay) {
    var card = document.querySelector('[data-narration]');
    setTimeout(function () { speak(narrationFor(card)); }, 500);
  }
})();
`
