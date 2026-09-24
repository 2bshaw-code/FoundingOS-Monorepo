/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useMemo, useState } from 'react'
import { QuantumButtonGhost, QuantumButtonPrimary, QuantumCard, QuantumMetricCard, QuantumSelect, QuantumTextField, qText } from '@foundingos/ui/quantum'
import { brands } from '@foundingos/config'

export type PipelineLead = {
  id: string
  companyName: string
  contactName: string | null
  stage: string
  valuePence: number
  customerId: string | null
  createdAt: string
  updatedAt: string
  tags?: string[]
  assignedUserId?: string | null
}

type ConversationMessage = { id: string; channel: string; direction: string; body: string; createdAt: string; status?: string; mediaUrl?: string | null; mediaType?: string | null }
type AiAnswer = {
  answer: string
  citations: Array<{ workspace: string; module: string; reference: string; name: string }>
  suggestedActions: string[]
  quotedMessages: string[]
  usedConversation: boolean
  conversationMessageCount: number
}
type PendingMessage = { tempId: string; body: string; createdAt: string; status: 'sending' | 'failed' }

const STAGES = ['new', 'qualified', 'proposal', 'won', 'lost'] as const
const OPEN_STAGES = STAGES.filter((stage) => stage !== 'lost' && stage !== 'won')
// How often to re-poll an open conversation panel for new inbound WhatsApp messages. Short
// enough to feel live, long enough not to hammer Core.Operations while a rep is just reading.
const CONVERSATION_POLL_MS = 6_000

// Real, honest status label for an outbound message — reflects whatever WhatsApp's own
// delivery/read webhook last reported (or "Sent" if no status webhook has landed yet), never
// a guessed/simulated progression.
function statusLabel(status: string | undefined) {
  switch (status) {
    case 'delivered': return 'Delivered ✓✓'
    case 'read': return 'Read ✓✓'
    case 'failed': return 'Failed'
    case 'sent':
    default: return 'Sent ✓'
  }
}

function formatMoney(pence: number) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(pence / 100)
}

function formatMessageTime(iso: string) {
  return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
}

// A short, human day label for the conversation thread's date separators — "Today"/
// "Yesterday" read naturally in a fast-moving WhatsApp thread; anything older falls back to
// a plain date so the separator stays meaningful without needing the year in the common case.
function formatDaySeparator(iso: string) {
  const date = new Date(iso)
  const today = new Date()
  const startOfDay = (value: Date) => new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime()
  const diffDays = Math.round((startOfDay(today) - startOfDay(date)) / 86_400_000)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: date.getFullYear() === today.getFullYear() ? undefined : 'numeric' }).format(date)
}

// Human-readable "how long has this been waiting" duration for the Pipeline's "Awaiting
// reply" badge — deliberately coarse (minutes/hours/days) rather than a precise countdown,
// since this is meant to convey urgency at a glance, not double as a stopwatch.
function formatWaitingDuration(iso: string): string {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60_000))
  if (minutes < 60) return `${minutes || 1}m`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.round(hours / 24)
  return `${days}d`
}

// Client half of the console's first real, backend-persisted module. Renders the leads the
// server component fetched, and lets you add a lead or move its stage — both write straight
// through /api/pipeline (this app's own proxy) to Core.Operations' real Lead model, the same
// one the mobile app's Sales Pipeline already uses.
export function PipelineBoard({ initialLeads, awaitingReplySince = {} }: { initialLeads: PipelineLead[]; awaitingReplySince?: Record<string, string> }) {
  const [leads, setLeads] = useState(initialLeads)
  const [companyName, setCompanyName] = useState('')
  const [contactName, setContactName] = useState('')
  const [valuePounds, setValuePounds] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [openConversationFor, setOpenConversationFor] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Record<string, ConversationMessage[] | 'loading' | 'error'>>({})
  const [pendingByLead, setPendingByLead] = useState<Record<string, PendingMessage | undefined>>({})
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({})
  const [sendingReplyFor, setSendingReplyFor] = useState<string | null>(null)
  const [converting, setConverting] = useState<string | null>(null)
  const [stageFilter, setStageFilter] = useState<(typeof STAGES)[number] | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [aiOpenFor, setAiOpenFor] = useState<string | null>(null)
  const [aiQuestions, setAiQuestions] = useState<Record<string, string>>({})
  const [aiAnswers, setAiAnswers] = useState<Record<string, AiAnswer | 'loading' | 'error'>>({})
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set())
  const [bulkUpdating, setBulkUpdating] = useState(false)
  const [bulkTagInput, setBulkTagInput] = useState('')

  // Mirrors the KPI row and stage filter the mobile app's Sales Pipeline already has, so both
  // surfaces feel consistent for the same messaging-driven deals — computed client-side from
  // the same leads already loaded, no extra backend call needed.
  const kpis = useMemo(() => {
    const open = leads.filter((lead) => OPEN_STAGES.includes(lead.stage as (typeof OPEN_STAGES)[number]))
    const won = leads.filter((lead) => lead.stage === 'won')
    const decided = leads.filter((lead) => lead.stage === 'won' || lead.stage === 'lost')
    return {
      openValuePence: open.reduce((sum, lead) => sum + lead.valuePence, 0),
      wonValuePence: won.reduce((sum, lead) => sum + lead.valuePence, 0),
      winRate: decided.length === 0 ? 0 : Math.round((won.length / decided.length) * 100),
    }
  }, [leads])

  const visibleLeads = useMemo(() => {
    const byStage = stageFilter === 'all' ? leads : leads.filter((lead) => lead.stage === stageFilter)
    const query = searchQuery.trim().toLowerCase()
    if (!query) return byStage
    // Client-side search across company/contact name — the lead list is already fully
    // loaded (tenant-scoped, capped at 100 in pipelineSummary), so a network round-trip
    // isn't needed for something this small, and results update instantly as you type.
    return byStage.filter((lead) =>
      lead.companyName.toLowerCase().includes(query) || (lead.contactName ?? '').toLowerCase().includes(query)
    )
  }, [leads, stageFilter, searchQuery])

  async function createLead() {
    if (!companyName.trim()) {
      setError('Company name is required.')
      return
    }
    setCreating(true)
    setError(null)
    try {
      const response = await fetch('/api/pipeline', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          companyName: companyName.trim(),
          contactName: contactName.trim() || undefined,
          valuePence: valuePounds ? Math.round(Number(valuePounds) * 100) : undefined,
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.error || 'Could not create the lead.')
      setLeads((current) => [data as PipelineLead, ...current])
      setCompanyName('')
      setContactName('')
      setValuePounds('')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not create the lead.')
    } finally {
      setCreating(false)
    }
  }

  async function changeStage(id: string, stage: string): Promise<boolean> {
    const previousStage = leads.find((lead) => lead.id === id)?.stage
    setLeads((current) => current.map((lead) => (lead.id === id ? { ...lead, stage } : lead)))
    try {
      const response = await fetch(`/api/pipeline/${id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ stage }),
      })
      if (!response.ok) throw new Error('Could not update the lead.')
      return true
    } catch {
      // Revert just this lead's stage (not the whole list) so a failed update can't clobber
      // other leads that changed concurrently — matters now that bulk actions (below) can
      // fire several of these calls at once.
      if (previousStage) setLeads((current) => current.map((lead) => (lead.id === id ? { ...lead, stage: previousStage } : lead)))
      setError('Could not update that lead. Please try again.')
      return false
    }
  }

  // A lead only has a real conversation thread once it's been converted into a Customer
  // (customerId set) — that's where CustomerMessage rows (real WhatsApp/messaging history)
  // live. This is a messaging-first OS, so a deal should let you see the actual conversation
  // it came from, not just its stage/value. Shared by the initial open, the poll-refresh, and
  // the auto-open right after a lead is converted.
  async function loadConversation(customerId: string, options: { silent?: boolean } = {}) {
    if (!options.silent) setConversations((current) => ({ ...current, [customerId]: 'loading' }))
    try {
      const response = await fetch(`/api/customers/${customerId}`)
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error()
      setConversations((current) => ({ ...current, [customerId]: (data?.messages ?? []) as ConversationMessage[] }))
    } catch {
      if (!options.silent) setConversations((current) => ({ ...current, [customerId]: 'error' }))
      // A silent (background poll) failure is left alone — the thread keeps showing whatever
      // was last loaded successfully rather than flashing an error while someone is reading.
    }
  }

  function toggleConversation(lead: PipelineLead) {
    if (openConversationFor === lead.id) {
      setOpenConversationFor(null)
      return
    }
    setOpenConversationFor(lead.id)
    if (lead.customerId && !conversations[lead.customerId]) void loadConversation(lead.customerId)
  }

  // Keeps the open conversation live — polls for new inbound WhatsApp messages every few
  // seconds while a panel is open, instead of requiring a manual page refresh to see a reply
  // come in. Stops as soon as the panel is closed or another lead's panel is opened, and
  // pauses while the browser tab isn't visible so an idle background tab isn't quietly
  // hammering Core.Operations for every rep who leaves the console open all day.
  useEffect(() => {
    if (!openConversationFor) return
    const lead = leads.find((item) => item.id === openConversationFor)
    if (!lead?.customerId) return
    const customerId = lead.customerId
    let interval: ReturnType<typeof setInterval> | null = null
    const start = () => {
      if (interval) return
      interval = setInterval(() => {
        void loadConversation(customerId, { silent: true })
      }, CONVERSATION_POLL_MS)
    }
    const stop = () => {
      if (interval) clearInterval(interval)
      interval = null
    }
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        void loadConversation(customerId, { silent: true })
        start()
      } else {
        stop()
      }
    }
    if (document.visibilityState === 'visible') start()
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      stop()
      document.removeEventListener('visibilitychange', handleVisibility)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openConversationFor, leads])

  // Sends a real WhatsApp message to this customer (via /api/customers/:id/messages, which
  // proxies Core.Operations' Cloud API send-and-record), then appends it to the open thread
  // immediately so a reply feels native instead of only showing up after a refresh. A
  // "Sending…" bubble shows while the Cloud API call is in flight, and turns into the real,
  // persisted message (shown as "Sent") once it succeeds — or "Failed to send" if it doesn't,
  // so the thread is always honest about what's actually happened, not just optimistic.
  async function sendReply(lead: PipelineLead) {
    const customerId = lead.customerId
    const text = (replyDrafts[lead.id] || '').trim()
    if (!customerId || !text) return
    setSendingReplyFor(lead.id)
    setError(null)
    const tempId = `pending-${Date.now()}`
    setPendingByLead((current) => ({ ...current, [lead.id]: { tempId, body: text, createdAt: new Date().toISOString(), status: 'sending' } }))
    try {
      const response = await fetch(`/api/customers/${customerId}/messages`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.error || 'Could not send that message.')
      setConversations((current) => {
        const existing = current[customerId]
        const thread = Array.isArray(existing) ? existing : []
        return { ...current, [customerId]: [data as ConversationMessage, ...thread] }
      })
      setPendingByLead((current) => ({ ...current, [lead.id]: undefined }))
      setReplyDrafts((current) => ({ ...current, [lead.id]: '' }))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not send that message.')
      setPendingByLead((current) => ({ ...current, [lead.id]: { tempId, body: text, createdAt: new Date().toISOString(), status: 'failed' } }))
    } finally {
      setSendingReplyFor(null)
    }
  }

  // Quick "Mark lost" parity with the mobile app's swipe-to-lose gesture — the stage select
  // already supports this, but a one-tap action is the ergonomic equivalent on the web.
  function markLost(lead: PipelineLead) {
    void changeStage(lead.id, 'lost')
  }

  function toggleSelected(id: string) {
    setSelectedLeadIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Bulk version of "Mark lost" for when a rep is clearing out several stale leads at once —
  // reuses the same per-lead PATCH /api/pipeline/:id as the single-lead action above (no new
  // bulk endpoint needed), just fires them together and reports how many succeeded.
  async function markSelectedLost() {
    const ids = [...selectedLeadIds]
    if (ids.length === 0) return
    setBulkUpdating(true)
    setError(null)
    const results = await Promise.all(ids.map((id) => changeStage(id, 'lost')))
    const failed = results.filter((succeeded) => !succeeded).length
    if (failed > 0) setError(`Marked ${ids.length - failed} of ${ids.length} leads as lost — the rest failed, please try again.`)
    setSelectedLeadIds(new Set())
    setBulkUpdating(false)
  }

  // Assigns the selected leads to whoever is currently signed in ("me" is resolved server-side
  // to the authenticated user — the console never needs to know its own user ID), and adds a
  // tag to all of them if one was entered. Uses the real PATCH /api/pipeline/bulk endpoint.
  async function assignSelectedToMe() {
    const ids = [...selectedLeadIds]
    if (ids.length === 0) return
    setBulkUpdating(true)
    setError(null)
    try {
      const response = await fetch('/api/pipeline/bulk', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ids, assignedUserId: 'me' }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.error || 'Could not assign the selected leads.')
      setSelectedLeadIds(new Set())
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not assign the selected leads.')
    } finally {
      setBulkUpdating(false)
    }
  }

  async function tagSelected(tag: string) {
    const ids = [...selectedLeadIds]
    const cleanTag = tag.trim()
    if (ids.length === 0 || !cleanTag) return
    setBulkUpdating(true)
    setError(null)
    try {
      // Merges the new tag onto each selected lead's own existing tags — a bulk tag action
      // should add to what's already there, not overwrite one lead's tags with another's.
      const targets = leads.filter((lead) => selectedLeadIds.has(lead.id))
      await Promise.all(
        targets.map((lead) => {
          const existingTags = lead.tags ?? []
          const nextTags = existingTags.includes(cleanTag) ? existingTags : [...existingTags, cleanTag]
          return fetch('/api/pipeline/bulk', {
            method: 'PATCH',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ ids: [lead.id], tags: nextTags }),
          })
        }),
      )
      setSelectedLeadIds(new Set())
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not tag the selected leads.')
    } finally {
      setBulkUpdating(false)
    }
  }

  // Permanently deletes the selected leads — irreversible, so gated behind a plain confirm()
  // rather than a silent one-click action.
  async function deleteSelected() {
    const ids = [...selectedLeadIds]
    if (ids.length === 0) return
    if (!window.confirm(`Permanently delete ${ids.length} lead${ids.length === 1 ? '' : 's'}? This cannot be undone.`)) return
    setBulkUpdating(true)
    setError(null)
    try {
      const response = await fetch('/api/pipeline/bulk', {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ids }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.error || 'Could not delete the selected leads.')
      setLeads((current) => current.filter((lead) => !selectedLeadIds.has(lead.id)))
      setSelectedLeadIds(new Set())
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not delete the selected leads.')
    } finally {
      setBulkUpdating(false)
    }
  }

  // Converts this lead into a real Customer, then opens its conversation panel immediately —
  // so going from "lead" to "I can see their WhatsApp history" is one action, not a detour to
  // another screen. Leads without a phone/email on file still convert, they'll just have no
  // messages yet until one comes in.
  async function convertLead(lead: PipelineLead) {
    setConverting(lead.id)
    setError(null)
    try {
      const response = await fetch(`/api/pipeline/${lead.id}/convert`, { method: 'POST' })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.error || 'Could not convert this lead.')
      const customerId = String(data?.id || '')
      if (!customerId) throw new Error('Could not convert this lead.')
      setLeads((current) => current.map((item) => (item.id === lead.id ? { ...item, customerId } : item)))
      setOpenConversationFor(lead.id)
      void loadConversation(customerId)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not convert this lead.')
    } finally {
      setConverting(null)
    }
  }

  // Grounds FoundAI's answer in this specific customer's real WhatsApp thread when one is
  // open — this is what makes "ask FoundAI about this conversation" meaningfully different
  // from asking it about workspace records in general. Each lead keeps its own question, and
  // opening the widget pre-fills a sensible default so it's one tap to ask, not a blank box.
  function openAiFor(lead: PipelineLead) {
    const next = aiOpenFor === lead.id ? null : lead.id
    setAiOpenFor(next)
    if (next && !aiQuestions[lead.id]) {
      setAiQuestions((current) => ({ ...current, [lead.id]: `What does ${lead.contactName || lead.companyName} need from us next?` }))
    }
  }

  async function askAiAboutLead(lead: PipelineLead) {
    const question = (aiQuestions[lead.id] || '').trim()
    if (!question) return
    setAiAnswers((current) => ({ ...current, [lead.id]: 'loading' }))
    try {
      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question, customerId: lead.customerId }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error()
      setAiAnswers((current) => ({ ...current, [lead.id]: data as AiAnswer }))
    } catch {
      setAiAnswers((current) => ({ ...current, [lead.id]: 'error' }))
    }
  }

  return (
    <div className="q-form-stack">
      <div className="q-ai-domain-grid">
        <QuantumMetricCard label="Open pipeline" value={formatMoney(kpis.openValuePence)} brand={brands.foundingos} />
        <QuantumMetricCard label="Won this cycle" value={formatMoney(kpis.wonValuePence)} brand={brands.foundingos} />
        <QuantumMetricCard label="Win rate" value={`${kpis.winRate}%`} brand={brands.foundingos} />
      </div>

      <QuantumCard brand={brands.foundingos}>
        <p className={qText.overline}>Add a lead</p>
        <div className="q-form-stack">
          <QuantumTextField label="Company name" value={companyName} onChange={(event) => setCompanyName((event.target as HTMLInputElement).value)} />
          <QuantumTextField label="Contact name (optional)" value={contactName} onChange={(event) => setContactName((event.target as HTMLInputElement).value)} />
          <QuantumTextField label="Deal value in GBP (optional)" type="number" min="0" step="0.01" value={valuePounds} onChange={(event) => setValuePounds((event.target as HTMLInputElement).value)} />
          {error ? <p className={qText.caption}>{error}</p> : null}
          <QuantumButtonPrimary type="button" disabled={creating} onClick={() => void createLead()}>
            {creating ? 'Adding…' : 'Add lead'}
          </QuantumButtonPrimary>
        </div>
      </QuantumCard>

      {leads.length === 0 ? (
        <QuantumCard brand={brands.foundingos}>
          <p className={qText.body}>No leads yet. Add your first one above — it's saved to your real FoundingOS account, not a demo.</p>
        </QuantumCard>
      ) : (
        <>
          <QuantumTextField
            label="Search leads"
            placeholder="Search by company or contact name…"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <div className="q-pill-row">
            <button type="button" className={`q-pill${stageFilter === 'all' ? ' q-pill-active' : ''}`} onClick={() => setStageFilter('all')}>
              All ({leads.length})
            </button>
            {STAGES.map((stage) => (
              <button key={stage} type="button" className={`q-pill${stageFilter === stage ? ' q-pill-active' : ''}`} onClick={() => setStageFilter(stage)}>
                {stage.charAt(0).toUpperCase() + stage.slice(1)} ({leads.filter((lead) => lead.stage === stage).length})
              </button>
            ))}
          </div>
          {visibleLeads.length === 0 ? (
            <QuantumCard brand={brands.foundingos}>
              <p className={qText.body}>No leads match "{searchQuery}".</p>
            </QuantumCard>
          ) : null}
          {selectedLeadIds.size > 0 ? (
            <QuantumCard brand={brands.foundingos}>
              <p className={qText.body}>
                {selectedLeadIds.size} lead{selectedLeadIds.size === 1 ? '' : 's'} selected.
              </p>
              <div className="q-pill-row">
                <QuantumButtonGhost type="button" disabled={bulkUpdating} onClick={() => void markSelectedLost()}>
                  {bulkUpdating ? 'Updating…' : 'Mark selected as lost'}
                </QuantumButtonGhost>
                <QuantumButtonGhost type="button" disabled={bulkUpdating} onClick={() => void assignSelectedToMe()}>
                  Assign to me
                </QuantumButtonGhost>
                <QuantumButtonGhost type="button" disabled={bulkUpdating} onClick={() => void deleteSelected()}>
                  Delete selected
                </QuantumButtonGhost>
                <QuantumButtonGhost type="button" onClick={() => setSelectedLeadIds(new Set())}>
                  Clear selection
                </QuantumButtonGhost>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <QuantumTextField label="Add a tag" placeholder="e.g. vip, follow-up" value={bulkTagInput} onChange={(event) => setBulkTagInput(event.target.value)} />
                <QuantumButtonGhost type="button" disabled={bulkUpdating || !bulkTagInput.trim()} onClick={() => { void tagSelected(bulkTagInput); setBulkTagInput('') }}>
                  Apply tag
                </QuantumButtonGhost>
              </div>
            </QuantumCard>
          ) : null}

          {visibleLeads.map((lead) => {
          const conversation = lead.customerId ? conversations[lead.customerId] : undefined
          const aiAnswer = aiAnswers[lead.id]
          const pending = pendingByLead[lead.id]
          const awaitingReplySinceIso = lead.customerId ? awaitingReplySince[lead.customerId] : undefined
          return (
            <QuantumCard key={lead.id} brand={brands.foundingos}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="checkbox"
                  checked={selectedLeadIds.has(lead.id)}
                  onChange={() => toggleSelected(lead.id)}
                  aria-label={`Select ${lead.companyName}`}
                />
              </label>
              <p className={qText.overline}>
                {lead.companyName}
                {awaitingReplySinceIso ? (
                  <span className="q-pill q-pill-active" style={{ marginLeft: 8 }}>
                    Awaiting reply · {formatWaitingDuration(awaitingReplySinceIso)}
                  </span>
                ) : null}
                {(lead.tags ?? []).map((tag) => (
                  <span key={tag} className="q-pill" style={{ marginLeft: 8 }}>
                    {tag}
                  </span>
                ))}
              </p>
              <p className={qText.body}>
                {lead.contactName ? `${lead.contactName} · ` : ''}
                {formatMoney(lead.valuePence)}
              </p>
              {lead.stage === 'converted' ? (
                // 'converted' is set by the backend when a lead becomes a customer (see
                // convertLead in pipeline.ts) — it's deliberately not one of the pipeline's
                // working stages (new/qualified/proposal/won/lost), so the stage select would
                // render with no matching <option> and look blank. Show a plain status line
                // instead of a dropdown for a stage that isn't meant to be re-selected here.
                <p className={qText.caption}>Stage: Converted to customer ✓</p>
              ) : (
                <QuantumSelect label="Stage" value={lead.stage} onChange={(event) => void changeStage(lead.id, (event.target as HTMLSelectElement).value)}>
                  {STAGES.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage.charAt(0).toUpperCase() + stage.slice(1)}
                    </option>
                  ))}
                </QuantumSelect>
              )}
              {lead.stage !== 'lost' && lead.stage !== 'won' && lead.stage !== 'converted' ? (
                <QuantumButtonGhost type="button" onClick={() => markLost(lead)}>
                  Mark lost
                </QuantumButtonGhost>
              ) : null}
              {lead.customerId ? (
                <div className="q-form-stack">
                  <QuantumButtonGhost type="button" onClick={() => toggleConversation(lead)}>
                    {openConversationFor === lead.id ? 'Hide conversation' : 'View conversation'}
                  </QuantumButtonGhost>
                  {openConversationFor === lead.id ? (
                    conversation === 'loading' || conversation === undefined ? (
                      <p className={qText.caption}>Loading conversation…</p>
                    ) : conversation === 'error' ? (
                      <p className={qText.caption}>Could not load this conversation.</p>
                    ) : (
                      <div className="q-form-stack">
                        {conversation.length === 0 && !pending ? (
                          <p className={qText.caption}>No messages yet with this customer.</p>
                        ) : (
                          <div className="q-conversation-thread">
                            {[...conversation].reverse().map((message, index, ordered) => {
                              const previous = ordered[index - 1]
                              const showDaySeparator = !previous || formatDaySeparator(previous.createdAt) !== formatDaySeparator(message.createdAt)
                              return (
                                <div key={message.id} className="q-form-stack">
                                  {showDaySeparator ? <p className="q-conversation-day">{formatDaySeparator(message.createdAt)}</p> : null}
                                  <div className={`q-message-bubble q-message-bubble--${message.direction === 'inbound' ? 'inbound' : 'outbound'}`}>
                                    <span className="q-message-meta">
                                      <strong>{message.direction === 'inbound' ? lead.contactName || lead.companyName : 'You'}</strong>
                                      <span>· {message.channel}</span>
                                      <span>· {formatMessageTime(message.createdAt)}</span>
                                      {message.direction === 'outbound' ? <span>· {statusLabel(message.status)}</span> : null}
                                    </span>
                                    <span className="q-message-body">{message.body}</span>
                                    {message.mediaUrl && message.mediaType === 'image' ? (
                                      <img src={message.mediaUrl} alt="" className="q-message-media-image" />
                                    ) : message.mediaUrl ? (
                                      <a href={message.mediaUrl} target="_blank" rel="noreferrer" className="q-message-media-link">
                                        Open attachment
                                      </a>
                                    ) : null}
                                  </div>
                                </div>
                              )
                            })}
                            {pending ? (
                              <div className={`q-message-bubble q-message-bubble--outbound${pending.status === 'failed' ? ' q-message-bubble--failed' : ' q-message-bubble--pending'}`}>
                                <span className="q-message-meta">
                                  <strong>You</strong>
                                  <span>· {pending.status === 'sending' ? 'Sending…' : 'Failed to send'}</span>
                                </span>
                                <span className="q-message-body">{pending.body}</span>
                                {pending.status === 'failed' ? (
                                  <QuantumButtonGhost type="button" onClick={() => void sendReply(lead)}>
                                    Retry
                                  </QuantumButtonGhost>
                                ) : null}
                              </div>
                            ) : null}
                          </div>
                        )}
                        {conversation.length >= 100 ? (
                          <p className={qText.caption}>Showing the most recent 100 messages.</p>
                        ) : null}
                        <p className={qText.caption}>
                          Live — checks for new WhatsApp messages every few seconds while this
                          panel is open. "Sent" confirms WhatsApp accepted the message;
                          delivered/read receipts aren't wired up yet.
                        </p>
                        <div className="q-form-stack">
                          <QuantumTextField
                            label="Reply on WhatsApp"
                            placeholder="Type a quick reply…"
                            value={replyDrafts[lead.id] || ''}
                            onChange={(event) => setReplyDrafts((current) => ({ ...current, [lead.id]: (event.target as HTMLInputElement).value }))}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') void sendReply(lead)
                            }}
                          />
                          <QuantumButtonPrimary type="button" disabled={sendingReplyFor === lead.id || !(replyDrafts[lead.id] || '').trim()} onClick={() => void sendReply(lead)}>
                            {sendingReplyFor === lead.id ? 'Sending…' : 'Send reply'}
                          </QuantumButtonPrimary>
                        </div>
                        <div className="q-form-stack">
                          <QuantumButtonGhost type="button" onClick={() => openAiFor(lead)}>
                            {aiOpenFor === lead.id ? 'Hide FoundAI' : 'Ask FoundAI about this conversation'}
                          </QuantumButtonGhost>
                          {aiOpenFor === lead.id ? (
                            <div className="q-form-stack">
                              <QuantumTextField
                                label={`Ask about ${lead.contactName || lead.companyName}`}
                                placeholder="e.g. What is this customer waiting on?"
                                value={aiQuestions[lead.id] || ''}
                                onChange={(event) => setAiQuestions((current) => ({ ...current, [lead.id]: (event.target as HTMLInputElement).value }))}
                                onKeyDown={(event) => {
                                  if (event.key === 'Enter') void askAiAboutLead(lead)
                                }}
                              />
                              <QuantumButtonPrimary type="button" disabled={aiAnswer === 'loading' || !(aiQuestions[lead.id] || '').trim()} onClick={() => void askAiAboutLead(lead)}>
                                {aiAnswer === 'loading' ? 'Asking FoundAI…' : 'Ask'}
                              </QuantumButtonPrimary>
                              {aiAnswer === 'error' ? (
                                <p className={qText.caption}>FoundAI couldn't answer that — check it's configured (ANTHROPIC_API_KEY) and try again.</p>
                              ) : aiAnswer && aiAnswer !== 'loading' ? (
                                <QuantumCard brand={brands.foundingos}>
                                  <p className={qText.overline}>
                                    {aiAnswer.usedConversation
                                      ? `Answered from this WhatsApp conversation · Based on ${aiAnswer.conversationMessageCount} message${aiAnswer.conversationMessageCount === 1 ? '' : 's'}`
                                      : 'Answered from workspace records'}
                                  </p>
                                  <p className={qText.body}>{aiAnswer.answer}</p>
                                  {aiAnswer.quotedMessages.length > 0 ? (
                                    <div className="q-form-stack">
                                      <p className={qText.overline}>What {lead.contactName || lead.companyName} actually said</p>
                                      {aiAnswer.quotedMessages.map((quote, index) => (
                                        <blockquote key={index} className="q-message-bubble q-message-bubble--inbound">
                                          <span className="q-message-body">&ldquo;{quote}&rdquo;</span>
                                        </blockquote>
                                      ))}
                                    </div>
                                  ) : null}
                                  {aiAnswer.suggestedActions.length > 0 ? (
                                    <p className={qText.caption}>FoundAI suggests: {aiAnswer.suggestedActions.join(' · ')}</p>
                                  ) : null}
                                </QuantumCard>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    )
                  ) : null}
                </div>
              ) : (
                <div className="q-form-stack">
                  <p className={qText.caption}>No linked conversation yet — convert this lead to a customer to see its WhatsApp history here.</p>
                  <QuantumButtonGhost type="button" disabled={converting === lead.id} onClick={() => void convertLead(lead)}>
                    {converting === lead.id ? 'Converting…' : 'Convert to customer'}
                  </QuantumButtonGhost>
                </div>
              )}
            </QuantumCard>
          )
          })}
        </>
      )}
    </div>
  )
}
