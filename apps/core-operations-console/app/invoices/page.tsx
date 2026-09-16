/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ModuleHeader } from '@foundingos/ui/console'
import { brandConfig } from '../brand-config'
import { fetchInvoices, type Invoice } from '../lib/finance-api'

export default function InvoiceListPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    fetchInvoices().then((data) => {
      if (cancelled) return
      if (data === null) setError('Could not load invoices right now.')
      else setInvoices(data)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  return (
    <div className="module-page">
      <ModuleHeader
        config={brandConfig}
        title="Invoices"
        description="Every invoice raised, auto-generated from fulfilled orders or created manually."
      />
      {loading ? <p>Loading invoices…</p> : null}
      {error ? <p className="module-error">{error}</p> : null}
      {!loading && !error && invoices.length === 0 ? <p>No invoices yet.</p> : null}
      <div className="module-table">
        {invoices.map((invoice) => (
          <Link key={invoice.id} href={`/invoices/${invoice.id}`} className="module-row" style={{ display: 'block', borderColor: brandConfig.accent, textDecoration: 'none', color: 'inherit' }}>
            <strong>{invoice.number}</strong> · £{(invoice.totalPence / 100).toFixed(2)}
            <div>{invoice.status}{invoice.dueAt ? ` · due ${new Date(invoice.dueAt).toLocaleDateString('en-GB')}` : ''}</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>{new Date(invoice.createdAt).toLocaleString('en-GB')}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
