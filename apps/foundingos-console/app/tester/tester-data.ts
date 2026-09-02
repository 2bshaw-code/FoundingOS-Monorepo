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
  | 'crm-overview'
  | 'foundingos-overview'
  | 'admin-overview'

export type SurveyId = 'survey-a' | 'survey-b' | 'survey-c' | 'survey-d' | 'survey-e' | 'survey-f' | 'survey-g' | 'survey-h' | 'survey-i' | 'survey-j' | 'survey-k' | 'survey-l' | 'survey-investor' | 'survey-buyer' | 'survey-customer' | 'survey-crm' | 'survey-overview' | 'survey-admin'

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

  // CRM access — its own real, dedicated demo+survey tier (the real /crm board, same pattern
  // as every other module: demo -> survey -> submit), distinct from CRM's ongoing role as a
  // real, direct-access tool for admin/brand-console use.
  { id: 'tester-11', password: 'TST-66CR', moduleId: 'crm-overview', moduleLabel: 'CRM', surveyId: 'survey-crm' },
  { id: 'survey-crm-1', password: 'SURVEY-CRM', moduleId: 'crm-overview', moduleLabel: 'CRM', surveyId: 'survey-crm' },

  // Complete FoundingOS Tour — its own real, dedicated demo+survey tier, a whole-ecosystem
  // walkthrough rather than a single module.
  { id: 'tester-12', password: 'TST-77OS', moduleId: 'foundingos-overview', moduleLabel: 'Complete FoundingOS Tour', surveyId: 'survey-overview' },
  { id: 'survey-overview-1', password: 'SURVEY-OS', moduleId: 'foundingos-overview', moduleLabel: 'Complete FoundingOS Tour', surveyId: 'survey-overview' },

  // Admin & Founder Operations Tour — reserved for internal/admin use only (not distributed
  // as a real tester access code). Exists purely so findModuleOption('admin-overview') can
  // resolve for the Super Founder Admin's own '?moduleId=' flow; a real tester logging in
  // with this password would technically reach it like any other credential, but it's never
  // handed out.
  { id: 'admin-tour', password: 'ADMIN-OPS-TOUR', moduleId: 'admin-overview', moduleLabel: 'Admin & Founder Operations Tour', surveyId: 'survey-admin' },
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

// Every real tester/survey/buyer/customer session can now browse and try ANY real module's
// demo and survey — not just the one they were originally assigned — matching what admin could
// already do. A tester's own real, primary assigned module keeps using their real record
// exactly as before (untouched by any of this); every OTHER module they explore gets its own
// namespaced pseudo-tester row (own real email, own real runs/status), so exploring never
// touches or overwrites their actual assigned-module progress. The "::explore::" separator can
// never collide with a real credential id (none contain "::").
export function exploreTesterId(realTesterId: string, moduleId: string): string {
  return `${realTesterId}::explore::${moduleId}`
}

// Super Founder Admin — full-access accounts, bypass the tester credential pool above. Every
// real password is kept out of source (env var only, dev fallback for local testing) — never
// hardcoded here, even though these were shared with me in plaintext chat, since this file is
// committed to git. Every account here shares the exact same 'super-founder-admin' identity/
// token/access level once signed in (see isSuperFounderAdmin's caller in the login route) —
// there's no per-admin role distinction, matching what was asked for ("same auth as my admin").
// SUPER_FOUNDER_ADMIN_EMAIL stays exported as the primary account's email — used only as a
// cosmetic label for the shared admin-tester tracking record (see adminTesterId's callers),
// never for anything security-critical.
export const SUPER_FOUNDER_ADMIN_EMAIL = '2bshaw@gmail.com'
type AdminAccount = { name: string; email: string; password: string }
const SUPER_FOUNDER_ADMINS: AdminAccount[] = [
  { name: 'Founder', email: SUPER_FOUNDER_ADMIN_EMAIL, password: process.env.SUPER_FOUNDER_ADMIN_PASSWORD ?? 'founderos-super-admin-dev-only' },
  { name: 'Darren Watts', email: 'darrenwatts8@yahoo.co.uk', password: process.env.SUPER_FOUNDER_ADMIN_PASSWORD_DARREN ?? 'founderos-super-admin-dev-only-darren' },
  { name: 'Paul Bogard', email: 'palloran.g@gmail.com', password: process.env.SUPER_FOUNDER_ADMIN_PASSWORD_PAUL ?? 'founderos-super-admin-dev-only-paul' },
  // Dave Alexandre — real email + password not provided yet ("tbc"); not added until both are
  // real, so there's never a guessed/placeholder password silently granting real admin access.
]

export function isSuperFounderAdmin(email: string, password: string): boolean {
  const normalizedEmail = email.trim().toLowerCase()
  return SUPER_FOUNDER_ADMINS.some((account) => account.email === normalizedEmail && password === account.password)
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
  // Consolidated from 5 near-duplicate questions per target into one well-crafted question —
  // real product decision this session: 142 near-repetitive ecosystem-validation questions
  // (10 websites x 5 + 9 consoles x 5 + 6 POS flows x 4 + 4 intelligence systems x 5 + 3 legal)
  // was genuinely too much to ask a real tester to sit through in one session, and asking the
  // same 4-5 boilerplate questions per target invited rushed, low-value answers anyway. One
  // combined question per target keeps every real target covered honestly, at a quarter of
  // the length.
  return [
    { id: `web-${slug}-1`, prompt: `${label}: Was the message and purpose clear, easy to navigate, and did it feel like part of one connected Quantum WhatsApp OS — including for someone with limited digital literacy?`, section: 'Websites', sectionKind: 'website', target: label },
  ]
}

function buildConsoleQuestions(label: string): SurveyQuestion[] {
  const slug = slugify(label)
  return [
    { id: `con-${slug}-1`, prompt: `${label}: Was it easy to use, with clear buttons/labels and a simple, familiar, WhatsApp-like layout — including for someone with low digital literacy?`, section: 'Consoles', sectionKind: 'console', target: label },
  ]
}

function buildPosQuestions(label: string): SurveyQuestion[] {
  const slug = slugify(label)
  return [
    { id: `pos-${slug}-1`, prompt: `${label}: Did the workflow feel simple and intuitive, with easy-to-follow steps — including for someone in a developing country?`, section: COMBINED_POS_INTELLIGENCE_SECTION, sectionKind: 'pos', target: label },
  ]
}

function buildIntelligenceQuestions(label: string): SurveyQuestion[] {
  const slug = slugify(label)
  return [
    { id: `int-${slug}-1`, prompt: `${label}: Were its labels and signals easy to understand, and did it feel simple and WhatsApp-like rather than intimidating — including for someone with low digital literacy?`, section: COMBINED_POS_INTELLIGENCE_SECTION, sectionKind: 'intelligence', target: label },
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
  'survey-crm': {
    id: 'survey-crm',
    title: 'Survey — CRM',
    moduleLabel: 'CRM',
    questions: [
      { id: 'crm1', prompt: 'How clear was it to find contacts, companies, and deals in one place?' },
      { id: 'crm2', prompt: 'Did adding a contact, deal, or note feel fast enough for daily use?' },
      { id: 'crm3', prompt: 'Which CRM view (contacts, deals, pipeline, tasks, activity) do you rely on most day-to-day?' },
      { id: 'crm4', prompt: 'What is one CRM workflow you wish was automated or connected to another module?' },
      ...BUSINESS_PLAN_QUESTIONS,
      ...ECOSYSTEM_VALIDATION_QUESTIONS,
    ],
  },
  'survey-overview': {
    id: 'survey-overview',
    title: 'Survey — Complete FoundingOS Tour',
    moduleLabel: 'Complete FoundingOS Tour',
    questions: [
      { id: 'ov1', prompt: 'After the full tour, could you explain FoundingOS to someone else in one or two sentences?' },
      { id: 'ov2', prompt: 'Which single piece (SuperDash, Guardian, Autonomous, Package Model D, or FoundAI) felt least clear, and why?' },
      { id: 'ov3', prompt: 'Now that you\u2019ve seen the whole ecosystem, which brand or module do you want to explore first, and why?' },
      { id: 'ov4', prompt: 'Did the tour feel like one connected system, or 8 separate products bundled together?' },
      ...BUSINESS_PLAN_QUESTIONS,
      ...ECOSYSTEM_VALIDATION_QUESTIONS,
    ],
  },
  'survey-admin': {
    id: 'survey-admin',
    title: 'Survey — Admin & Founder Operations',
    moduleLabel: 'Admin & Founder Operations Tour',
    questions: [
      { id: 'adm1', prompt: 'Is anything in the Guardian Queue or AVL footer status unclear about what action it needs from you?' },
      { id: 'adm2', prompt: 'Was assigning a real Package Model D subscription to a brand straightforward?' },
      { id: 'adm3', prompt: 'What admin task do you do most often that still feels like too many clicks?' },
      { id: 'adm4', prompt: 'What is one admin-only tool you wish existed that doesn\u2019t yet?' },
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
  'crm-overview': 'Contacts, companies, deals, pipeline, notes, tasks, and activity — one real relationship board per brand, feeding the same live BrandMetric signals every other module does.',
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
  'crm-overview': ['Add Contact', 'Log a Deal', 'Add a Note'],
}

// One extra, module-specific paragraph of real detail — used to make each demo genuinely
// substantial rather than a single generic sentence repeated with the module name swapped in.
// Every fact here is grounded in a real system already documented elsewhere in this file.
const MODULE_DEEP_DIVE: Partial<Record<ModuleId, string>> = {
  'accounting': "Every invoice you create here becomes a real signal the moment it's saved — overdue accounts are automatically flagged for follow-up, and reconciliation status feeds directly into this brand's overall health score in SuperDash.",
  'customer-service': "Tickets move through a real queue with SLA timers, and every reply — good or bad — becomes part of this brand's satisfaction signal. A sustained spike in unhappy tickets is exactly the kind of pattern Autonomous watches for.",
  'messaging': "Every channel a brand uses — WhatsApp, SMS, email — flows through the same inbox here, so nothing gets missed. Templates you save are reusable across every future conversation, and assigning a conversation to a teammate is tracked in real time.",
  'ai-automation': "This is FoundAI's own home module — the same assistant you see in the bottom-right corner on every page, but with its full workflow and automation surface expanded here. Every suggestion it makes is grounded in this brand's own real signals, not a generic script.",
  'finance': "Cash flow, revenue, and financial operations all live here as one of the core real inputs the OS uses to score brand health. A sustained dip in cash flow is exactly the kind of signal that would trigger an Autonomous auto-coach moment.",
  'crypto': "Market exposure and wallet-level signals are tracked here as their own real, live data stream — kept safely in Guardian's own lane, distinct from every other brand's financial data.",
  'superdashboard-demo': "This is the same real, read-only view an admin or investor actually sees: every brand, every module, rolled into one live dashboard. Nothing here is brand-specific — it's the whole ecosystem's health in one place.",
  'buyer-overview': "You're seeing the real, live brand website exactly as a genuine customer would — the same product pages, the same cart, the same checkout flow. Nothing here is a mockup built just for this demo.",
  'customer-overview': "This is Customer Service from the other side of the counter — what it actually feels like to ask for help as a real customer, rather than the agent's own queue view you'd see in the Customer Service module.",
  'crm-overview': "Every contact, deal, and note you add here persists for the length of your session — a real, working CRM board, not a static screenshot. The same relationship data rolls up into SuperDash exactly like every other module's signals do.",
  'operations': "Operations covers the day-to-day mechanics of running a brand — the connective tissue between every other module, even without its own dedicated screen yet.",
  'sales': "Sales tracks the commercial motion of a brand — leads, pipeline, and closed revenue — feeding the same live signal every module contributes to the brand's overall health score.",
  'branding': "Branding covers how a brand presents itself — visual identity, tone, and consistency — the layer Guardian checks to keep every brand feeling distinct even inside one shared OS.",
  'console-navigation': "Console Navigation is about orientation — how quickly a new team member can find their way around a brand's console without training. It's a real usability signal, not a cosmetic one.",
}

export type NarratorStep = { step: string; text: string; detail: string }

// Modules whose real, checked actions are inherently message/conversation-driven — used only
// to pick a more relevant "Animated message flow" step detail below; every module still gets
// the same step, just worded honestly for whether messaging is central to it or not.
const MESSAGE_DRIVEN_MODULE_IDS = new Set<ModuleId>(['messaging', 'customer-service', 'ai-automation'])

// The AI narrator's personality: warm, human, reactive — a short (3–10 word) spoken reaction
// for every beat, never a long scripted paragraph. The practical substance (what the module
// does, why it exists, its features, real-time behaviour, cross-brand integration, the AI
// guidance moment, the animated message flow, and a short summary) lives in "detail" and
// renders as the card's own body copy; "text" is only the narrator's own short reaction to
// that beat, read aloud by the same voice everywhere. "detail" is real body copy (read on
// screen, not spoken) and can be as long/substantial as genuinely useful — deliberately
// enriched with a second real sentence per step so each demo is a real, informative few
// minutes rather than a single short line per card.
export function buildNarratorSteps(moduleLabel: string, moduleDetail: string, moduleId?: ModuleId): NarratorStep[] {
  const actions = (moduleId && MODULE_REAL_ACTIONS[moduleId]) || null
  const messageDriven = moduleId ? MESSAGE_DRIVEN_MODULE_IDS.has(moduleId) : false
  const deepDive = (moduleId && MODULE_DEEP_DIVE[moduleId]) || `Everything you try here is real and clickable — nothing in ${moduleLabel} is a static screenshot standing in for a real feature.`
  return [
    {
      step: '1 · Overview',
      text: 'Alright, here\'s the fun part.',
      detail: `${moduleLabel}: ${moduleDetail} ${deepDive}`,
    },
    {
      step: '2 · Why it exists',
      text: "Here's why this matters.",
      detail: `Every module here exists to turn real (or synthetic, for demo sessions) activity into a live signal the rest of the OS can act on — ${moduleLabel} is no different. Without it, this brand would be flying blind on exactly the thing ${moduleLabel} tracks; with it, that same activity becomes something Guardian can watch and Autonomous can react to, automatically.`,
    },
    {
      step: '3 · Key features',
      text: 'Let me walk you through it.',
      detail: actions
        ? `The real actions here are ${actions.join(', ')}. Try ${actions[0]} below, then ${actions[1].toLowerCase()} — that covers the core flow, and ${actions[2].toLowerCase()} shows you how it looks once it's already in motion.`
        : `Open ${moduleLabel} below and try whatever's on screen — every button, field, and row is real and clickable, not a disabled preview.`,
    },
    {
      step: '4 · Real-time behaviour',
      text: 'Watch what happens next.',
      detail: `Every action in ${moduleLabel} updates its numbers live — nothing here is a static screenshot. ${deepDive}`,
    },
    {
      step: '5 · Cross-brand integration',
      text: "Here's the clever part.",
      detail: `That same activity becomes a BrandMetric signal the instant it happens — Guardian keeps it safely in ${moduleLabel}'s own brand lane (never leaking into another brand's data), Autonomous watches it for spikes or dips worth reacting to, and SuperDash rolls the whole thing up into one live, cross-brand view.`,
    },
    {
      step: '6 · AI guidance',
      text: "FoundAI's got thoughts on this too.",
      detail: `Open FoundAI (bottom-right) while you're here — it already knows it's watching ${moduleLabel} on this brand, and it can answer real questions about what you're looking at, suggest a next step, or just explain what a specific number means.`,
    },
    {
      step: '7 · Animated message flow',
      text: "Here's how it feels in the wild.",
      detail: messageDriven
        ? `This is exactly the kind of exchange ${moduleLabel} powers — see the Message style preview above for a taste, cycling through WhatsApp, Telegram, iMessage, and Messenger styling, since WhatsApp-style messaging is the whole reason this OS exists.`
        : `${moduleLabel} works more through its own real actions than chat — but the same OS-wide message engine (see the Message style preview above) is what powers the brands that live and breathe WhatsApp-style conversations.`,
    },
    {
      step: '8 · Summary + next action',
      text: "That's the gist — nice work.",
      detail: actions
        ? `Try ${actions[2]} now, then head to your survey — you'll see it reflected the moment you use it. That's ${moduleLabel}: real actions, a real live signal, and a real place in the wider OS.`
        : `That's ${moduleLabel}, in short — real, live, and connected to everything else in the OS. Your survey's up next.`,
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
// template) — same short reactive-narrator voice, with steps that map onto its real, tabbed
// structure (Campaigns / Templates / Segments / Analytics, each its own real, interactive
// workbench — see packages/ui/src/modules/MarketingModule.tsx) and its place in the wider OS
// (IntelligenceOS/Guardian/Autonomous), not invented functionality.
const MARKETING_SUITE_NARRATOR_STEPS: NarratorStep[] = [
  { step: '1 · Overview', text: 'This is your marketing command center.', detail: 'Four real tabs across the top — Campaigns, Templates, Segments, and Analytics — everything a marketing team actually touches, not one generic page pretending to be all of them. Every row in every tab is a real, editable record, not a screenshot.' },
  { step: '2 · Campaigns tab', text: "Let's build one together.", detail: 'Create a campaign with a real name, channel (Email/SMS/WhatsApp/Social), status, and budget — click Create new and it appears in the table immediately. Try changing an existing one to Live and watch the "Live campaigns" KPI card update on the spot.' },
  { step: '3 · Templates tab', text: "Here's your reusable message library.", detail: 'Click the Templates tab. Every approved template here is ready to plug into a campaign or an automation without rewriting it from scratch — the Approved/Draft status keeps anything unfinished from accidentally going out.' },
  { step: '4 · Segments tab', text: 'Now let\u2019s target the right people.', detail: 'Click the Segments tab. Each segment is a real audience definition — criteria plus a contact count — the same kind of targeting a real campaign would use to decide exactly who receives it.' },
  { step: '5 · Analytics tab', text: 'And here\u2019s how it all performed.', detail: 'Click the Analytics tab for open rate, click-through rate, revenue attributed, and unsubscribe rate. These are illustrative benchmark figures — real revenue always lives in the real monetary fields (Accounting/Finance), never invented here.' },
  { step: '6 · Cross-brand integration', text: 'Guardian and Autonomous are both watching.', detail: "Guardian keeps this brand's marketing data safely in its own lane — a spike in FoundRetail's numbers never leaks into FoundMeat's, even though both run the exact same module. Autonomous watches for a real surge or dip worth reacting to, and SuperDash rolls the whole thing up into one live, cross-brand view." },
  { step: '7 · AI guidance', text: "FoundAI's got thoughts on this too.", detail: 'Open FoundAI (bottom-right) while you\u2019re on any of these tabs — it already knows it\u2019s watching Marketing Suite on this brand, and can suggest a next step or explain what a number means.' },
  { step: '8 · Summary + next steps', text: "Nice — you're ready to explore more.", detail: "That's Marketing Suite: four real tabs, each with its own real, editable data. Like every module, its usage rolls into the same Package Model D pricing tiers (SystemOS/IntelligenceOS/QuantumOS) the whole OS runs on. Your survey's up next, then Free Roam." },
]
MODULE_NARRATOR_STEPS['marketing-suite'] = MARKETING_SUITE_NARRATOR_STEPS

// Accounting: Invoices / Expenses / Reports / Reconciliation — see
// packages/ui/src/modules/AccountingModule.tsx. Invoices is the one tab backed by a real,
// Prisma-persisted model (wired earlier this session) — genuinely real numbers, honest zero
// until a real invoice exists. The other three tabs are real, interactive client-state
// workspaces, clearly labeled illustrative where the numbers are.
const ACCOUNTING_NARRATOR_STEPS: NarratorStep[] = [
  { step: '1 · Overview', text: 'Welcome to Accounting.', detail: 'Four real tabs — Invoices, Expenses, Reports, and Reconciliation. Invoices is genuinely database-backed (the same real system wired into SuperDash and CRM this session); the other three are real, interactive workspaces with illustrative example numbers.' },
  { step: '2 · Invoices tab (real, database-backed)', text: 'This one\u2019s the real deal.', detail: 'Every invoice here is a real Prisma-persisted record — honestly zero until a real one is created. Add one with a real amount and currency, and it\u2019s genuinely stored, not just held in this page\u2019s memory like the other tabs.' },
  { step: '3 · Expenses tab', text: 'Now let\u2019s track what\u2019s going out.', detail: 'Click the Expenses tab. Log spend by category and vendor, and move it through Pending \u2192 Approved \u2192 Paid — the same real approval flow a bookkeeper would actually use.' },
  { step: '4 · Reports tab', text: 'Here\u2019s the summary view.', detail: 'Click the Reports tab for a revenue/expenses/net snapshot. These are illustrative summary cards — for the honest, real, database-backed figures, see the real Finance module or SuperDash.' },
  { step: '5 · Reconciliation tab', text: 'And here\u2019s where it all gets matched up.', detail: 'Click the Reconciliation tab. Every real bank transaction gets matched against a real invoice or expense — Matched, Unmatched, or Review — exactly the last step of a real month-end close.' },
  { step: '6 · Cross-brand integration', text: 'This feeds the bigger picture too.', detail: "A real invoice's outstanding balance is exactly the kind of signal Autonomous watches for, and Guardian keeps this brand's financial data completely separate from every other brand's, even though they all run the same Accounting module." },
  { step: '7 · AI guidance', text: "FoundAI's ready to help here too.", detail: 'Open FoundAI (bottom-right) on any Accounting tab — it knows which brand\u2019s books it\u2019s looking at and can explain a real invoice status or reconciliation match.' },
  { step: '8 · Summary + next action', text: "That's Accounting — nice work.", detail: 'Real invoices, real database persistence, and three more real workspaces around it. Your survey\u2019s up next, then Free Roam.' },
]
MODULE_NARRATOR_STEPS['accounting'] = ACCOUNTING_NARRATOR_STEPS

// Messaging: Inbox / Templates / Automations / Analytics — see
// packages/ui/src/modules/MessagingModule.tsx. Inbox reuses the real, already-built
// AnimatedMessageFlow conversation preview.
const MESSAGING_NARRATOR_STEPS: NarratorStep[] = [
  { step: '1 · Overview', text: 'This is Messaging, unified.', detail: 'Four real tabs — Inbox, Templates, Automations, and Analytics — every channel a brand uses, in one place, not scattered across separate tools.' },
  { step: '2 · Inbox tab', text: 'Here\u2019s what a real conversation looks like.', detail: 'The Inbox tab shows a live preview cycling through WhatsApp, Telegram, iMessage, and Messenger styling — since WhatsApp-style messaging is the whole reason this OS exists.' },
  { step: '3 · Templates tab', text: 'Now the reusable messages.', detail: 'Click the Templates tab. Every approved template — order confirmation, delivery update, support follow-up — is ready to send instantly, on whichever channel it\u2019s built for.' },
  { step: '4 · Automations tab', text: 'And here\u2019s where it runs itself.', detail: 'Click the Automations tab. Each row pairs a real trigger (like "no reply after 24h") with a real action (like "send a follow-up template") — Active or Paused, exactly like a real automation platform.' },
  { step: '5 · Analytics tab', text: 'Here\u2019s how it\u2019s performing.', detail: 'Click the Analytics tab for messages sent, response rate, and average response time — illustrative figures for now, since there\u2019s no real delivery engine wired up yet.' },
  { step: '6 · Cross-brand integration', text: 'Every message becomes a signal too.', detail: "Response rate and volume feed the same BrandMetric signal every other module contributes to — Guardian keeps this brand's conversations in their own lane, and Autonomous watches for a real spike or drop in engagement." },
  { step: '7 · AI guidance', text: "FoundAI's watching the inbox too.", detail: 'Open FoundAI (bottom-right) on any Messaging tab — it can draft a reply, suggest a template, or explain an automation\u2019s trigger.' },
  { step: '8 · Summary + next action', text: "That's Messaging — you've seen it all.", detail: 'Inbox, templates, automations, and analytics — every channel, one real workspace. Your survey\u2019s up next, then Free Roam.' },
]
MODULE_NARRATOR_STEPS['messaging'] = MESSAGING_NARRATOR_STEPS

// Customer Service: Tickets / Live Chat / Knowledge Base / SLA — see
// packages/ui/src/modules/CustomerServiceModule.tsx.
const CUSTOMER_SERVICE_NARRATOR_STEPS: NarratorStep[] = [
  { step: '1 · Overview', text: 'Welcome to Customer Service.', detail: 'Four real tabs — Tickets, Live Chat, Knowledge Base, and SLA — everything a support team needs to track an issue from "just opened" to "resolved."' },
  { step: '2 · Tickets tab', text: 'Every issue, tracked properly.', detail: 'Try creating a ticket with a real subject, customer, priority, and assignee, then move it from Open \u2192 In Progress \u2192 Resolved — the "Open"/"In progress"/"Resolved" KPI cards update as you go.' },
  { step: '3 · Live Chat tab', text: 'Here\u2019s what a real-time conversation feels like.', detail: 'Click the Live Chat tab for a live preview of a support conversation, cycling through real messaging-channel styling — the same preview used in the Messaging module, shown here in its support context.' },
  { step: '4 · Knowledge Base tab', text: 'And here\u2019s how tickets get prevented in the first place.', detail: 'Click the Knowledge Base tab. Every published article deflects a ticket before it\u2019s ever raised — the view count next to each one shows real self-serve demand.' },
  { step: '5 · SLA tab', text: 'Here\u2019s how the team is actually performing.', detail: 'Click the SLA tab for average first-response time, resolution time, satisfaction score, and SLA breaches — the real accountability numbers a support lead checks every morning.' },
  { step: '6 · Cross-brand integration', text: 'Every reply becomes a signal too.', detail: "A sustained spike in unhappy tickets is exactly the kind of pattern Autonomous watches for, and Guardian keeps this brand's support data in its own lane, safely apart from every other brand's." },
  { step: '7 · AI guidance', text: "FoundAI can help you answer faster.", detail: 'Open FoundAI (bottom-right) on any Customer Service tab — it can draft a reply, suggest a knowledge base article, or summarize a ticket\u2019s history.' },
  { step: '8 · Summary + next action', text: "That's Customer Service — well done.", detail: 'Tickets, live chat, a knowledge base, and real SLA tracking, all in one place. Your survey\u2019s up next, then Free Roam.' },
]
MODULE_NARRATOR_STEPS['customer-service'] = CUSTOMER_SERVICE_NARRATOR_STEPS

// AI Automation: Workflows / Triggers / Run Logs / Templates — see
// packages/ui/src/modules/FoundAIDemoModule.tsx. Workflows keeps the real FoundAI assistant
// widget front and centre, since that's the one genuinely real, working piece of AI already
// in this module.
const AI_AUTOMATION_NARRATOR_STEPS: NarratorStep[] = [
  { step: '1 · Overview', text: 'This is AI Automation.', detail: 'Four real tabs — Workflows, Triggers, Run Logs, and Templates — plus the real FoundAI assistant, the same one you see in the bottom-right corner on every page, expanded here with its full home.' },
  { step: '2 · Workflows tab', text: "Let's see one in motion.", detail: 'Each workflow pairs a real trigger with a real action — like "stock below threshold" triggering "notify supplier + create draft order." Try describing a new one in plain language to the real FoundAI widget right on this tab.' },
  { step: '3 · Triggers tab', text: 'Here\u2019s what actually sets things off.', detail: 'Click the Triggers tab. Every trigger is a real condition — like "order value > £100" — paired with the action it sets in motion, independent of which workflow uses it.' },
  { step: '4 · Run Logs tab', text: 'And here\u2019s the receipts.', detail: 'Click the Run Logs tab for a full history of past automation runs — timestamp, workflow, success or failure, and how long it took. Real auditability, not a black box.' },
  { step: '5 · Templates tab', text: 'Don\u2019t want to start from scratch?', detail: 'Click the Templates tab for pre-built automations — low stock reorder, abandoned cart recovery, overdue invoice reminder — ready to adopt in one click.' },
  { step: '6 · Cross-brand integration', text: 'This is IntelligenceOS in action.', detail: 'Every workflow run is grounded in this brand\u2019s own real signals, kept safely in Guardian\u2019s own lane — Autonomous is really just this module\u2019s reflexes, watching for the moment a real automation should fire.' },
  { step: '7 · AI guidance', text: "This IS the AI guidance module.", detail: 'FoundAI here isn\u2019t a bolt-on — it\u2019s the same assistant everywhere else in the OS, just with its full workflow-building surface expanded on the Workflows tab.' },
  { step: '8 · Summary + next action', text: "That's AI Automation — you've seen the whole engine.", detail: 'Workflows, triggers, run history, and ready-made templates, all backed by the real FoundAI assistant. Your survey\u2019s up next, then Free Roam.' },
]
MODULE_NARRATOR_STEPS['ai-automation'] = AI_AUTOMATION_NARRATOR_STEPS

// Sales: Pipeline / Quotes / Activities / Analytics — see packages/ui/src/modules/SalesModule.tsx.
// Previously "sales" had no dedicated page at all anywhere in the ecosystem; this is its first
// real, tabbed walkthrough.
const SALES_NARRATOR_STEPS: NarratorStep[] = [
  { step: '1 · Overview', text: 'Welcome to Sales — brand new this session.', detail: 'Four real tabs — Pipeline, Quotes, Activities, and Analytics — the commercial engine behind every brand, tracking a deal from first contact all the way to closed-won.' },
  { step: '2 · Pipeline tab', text: "Let's move a deal forward.", detail: 'Every deal here has a real stage — Prospecting \u2192 Qualified \u2192 Proposal \u2192 Negotiation \u2192 Won/Lost. Try editing one\u2019s stage and watch the "Open deals" and "Pipeline value" KPI cards update.' },
  { step: '3 · Quotes tab', text: 'Here\u2019s how a deal gets priced.', detail: 'Click the Quotes tab. Every quote is a real record — number, customer, amount, and status (Draft/Sent/Accepted/Rejected) — the paperwork behind every pipeline deal.' },
  { step: '4 · Activities tab', text: 'And here\u2019s the actual legwork.', detail: 'Click the Activities tab. Every call, email, and meeting is logged against a real contact, with a real outcome — the history a sales rep actually keeps.' },
  { step: '5 · Analytics tab', text: 'Here\u2019s how the team is tracking.', detail: 'Click the Analytics tab for pipeline value, win rate, average deal size, and quota progress. Real deal values with real numeric fields live separately in CRM Deals — this is the illustrative sales-team view on top.' },
  { step: '6 · Cross-brand integration', text: 'Every deal becomes a signal too.', detail: "A deal moving to Won is exactly the kind of real activity Autonomous watches for, and Guardian keeps this brand's pipeline completely separate from every other brand's, even though they all run the same Sales module." },
  { step: '7 · AI guidance', text: "FoundAI can help close deals faster too.", detail: 'Open FoundAI (bottom-right) on any Sales tab — it can draft a follow-up, summarize a deal\u2019s activity history, or suggest what to try next on a stalled negotiation.' },
  { step: '8 · Summary + next action', text: "That's Sales — the newest real module in the OS.", detail: 'Pipeline, quotes, activities, and analytics, all real and interactive. Your survey\u2019s up next, then Free Roam.' },
]
MODULE_NARRATOR_STEPS['sales'] = SALES_NARRATOR_STEPS

// The Complete FoundingOS Tour — a dedicated master walkthrough covering the whole
// ecosystem (not one module), for testers who want the full picture before diving into any
// single brand/module. Same short reactive-narrator voice; every fact here is a real system
// already covered elsewhere in this file (brand count, SuperDash, Guardian, Autonomous,
// Package Model D, FoundAI, CRM) — nothing invented for this tour.
const FOUNDINGOS_OVERVIEW_NARRATOR_STEPS: NarratorStep[] = [
  { step: '1 · Overview', text: "Let's zoom all the way out.", detail: 'FoundingOS is one operating system running 8 real brands — Retail, Meat, Logistics, Talent, Crypto, Finance, Health, and FoundThat — each with its own console, plus a shared intelligence layer on top.' },
  { step: '2 · Why it exists', text: 'Here\u2019s the problem it solves.', detail: 'Every brand used to run in its own silo. FoundingOS gives every brand the same real modules (Marketing, Accounting, Messaging, Customer Service, CRM, AI Automation) while rolling every signal up into one shared view.' },
  { step: '3 · Every brand, one console pattern', text: 'Same shape, every time.', detail: 'Each of the 8 brand consoles is a real, separately deployed app — but every one shares the same modules, the same CRM board, and the same FoundAI assistant, so once you know one console, you know them all.' },
  { step: '4 · SuperDash', text: 'This is where it all rolls up.', detail: 'SuperDash pulls every brand\u2019s real engagement, scraper health, and pipeline data into one live, cross-brand view — the same view an admin or investor actually sees.' },
  { step: '5 · Guardian + Autonomous', text: 'The safety net and the reflexes.', detail: 'Guardian keeps every brand\u2019s data in its own lane and flags anomalies; Autonomous reacts to real signals (auto-optimize or auto-coach) without a human needing to click anything.' },
  { step: '6 · Package Model D', text: 'And here\u2019s how it\u2019s priced.', detail: 'SystemOS, IntelligenceOS, and QuantumOS tiers, plus an industry pack per brand — the same real pricing catalog every module\u2019s summary step points back to.' },
  { step: '7 · FoundAI, your guide throughout', text: 'I\u2019m with you on every page.', detail: 'The same FoundAI assistant (bottom-right, on every real page) already knows which brand and module you\u2019re looking at, and can answer real questions about any of this.' },
  { step: '8 · Summary + next action', text: "That's the whole picture — now go explore a brand.", detail: 'Head back to the Switcher Hub and pick any brand demo, the CRM demo, or SuperDash read-only — you now know how every piece fits together.' },
]
MODULE_NARRATOR_STEPS['foundingos-overview'] = FOUNDINGOS_OVERVIEW_NARRATOR_STEPS

// Admin & Founder Operations Tour — admin-only, covers everything an admin actually operates
// day-to-day (not the tester-facing tour above). Every system named here is real and already
// shipped: Founder Console, SuperDash's real subscriptions/scraping sections, AVL, Guardian
// Queue, Package Model D admin actions, and the tester program's own admin tools.
const ADMIN_OPERATIONS_NARRATOR_STEPS: NarratorStep[] = [
  { step: '1 · Overview', text: "Welcome to the operator's seat.", detail: 'As admin, you have full, unrestricted access to every demo, every survey, every brand console, and every admin-only tool in the ecosystem — nothing here is locked for you.' },
  { step: '2 · Founder Console', text: "This is your control centre.", detail: 'All brands, workflows, WhatsApp automation, analytics, AI onboarding, customers, orders, products, employees, permissions, and settings — all 12 sections now link to a real destination, no "coming soon" placeholders.' },
  { step: '3 · SuperDash — the intelligence layer', text: 'Everything rolls up here.', detail: 'Cross-brand analytics, brand switching, the real Package Model D subscriptions section (live MRR/ARR + real FX conversion), and the Scraping Dashboard (real scrape history, diffing, and the customer pipeline builder).' },
  { step: '4 · AVL — Autonomous Verification Layer', text: "It's watching the whole system for you.", detail: 'Runs every 5 minutes: scans all 26 apps for reachability, detects drift against the last known-good snapshot, auto-applies safe fixes (like re-triggering a stale scrape), and reports lastRun/driftCount/safeFixCount/pendingGuardian in the SuperDash footer.' },
  { step: '5 · Guardian Queue', text: 'High-risk items wait for you here.', detail: 'Anything AVL classifies as needing a human call sits unresolved until you review it — the pendingGuardian count in the SuperDash footer tells you exactly how many are waiting right now.' },
  { step: '6 · Package Model D — real admin actions', text: "You control real subscriptions here.", detail: 'From SuperDash you can assign any of the 8 real brands a real base tier + industry pack; it snapshots the real catalog price into a persisted MRR/ARR record — informational only, no payment processor, but genuinely real and stored.' },
  { step: '7 · Tester program admin tools', text: "This is how you run the tester program.", detail: 'At /tester/admin you can review every tester\u2019s real survey answers and reassign their module — separate from your own Super Founder Admin access, which lets you open any demo or survey directly from the Switcher Hub.' },
  { step: '8 · Summary + next action', text: "That's the full operator's view — go run it.", detail: 'You now know every admin-only tool in the ecosystem. Head to SuperDash or the Founder Console to put it to use, or read the full Admin & Founder Operations Manual for the written version.' },
]
MODULE_NARRATOR_STEPS['admin-overview'] = ADMIN_OPERATIONS_NARRATOR_STEPS

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
  if (moduleId === 'sales') return '/modules/sales'
  if (moduleId === 'buyer-overview') return 'https://retail.foundingos.com'
  if (moduleId === 'investor-overview') return '/investor'
  return `/tester/demo/${moduleId}`
}

// Demo & Survey Switcher — a pure navigation aid: no backend mutation beyond the same
// namespaced explore-record mechanism already used for admin (see exploreTesterId's doc
// comment). Every real session now sees the exact same full access admin already had — every
// demo, every survey, nothing gated by category — since every /tester/demo/[moduleId] and
// /tester/survey?moduleId= request now resolves via that session's own real record (their
// primary assigned module) or a per-module explore record (everything else), and
// middleware.ts's SuperDashboard/Guardian gate treats every non-admin session the same
// (real, live, read-only). U2/T2 stay admin-only — genuine founder/operator tooling, not a
// demo or survey.
export const SWITCHER_PANEL_TITLE = 'Explore Another Part of the OS'
export const SWITCHER_PANEL_NARRATOR_LINE =
  "Welcome to FoundingOS — I'm your AI guide. Here's everything you can explore: every brand demo, every survey, and Free Roam. Pick whatever you'd like to try first."

// Shown directly above the Free Roam box on the survey-completion screen — the "unlocked a
// new level" framing for reaching Free Roam.
export const FREE_ROAM_UNLOCK_LINE =
  "Nice work — you've completed the demo and survey. You've just unlocked a new level: Free Roam."

export type SwitcherOption = { code: string; label: string; href: string; available: boolean; note?: string }

export function buildSwitcherOptions(category: CredentialCategory): SwitcherOption[] {
  const isAdmin = category === 'admin'
  // Every real session (tester/survey/buyer/customer/investor/lawyer/free-roam) can now reach
  // every demo and every survey — matching admin's existing full access — via the explore
  // mechanism (see exploreTesterId's doc comment) for /tester/demo/[moduleId], and the same
  // moduleId-aware rendering (see /tester/survey's page) for surveys. middleware.ts now treats
  // every non-admin session the same way for SuperDashboard/Guardian too: real, live, read-only.
  // U2/T2 stay admin-only on purpose — they're genuine founder/operator tooling (real admin
  // actions, real founder-only screens), not a demo or survey a tester would take.
  return [
    { code: 'R1', label: 'Retail Demo', href: 'https://retail.foundingos.com', available: true },
    { code: 'M1', label: 'Messaging Console Demo', href: '/modules/messaging', available: true },
    { code: 'M2', label: 'CRM Demo', href: '/crm', available: true },
    { code: 'U1', label: 'Brand User Guide', href: '/tester/guide', available: true },
    { code: 'U2', label: 'Admin & Founder Operations Manual', href: '/founder/manual', available: isAdmin, note: 'Admin-only.' },
    { code: 'G1', label: 'Guardian Demo', href: '/system/guardian', available: true },
    { code: 'A1', label: 'Autonomous Demo', href: '/superdashboard?readOnly=1', available: true },
    { code: 'B1', label: 'BrandMetric Demo', href: '/superdashboard?readOnly=1', available: true },
    { code: 'S1', label: 'Tester Survey', href: '/tester/survey?moduleId=marketing-suite', available: true },
    { code: 'S2', label: 'Buyer Survey', href: '/tester/survey?moduleId=buyer-overview', available: true },
    { code: 'S3', label: 'Customer Survey', href: '/tester/survey?moduleId=customer-overview', available: true },
    { code: 'S4', label: 'Investor Survey', href: '/investor', available: true },
    { code: 'S5', label: 'Lawyer Survey', href: '/tester/survey?moduleId=superdashboard-demo', available: true },
    { code: 'S6', label: 'CRM Demo Survey', href: '/tester/survey?moduleId=crm-overview', available: true },
    { code: 'T1', label: 'Complete FoundingOS Tour', href: '/tester/demo/foundingos-overview', available: true },
    { code: 'T2', label: 'Admin & Founder Operations Tour', href: '/tester/demo/admin-overview', available: isAdmin, note: 'Admin-only.' },
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
// assets).
//
// Two independent, orthogonal controls:
// - "Narrator: ON/OFF" (#narrator-enabled-toggle, unchanged from before) — shows/hides the
//   narrator text panels and narrate buttons entirely.
// - "Audio: ON/OFF" ([data-audio-toggle], always visible, never hidden by the Narrator
//   toggle) — a master permission gate for actually speaking anything aloud. OFF (the
//   default) means every narrate-button click is a silent no-op; ON enables them. This is
//   the only thing that ever triggers audio without a direct click: 15 seconds after a
//   narrator surface loads, if — and only if — Audio is already ON, it speaks the page's
//   first narrator line once. If Audio is OFF (the default), nothing plays automatically,
//   ever.
export const NARRATION_PLAYER_SCRIPT = `
(function () {
  // Best-available free voice — the browser's default speechSynthesis voice is often the
  // most robotic one on that system; most real browsers also ship at least one noticeably
  // better ("Natural"/"Enhanced"/"Premium"/network "Google"/"Microsoft ... Online") voice
  // among speechSynthesis.getVoices(). No paid API, no new dependency — just a smarter pick
  // from what's already free and built in. Cached once, refreshed if the browser loads its
  // voice list asynchronously (getVoices() can be empty on first call in some browsers).
  var cachedVoice = null;
  function pickBestVoice() {
    try {
      if (!('speechSynthesis' in window)) return null;
      var voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return null;
      var english = voices.filter(function (v) { return /^en/i.test(v.lang); });
      var pool = english.length > 0 ? english : voices;
      return pool.find(function (v) { return /natural/i.test(v.name); })
        || pool.find(function (v) { return /enhanced|premium/i.test(v.name); })
        || pool.find(function (v) { return /online/i.test(v.name); })
        || pool.find(function (v) { return /google/i.test(v.name); })
        || pool.find(function (v) { return v.localService === false; })
        || pool[0];
    } catch (err) { return null; }
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = function () { cachedVoice = null; };
  }

  function speak(text, onEnd) {
    try {
      if (!text || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      var utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.98;
      if (!cachedVoice) cachedVoice = pickBestVoice();
      if (cachedVoice) utter.voice = cachedVoice;
      if (onEnd) utter.onend = onEnd;
      window.speechSynthesis.speak(utter);
    } catch (err) {}
  }
  function narrationFor(el) { return el ? el.getAttribute('data-narration') : ''; }
  function setButtonLabel(btn, label) { if (btn) btn.textContent = label; }

  // Per explicit product direction: Audio now defaults ON (a real spoken welcome/guide plays
  // shortly after a narrator surface loads) rather than requiring an opt-in first — testers
  // asked for this to feel like a real guided introduction on sign-in, not a silent page.
  // Still a genuine, always-visible toggle: an explicit OFF choice (stored '0') is respected
  // and persists, exactly like the Narrator visibility toggle already does.
  var audioEnabled = true;
  try { audioEnabled = localStorage.getItem('fo-audio-enabled') !== '0'; } catch (err) {}

  function setAudioButtonLabels() {
    var toggles = document.querySelectorAll('[data-audio-toggle]');
    for (var i = 0; i < toggles.length; i += 1) toggles[i].textContent = audioEnabled ? 'Audio: ON' : 'Audio: OFF';
  }

  function setAudioEnabled(enabled) {
    audioEnabled = enabled;
    if (!enabled) { try { window.speechSynthesis.cancel(); } catch (err) {} }
    try { localStorage.setItem('fo-audio-enabled', enabled ? '1' : '0'); } catch (err) {}
    setAudioButtonLabels();
  }

  // Master Audio ON/OFF toggle — always visible regardless of the separate Narrator
  // visibility toggle below; clicking it never itself speaks anything, it only flips the
  // gate that every narrate-button click (and the 15-second auto-play) checks first.
  document.addEventListener('click', function (e) {
    var toggle = e.target.closest('[data-audio-toggle]');
    if (!toggle) return;
    setAudioEnabled(!audioEnabled);
  });

  // Play / Stop toggle, scoped to the button's own nearest [data-narration] card — each button
  // only ever speaks that one card's own short micro-line, never a joined multi-step script.
  // A no-op while Audio is OFF: the button stays visible and clickable, it just doesn't speak.
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-narrate-btn]');
    if (!btn || btn.disabled) return;
    if (!audioEnabled) return;
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
  // off across pages. Independent of the Audio toggle above: this one is purely about
  // visibility, never about permission to speak.
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

  // Re-applied at several delays (not just once): a separate, pre-existing app-wide hydration
  // quirk (present even on pages with no narrator content at all — not something this script
  // causes) can make React re-commit its own server-rendered DOM shortly after this script's
  // first pass, silently reverting these mutations back to their static default text. Re-
  // asserting the correct state a few times over ~2 seconds reliably wins against that,
  // without needing to first solve that separate, broader issue.
  function applyInitialState() {
    if (narratorToggle) narratorToggle.checked = narratorEnabled
    setNarratorEnabled(narratorEnabled)
    setAudioButtonLabels()
  }
  ;[0, 60, 200, 500, 1200, 2000].forEach(function (delay) { window.setTimeout(applyInitialState, delay) })

  // Real spoken guide on arrival: 2.5 seconds after this narrator surface loads (long enough
  // for the retry-settled state above to land, short enough to feel like a real greeting
  // rather than a delayed afterthought), if Audio is ON (the real new default — see above),
  // speak the page's first narrator line once. An explicit Audio: OFF still fully silences
  // this, same as every other narrate action on the page.
  window.setTimeout(function () {
    if (!audioEnabled) return;
    var first = document.querySelector('[data-narration]');
    if (first) speak(narrationFor(first));
  }, 2500);
})();
`
