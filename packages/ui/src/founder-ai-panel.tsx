'use client'
/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// FoundAI inside SuperDash, asking about FoundingOS's own business rather than a customer
// workspace. Sends scope: 'founder' so the backend supplies revenue, costs, runway and
// platform health alongside the usual records, and turns a suggested cost into a real
// ledger entry in one tap.
import { useState } from 'react'
import { productionRequest } from './workspace-production-client'
import type { FounderFinance } from './founder-types'

type Answer = {
  answer: string
  suggestedActions: string[]
  citations: Array<{ workspace: string; module: string; reference: string; name: string }>
  model: string
}

const PROMPTS = [
  'What is my MRR and how many paying customers do I have?',
  'What am I spending each month and what is my biggest cost?',
  'How long is my runway?',
  'Which cost categories have nothing recorded yet?',
  'How is the platform doing right now?',
]

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
  const [answer, setAnswer] = useState<Answer | null>(null)
  const [asked, setAsked] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState('')
  const [savingAction, setSavingAction] = useState('')
  const [categories, setCategories] = useState<string[]>([])

  const ask = async (text: string) => {
    const clean = text.trim()
    if (!clean || busy) return
    setBusy(true)
    setError('')
    setSaved('')
    setAnswer(null)
    setAsked(clean)
    try {
      const [result, finance] = await Promise.all([
        productionRequest<Answer>('/ai/ask', { method: 'POST', body: JSON.stringify({ question: clean, scope: 'founder' }) }),
        categories.length
          ? Promise.resolve(null)
          : productionRequest<FounderFinance>('/founder/finance').catch(() => null),
      ])
      if (finance?.categories?.length) setCategories(finance.categories)
      setAnswer(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'FoundAI could not answer just now.')
    } finally {
      setBusy(false)
      setQuestion('')
    }
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

  return (
    <section className="sd-panel sd-wide sd-ai">
      <div className="sd-panel-head">
        <h2>Ask FoundAI about your business</h2>
        {answer ? <small className="sd-muted">{answer.model}</small> : null}
      </div>
      <p className="sd-muted">
        FoundAI can see your revenue, subscribers, costs, runway and platform health. Ask a question, or tell it a cost to record.
      </p>

      <form
        className="sd-ai-form"
        onSubmit={(event) => { event.preventDefault(); void ask(question) }}
      >
        <input
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="e.g. What is my runway, or: add cost Vercel Pro £20 a month hosting"
          value={question}
        />
        <button disabled={busy || !question.trim()} type="submit">{busy ? 'Thinking…' : 'Ask'}</button>
      </form>

      <div className="sd-ai-prompts">
        {PROMPTS.map((prompt) => (
          <button disabled={busy} key={prompt} onClick={() => void ask(prompt)} type="button">{prompt}</button>
        ))}
      </div>

      {error ? <p className="sd-error">{error}</p> : null}
      {saved ? <p className="sd-ai-saved">{saved}</p> : null}

      {busy ? <p className="sd-muted">Reading your live figures…</p> : null}

      {answer ? (() => {
        const { actions, text } = collectLedgerActions(answer)
        return (
        <div className="sd-ai-answer">
          <p className="sd-ai-question">{asked}</p>
          <p>{text}</p>
          {actions.length ? (
            <div className="sd-ai-actions">
              <h3>Suggested next steps</h3>
              {actions.map((action) => {
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
          {answer.citations.length ? (
            <p className="sd-muted sd-ai-cites">
              From {answer.citations.map((citation) => `${citation.name} (${citation.reference})`).join(', ')}
            </p>
          ) : null}
        </div>
        )
      })() : null}
    </section>
  )
}
