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

export type SurveyId = 'survey-a' | 'survey-b' | 'survey-c' | 'survey-d' | 'survey-e' | 'survey-f' | 'survey-g' | 'survey-h' | 'survey-i' | 'survey-j' | 'survey-k' | 'survey-l'

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
]

export function findCredentialByPassword(password: string): Credential | null {
  return CREDENTIALS.find((credential) => credential.password === password) ?? null
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

export const MODULE_OPTIONS: ModuleOption[] = CREDENTIALS.map((credential) => ({
  moduleId: credential.moduleId,
  moduleLabel: credential.moduleLabel,
  surveyId: credential.surveyId,
}))

export function findModuleOption(moduleId: string): ModuleOption | null {
  return MODULE_OPTIONS.find((option) => option.moduleId === moduleId) ?? null
}

export type SurveyQuestion = { id: string; prompt: string }
export type Survey = { id: SurveyId; title: string; moduleLabel: string; questions: SurveyQuestion[] }

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
    ],
  },
}
