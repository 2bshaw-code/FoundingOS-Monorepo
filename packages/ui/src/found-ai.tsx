/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { SpeakButton, speak, speechSupported, stopSpeaking, useAutoSpeak } from './speech'
import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { LOCKED_BRAND_COLORS } from '@foundingos/config'
import type { BrandConsoleConfig } from './console'
import { useAIAssistance } from './ai-assistance'
import { FoundAIMascot } from './foundai-mascot'
import { FoundAISettings } from './foundai-settings'
import { useBotMovement } from './use-bot-movement'
import { useBotResize } from './use-bot-resize'
import { BotVoiceConversation } from './bot-voice-conversation'
import { BOT_COLOURS, BOT_PROGRESS_KEY, botPreferenceScope, botWelcome, companionLevel, validateBotPreferences, type BotPreferences } from './foundai-preferences'

type Message = { role: 'assistant' | 'user'; text: string }

function routeLabel(pathname: string) {
  if (pathname === '/' || pathname === '/dashboard' || pathname === '/console') return 'Dashboard'
  if (pathname === '/crm') return 'CRM'
  if (pathname === '/settings') return 'Settings'
  if (pathname === '/finance') return 'Finance'
  if (pathname === '/intelligence') return 'Intelligence'
  if (/^\/(?:test-workspaces|app)\/intelligence(?:\/|$)/.test(pathname)) return 'Intelligence'
  if (pathname.startsWith('/console/packages')) return 'Packages'

  // foundingos-console-only routes (FounderOS admin/tester/investor surfaces) — safe to
  // special-case here without affecting brand-console behavior, since none of these paths
  // exist in any brand console.
  if (pathname.startsWith('/superdashboard') || pathname.startsWith('/superdash')) return 'SuperDash'
  if (pathname.startsWith('/founder')) return 'Founder Console'
  if (pathname === '/investor') return 'Investor Briefing'
  if (pathname === '/system/guardian') return 'Guardian'
  if (pathname === '/tester/dashboard') return 'Switcher Hub'
  if (pathname === '/tester/survey') return 'Survey'
  if (pathname === '/tester/admin' || pathname.startsWith('/tester/admin/')) return 'Tester Admin'
  const demoMatch = pathname.match(/^\/tester\/demo\/([^/]+)/)
  if (demoMatch) return `${demoMatch[1].replaceAll('-', ' ').replace(/\b\w/g, (char) => char.toUpperCase())} Guided Demo`

  // FoundingOS website-only routes (foundingos-web) — these paths don't exist in any
  // console, so they're safe to special-case here without affecting console behavior.
  if (pathname === '/landing') return 'Landing'
  if (pathname === '/login') return 'Sign In'
  if (pathname === '/survey') return 'Survey'
  if (pathname === '/onboarding') return 'Onboarding'
  if (pathname === '/tester-login') return 'Tester Access'

  const moduleMatch = pathname.match(/^\/modules\/([^/]+)/)
  if (moduleMatch) {
    return moduleMatch[1].replaceAll('-', ' ').replace(/\b\w/g, (char) => char.toUpperCase())
  }

  return 'Workspace'
}

function foundAITheme(brand: FoundAIBrand) {
  switch (brand.name) {
    case 'FoundingOS':
      return { accent: '#24c47a', glow: 'rgba(36, 196, 122, 0.38)' }
    case 'FoundRetail':
      return { accent: LOCKED_BRAND_COLORS.retail, glow: 'color-mix(in srgb, var(--found-ai-accent) 35%, transparent)' }
    case 'FoundTalent':
      return { accent: LOCKED_BRAND_COLORS.talent, glow: 'color-mix(in srgb, var(--found-ai-accent) 35%, transparent)' }
    default:
      return { accent: brand.accent, glow: 'color-mix(in srgb, var(--found-ai-accent) 35%, transparent)' }
  }
}

function suggestedPrompts(brand: FoundAIBrand, context: string) {
  const base = [
    `What should I focus on in ${context.toLowerCase()}?`,
    `Show me today's most important items.`,
    `What should I do next?`,
    `Summarise the current situation.`,
  ]

  // FoundingOS website contexts (landing/login/survey/onboarding) — distinguished by
  // context string, not just brand name, since foundingos-console shares the same brand
  // name but never produces these specific context labels.
  if (brand.name === 'FoundingOS' && context === 'Landing') return ['What is FoundingOS?', 'What can I do here?', 'How do I sign in?', 'Recommend a package for me']
  if (brand.name === 'FoundingOS' && context === 'Sign In') return ['How do I sign in?', 'Is this demo mode?', 'What happens after I sign in?']
  if (brand.name === 'FoundingOS' && context === 'Survey') return ['Why are you asking this?', 'Can I skip this question?', 'What happens to my answer?']
  if (brand.name === 'FoundingOS' && context === 'Onboarding') return ['Recommend a package for me', 'How does pricing work?', 'Which workspaces are there?']
  if (brand.name === 'FoundingOS' && context === 'Tester Access') return ['What am I testing?', 'What is the legal acceptance for?', 'What happens after I log in?']
  if (brand.name === 'FoundingOS' && context === 'SuperDash') return ['How is the platform performing?', 'Which customers need attention?', 'How does pricing work?']
  if (brand.name === 'FoundingOS' && context === 'Intelligence') return ['What should we be paying attention to right now?', 'What value has FoundingOS created?', 'How is the system performing overall?', 'What needs my approval?', 'Are any decisions related?']
  if (brand.name === 'FoundingOS' && context === 'Founder Console') return ['Show me all suites', 'What needs my approval?', 'Summarise system stability', 'How does pricing work?']
  if (brand.name === 'FoundingOS' && context === 'Investor Briefing') return ['How does pricing work?', 'How do the workspaces work together?', 'Is this real customer data?']
  if (brand.name === 'FoundingOS' && context === 'Guardian') return ['What does Guardian actually check?', 'What counts as an anomaly?', 'Is anything flagged right now?']
  if (brand.name === 'FoundingOS' && context === 'Switcher Hub') return ['What can I explore from here?', 'What is Free Roam?', 'Are all workspaces unlocked for me?']

  if (brand.name === 'FoundRetail') return ['Add new product', 'Show low stock items', 'Create customer', 'Review suppliers']
  if (brand.name === 'FoundTalent') return ['Add new job', 'Find top candidates', 'Schedule interview', 'Review pipeline']
  if (brand.name === 'FoundFinance') return ['Show open invoices', 'Check cash flow', 'Review reconciliation', 'Explain pricing']
  if (brand.name === 'FoundHealth') return ['Show today\u2019s appointments', 'Check patient records status', 'Review compliance', 'Check supply levels']
  return base
}

type SmartAction = {
  label: string
  answer?: string
  // Live "Full Demo Mode" data interpretation: fetches a same-origin demo endpoint and turns
  // its JSON into a plain-language explanation. Only ever hits the app's own read-only demo
  // routes (no external/paid APIs), and only appears on brands whose console actually has the
  // corresponding endpoint deployed.
  fetchPath?: string
  interpret?: (data: any) => string
  // Real, single-step AI Auto-Action: navigates straight to a real page that already has the
  // real create/update handler (RealDealsPanel/RealInvoicesPanel/RealBrandFinancePanel — the
  // only three database-persisted create/update handlers anywhere in the app), landing on and
  // focusing its one truly-required input via a real URL anchor. Never creates anything
  // itself and never invents the record's real data (name/value/amount) — the user still
  // types that; this only removes the friction of finding the form.
  href?: string
  audio?: string
}

// Single-step AI Auto-Actions: each opens the real create form in the live workspace
// (via "#new"), so the record's name/value/amount still comes from the user.
function aiAutoActions(_brand: FoundAIBrand): SmartAction[] {
  return [
    { label: '\u2795 Create a deal for me', href: '/app/retail/sales-pipeline#new' },
    { label: '\u2795 Log an invoice for me', href: '/app/finance/invoices#new' },
  ]
}

// Interpreters for the Full Demo Mode data engines (/api/feeds/update,
//, /api/dashboard/refresh) — pure functions that turn the JSON payload into
// a short, human-readable explanation of what the chart/feed/metric actually shows.
function interpretFeedsUpdate(data: any): string {
  const products = Array.isArray(data?.products) ? data.products : []
  if (products.length === 0) return 'The product feed came back empty this cycle.'
  const cheapest = products.reduce((min: any, p: any) => (p.priceUsd < min.priceUsd ? p : min), products[0])
  return `The product feed has ${products.length} item(s); ${cheapest.name} is the lowest-priced at $${cheapest.priceUsd} with ${cheapest.stock} in stock. Updates every ${data.refreshIntervalMinutes ?? 20} minutes, demo data only.`
}

function interpretDashboardRefresh(data: any): string {
  const m = data?.metrics ?? {}
  return `Dashboard snapshot: ${m.activeUsers ?? 0} active users, ${m.ordersToday ?? 0} orders today, $${m.revenueTodayUsd ?? 0} revenue, and ${m.openAlerts ?? 0} open alert(s). Refreshes every ${data.refreshIntervalMinutes ?? 5} minutes, demo data only.`
}

const FEEDS_UPDATE_ACTION: SmartAction = { label: 'Read latest product feed', fetchPath: '/api/feeds/update', interpret: interpretFeedsUpdate }
const DASHBOARD_REFRESH_ACTION: SmartAction = { label: 'Read dashboard metrics', fetchPath: '/api/dashboard/refresh', interpret: interpretDashboardRefresh }

function smartActions(brand: FoundAIBrand, context: string): SmartAction[] {
  if (brand.name === 'FoundingOS' && context === 'Landing') {
    return [
      { label: 'What is FoundingOS?', answer: 'FoundingOS is one system of record connecting Core.Operations, Core.Workforce, and Core.Intelligence under a single governed command layer.' },
      { label: 'How do I sign in?', answer: 'Tap Sign In on this page — it\u2019s demo mode, so no real account is required.' },
      { label: 'Recommend a package for me', answer: 'Once you reach onboarding, I can recommend a plan and workspaces based on your business profile.' },
    ]
  }
  if (brand.name === 'FoundingOS' && context === 'Sign In') {
    return [
      { label: 'Is this demo mode?', answer: 'Yes — this sign-in is demo mode only. No real account or password is required.' },
      { label: 'What happens after I sign in?', answer: 'You\u2019ll be taken to a quick survey question, then on into the FoundingOS experience.' },
    ]
  }
  if (brand.name === 'FoundingOS' && context === 'Survey') {
    return [
      { label: 'Why are you asking this?', answer: 'This helps us understand what brought you here so we can tailor the experience.' },
      { label: 'Can I skip this question?', answer: 'You can leave it blank and submit — nothing is required.' },
    ]
  }
  if (brand.name === 'FoundingOS' && context === 'Onboarding') {
    return [
      { label: 'How does pricing work?', answer: 'Pricing is modular: a free Lite plan, Core from £19 a month per workspace with optional bolt-ons, Complete at £89 a month for every workspace, and Enterprise on request. See the Pricing page for the live catalogue.' },
      { label: 'Which workspaces are there?', answer: 'Core.Operations covers Retail & Logistics and Health; Core.Workforce covers Talent and HR; Core.Intelligence is a bolt-on that adds FoundAI insight across them.' },
      { label: 'Recommend a package for me', answer: 'Start with Core and the one or two workspaces you use every day, then move to Complete when you need everything connected.' },
    ]
  }
  if (brand.name === 'FoundingOS' && context === 'Tester Access') {
    return [
      { label: 'What am I testing?', answer: 'You\u2019re previewing FoundingOS in demo mode — no real data, no real payments, fully safe to explore.' },
      { label: 'What is the legal acceptance for?', answer: 'It\u2019s a quick agreement covering confidentiality and pre-release terms before you continue.' },
    ]
  }
  if (brand.name === 'FoundingOS' && context === 'SuperDash') {
    return [
      { label: 'How does pricing work?', answer: 'Pricing is modular: a free Lite plan, Core from £19 a month per workspace with optional bolt-ons, Complete at £89 a month for every workspace, and Enterprise on request. See the Pricing page for the live catalogue.' },
      DASHBOARD_REFRESH_ACTION,
    ]
  }
  if (brand.name === 'FoundingOS' && context === 'Intelligence') {
    return [
      { label: 'Coordinate low-stock response', href: '#agent-actions', answer: 'I ranked the low-stock response using financial impact, operating risk, urgency, and three-workspace coverage. Review the historical evidence and Retail, Logistics, and Finance trade-offs before approval.' },
      { label: 'Explain the approval', answer: 'Nothing external happens until you approve. The proposal shows cash commitment, inbound load, inventory exposure, and evidence from similar Event Feed outcomes before creating synchronized records.' },
      { label: 'Explain the event trail', answer: 'Every action has one correlation trail: source signal, proposal, owner decision, each workspace mutation, and completion outcome. Open the trail from the orchestration panel to inspect the evidence.' },
      { label: 'Show the simulation', href: '#agent-actions', answer: 'The orchestration panel contains a read-only before/after projection for Retail, Logistics, and Finance. It never creates records or contacts external systems before approval and execution.' },
    ]
  }
  if (brand.name === 'FoundingOS' && context === 'Founder Console') {
    return [
      { label: 'Show me all suites', answer: 'All 3 licensed suites — Core.Operations, Core.Workforce, and Core.Intelligence — are live under All suites and All workspaces below.' },
      { label: 'What needs my approval?', answer: 'Anything AVL classifies as high-risk sits in GuardianQueue, unresolved, until you review it — check the SuperDash footer for the current pending count.' },
      { label: 'Summarise system stability', answer: 'Stability is scored from real anomaly and drift counts (see the SuperDash footer\u2019s Testers line) — fewer open anomalies and less unresolved drift means a higher score.' },
    ]
  }
  if (brand.name === 'FoundingOS' && context === 'Investor Briefing') {
    return [
      { label: 'How does pricing work?', answer: 'Pricing is modular: a free Lite plan, Core from £19 a month per workspace with optional bolt-ons, Complete at £89 a month for every workspace, and Enterprise on request. See the Pricing page for the live catalogue.' },
      { label: 'Is this real customer data?', answer: 'No — the briefing uses clearly labelled demo data. Live customer workspaces run on the same platform with their own isolated data.' },
    ]
  }
  if (brand.name === 'FoundingOS' && context === 'Guardian') {
    return [
      { label: 'What does Guardian actually check?', answer: 'Guardian watches each workspace\u2019s own activity and anomaly signals and never mixes data between customers.' },
      { label: 'Is anything flagged right now?', answer: 'Check the anomaly count on this page — anything above the normal range gets flagged here first.' },
    ]
  }
  if (brand.name === 'FoundingOS' && context === 'Switcher Hub') {
    return [
      { label: 'What is Free Roam?', answer: 'Free Roam lets you explore every demo and survey without being locked into just your assigned one.' },
      { label: 'Are all workspaces unlocked for me?', answer: 'You can see every workspace and survey here — some may show an honest lock note if your session isn\u2019t assigned to that one yet.' },
    ]
  }

  if (brand.name === 'FoundRetail') {
    return [
      { label: 'Add new product', answer: 'I can help you add a new product with a clean title, category, price, stock level, and supplier link.' },
      { label: 'Show low stock items', answer: 'I’ve highlighted the low-stock retail items that need attention before the next replenishment window.' },
      { label: 'Create customer', answer: 'I can prepare a new customer record with the right contact details and store preferences.' },
      { label: 'Review suppliers', answer: 'I’ve reviewed the supplier queue and flagged the highest-priority follow-ups.' },
      FEEDS_UPDATE_ACTION,
      DASHBOARD_REFRESH_ACTION,
    ]
  }



  if (brand.name === 'FoundTalent') {
    return [
      { label: 'Add new job', answer: 'I can create a new job with role, hiring manager, stage, and next action in one pass.' },
      { label: 'Find top candidates', answer: 'I’ve sorted the candidate pool by fit and urgency so your strongest matches are first.' },
      { label: 'Schedule interview', answer: 'I can help sequence the next interview steps so the funnel keeps moving.' },
      { label: 'Review pipeline', answer: 'The hiring pipeline is active, and I’ve pointed out the stages that need attention.' },
    ]
  }


  if (brand.name === 'FoundLogistics') {
    return [
      { label: 'Show active shipments', answer: 'I’ve pulled the active shipments and flagged the ones closest to their delivery window.' },
      { label: 'Check fleet status', answer: 'The fleet is running within normal capacity, with a couple of vehicles worth checking before their next route.' },
      { label: 'Review routes', answer: 'I’ve reviewed today’s routes and highlighted the ones with the tightest scheduling.' },
      DASHBOARD_REFRESH_ACTION,
    ]
  }

  if (brand.name === 'FoundFinance') {
    return [
      { label: 'Show open invoices', answer: 'I’ve pulled the open invoices and flagged the ones closest to their due date.' },
      { label: 'Check cash flow', answer: 'Cash flow is within range this cycle — I’ve highlighted the accounts worth a closer look.' },
      { label: 'Review reconciliation', answer: 'I’ve reviewed reconciliation status and flagged the entries that still need matching.' },
      { label: 'Explain pricing', answer: 'Pricing is modular: a free Lite plan, Core from £19 a month per workspace with optional bolt-ons, Complete at £89 a month for every workspace, and Enterprise on request. See the Pricing page for the live catalogue.' },
    ]
  }

  if (brand.name === 'FoundHealth') {
    return [
      { label: 'Show today\u2019s appointments', answer: 'I’ve pulled today\u2019s appointments and flagged the ones that still need confirmation.' },
      { label: 'Check patient records status', answer: 'Patient records are up to date overall, with a few entries worth a closer review.' },
      { label: 'Review compliance', answer: 'Compliance is within range, and I’ve flagged the items due for their next check.' },
      { label: 'Check supply levels', answer: 'I’ve reviewed supply levels and flagged the items closest to reorder point.' },
    ]
  }

  return [
    { label: `Review ${context.toLowerCase()}`, answer: `I’ve reviewed the current ${context.toLowerCase()} context and lined up the next operational steps.` },
    { label: 'Summarise priorities', answer: 'I’ve pulled the top priorities into a concise action list.' },
    { label: 'Show likely risks', answer: 'I’ve highlighted the main risks and the quickest ways to respond.' },
    { label: 'Plan next steps', answer: 'I’ve drafted the clearest next-step plan for the current workspace context.' },
  ]
}

type FoundAIBrand = Pick<BrandConsoleConfig, 'name' | 'accent'>

// Real, honest topic answers for free-text questions — a rule-based keyword match, not a
// live LLM. Only ever states facts that are true elsewhere in this codebase (pricing,
// CRM board sections, Guardian's real scope, SuperDash's real rollup, the one real
// Marketing Suite module). Falls back to a context-relevant smart action rather than
// echoing the question back when nothing matches.
const KNOWLEDGE_BASE: Array<{ match: RegExp; answer: string }> = [
  { match: /\bcrm\b|contact|\blead\b|\bdeal\b|pipeline/i, answer: 'CRM covers contacts, companies, deals, pipeline, notes, tasks, and activity — one board per workspace.' },
  { match: /invoice|cashflow|cash flow|reconcil|payable|receivable|forecast/i, answer: 'Invoicing and cash flow live in the Accounting module (with dedicated tools in the Finance workspace) — real records, not a mockup.' },
  { match: /subscription/i, answer: 'Subscriptions are tracked as part of the Finance/Accounting layer alongside invoices — there\u2019s no separate subscriptions screen yet.' },
  { match: /pricing|price|plan|tier|package/i, answer: 'Pricing is modular: a free Lite plan, Core from £19 a month per workspace with optional bolt-ons, Complete at £89 a month for every workspace, and Enterprise on request. See the Pricing page for the live catalogue.' },
  { match: /marketing/i, answer: 'Marketing Suite is one real, active module — campaigns, sends, and analytics all live inside it, not separate tools.' },
  { match: /automat/i, answer: 'Automations run through Guardian + Autonomous reactions on top of real workspace signals — no manual triggering needed.' },
  { match: /superdash|super dash/i, answer: 'SuperDash is the founder view — customers, subscriptions, revenue, ratings and platform health roll up there.' },
  { match: /guardian/i, answer: 'Guardian watches each workspace\u2019s own activity and anomaly signals and flags anything unusual for review.' },
  { match: /\bbrand(s)?\b|ecosystem|\bsuite(s)?\b|workspaces/i, answer: 'FoundingOS connects all 3 licensed suites — Core.Operations, Core.Workforce, and Core.Intelligence — under one shared governed intelligence layer.' },
]

function matchKnowledge(text: string): string | null {
  const hit = KNOWLEDGE_BASE.find((entry) => entry.match.test(text))
  return hit?.answer ?? null
}

export function FoundAI({ brand }: { brand: FoundAIBrand }) {
  const pathname = usePathname()
  const scope = botPreferenceScope(pathname)
  return <FoundAICompanion key={scope.key} brand={brand} scope={scope} />
}

function FoundAICompanion({ brand, scope }: { brand: FoundAIBrand; scope: ReturnType<typeof botPreferenceScope> }) {
  const pathname = usePathname()
  const aiEnabled = useAIAssistance()
  const [open, setOpen] = useState(false)
  const [choicesOpen, setChoicesOpen] = useState(false)
  const [voiceOpen, setVoiceOpen] = useState(false)
  const panelRef = useRef<HTMLElement>(null)
  useEffect(() => { if (panelRef.current) panelRef.current.inert = !open }, [open, aiEnabled])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [autoSpeak, setAutoSpeak] = useAutoSpeak()
  const [canSpeak, setCanSpeak] = useState(false)
  const [preferences, setPreferences] = useState<BotPreferences>(scope.defaults)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settingsError, setSettingsError] = useState('')
  const [voiceError, setVoiceError] = useState('')
  const [settingsNotice, setSettingsNotice] = useState('')
  const [interactions, setInteractions] = useState(0)
  const interactionCount = useRef(0)
  const progress = companionLevel(interactions)
  const botColour = preferences.colour === 'original' ? undefined : BOT_COLOURS.find((colour) => colour.id === preferences.colour)?.hex
  const speechOptions = { voiceURI: preferences.voiceURI, rate: preferences.rate, character: preferences.character, onError: setVoiceError }
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(scope.key)
      if (stored) setPreferences(validateBotPreferences(JSON.parse(stored)))
    } catch (error) {
      setSettingsError(`Could not load your bot settings. ${error instanceof Error ? error.message : 'Storage is unavailable.'} Save settings to replace them.`)
    }
    try {
      const stored = window.localStorage.getItem(BOT_PROGRESS_KEY)
      if (stored !== null) {
        const count: unknown = JSON.parse(stored)
        if (typeof count !== 'number') throw new Error('Invalid companion progress.')
        companionLevel(count)
        interactionCount.current = count
        setInteractions(count)
      }
    } catch {
      setSettingsError('Could not load companion progress. New progress will start on this device.')
    }
  }, [])
  const savePreferences = (value: BotPreferences) => {
    try {
      const validated = validateBotPreferences(value)
      window.localStorage.setItem(scope.key, JSON.stringify(validated))
      stopSpeaking()
      setPreferences(validated)
      setSettingsError('')
      setVoiceError('')
      setSettingsNotice('Bot settings saved on this device.')
      return true
    } catch (error) {
      setSettingsError(`Settings were not saved. ${error instanceof Error ? error.message : 'Storage is unavailable.'}`)
      return false
    }
  }
  const resize = useBotResize(preferences.size, (size) => savePreferences({ ...preferences, size }))
  const movement = useBotMovement(open || choicesOpen || voiceOpen, aiEnabled, resize.size, resize.resizing)
  const recordInteraction = () => {
    const next = interactionCount.current + 1
    try {
      companionLevel(next)
      window.localStorage.setItem(BOT_PROGRESS_KEY, JSON.stringify(next))
      interactionCount.current = next
      setInteractions(next)
    } catch {
      setSettingsError('Companion progress could not be saved on this device.')
    }
  }
  useEffect(() => setCanSpeak(speechSupported()), [])
  const spokenCount = useRef(0)
  useEffect(() => {
    const last = messages[messages.length - 1]
    if (autoSpeak && open && messages.length > spokenCount.current && last?.role === 'assistant') speak(last.text, { voiceURI: preferences.voiceURI, rate: preferences.rate, character: preferences.character, onError: setVoiceError })
    spokenCount.current = messages.length
  }, [messages, autoSpeak, open, preferences.voiceURI, preferences.rate, preferences.character])
  useEffect(() => { if (!open) stopSpeaking() }, [open])
  const [agentContext, setAgentContext] = useState<{ title?: string; coordinationSummary?: { scoreExplanation?: string[]; tradeoffs?: string[] }; historicalContext?: { narrative?: string }; predictiveSignals?: { triggerPattern?: string; likelyNext?: string; confidence?: number; highImpactOutcomeRate?: number; evidenceCount?: number; assessedOutcomes?: number; averageAccuracy?: number; reliabilityScore?: number; refined?: boolean; basis?: string[] }; simulationPreview?: { disclaimer?: string; comparison?: { predictedDelta?: string } }; outcomeAssessment?: { accuracy?: number; summary?: string } } | null>(null)
  const [systemIntelligence, setSystemIntelligence] = useState<{
    health?: { totalAssessedOutcomes?: number; averagePredictionAccuracy?: number; refinedPatterns?: number; confidenceImprovement?: number; averageReliability?: number; narrative?: string; recurringDeviation?: { insight?: string } | null }
    interactions?: Array<{ summary?: string; evidence?: string[]; advisory?: string }>
    emergingSignals?: Array<{ title?: string; summary?: string; reliability?: number; outcomeCount?: number; advisory?: string }>
    snapshot?: {
      activeInteractions?: number
      recentAccuracyTrend?: { current?: number; change?: number; assessmentWindow?: number; narrative?: string }
      learningMomentum?: { score?: number; label?: string; narrative?: string }
      economicValue?: { cashGovernedPence?: number; cashPreservedPence?: number; marginProtectedPence?: number | null; inventoryUnitsProtected?: number; riskReducedActions?: number; estimatedOperatorMinutesSaved?: number; measuredOutcomes?: number; narrative?: string }
    }
    auditTrail?: Array<{ stage?: string; actionTitle?: string; summary?: string; occurredAt?: string }>
  } | null>(null)

  const context = useMemo(() => routeLabel(pathname), [pathname])
  const theme = useMemo(() => foundAITheme(brand), [brand])
  const prompts = useMemo(() => suggestedPrompts(brand, context), [brand, context])
  const actions = useMemo(() => {
    const contextual = smartActions(brand, context)
    if (context === 'Intelligence' && agentContext) {
      contextual.push({
        label: 'Explain historical evidence',
        answer: `${agentContext.title || 'The leading proposal'} is supported by the Shared Event Feed: ${agentContext.historicalContext?.narrative || 'no comparable completed action is recorded yet.'} Ranking factors: ${agentContext.coordinationSummary?.scoreExplanation?.join(', ') || 'cross-workspace coverage and operating risk'}. Key trade-off: ${agentContext.coordinationSummary?.tradeoffs?.[0] || 'approval balances operating risk against resource commitment'}.`,
      })
      contextual.push({
        label: 'How has this pattern improved?',
        answer: agentContext.predictiveSignals?.refined
          ? `This is a refined pattern. Based on ${agentContext.predictiveSignals.assessedOutcomes} assessed outcomes, predictions averaged ${agentContext.predictiveSignals.averageAccuracy}% accuracy and pattern reliability is ${agentContext.predictiveSignals.reliabilityScore}%. ${agentContext.outcomeAssessment?.summary || ''}`
          : `This pattern is still accumulating evidence. It has ${agentContext.predictiveSignals?.assessedOutcomes ?? 0} assessed outcomes; FoundAI marks it refined after at least 10 assessed and 10 resolved cases. Reliability is currently ${agentContext.predictiveSignals?.reliabilityScore ?? 0}%.`,
      })
      contextual.push({
        label: 'Compare approve and reject',
        answer: `${agentContext.simulationPreview?.comparison?.predictedDelta || 'The before/after simulation compares operating cover with cash preservation.'} This is read-only foresight; neither path is executed until you explicitly approve and run the action.`,
      })
      contextual.push({
        label: 'What usually happens next?',
        answer: `${agentContext.predictiveSignals?.triggerPattern || 'The current operating signal'} usually precedes this outcome: ${agentContext.predictiveSignals?.likelyNext || 'there is not enough history to make a strong forward-looking claim yet.'} Confidence is ${agentContext.predictiveSignals?.confidence ?? 50}%; ${agentContext.predictiveSignals?.highImpactOutcomeRate ?? 0}% of successful precedents were high-impact. Evidence: ${agentContext.predictiveSignals?.basis?.join(', ') || 'currently available tenant history'}. ${agentContext.simulationPreview?.disclaimer || 'Execution remains human-approved.'}`,
      })
      if (systemIntelligence) {
        const economic = systemIntelligence.snapshot?.economicValue
        const money = (pence?: number | null) => pence === null || pence === undefined ? 'not yet measurable' : new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(pence / 100)
        const leadingSignal = systemIntelligence.emergingSignals?.[0]
        const leadingInteraction = systemIntelligence.interactions?.[0]
        const latestAudit = systemIntelligence.auditTrail?.[0]
        contextual.push({
          label: 'How healthy is system intelligence?',
          answer: `${systemIntelligence.health?.narrative || 'System intelligence is awaiting measured outcomes.'} Evidence-weighted pattern reliability is ${systemIntelligence.health?.averageReliability ?? 0}%; predictive confidence has changed by ${systemIntelligence.health?.confidenceImprovement ?? 0} points. These are decision-support signals, not measured outcome accuracy. ${systemIntelligence.health?.recurringDeviation?.insight || 'No recurring prediction bias has met the evidence threshold.'}`,
        })
        contextual.push({
          label: 'Are any decisions related?',
          answer: systemIntelligence.interactions?.length
            ? `${systemIntelligence.interactions[0].summary} Evidence: ${systemIntelligence.interactions[0].evidence?.join(', ')}. ${systemIntelligence.interactions[0].advisory}`
            : 'No material overlap is currently detected between pending or recently executed actions.',
        })
        contextual.push({
          label: 'What should we be paying attention to right now?',
          answer: `Priority 1 — ${leadingSignal?.title || 'Protect the measured baseline'}: ${leadingSignal?.summary || 'No emerging signal has crossed its evidence threshold.'} Priority 2 — ${leadingInteraction?.summary || 'No material cross-action conflict is active.'}${leadingInteraction?.evidence?.[0] ? ` Evidence: ${leadingInteraction.evidence[0]}.` : ''} Economic context: ${money(economic?.cashGovernedPence)} governed, ${economic?.inventoryUnitsProtected ?? 0} units protected, and about ${economic?.estimatedOperatorMinutesSaved ?? 0} operator minutes saved across measured outcomes. Recommendation: ${leadingSignal?.advisory || 'Continue collecting outcomes and preserve explicit approval gates.'}`,
        })
        contextual.push({
          label: 'How is the system performing overall?',
          answer: `Measured performance: ${systemIntelligence.health?.narrative || 'The system is establishing its post-execution baseline.'} Measured accuracy trend: ${systemIntelligence.snapshot?.recentAccuracyTrend?.narrative || 'Not established yet.'} Value: ${economic?.narrative || 'Economic value measurement begins with completed assessed actions.'} Governance: ${systemIntelligence.auditTrail?.length ?? 0} recent lifecycle events are visible; latest is ${latestAudit ? `${latestAudit.stage} for ${latestAudit.actionTitle}` : 'not yet available'}. Learning momentum is an evidence-weighted indicator at ${systemIntelligence.snapshot?.learningMomentum?.score ?? 0}/100, not an outcome-accuracy claim. Watch: ${systemIntelligence.health?.recurringDeviation?.insight || 'No repeatable prediction bias currently meets the evidence threshold.'}`,
        })
        contextual.push({
          label: 'What value has FoundingOS created?',
          answer: `${money(economic?.cashGovernedPence)} of internal cash commitments have been governed and ${money(economic?.cashPreservedPence)} of immediate commitments were avoided through recorded rejections. ${economic?.inventoryUnitsProtected ?? 0} inventory units were protected across ${economic?.riskReducedActions ?? 0} accurately resolved risks, with about ${economic?.estimatedOperatorMinutesSaved ?? 0} operator minutes saved using the documented handoff benchmark. Margin protected is ${economic?.marginProtectedPence === null ? 'not claimed because selling-price evidence is incomplete' : money(economic?.marginProtectedPence)}. These are evidence-backed operating measures, not projected ROI.`,
        })
      }
    }
    return [...contextual, ...aiAutoActions(brand), { label: '\ud83d\udd0a Hear my welcome', audio: botWelcome(preferences.name) }]
  }, [agentContext, brand, context, systemIntelligence, preferences.name])

  useEffect(() => {
    const receiveContext = (event: Event) => setAgentContext((event as CustomEvent).detail ?? null)
    window.addEventListener('foundingos-agent-context', receiveContext)
    return () => window.removeEventListener('foundingos-agent-context', receiveContext)
  }, [])
  useEffect(() => {
    const receiveSystemIntelligence = (event: Event) => setSystemIntelligence((event as CustomEvent).detail ?? null)
    window.addEventListener('foundingos-system-intelligence', receiveSystemIntelligence)
    return () => window.removeEventListener('foundingos-system-intelligence', receiveSystemIntelligence)
  }, [])
  useEffect(() => {
    if (open) window.dispatchEvent(new Event('foundingos-intelligence-context-request'))
  }, [open])

  useEffect(() => {
    if (!open) return
    if (messages.length > 0) return
    setMessages([
      {
        role: 'assistant',
        text: `Hi, I’m ${preferences.name}. I’m watching ${brand.name} ${context.toLowerCase()} and can help with next steps, risks, or quick actions.`,
      },
    ])
  }, [open, messages.length, brand.name, context, preferences.name])

  // Respects the global AI Assistance toggle (Settings) — hides the floating button and
  // panel entirely, everywhere, the instant it's turned off.
  if (!aiEnabled) return null

  const submit = (text: string) => {
    const clean = text.trim()
    if (!clean) return
    // Real, honest keyword match first; otherwise fall back to this context's own real
    // smart-action answer (still a genuine fact about this brand/context) rather than a
    // blank echo of the question.
    const contextualMatch = [...actions]
      .reverse()
      .find((action) => action.label.toLowerCase() === clean.toLowerCase() && action.answer)
    const knowledgeHit = matchKnowledge(clean)
    const contextualFallback = actions.find((action) => action.answer)?.answer
      ?? `Here's what's active in ${brand.name} ${context.toLowerCase()} — ask me about CRM, invoices, marketing, or SuperDash and I'll explain.`
    const reply = contextualMatch?.answer ?? knowledgeHit ?? `For ${brand.name} ${context.toLowerCase()}: ${contextualFallback}`
    setMessages((current) => [...current, { role: 'user', text: clean }, { role: 'assistant', text: reply }])
    recordInteraction()
    setInput('')
    setLoading(false)
    return reply
  }

  const runAction = (action: SmartAction) => {
    if (action.href) {
      // Real navigation to a real page's real create/update form — never fabricates the
      // record itself, just removes the friction of finding the right screen and field.
      window.location.href = action.href
      return
    }
    setLoading(true)
    if (action.audio) {
      const line = action.audio
      window.setTimeout(() => {
        setMessages((current) => [...current, { role: 'assistant', text: line }])
        setLoading(false)
        if (!autoSpeak) speak(line, speechOptions)
        recordInteraction()
      }, 400)
      return
    }
    if (action.fetchPath && action.interpret) {
      // Live "Full Demo Mode" interpretation: fetch the app's own same-origin read-only demo
      // endpoint and explain the result — no external/paid APIs involved.
      fetch(action.fetchPath)
        .then((response) => {
          if (!response.ok) throw new Error(`status ${response.status}`)
          return response.json()
        })
        .then((data) => {
          setMessages((current) => [...current, { role: 'assistant', text: action.interpret!(data) }])
          recordInteraction()
        })
        .catch(() => {
          setMessages((current) => [...current, { role: 'assistant', text: `I couldn’t reach ${action.fetchPath} on this app just now — it may not be deployed here yet.` }])
        })
        .finally(() => setLoading(false))
      return
    }
    window.setTimeout(() => {
      setMessages((current) => [...current, { role: 'assistant', text: action.answer ?? '' }])
      if (action.answer) recordInteraction()
      setLoading(false)
    }, 500)
  }

  return (
    <>
      <button
        type="button"
        className={`found-ai-fab${movement.move ? ` is-${movement.move}` : ''}${movement.dragging ? ' is-dragging' : ''}`}
        style={{ '--found-ai-accent': theme.accent, '--found-ai-glow': theme.glow, width: resize.size, height: resize.size, ...(movement.position ? { left: movement.position.x, top: movement.position.y, right: 'auto', bottom: 'auto' } : {}) } as React.CSSProperties}
        onPointerDown={movement.pointerDown}
        onPointerMove={movement.pointerMove}
        onPointerUp={movement.pointerEnd}
        onPointerCancel={movement.pointerEnd}
        onLostPointerCapture={movement.pointerEnd}
        onKeyDown={movement.keyDown}
        title="Drag to move. Grab the corner handle to resize. Use arrow keys when focused. Click to open help."
        onClick={() => { if (!movement.consumeDrag()) { movement.stop(); setOpen(false); setVoiceOpen(false); setChoicesOpen((value) => !value) } }}
        aria-expanded={choicesOpen || open || voiceOpen}
        aria-label={`${choicesOpen || open || voiceOpen ? 'Close' : 'Open'} ${preferences.name}`}
      >
        <FoundAIMascot active thinking={loading} size={resize.size} colour={botColour} multicolour={preferences.colour === 'multicolour'} accessory={preferences.accessory} character={preferences.character} />
      </button>
      {settingsError && !open ? <p className="found-ai-float-status" role="alert">{settingsError}</p> : null}
      {choicesOpen ? <section className="found-ai-choices" role="dialog" aria-label={`${preferences.name} options`} onKeyDown={(event) => { if (event.key === 'Escape') setChoicesOpen(false) }}>
        <strong>{preferences.name}</strong>
        <button type="button" autoFocus onClick={() => { setChoicesOpen(false); setSettingsOpen(false); setVoiceOpen(true) }}>Talk to me</button>
        <span>Microphone + spoken replies. Your browser may use an online recognition service.</span>
        <button type="button" onClick={() => { setChoicesOpen(false); setVoiceOpen(false); setSettingsOpen(false); setOpen(true) }}>Open chat</button>
        <button type="button" onClick={() => setChoicesOpen(false)}>Cancel</button>
      </section> : null}
      {voiceOpen ? <BotVoiceConversation name={preferences.name} options={speechOptions} onSubmit={submit} onClose={() => setVoiceOpen(false)} onOpenChat={() => { setVoiceOpen(false); setSettingsOpen(false); setOpen(true) }} /> : null}
      <button type="button" className="found-ai-resize" disabled={settingsOpen && open} aria-label={`Resize ${preferences.name}, currently ${resize.size} pixels`} title={settingsOpen && open ? 'Close Bot settings before resizing.' : 'Drag diagonally to resize. Arrow keys grow or shrink the bot.'}
        style={movement.position ? { left: movement.position.x + resize.size - 24, top: movement.position.y + resize.size - 24, right: 'auto', bottom: 'auto' } : { right: 24, bottom: 24 }}
        onPointerDown={(event) => { movement.stop(); resize.pointerDown(event) }} onPointerMove={resize.pointerMove} onPointerUp={resize.pointerEnd} onPointerCancel={resize.pointerEnd} onLostPointerCapture={resize.pointerEnd}
        onKeyDown={(event) => { movement.stop(); resize.keyDown(event) }}>
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16"><path d="M3 9 V3 H9 M3 3 L13 13 M7 13 H13 V7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      <aside ref={panelRef} className={`found-ai-panel ${open ? 'open' : ''}${settingsOpen ? ' is-settings' : ''}`} style={{ '--found-ai-accent': theme.accent, '--found-ai-glow': theme.glow } as React.CSSProperties} aria-hidden={!open}>
        <header className="found-ai-panel-header">
          <FoundAIMascot active={open} thinking={loading} size={58} colour={botColour} multicolour={preferences.colour === 'multicolour'} accessory={preferences.accessory} character={preferences.character} />
          <div>
            <strong>{preferences.name}</strong>
            <span>{brand.name} · {context}</span>
          </div>
          {canSpeak ? <button type="button" className={`found-ai-voice${autoSpeak ? ' is-on' : ''}`} onClick={() => setAutoSpeak(!autoSpeak)} aria-pressed={autoSpeak} title={autoSpeak ? 'FoundAI reads replies aloud — tap to mute' : 'Turn on to hear FoundAI read replies aloud'}>{autoSpeak ? '🔊 Voice on' : '🔈 Voice off'}</button> : null}
          <button type="button" className="found-ai-close" onClick={() => setOpen(false)} aria-label={`Close ${preferences.name}`}>×</button>
        </header>

        <div className="found-ai-personalise">
          <button type="button" className="btn" aria-expanded={settingsOpen} onClick={() => { stopSpeaking(); setSettingsNotice(''); setSettingsOpen(!settingsOpen) }}>{settingsOpen ? 'Back to chat' : 'Bot settings & accessories'}</button>
          {!settingsOpen ? <>
          <span>Level {progress.level} · {progress.label}</span>
          <p>{interactions} interactions on this device{progress.next === null ? '' : ` · next level at ${progress.next}`}. Companion levels are cosmetic, not AI intelligence.</p>
          {context === 'Intelligence' && systemIntelligence?.health ? <p>Measured intelligence: {systemIntelligence.health.totalAssessedOutcomes ?? 0} assessed outcomes. {!systemIntelligence.health.totalAssessedOutcomes || systemIntelligence.health.averagePredictionAccuracy == null ? 'Accuracy not available.' : `Average measured accuracy: ${systemIntelligence.health.averagePredictionAccuracy}%.`} Accessories never change approval permissions or decision quality.</p> : <p>For measured outcomes and intelligence, open the Intelligence workspace. Chat use does not train a model.</p>}
          </> : null}
          {settingsNotice ? <p role="status">{settingsNotice}</p> : null}
          {settingsError ? <p role="alert">{settingsError}</p> : null}
          {voiceError ? <p role="alert">{voiceError}</p> : null}
          {!settingsOpen ? <><div className="found-ai-movement" role="group" aria-label="Bot movement">
            <button type="button" disabled={movement.reduced} onClick={() => movement.perform('dance')}>Dance</button>
            <button type="button" disabled={movement.reduced} onClick={() => movement.perform('slide')}>Slide</button>
            <button type="button" onClick={() => { movement.stop(); movement.setAutomatic(false) }}>Stop moving</button>
            <button type="button" onClick={movement.reset}>Reset position</button>
            <button type="button" disabled={movement.reduced} aria-pressed={movement.automatic} onClick={() => movement.setAutomatic(!movement.automatic)}>Move on his own: {movement.automatic ? 'on' : 'off'}</button>
          </div>
          {movement.reduced ? <p>Dance and slide are disabled by your reduced-motion setting. You can still drag the bot.</p> : null}</> : null}
        </div>
        {settingsOpen ? <FoundAISettings preferences={preferences} defaults={scope.defaults} onSave={savePreferences} onClose={() => setSettingsOpen(false)} onSpeechError={setVoiceError} /> : <>
        <section className="found-ai-chat">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`found-ai-message ${message.role}`}>
              {message.text}
              {message.role === 'assistant' ? <SpeakButton className="found-ai-speak" text={message.text} options={speechOptions} /> : null}
            </div>
          ))}
          {loading && (
            <div className="found-ai-message assistant found-ai-typing" aria-label={`${preferences.name} is typing`}>
              <span /><span /><span />
            </div>
          )}
        </section>

        <section className="found-ai-prompts">
          <h3>Suggested prompts</h3>
          <div className="found-ai-chip-grid">
            {prompts.map((prompt) => (
              <button key={prompt} type="button" className="found-ai-chip" onClick={() => submit(prompt)}>{prompt}</button>
            ))}
          </div>
        </section>

        <section className="found-ai-actions">
          <h3>Smart actions</h3>
          <div className="action-list">
            {actions.map((action) => (
              <button key={action.label} type="button" onClick={() => runAction(action)}>{action.label}</button>
            ))}
          </div>
        </section>

        <footer className="found-ai-compose">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={`Ask ${preferences.name} about ${context.toLowerCase()}...`}
            rows={3}
          />
          <button type="button" className="btn btn-primary btn-premium" onClick={() => submit(input)}>Send</button>
        </footer>
        </>}
      </aside>
    </>
  )
}

export default FoundAI
