/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

// Real, database-backed monetary panels — CRM Deals, Accounting Invoices, and Brand Finance.
// Each is additive: rendered alongside (never replacing) the existing generic/demo workbench
// content already on these pages. Every value shown comes from a real fetch to
// foundingos-console's real API routes (see app/api/crm/deals, app/api/accounting/invoices,
// app/api/brand/finance); nothing here is generated client-side. Real zero/empty is the
// honest default state, never dressed up as a fake number.
import { useEffect, useState } from 'react'
import { realMonetaryUrl, useRealFxRates, FxHint } from './real-monetary'

// Real, single-step AI Auto-Action support: when FoundAI (or a module hint/onboarding
// card) navigates here with e.g. "#quick-add-deal", this focuses that real input the
// instant it's on screen — the browser's own anchor scroll already brings it into view, this
// just adds focus so the user can start typing immediately. Never fills in a value itself.
function useFocusOnHashMatch(id: string, ready: boolean) {
  useEffect(() => {
    if (!ready) return
    if (typeof window === 'undefined') return
    if (window.location.hash !== `#${id}`) return
    const el = document.getElementById(id)
    el?.focus()
  }, [id, ready])
}

type RealDeal = { id: string; name: string; stage: string; dealValue: number; currency: string; expectedValue: number; probabilityWeightedValue: number }
type DealTotals = { totalDealValue: number; totalExpectedValue: number; totalWeightedValue: number; count: number }

export function RealDealsPanel({ brandSlug, brandName }: { brandSlug: string; brandName: string }) {
  const [deals, setDeals] = useState<RealDeal[]>([])
  const [totals, setTotals] = useState<DealTotals | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [name, setName] = useState('')
  const [dealValue, setDealValue] = useState('')
  const [stage, setStage] = useState('Discovery')
  const [saving, setSaving] = useState(false)
  // AI Simplification Flow — "Discovery" is already the real, sensible default for a brand-
  // new deal, so Simple Mode just hides the stage picker until asked for; the same real
  // submit() handler and the same real 'Discovery' default is used either way.
  const [showAdvanced, setShowAdvanced] = useState(false)
  const fx = useRealFxRates()

  const load = () => {
    fetch(realMonetaryUrl(`/api/crm/deals?brandSlug=${brandSlug}`))
      .then((r) => r.json())
      .then((data: { deals: RealDeal[]; totals: DealTotals }) => {
        setDeals(data.deals ?? [])
        setTotals(data.totals ?? null)
      })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }

  useEffect(load, [brandSlug])

  const submit = async () => {
    const value = Number(dealValue)
    if (!name.trim() || !Number.isFinite(value) || value < 0) return
    setSaving(true)
    try {
      await fetch(realMonetaryUrl('/api/crm/deals'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandSlug, name: name.trim(), dealValue: value, stage, currency: 'GBP' }),
      })
      setName('')
      setDealValue('')
      load()
    } finally {
      setSaving(false)
    }
  }

  useFocusOnHashMatch('quick-add-deal', loaded)

  if (!loaded) return null

  return (
    <article className="module-card card-premium module-card-static">
      <strong>Real deals (live)</strong>
      <p><small>Database-backed — real zero until a real deal is added below, never fabricated.</small></p>
      {totals && (
        <p style={{ margin: '6px 0' }}>
          Total deal value: {formatGbp(totals.totalDealValue)}<FxHint amountBase={totals.totalDealValue} baseCurrency="GBP" fx={fx} /> · Expected: {formatGbp(totals.totalExpectedValue)} · Weighted: {formatGbp(totals.totalWeightedValue)} · {totals.count} real deal{totals.count === 1 ? '' : 's'}
        </p>
      )}
      {deals.length > 0 ? (
        <ul style={{ margin: '6px 0', paddingLeft: 18 }}>
          {deals.map((d) => (
            <li key={d.id}>{d.name} — {d.stage} — {formatGbp(d.dealValue)}<FxHint amountBase={d.dealValue} baseCurrency={d.currency} fx={fx} /> (weighted {formatGbp(d.probabilityWeightedValue)})</li>
          ))}
        </ul>
      ) : (
        <p><small>No real deals for {brandName} yet.</small></p>
      )}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
        <input id="quick-add-deal" placeholder="Deal name" value={name} onChange={(e) => setName(e.target.value)} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--text)' }} />
        <input placeholder="Value (GBP)" type="number" min="0" value={dealValue} onChange={(e) => setDealValue(e.target.value)} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--text)', width: 120 }} />
        {showAdvanced ? (
          <select value={stage} onChange={(e) => setStage(e.target.value)} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--text)' }}>
            {['Discovery', 'Qualified', 'Proposal', 'Won', 'Lost'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        ) : (
          <button type="button" className="btn btn-secondary" onClick={() => setShowAdvanced(true)} style={{ fontSize: 12 }}>More options (stage: {stage})</button>
        )}
        <button type="button" className="btn btn-secondary quantum-btn" disabled={saving} onClick={submit}>Add real deal</button>
      </div>
    </article>
  )
}

type RealInvoice = { id: string; invoiceNumber: string; invoiceAmount: number; paidAmount: number; outstandingAmount: number; currency: string; status: string }
type InvoiceTotals = { totalInvoiceAmount: number; totalPaidAmount: number; totalOutstandingAmount: number; count: number }

export function RealInvoicesPanel({ brandSlug, brandName }: { brandSlug: string; brandName: string }) {
  const [invoices, setInvoices] = useState<RealInvoice[]>([])
  const [totals, setTotals] = useState<InvoiceTotals | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [invoiceAmount, setInvoiceAmount] = useState('')
  const [paidAmount, setPaidAmount] = useState('0')
  const [saving, setSaving] = useState(false)
  // AI Simplification Flow — most new invoices start fully unpaid, so '0' is already the
  // real, sensible default; Simple Mode just hides this field until a real part-payment
  // needs recording. Same real submit() handler and default either way.
  const [showAdvanced, setShowAdvanced] = useState(false)
  const fx = useRealFxRates()

  const load = () => {
    fetch(realMonetaryUrl(`/api/accounting/invoices?brandSlug=${brandSlug}`))
      .then((r) => r.json())
      .then((data: { invoices: RealInvoice[]; totals: InvoiceTotals }) => {
        setInvoices(data.invoices ?? [])
        setTotals(data.totals ?? null)
      })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }

  useEffect(load, [brandSlug])

  const submit = async () => {
    const amount = Number(invoiceAmount)
    const paid = Number(paidAmount || 0)
    if (!Number.isFinite(amount) || amount < 0 || !Number.isFinite(paid) || paid < 0) return
    setSaving(true)
    try {
      await fetch(realMonetaryUrl('/api/accounting/invoices'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandSlug, invoiceAmount: amount, paidAmount: paid, currency: 'GBP' }),
      })
      setInvoiceAmount('')
      setPaidAmount('0')
      load()
    } finally {
      setSaving(false)
    }
  }

  useFocusOnHashMatch('quick-add-invoice', loaded)

  if (!loaded) return null

  return (
    <article className="module-card card-premium module-card-static">
      <strong>Real invoices (live)</strong>
      <p><small>Database-backed — real zero until a real invoice is added below, never fabricated.</small></p>
      {totals && (
        <p style={{ margin: '6px 0' }}>
          Total invoiced: {formatGbp(totals.totalInvoiceAmount)}<FxHint amountBase={totals.totalInvoiceAmount} baseCurrency="GBP" fx={fx} /> · Paid: {formatGbp(totals.totalPaidAmount)} · Outstanding: {formatGbp(totals.totalOutstandingAmount)} · {totals.count} real invoice{totals.count === 1 ? '' : 's'}
        </p>
      )}
      {invoices.length > 0 ? (
        <ul style={{ margin: '6px 0', paddingLeft: 18 }}>
          {invoices.map((i) => (
            <li key={i.id}>{i.invoiceNumber} — {i.status} — {formatGbp(i.invoiceAmount)} invoiced, {formatGbp(i.outstandingAmount)} outstanding<FxHint amountBase={i.outstandingAmount} baseCurrency={i.currency} fx={fx} /></li>
          ))}
        </ul>
      ) : (
        <p><small>No real invoices for {brandName} yet.</small></p>
      )}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
        <input id="quick-add-invoice" placeholder="Invoice amount (GBP)" type="number" min="0" value={invoiceAmount} onChange={(e) => setInvoiceAmount(e.target.value)} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--text)', width: 160 }} />
        {showAdvanced ? (
          <input placeholder="Paid so far (GBP)" type="number" min="0" value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--text)', width: 160 }} />
        ) : (
          <button type="button" className="btn btn-secondary" onClick={() => setShowAdvanced(true)} style={{ fontSize: 12 }}>+ Add payment already received</button>
        )}
        <button type="button" className="btn btn-secondary quantum-btn" disabled={saving} onClick={submit}>Add real invoice</button>
      </div>
    </article>
  )
}

type RealFinance = { revenue: number; expenses: number; profit: number; brandRevenue: number; brandProfit: number; currency: string }

export function RealBrandFinancePanel({ brandSlug, brandName }: { brandSlug: string; brandName: string }) {
  const [finance, setFinance] = useState<RealFinance | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [revenue, setRevenue] = useState('')
  const [expenses, setExpenses] = useState('')
  const [saving, setSaving] = useState(false)
  const fx = useRealFxRates()

  const load = () => {
    fetch(realMonetaryUrl(`/api/brand/finance?brandSlug=${brandSlug}`))
      .then((r) => r.json())
      .then((data: { finance: RealFinance }) => setFinance(data.finance ?? null))
      .catch(() => {})
      .finally(() => setLoaded(true))
  }

  useEffect(load, [brandSlug])

  const submit = async () => {
    const rev = Number(revenue)
    const exp = Number(expenses)
    if (!Number.isFinite(rev) || rev < 0 || !Number.isFinite(exp) || exp < 0) return
    setSaving(true)
    try {
      await fetch(realMonetaryUrl('/api/brand/finance'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandSlug, revenue: rev, expenses: exp, currency: 'GBP' }),
      })
      load()
    } finally {
      setSaving(false)
    }
  }

  useFocusOnHashMatch('quick-add-finance', loaded && Boolean(finance))

  if (!loaded || !finance) return null

  return (
    <article className="module-card fo-card">
      <strong>Brand Finance — Revenue &amp; Profit (live)</strong>
      <p><small>Database-backed — real zero until real figures are entered below, never fabricated or estimated.</small></p>
      <p style={{ margin: '6px 0' }}>
        Revenue: {formatGbp(finance.brandRevenue)}<FxHint amountBase={finance.brandRevenue} baseCurrency={finance.currency} fx={fx} /> · Expenses: {formatGbp(finance.expenses)} · Profit: {formatGbp(finance.brandProfit)}<FxHint amountBase={finance.brandProfit} baseCurrency={finance.currency} fx={fx} />
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
        <input id="quick-add-finance" placeholder="Revenue (GBP)" type="number" min="0" value={revenue} onChange={(e) => setRevenue(e.target.value)} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--text)', width: 140 }} />
        <input placeholder="Expenses (GBP)" type="number" min="0" value={expenses} onChange={(e) => setExpenses(e.target.value)} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--text)', width: 140 }} />
        <button type="button" className="btn btn-secondary quantum-btn" disabled={saving} onClick={submit}>Save real figures for {brandName}</button>
      </div>
    </article>
  )
}

function formatGbp(amount: number): string {
  try {
    // Explicit 'en-GB' (not `undefined`) — see real-monetary.tsx's formatBase for why this
    // matters: `undefined` resolves to the runtime's default locale, which differs between
    // server and a real visitor's browser and causes a real, confirmed-live hydration mismatch.
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount)
  } catch {
    return `£${amount.toFixed(2)}`
  }
}
