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
  if (pathname === '/' || pathname === '/dashboard') return 'Dashboard'
  if (pathname === '/crm') return 'CRM'
  if (pathname === '/settings') return 'Settings'

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

  if (brand.name === 'FoundRetail') return ['Add new product', 'Show low stock items', 'Create customer', 'Review suppliers']
  if (brand.name === 'FoundMeat') return ['Add new batch', 'Check compliance status', 'Review logistics', 'Record QA']
  if (brand.name === 'FoundThat') return ['Show system alerts', 'Summarise data pipeline health', 'Create a ticket', 'Audit assets']
  if (brand.name === 'FoundTalent') return ['Add new job', 'Find top candidates', 'Schedule interview', 'Review pipeline']
  if (brand.name === 'FoundCrypto') return ['Show wallet balance', 'Create new trigger', 'Review signals', 'Check risk']
  return base
}

function smartActions(brand: FoundAIBrand, context: string) {
  if (brand.name === 'FoundRetail') {
    return [
      { label: 'Add new product', answer: 'I can help you add a new product with a clean title, category, price, stock level, and supplier link.' },
      { label: 'Show low stock items', answer: 'I’ve highlighted the low-stock retail items that need attention before the next replenishment window.' },
      { label: 'Create customer', answer: 'I can prepare a new customer record with the right contact details and store preferences.' },
      { label: 'Review suppliers', answer: 'I’ve reviewed the supplier queue and flagged the highest-priority follow-ups.' },
    ]
  }

  if (brand.name === 'FoundMeat') {
    return [
      { label: 'Add new batch', answer: 'I can create a new batch record with supplier, cut, QA status, and delivery context.' },
      { label: 'Check compliance status', answer: 'Compliance is within range overall, and I’ve highlighted the batches that need the next QA review.' },
      { label: 'Review logistics', answer: 'I’ve organised the logistics partners by urgency so dispatch can focus on the tightest route first.' },
      { label: 'Record QA', answer: 'I can capture the QA result, owner, and next action in one clean update.' },
    ]
  }

  if (brand.name === 'FoundThat') {
    return [
      { label: 'Show system alerts', answer: 'I’ve pulled the active system alerts and grouped the ones that need immediate attention.' },
      { label: 'Summarise data pipeline health', answer: 'The data pipeline is mostly healthy, with one job that deserves a closer look before the next run.' },
      { label: 'Create a ticket', answer: 'I can draft a new support ticket and keep the response path clean and actionable.' },
      { label: 'Audit assets', answer: 'Asset coverage is stable, but I’ve marked the endpoints that should be revalidated this cycle.' },
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

export function FoundAI({ brand }: { brand: FoundAIBrand }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const context = useMemo(() => routeLabel(pathname), [pathname])
  const theme = useMemo(() => foundAITheme(brand), [brand])
  const prompts = useMemo(() => suggestedPrompts(brand, context), [brand, context])
  const actions = useMemo(() => smartActions(brand, context), [brand, context])

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
    setMessages((current) => [...current, { role: 'user', text: clean }, { role: 'assistant', text: `For ${brand.name} ${context.toLowerCase()}, I’d focus on: ${clean}.` }])
    setInput('')
    setLoading(false)
  }

  const runAction = (answer: string) => {
    setLoading(true)
    window.setTimeout(() => {
      setMessages((current) => [...current, { role: 'assistant', text: answer }])
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
              <button key={action.label} type="button" onClick={() => runAction(action.answer)}>{action.label}</button>
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
