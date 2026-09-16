/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import { ModuleHeader } from '@foundingos/ui/console'
import { brandConfig } from '../brand-config'
import { fetchMobileMoneyTransactions, type MobileMoneyTransaction } from '../lib/finance-api'

export default function MobileMoneyLedgerPage() {
  const [transactions, setTransactions] = useState<MobileMoneyTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    fetchMobileMoneyTransactions().then((data) => {
      if (cancelled) return
      if (data === null) setError('Could not load mobile money transactions right now.')
      else setTransactions(data)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  const totalPence = transactions.reduce((sum, t) => sum + t.amountPence, 0)

  return (
    <div className="module-page">
      <ModuleHeader
        config={brandConfig}
        title="Mobile Money Ledger"
        description="M-Pesa, MTN MoMo, Paystack, Flutterwave, and UPI transactions reconciled against invoices."
      />
      {loading ? <p>Loading transactions…</p> : null}
      {error ? <p className="module-error">{error}</p> : null}
      {!loading && !error ? <p>Total reconciled: £{(totalPence / 100).toFixed(2)}</p> : null}
      {!loading && !error && transactions.length === 0 ? <p>No mobile money transactions yet.</p> : null}
      <div className="module-table">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="module-row" style={{ borderColor: brandConfig.accent }}>
            <strong>{transaction.provider}</strong> · {transaction.reference} · £{(transaction.amountPence / 100).toFixed(2)}
            <div>{transaction.status}</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>{new Date(transaction.createdAt).toLocaleString('en-GB')}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
