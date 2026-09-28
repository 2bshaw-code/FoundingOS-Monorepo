'use client'
/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// FoundAI inside SuperDash, asking about FoundingOS's own business rather than a customer
// workspace. Sends scope: 'founder' so the backend supplies revenue, costs, runway and
// platform health alongside the usual records, and turns a suggested cost into a real
// ledger entry in one tap.
import { useEffect, useRef, useState } from 'react'
import { productionRequest } from './workspace-production-client'
import type { FounderFinance } from './founder-types'

type Answer = {
  answer: string
  suggestedActions: string[]
  citations: Array<{ workspace: string; module: string; reference: string; name: string }>
  webSources: Array<{ title: string; url: string }>
  researchEnabled: boolean
  model: string
}

type Turn = {
  id: string
  question: string
  answer: Answer | null
  error?: string
}

const PROMPTS = [
  'What is my MRR and how many paying customers do I have?',
  'What am I spending each month and what is my biggest cost?',
  'How long is my runway?',
  'What are competitors charging for WhatsApp business tools right now?',
  'What is happening in my market this month that I should know about?',
]

// The conversation is kept in the browser so closing SuperDash and coming back does not
// wipe what was already discussed. It is FoundingOS's own business data, so it stays on
// the founder's own device rather than being written to a shared store.
const MEMORY_KEY = 'foundingos-superdash-ai-thread'
const MEMORY_LIMIT = 20

function loadThread(): Turn[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(MEMORY_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return Array.isArray(parsed) ? (parsed as Turn[]).slice(-MEMORY_LIMIT) : []
  } catch {
    return []
  }
}

function saveThread(thread: Turn[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(MEMORY_KEY, JSON.stringify(thread.slice(-MEMORY_LIMIT)))
  } catch {
    // A full or blocked storage quota must never stop the conversation itself working.
  }
}

// Only completed exchanges are worth sending back as memory; a failed turn would just
// teach the model that it once errored.
export function toHistory(thread: Turn[]) {
  return thread.flatMap((turn) =>
    turn.answer
      ? [{ role: 'user' as const, content: turn.question }, { role: 'assistant' as const, content: turn.answer.answer }]
      : [],
  )
}

// FoundAI is told to phrase a cost as "Add cost: <label>, £<amount>/month, <category>".
// Parsing that back gives a one-tap save without letting the model write to the ledger itself.
export function parseCostSuggestion(text: string, categories: string[]) {
  const match = text.match(/^\s*add\s+(cost|expense|income)\s*:\s*(.+)$/i)
  if (!match) return null
  const kind = match[1].toLowerCase() === 'income' ? 'income' : 'expense'
  // Strip thousands separators first, otherwise "£1,500" splits into "£1" and "500"
  // on the comma that separates the fields and the amount reads as £1.
  const body = match[2].replace(/(\d),(?=\d{3}(?:\D|$))/g, '$1')
  const parts = body.split(',').map((part) => part.trim()).filter(Boolean)
  if (parts.length < 2) return null
  const label = parts[0]
  const amountPart = parts.find((part) => /£|\d/.test(part))
  if (!amountPart) return null
  const amount = Number(amountPart.replace(/[^0-9.]/g, ''))
  if (!Number.isFinite(amount) || amount <= 0) return null
  const recurring = /month|monthly|\/mo|per month/i.test(amountPart) || /month/i.test(body)
  const category = categories.find((option) => parts.some((part) => part.toLowerCase() === option.toLowerCase()))
    ?? categories.find((option) => body.toLowerCase().includes(option.toLowerCase()))
    ?? 'Other'
  return { kind, label, category, amountGbp: amount, recurring }
}

const LEDGER_LINE = /^add\s+(cost|expense|income)\s*:/i

// The model is told to put ledger entries in suggestedActions, but it sometimes writes them
// inline in the answer instead. Pull those out so the save button still appears, and so the
// same line is not shown twice.
export function collectLedgerActions(answer: { answer: string; suggestedActions: string[] }) {
  const inline: string[] = []
  const prose: string[] = []
  for (const line of answer.answer.split('\n')) {
    const stripped = line.replace(/^[\s>*+-]*(?:\d+[.)])?\s*/, '').trim()
    if (LEDGER_LINE.test(stripped)) inline.push(stripped)
    else prose.push(line)
  }
  const seen = new Set<string>()
  const actions: string[] = []
  for (const item of [...answer.suggestedActions, ...inline].map((entry) => entry.trim())) {
    const key = item.toLowerCase()
    if (!item || seen.has(key)) continue
    seen.add(key)
    actions.push(item)
  }
  return { actions, text: prose.join('\n').trim() || answer.answer.trim() }
}

export function FounderAiPanel({ demo = false, onSaved }: { demo?: boolean; onSaved?: () => void }) {
  const [question, setQuestion] = useState('')
  const [thread, setThread] = useState<Turn[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState('')
  const [savingAction, setSavingAction] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const endRef = useRef<HTMLDivElement | null>(null)

  // localStorage is only readable on the client, so the thread is restored after mount to
  // keep the server and first client render identical.
  useEffect(() => { setThread(loadThread()) }, [])
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'nearest' }) }, [thread, busy])

  const ask = async (text: string) => {
    const clean = text.trim()
    if (!clean || busy) return
    const history = toHistory(thread)
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    setBusy(true)
    setError('')
    setSaved('')
    setQuestion('')
    setThread((current) => [...current, { id, question: clean, answer: null }])
    try {
      const [result, finance] = await Promise.all([
        productionRequest<Answer>('/ai/ask', { method: 'POST', body: JSON.stringify({ question: clean, scope: 'founder', history }) }),
        categories.length
          ? Promise.resolve(null)
          : productionRequest<FounderFinance>('/founder/finance').catch(() => null),
      ])
      if (finance?.categories?.length) setCategories(finance.categories)
      setThread((current) => {
        const next = current.map((turn) => (turn.id === id ? { ...turn, answer: result } : turn))
        saveThread(next)
        return next
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'FoundAI could not answer just now.'
      setError(message)
      setThread((current) => current.map((turn) => (turn.id === id ? { ...turn, error: message } : turn)))
    } finally {
      setBusy(false)
    }
  }

  const clearThread = () => {
    setThread([])
    saveThread([])
    setError('')
    setSaved('')
  }

  const saveCost = async (action: string) => {
    const parsed = parseCostSuggestion(action, categories.length ? categories : ['Other'])
    if (!parsed) return
    if (demo) { setError('This is example data. Switch back to live figures to save a cost.'); return }
    setSavingAction(action)
    setError('')
    try {
      await productionRequest('/founder/ledger', {
        method: 'POST',
        body: JSON.stringify({ ...parsed, date: new Date().toISOString().slice(0, 10) }),
      })
      setSaved(`Saved “${parsed.label}” to your books.`)
      onSaved?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save that cost.')
    } finally {
      setSavingAction('')
    }
  }

  const latest = [...thread].reverse().find((turn) => turn.answer)?.answer ?? null

  return (
    <section className="sd-panel sd-wide sd-ai">
      <div className="sd-panel-head">
        <h2>Ask FoundAI about your business</h2>
        <div className="sd-ai-head-meta">
          {latest ? <small className="sd-muted">{latest.model}</small> : null}
          {thread.length ? <button className="sd-ai-clear" onClick={clearThread} type="button">Clear chat</button> : null}
        </div>
      </div>
      <p className="sd-muted">
        FoundAI can see your revenue, subscribers, costs, runway and platform health, and can look up live market
        prices, trends and competitors. Ask follow-up questions like a conversation, or tell it a cost to record.
      </p>

      {thread.length ? (
        <div className="sd-ai-thread">
          {thread.map((turn) => {
            const parsedTurn = turn.answer ? collectLedgerActions(turn.answer) : null
            return (
              <div className="sd-ai-turn" key={turn.id}>
                <p className="sd-ai-question">{turn.question}</p>
                {turn.error ? <p className="sd-error">{turn.error}</p> : null}
                {!turn.answer && !turn.error ? <p className="sd-muted">Reading your figures and checking the market…</p> : null}
                {turn.answer && parsedTurn ? (
                  <div className="sd-ai-answer">
                    <p>{parsedTurn.text}</p>
                    {parsedTurn.actions.length ? (
                      <div className="sd-ai-actions">
                        <h3>Suggested next steps</h3>
                        {parsedTurn.actions.map((action) => {
                          const cost = parseCostSuggestion(action, categories.length ? categories : ['Other'])
                          return (
                            <div className="sd-ai-action" key={action}>
                              <span>{action}</span>
                              {cost ? (
                                <button disabled={Boolean(savingAction)} onClick={() => void saveCost(action)} type="button">
                                  {savingAction === action ? 'Saving…' : 'Save to books'}
                                </button>
                              ) : null}
                            </div>
                          )
                        })}
                      </div>
                    ) : null}
                    {turn.answer.webSources?.length ? (
                      <p className="sd-muted sd-ai-cites">
                        Looked up:{' '}
                        {turn.answer.webSources.map((source, index) => (
                          <span key={source.url}>
                            {index > 0 ? ', ' : ''}
                            <a href={source.url} rel="noreferrer noopener" target="_blank">{source.title}</a>
                          </span>
                        ))}
                      </p>
                    ) : null}
                    {turn.answer.citations.length ? (
                      <p className="sd-muted sd-ai-cites">
                        From {turn.answer.citations.map((citation) => `${citation.name} (${citation.reference})`).join(', ')}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            )
          })}
          <div ref={endRef} />
        </div>
      ) : null}

      {error ? <p className="sd-error">{error}</p> : null}
      {saved ? <p className="sd-ai-saved">{saved}</p> : null}

      <form
        className="sd-ai-form"
        onSubmit={(event) => { event.preventDefault(); void ask(question) }}
      >
        <input
          onChange={(event) => setQuestion(event.target.value)}
          placeholder={thread.length ? 'Ask a follow-up…' : 'e.g. What is my runway, or: what are competitors charging?'}
          value={question}
        />
        <button disabled={busy || !question.trim()} type="submit">{busy ? 'Thinking…' : 'Ask'}</button>
      </form>

      <div className="sd-ai-prompts">
        {PROMPTS.map((prompt) => (
          <button disabled={busy} key={prompt} onClick={() => void ask(prompt)} type="button">{prompt}</button>
        ))}
      </div>
    </section>
  )
}
