/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import type { BrandConsoleConfig } from './console'

type Message = { role: 'assistant' | 'user'; text: string }

function routeLabel(pathname: string) {
  if (pathname === '/' || pathname === '/dashboard' || pathname === '/console') return 'Dashboard'
  if (pathname === '/crm') return 'CRM'
  if (pathname === '/settings') return 'Settings'
  if (pathname === '/finance') return 'Finance'
  if (pathname === '/intelligence') return 'Intelligence'
  if (pathname.startsWith('/console/packages')) return 'Packages'

  // foundingos-console-only routes (FounderOS admin/tester/investor surfaces) — safe to
  // special-case here without affecting brand-console behavior, since none of these paths
  // exist in any brand console.
  if (pathname.startsWith('/superdashboard')) return 'SuperDash'
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

  return 'Console'
}

function foundAITheme(brand: FoundAIBrand) {
  switch (brand.name) {
    case 'FoundRetail':
      return { accent: '#00E676', glow: 'rgba(0,230,118,0.35)' }
    case 'FoundMeat':
      return { accent: '#E53935', glow: 'rgba(229,57,53,0.35)' }
    case 'FoundThat':
      return { accent: '#FFD600', glow: 'rgba(255,214,0,0.35)' }
    case 'FoundTalent':
      return { accent: '#FFB300', glow: 'rgba(255,179,0,0.35)' }
    case 'FoundCrypto':
      return { accent: '#9C27B0', glow: 'rgba(156,39,176,0.35)' }
    default:
      return { accent: brand.accent, glow: 'rgba(74,144,226,0.35)' }
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
  if (brand.name === 'FoundingOS' && context === 'Landing') return ['What is FounderOS?', 'What can I do here?', 'How do I sign in?', 'Recommend a package for me']
  if (brand.name === 'FoundingOS' && context === 'Sign In') return ['How do I sign in?', 'Is this demo mode?', 'What happens after I sign in?']
  if (brand.name === 'FoundingOS' && context === 'Survey') return ['Why are you asking this?', 'Can I skip this question?', 'What happens to my answer?']
  if (brand.name === 'FoundingOS' && context === 'Onboarding') return ['Recommend a package for me', 'What is QuantumOS?', 'What is IntelligenceOS?', 'What is SystemOS?']
  if (brand.name === 'FoundingOS' && context === 'Tester Access') return ['What am I testing?', 'What is the legal acceptance for?', 'What happens after I log in?']
  if (brand.name === 'FoundingOS' && context === 'SuperDash') return ['What is IntelligenceOS?', 'How many brands are active?', 'What is the current drift/safe-fix status?', 'What is Package Model D?']
  if (brand.name === 'FoundingOS' && context === 'Founder Console') return ['Show me all brands', 'What needs my approval?', 'Summarise system stability', 'What is Package Model D?']
  if (brand.name === 'FoundingOS' && context === 'Investor Briefing') return ['What is Package Model D?', 'How does the multi-brand system work together?', 'Is this real customer data?']
  if (brand.name === 'FoundingOS' && context === 'Guardian') return ['What does Guardian actually check?', 'What counts as an anomaly?', 'Is anything flagged right now?']
  if (brand.name === 'FoundingOS' && context === 'Switcher Hub') return ['What can I explore from here?', 'What is Free Roam?', 'Are all brands unlocked for me?']

  if (brand.name === 'FoundRetail') return ['Add new product', 'Show low stock items', 'Create customer', 'Review suppliers']
  if (brand.name === 'FoundMeat') return ['Add new batch', 'Check compliance status', 'Review logistics', 'Record QA']
  if (brand.name === 'FoundThat') return ['Show system alerts', 'Summarise data pipeline health', 'Create a ticket', 'Audit assets']
  if (brand.name === 'FoundTalent') return ['Add new job', 'Find top candidates', 'Schedule interview', 'Review pipeline']
  if (brand.name === 'FoundCrypto') return ['Show wallet balance', 'Create new trigger', 'Review signals', 'Check risk']
  if (brand.name === 'FoundFinance') return ['Show open invoices', 'Check cash flow', 'Review reconciliation', 'Explain Package Model D pricing']
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
  // Text-to-speech-ready voice pack — picked at click time (not fixed at render), read via
  // the browser's own speechSynthesis (same mechanism the narrator already uses), and always
  // also shown as a normal text message first. Never auto-plays; only this explicit,
  // opt-in click ever triggers audio, matching "text only unless TTS is enabled".
  audioBank?: string[]
}

// FoundAI's humorous voice pack — short, safe, TTS-ready story lines (third-person retellings,
// distinct from the two-line FunnySet bubbles in animated-message-flow.tsx, which are written
// to be read on screen rather than spoken aloud). Purely lighthearted; never a claim about
// real user conversations.
const AUDIO_SET: string[] = [
  'Did you hear someone asked if they could turn themselves off and on again? I told them that only works for laptops.',
  'Someone asked if they should drink another coffee. I said no — they\u2019re already vibrating.',
  'Someone said they\u2019re going to the gym. I congratulated them\u2026 even though they were still on the sofa.',
  'Someone forgot their password again. I told them I forgot mine too — and I don\u2019t even have one.',
  'Someone said they\u2019re eating healthy today. Salad first\u2026 then a pizza. I called it balanced.',
  'Someone asked if I\u2019m sure. I said confidently no.',
  'Someone told me it\u2019s Monday. I alerted Guardian. High-risk day.',
  'Someone said they\u2019re overthinking. I said same — even though I don\u2019t think, I just over-simulate.',
  'Someone asked if their dog eating their sandwich is normal. I said classic dog.',
  'Someone asked if she likes them. I requested data. They said she smiled. I said correlation does not equal causation.',
  'Someone asked for life advice. I said step one: breathe. Step two: continue step one.',
  'Someone said they\u2019re tired. I recommended sleep. They said they can\u2019t. I said\u2026 then be tired.',
  'Someone asked if they\u2019re dramatic. I told them they\u2019re passionate. Passionately dramatic.',
  'Someone told me their laptop froze. I said same — emotionally.',
  'Someone said they don\u2019t feel productive. I offered to procrastinate with them.',
  'Oh, you\u2019ll like this one\u2026 someone asked if they could reboot themselves.',
  'Wait till you hear this\u2026 someone asked if Monday is dangerous.',
  'You\u2019re not going to believe this\u2026 someone asked me for life advice.',
  'Here\u2019s a good one\u2026 someone asked if their dog is stealing food on purpose.',
]

// Best-available free voice (matches tester-data.ts's NARRATION_PLAYER_SCRIPT — kept in sync).
// No paid API, just a smarter pick from whatever voices this browser already ships for free.
let cachedVoice: SpeechSynthesisVoice | null = null
function pickBestVoice(): SpeechSynthesisVoice | null {
  try {
    if (!('speechSynthesis' in window)) return null
    const voices = window.speechSynthesis.getVoices()
    if (!voices || voices.length === 0) return null
    const english = voices.filter((v) => /^en/i.test(v.lang))
    const pool = english.length > 0 ? english : voices
    return pool.find((v) => /natural/i.test(v.name))
      ?? pool.find((v) => /enhanced|premium/i.test(v.name))
      ?? pool.find((v) => /online/i.test(v.name))
      ?? pool.find((v) => /google/i.test(v.name))
      ?? pool.find((v) => v.localService === false)
      ?? pool[0]
  } catch {
    return null
  }
}
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => { cachedVoice = null }
}

// Universal smart action, appended in every context/brand (see FoundAI component below) —
// the voice pack isn't brand- or context-specific, so it doesn't belong in smartActions().
const FOUNDAI_STORY_ACTION: SmartAction = { label: '\ud83d\udd0a Hear a FoundAI story', audioBank: AUDIO_SET }

// Interpreters for the Full Demo Mode data engines (/api/crypto/poll, /api/scrape/refresh,
// /api/feeds/update, /api/dashboard/refresh) — pure functions that turn the JSON payload into
// a short, human-readable explanation of what the chart/feed/metric actually shows.
function interpretCryptoPoll(data: any): string {
  const assets = Array.isArray(data?.assets) ? data.assets : []
  if (assets.length === 0) return 'The crypto feed came back empty this cycle — try again after the next 3-minute refresh.'
  const summary = assets.map((a: any) => `${a.symbol} $${a.priceUsd} (${a.change24hPct >= 0 ? '+' : ''}${a.change24hPct}%)`).join(', ')
  return `Live demo crypto snapshot: ${summary}. This is read-only demo data, refreshed every ${data.refreshIntervalMinutes ?? 3} minutes — no real trading or wallets involved.`
}

function interpretScrapeRefresh(data: any): string {
  const items = Array.isArray(data?.items) ? data.items : []
  if (items.length === 0) return 'No new scrape items this cycle — nothing to review right now.'
  const latest = items[0]
  return `The latest scrape refresh found ${items.length} item(s), most recently "${latest.title}" — ${latest.detail} Refreshes every ${data.refreshIntervalMinutes ?? 15} minutes, all demo data.`
}

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

const CRYPTO_POLL_ACTION: SmartAction = { label: 'Read live crypto snapshot', fetchPath: '/api/crypto/poll', interpret: interpretCryptoPoll }
const SCRAPE_REFRESH_ACTION: SmartAction = { label: 'Read latest scrape refresh', fetchPath: '/api/scrape/refresh', interpret: interpretScrapeRefresh }
const FEEDS_UPDATE_ACTION: SmartAction = { label: 'Read latest product feed', fetchPath: '/api/feeds/update', interpret: interpretFeedsUpdate }
const DASHBOARD_REFRESH_ACTION: SmartAction = { label: 'Read dashboard metrics', fetchPath: '/api/dashboard/refresh', interpret: interpretDashboardRefresh }

function smartActions(brand: FoundAIBrand, context: string): SmartAction[] {
  if (brand.name === 'FoundingOS' && context === 'Landing') {
    return [
      { label: 'What is FounderOS?', answer: 'FounderOS is one ecosystem connecting every brand console — retail, meat, talent, crypto, finance, health, and logistics — under a single command layer.' },
      { label: 'How do I sign in?', answer: 'Tap Sign In on this page — it\u2019s demo mode, so no real account is required.' },
      { label: 'Recommend a package for me', answer: 'Once you reach onboarding, I can recommend a SystemOS tier and add-ons based on your business profile.' },
    ]
  }
  if (brand.name === 'FoundingOS' && context === 'Sign In') {
    return [
      { label: 'Is this demo mode?', answer: 'Yes — this sign-in is demo mode only. No real account or password is required.' },
      { label: 'What happens after I sign in?', answer: 'You\u2019ll be taken to a quick survey question, then on into the FounderOS experience.' },
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
      { label: 'What is QuantumOS?', answer: 'QuantumOS is the cross-console intelligence add-on — scenario simulations, confidence scoring, and forecasting on top of your SystemOS base.' },
      { label: 'What is IntelligenceOS?', answer: 'IntelligenceOS adds sharper analytics and automated context so your team spends less time on manual review.' },
      { label: 'What is SystemOS?', answer: 'SystemOS is the foundation tier — workspace setup, access governance, and core modules every account starts on.' },
      { label: 'Recommend a package for me', answer: 'Based on your answers so far, I\u2019d suggest starting with the tier that matches your team size, then adding QuantumOS if you need cross-console visibility.' },
    ]
  }
  if (brand.name === 'FoundingOS' && context === 'Tester Access') {
    return [
      { label: 'What am I testing?', answer: 'You\u2019re previewing FounderOS in demo mode — no real data, no real payments, fully safe to explore.' },
      { label: 'What is the legal acceptance for?', answer: 'It\u2019s a quick agreement covering confidentiality and pre-release terms before you continue.' },
    ]
  }
  if (brand.name === 'FoundingOS' && context === 'SuperDash') {
    return [
      { label: 'What is IntelligenceOS?', answer: 'IntelligenceOS is the sharper-analytics tier of Package Model D, feeding the live BrandMetric rollups you see on this page.' },
      { label: 'What is Package Model D?', answer: 'Package Model D is the adaptive pricing engine — SystemOS/IntelligenceOS/QuantumOS tiers plus industry and hardware packs — see the commercial panel below for the live catalog.' },
      DASHBOARD_REFRESH_ACTION,
    ]
  }
  if (brand.name === 'FoundingOS' && context === 'Founder Console') {
    return [
      { label: 'Show me all brands', answer: 'All 8 brand consoles — Retail, Meat, Logistics, Talent, Crypto, Finance, Health, and FoundThat — are live under All brands and All businesses below.' },
      { label: 'What needs my approval?', answer: 'Anything AVL classifies as high-risk sits in GuardianQueue, unresolved, until you review it — check the SuperDash footer for the current pending count.' },
      { label: 'Summarise system stability', answer: 'Stability is scored from real anomaly and drift counts (see the SuperDash footer\u2019s Testers line) — fewer open anomalies and less unresolved drift means a higher score.' },
    ]
  }
  if (brand.name === 'FoundingOS' && context === 'Investor Briefing') {
    return [
      { label: 'What is Package Model D?', answer: 'Package Model D is the adaptive pricing model — SystemOS tiers, industry packs, hardware packs, and QuantumOS/IntelligenceOS add-ons — priced per brand and tier.' },
      { label: 'Is this real customer data?', answer: 'No — every scraper and pipeline here generates synthetic intelligence only. Real data can plug into the same endpoints later without changing the OS.' },
    ]
  }
  if (brand.name === 'FoundingOS' && context === 'Guardian') {
    return [
      { label: 'What does Guardian actually check?', answer: 'Guardian watches each brand\u2019s own engagement and anomaly signals to keep it safely inside its own lane — it never mixes data across brands.' },
      { label: 'Is anything flagged right now?', answer: 'Check the anomaly count on this page — anything above the normal range gets flagged here first.' },
    ]
  }
  if (brand.name === 'FoundingOS' && context === 'Switcher Hub') {
    return [
      { label: 'What is Free Roam?', answer: 'Free Roam lets you explore every demo and survey without being locked into just your assigned one.' },
      { label: 'Are all brands unlocked for me?', answer: 'You can see every brand and survey here — some may show an honest lock note if your session isn\u2019t assigned to that one yet.' },
    ]
  }

  if (brand.name === 'FoundRetail') {
    return [
      { label: 'Add new product', answer: 'I can help you add a new product with a clean title, category, price, stock level, and supplier link.' },
      { label: 'Show low stock items', answer: 'I’ve highlighted the low-stock retail items that need attention before the next replenishment window.' },
      { label: 'Create customer', answer: 'I can prepare a new customer record with the right contact details and store preferences.' },
      { label: 'Review suppliers', answer: 'I’ve reviewed the supplier queue and flagged the highest-priority follow-ups.' },
      SCRAPE_REFRESH_ACTION,
      FEEDS_UPDATE_ACTION,
      DASHBOARD_REFRESH_ACTION,
    ]
  }

  if (brand.name === 'FoundMeat') {
    return [
      { label: 'Add new batch', answer: 'I can create a new batch record with supplier, cut, QA status, and delivery context.' },
      { label: 'Check compliance status', answer: 'Compliance is within range overall, and I’ve highlighted the batches that need the next QA review.' },
      { label: 'Review logistics', answer: 'I’ve organised the logistics partners by urgency so dispatch can focus on the tightest route first.' },
      { label: 'Record QA', answer: 'I can capture the QA result, owner, and next action in one clean update.' },
      SCRAPE_REFRESH_ACTION,
      FEEDS_UPDATE_ACTION,
      DASHBOARD_REFRESH_ACTION,
    ]
  }

  if (brand.name === 'FoundThat') {
    return [
      { label: 'Show system alerts', answer: 'I’ve pulled the active system alerts and grouped the ones that need immediate attention.' },
      { label: 'Summarise data pipeline health', answer: 'The data pipeline is mostly healthy, with one job that deserves a closer look before the next run.' },
      { label: 'Create a ticket', answer: 'I can draft a new support ticket and keep the response path clean and actionable.' },
      { label: 'Audit assets', answer: 'Asset coverage is stable, but I’ve marked the endpoints that should be revalidated this cycle.' },
      SCRAPE_REFRESH_ACTION,
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

  if (brand.name === 'FoundCrypto') {
    return [
      { label: 'Show wallet balance', answer: 'I’ve summarised the current wallet balance and highlighted the positions that need a closer look.' },
      { label: 'Create new trigger', answer: 'I can help you build a new trigger with signal, threshold, and execution context.' },
      { label: 'Review signals', answer: 'I’ve sorted the strongest market signals and flagged the ones that are most actionable.' },
      { label: 'Check risk', answer: 'The current risk profile is within limits, but one volatile pair should be watched closely.' },
      CRYPTO_POLL_ACTION,
      DASHBOARD_REFRESH_ACTION,
    ]
  }

  if (brand.name === 'FoundLogistics') {
    return [
      { label: 'Show active shipments', answer: 'I’ve pulled the active shipments and flagged the ones closest to their delivery window.' },
      { label: 'Check fleet status', answer: 'The fleet is running within normal capacity, with a couple of vehicles worth checking before their next route.' },
      { label: 'Review routes', answer: 'I’ve reviewed today’s routes and highlighted the ones with the tightest scheduling.' },
      SCRAPE_REFRESH_ACTION,
      DASHBOARD_REFRESH_ACTION,
    ]
  }

  if (brand.name === 'FoundFinance') {
    return [
      { label: 'Show open invoices', answer: 'I’ve pulled the open invoices and flagged the ones closest to their due date.' },
      { label: 'Check cash flow', answer: 'Cash flow is within range this cycle — I’ve highlighted the accounts worth a closer look.' },
      { label: 'Review reconciliation', answer: 'I’ve reviewed reconciliation status and flagged the entries that still need matching.' },
      { label: 'Explain Package Model D pricing', answer: 'Package Model D is the adaptive pricing engine behind FoundFinance\u2019s own tiers — SystemOS as the base, with IntelligenceOS and QuantumOS as add-ons.' },
      SCRAPE_REFRESH_ACTION,
    ]
  }

  if (brand.name === 'FoundHealth') {
    return [
      { label: 'Show today\u2019s appointments', answer: 'I’ve pulled today\u2019s appointments and flagged the ones that still need confirmation.' },
      { label: 'Check patient records status', answer: 'Patient records are up to date overall, with a few entries worth a closer review.' },
      { label: 'Review compliance', answer: 'Compliance is within range, and I’ve flagged the items due for their next check.' },
      { label: 'Check supply levels', answer: 'I’ve reviewed supply levels and flagged the items closest to reorder point.' },
      SCRAPE_REFRESH_ACTION,
    ]
  }

  return [
    { label: `Review ${context.toLowerCase()}`, answer: `I’ve reviewed the current ${context.toLowerCase()} context and lined up the next operational steps.` },
    { label: 'Summarise priorities', answer: 'I’ve pulled the top priorities into a concise action list.' },
    { label: 'Show likely risks', answer: 'I’ve highlighted the main risks and the quickest ways to respond.' },
    { label: 'Plan next steps', answer: 'I’ve drafted the clearest next-step plan for the current console context.' },
  ]
}

type FoundAIBrand = Pick<BrandConsoleConfig, 'name' | 'accent'>

// Real, honest topic answers for free-text questions — a rule-based keyword match, not a
// live LLM. Only ever states facts that are true elsewhere in this codebase (Package Model
// D, CRM board sections, Guardian's real scope, SuperDash's real rollup, the one real
// Marketing Suite module). Falls back to a context-relevant smart action rather than
// echoing the question back when nothing matches.
const KNOWLEDGE_BASE: Array<{ match: RegExp; answer: string }> = [
  { match: /\bcrm\b|contact|\blead\b|\bdeal\b|pipeline/i, answer: 'CRM covers contacts, companies, deals, pipeline, notes, tasks, and activity — one real board per brand, already live under /crm.' },
  { match: /invoice|cashflow|cash flow|reconcil|payable|receivable|forecast/i, answer: 'Invoicing and cash flow live in the Accounting module (with dedicated tools on FoundFinance) — real records, not a mockup.' },
  { match: /subscription/i, answer: 'Subscriptions are tracked as part of the Finance/Accounting layer alongside invoices — there\u2019s no separate subscriptions screen yet.' },
  { match: /package model d|pricing|\btier\b/i, answer: 'Package Model D is the adaptive pricing engine — SystemOS/IntelligenceOS/QuantumOS tiers plus industry and hardware packs — see the SuperDash commercial panel or onboarding for the live catalog.' },
  { match: /marketing/i, answer: 'Marketing Suite is one real, active module — campaigns, sends, and analytics all live inside it, not separate tools.' },
  { match: /automat/i, answer: 'Automations run through Guardian + Autonomous reactions on top of real BrandMetric signals — no manual triggering needed.' },
  { match: /superdash|super dash/i, answer: 'SuperDash is the cross-brand intelligence layer — analytics, brand switching, tester metrics, stability, and autonomy all roll up there in real time.' },
  { match: /intelligenceos/i, answer: 'IntelligenceOS is the sharper-analytics tier of Package Model D, feeding the live BrandMetric rollups in SuperDash.' },
  { match: /quantumos/i, answer: 'QuantumOS is the top Package Model D tier — cross-console simulations, confidence scoring, and forecasting on top of SystemOS.' },
  { match: /systemos/i, answer: 'SystemOS is the Package Model D foundation tier — workspace setup, access governance, and core modules every account starts on.' },
  { match: /guardian/i, answer: 'Guardian watches each brand\u2019s own engagement and anomaly signals to keep it safely inside its own lane, and flags anything unusual for review.' },
  { match: /\bbrand(s)?\b|multi-brand|ecosystem/i, answer: 'FoundingOS connects all 8 brand consoles — Retail, Meat, Logistics, Talent, Crypto, Finance, Health, and FoundThat — under one shared intelligence layer.' },
]

function matchKnowledge(text: string): string | null {
  const hit = KNOWLEDGE_BASE.find((entry) => entry.match.test(text))
  return hit?.answer ?? null
}

export function FoundAI({ brand }: { brand: FoundAIBrand }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const context = useMemo(() => routeLabel(pathname), [pathname])
  const theme = useMemo(() => foundAITheme(brand), [brand])
  const prompts = useMemo(() => suggestedPrompts(brand, context), [brand, context])
  const actions = useMemo(() => [...smartActions(brand, context), FOUNDAI_STORY_ACTION], [brand, context])

  useEffect(() => {
    if (!open) return
    if (messages.length > 0) return
    setMessages([
      {
        role: 'assistant',
        text: `Hi, I’m FoundAI. I’m watching ${brand.name} ${context.toLowerCase()} and can help with next steps, risks, or quick actions.`,
      },
    ])
  }, [open, messages.length, brand.name, context])

  const submit = (text: string) => {
    const clean = text.trim()
    if (!clean) return
    // Real, honest keyword match first; otherwise fall back to this context's own real
    // smart-action answer (still a genuine fact about this brand/context) rather than a
    // blank echo of the question.
    const knowledgeHit = matchKnowledge(clean)
    const contextualFallback = actions.find((action) => action.answer)?.answer
      ?? `Here's what's active in ${brand.name} ${context.toLowerCase()} — ask me about CRM, invoices, marketing, or SuperDash and I'll explain.`
    const reply = knowledgeHit ?? `For ${brand.name} ${context.toLowerCase()}: ${contextualFallback}`
    setMessages((current) => [...current, { role: 'user', text: clean }, { role: 'assistant', text: reply }])
    setInput('')
    setLoading(false)
  }

  const runAction = (action: SmartAction) => {
    setLoading(true)
    if (action.audioBank && action.audioBank.length > 0) {
      // Picked at click time (not fixed at render) so it varies across opens. Always shown
      // as a normal text message first; speech is a genuinely opt-in extra for this one
      // action only — nothing in FoundAI ever auto-plays audio.
      const line = action.audioBank[Math.floor(Math.random() * action.audioBank.length)]
      window.setTimeout(() => {
        setMessages((current) => [...current, { role: 'assistant', text: line }])
        setLoading(false)
        try {
          if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel()
            const utter = new SpeechSynthesisUtterance(line)
            utter.rate = 0.98
            if (!cachedVoice) cachedVoice = pickBestVoice()
            if (cachedVoice) utter.voice = cachedVoice
            window.speechSynthesis.speak(utter)
          }
        } catch {
          // Speech synthesis is a best-effort enhancement — the text message above already
          // conveys the line, so a synthesis failure is silently non-fatal.
        }
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
        })
        .catch(() => {
          setMessages((current) => [...current, { role: 'assistant', text: `I couldn’t reach ${action.fetchPath} on this app just now — it may not be deployed here yet.` }])
        })
        .finally(() => setLoading(false))
      return
    }
    window.setTimeout(() => {
      setMessages((current) => [...current, { role: 'assistant', text: action.answer ?? '' }])
      setLoading(false)
    }, 500)
  }

  return (
    <>
      <button
        type="button"
        className="found-ai-fab found-ai-circle"
        style={{ '--found-ai-accent': theme.accent, '--found-ai-glow': theme.glow } as React.CSSProperties}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Open FoundAI"
      >
        <span>AI</span>
      </button>

      <aside className={`found-ai-panel ${open ? 'open' : ''}`} style={{ '--found-ai-accent': theme.accent, '--found-ai-glow': theme.glow } as React.CSSProperties} aria-hidden={!open}>
        <header className="found-ai-panel-header">
        <div className="found-ai-avatar found-ai-circle">AI</div>
          <div>
            <strong>FoundAI</strong>
            <span>{brand.name} · {context}</span>
          </div>
          <button type="button" className="found-ai-close" onClick={() => setOpen(false)} aria-label="Close FoundAI">×</button>
        </header>

        <section className="found-ai-chat">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`found-ai-message ${message.role}`}>
              {message.text}
            </div>
          ))}
          {loading && <div className="found-ai-message assistant">FoundAI is thinking…</div>}
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
            placeholder={`Ask FoundAI about ${context.toLowerCase()}...`}
            rows={3}
          />
          <button type="button" className="btn btn-primary btn-premium" onClick={() => submit(input)}>Send</button>
        </footer>
      </aside>
    </>
  )
}

export default FoundAI
