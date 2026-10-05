'use client'

import { useEffect, useState, type FormEvent } from 'react'

type Mail = { id: string; subject: string; from: string; date: string }
type MailDetail = Mail & { text: string; attachments: { id: string; filename: string; size: number }[] }
type Expense = { id: string; supplier: string; invoiceNumber: string; amount: string; currency: string; date: string }
type ExpenseList = { expenses: Expense[]; totals: Record<string, string> }

class RequestError extends Error {
  constructor(message: string, public status: number) { super(message) }
}

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, cache: 'no-store' })
  const data = await response.json()
  if (!response.ok) throw new RequestError(typeof data.error === 'string' ? data.error : 'This request could not be completed. Please try again.', response.status)
  return data
}

function message(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.'
}

export function BuildingExpensesPanel() {
  const [gmail, setGmail] = useState<{ connected: boolean; email?: string }>({ connected: false })
  const [configured, setConfigured] = useState(false)
  const [statusError, setStatusError] = useState('')
  const [canReconnect, setCanReconnect] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [expenses, setExpenses] = useState<ExpenseList | null>(null)
  const [query, setQuery] = useState('invoice OR receipt')
  const [mails, setMails] = useState<Mail[] | null>(null)
  const [nextPage, setNextPage] = useState<string | null>(null)
  const [selected, setSelected] = useState<MailDetail | null>(null)
  const [busy, setBusy] = useState(false)
  const [supplier, setSupplier] = useState('')
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('')
  const [date, setDate] = useState('')

  async function loadExpenses() {
    setExpenses(await api<ExpenseList>('/api/founder-expenses'))
  }

  useEffect(() => {
    let mounted = true
    const callbackError = new URLSearchParams(window.location.search).get('gmailError')
    if (callbackError) {
      setNotice(callbackError)
      const url = new URL(window.location.href)
      url.searchParams.delete('gmailError')
      window.history.replaceState(null, '', url)
    }
    api<{ connected: boolean; email?: string }>('/api/gmail').then((data) => {
      if (mounted) { setGmail(data); setConfigured(true) }
    }).catch((err: unknown) => {
      if (mounted) { setStatusError(message(err)); setCanReconnect(err instanceof RequestError && err.status === 401) }
    })
    api<ExpenseList>('/api/founder-expenses').then((data) => {
      if (mounted) setExpenses(data)
    }).catch((err: unknown) => {
      if (mounted) setError(message(err))
    })
    return () => { mounted = false }
  }, [])

  async function search(event?: FormEvent, page?: string) {
    event?.preventDefault()
    setBusy(true); setError(''); setNotice(''); setSelected(null)
    try {
      const params = new URLSearchParams({ action: 'messages', q: query })
      if (page) params.set('page', page)
      const data = await api<{ messages: Mail[]; nextPage: string | null }>(`/api/gmail?${params}`)
      setMails(data.messages); setNextPage(data.nextPage)
    } catch (err) {
      setError(message(err))
      if (err instanceof RequestError && err.status === 401) { setGmail({ connected: false }); setCanReconnect(true) }
    } finally { setBusy(false) }
  }

  async function choose(id: string) {
    setBusy(true); setError(''); setNotice(''); setSelected(null)
    try {
      const mail = await api<MailDetail>(`/api/gmail?action=message&id=${encodeURIComponent(id)}`)
      setSelected(mail)
      setSupplier(''); setInvoiceNumber(''); setAmount(''); setCurrency(''); setDate('')
    } catch (err) { setError(message(err)) } finally { setBusy(false) }
  }

  async function download(id: string) {
    if (!selected) return
    setBusy(true); setError('')
    try {
      const params = new URLSearchParams({ action: 'attachment', id: selected.id, attachment: id })
      const response = await fetch(`/api/gmail?${params}`, { cache: 'no-store' })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(typeof data.error === 'string' ? data.error : 'This attachment could not be downloaded.')
      }
      const url = URL.createObjectURL(await response.blob())
      const link = document.createElement('a')
      link.href = url
      link.download = selected.attachments.find((item) => item.id === id)?.filename ?? 'invoice-attachment'
      document.body.appendChild(link)
      link.click(); link.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (err) { setError(message(err)) } finally { setBusy(false) }
  }

  async function save(event: FormEvent) {
    event.preventDefault()
    if (!selected) return
    setBusy(true); setError(''); setNotice('')
    let saved = false
    try {
      await api('/api/founder-expenses', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId: selected.id, supplier, invoiceNumber, amount, currency, date }),
      })
      saved = true
      setSelected(null); setNotice('Your building expense is saved.')
      await loadExpenses()
    } catch (err) {
      setError(saved ? `Saved, but the list could not refresh: ${message(err)} Reload this page to see it.` : message(err))
    } finally { setBusy(false) }
  }

  async function disconnect() {
    setBusy(true); setError(''); setNotice('')
    try {
      const data = await api<{ warning: string | null }>('/api/gmail', { method: 'POST' })
      setGmail({ connected: false }); setMails(null); setSelected(null); setNextPage(null)
      setNotice(data.warning ?? 'Gmail is disconnected. Your saved expenses are still here.')
    } catch (err) { setError(message(err)) } finally { setBusy(false) }
  }

  return (
    <article id="building-expenses" className="module-card fo-card panel-premium stack">
      <h2>Building expenses</h2>
      <p>Keep track of what it costs to build FoundingOS. These records are private to your founder account, not customer invoices.</p>
      {statusError && <p role="alert">{statusError}</p>}
      {canReconnect && !gmail.connected && <a className="btn btn-secondary" href="/api/gmail/connect">Reconnect Gmail</a>}
      {error && <p role="alert">{error}</p>}
      {notice && <p role="status">{notice}</p>}
      {busy && <p role="status">Please wait...</p>}
      {gmail.connected ? (
        <>
          <p>Connected to {gmail.email}. Read-only access: FoundingOS cannot send, change, or delete your emails.</p>
          <button type="button" className="btn btn-secondary" disabled={busy} onClick={disconnect}>Disconnect Gmail</button>
          <form onSubmit={(event) => search(event)} className="stack">
            <label>Find an invoice
              <input value={query} onChange={(event) => { setQuery(event.target.value); setNextPage(null); setMails(null) }} maxLength={300} placeholder="Supplier name, invoice or receipt" />
            </label>
            <button className="btn btn-primary" disabled={busy}>Search Gmail</button>
          </form>
          {mails && (
            <div className="stack">
              {mails.length === 0 && <p>No matching emails. Try the supplier name or a different search.</p>}
              {mails.map((mail) => <button key={mail.id} type="button" className="btn btn-secondary" disabled={busy} onClick={() => choose(mail.id)}>
                {mail.subject || '(No subject)'} — {mail.from} — {mail.date}
              </button>)}
              {nextPage && <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => search(undefined, nextPage)}>Next 10 emails</button>}
            </div>
          )}
        </>
      ) : configured ? (
        <div>
          <p>Choose one email at a time. Nothing is saved until you check and confirm it. The connection lasts up to one hour; reconnect when needed.</p>
          <a className="btn btn-primary" href="/api/gmail/connect">Connect Gmail</a>
        </div>
      ) : !statusError ? <p>Checking Gmail setup...</p> : null}
      {selected && (
        <section className="stack" aria-label="Review invoice">
          <h3>Check your invoice</h3>
          <p>{selected.subject} — {selected.from}</p>
          <details>
            <summary>Read the email</summary>
            {selected.text ? <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', maxHeight: 300, overflow: 'auto' }}>{selected.text}</pre> : <p>This email has no plain-text version. Open its attachment or read the email in Gmail.</p>}
          </details>
          {selected.attachments.map((attachment) => <button key={attachment.id} type="button" className="btn btn-secondary" disabled={busy || attachment.size > 10 * 1024 * 1024} onClick={() => download(attachment.id)}>
            Download {attachment.filename}{attachment.size > 10 * 1024 * 1024 ? ' (over 10 MB — open in Gmail)' : ''}
          </button>)}
          <p>Read the invoice and enter its details below. PDFs are not automatically read, and no amounts are guessed. One expense can be saved per email.</p>
          <form onSubmit={save} className="stack">
            <label>Supplier <input required maxLength={200} value={supplier} onChange={(event) => setSupplier(event.target.value)} /></label>
            <label>Invoice or receipt number <input required maxLength={200} value={invoiceNumber} onChange={(event) => setInvoiceNumber(event.target.value)} /></label>
            <label>Total on the invoice <input required type="number" min="0.01" max="999999999999.99" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} /></label>
            <label>Currency (for example, GBP) <input required maxLength={3} pattern="[A-Za-z]{3}" value={currency} onChange={(event) => setCurrency(event.target.value.toUpperCase())} /></label>
            <label>Invoice date <input required type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
            <button className="btn btn-primary" disabled={busy}>Confirm and save expense</button>
            <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => setSelected(null)}>Cancel</button>
          </form>
        </section>
      )}
      {expenses && (
        <section className="stack" aria-label="Saved building expenses">
          <h3>Saved expenses</h3>
          {Object.entries(expenses.totals).map(([code, total]) => <p key={code}>Total recorded: {total} {code}</p>)}
          <p><small>Totals stay separate for each currency. These are recorded invoice costs, not proof of payment. Email bodies and attachments are not stored.</small></p>
          {expenses.expenses.length === 0 ? <p>No building expenses saved yet.</p> : <ul>
            {expenses.expenses.map((expense) => <li key={expense.id}>
              {expense.date} — {expense.supplier} — {expense.invoiceNumber} — {expense.amount} {expense.currency}
            </li>)}
          </ul>}
        </section>
      )}
    </article>
  )
}
