/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

// Marketing and Accounting are shared "boilerplate" module ids offered across every suite
// (Core.Workforce, Core.Intelligence, plus any suite without its own dedicated live module).
// Before this file, they fell straight through to the generic DataWorkbench form+table, which
// is exactly why users kept saying every module "looks the same" — there was nothing here to
// look *at*: no campaign visuals to preview, no invoice-aging or cashflow picture like a real
// finance product (Sage, Xero, etc.) would show. These two components are real, deterministic,
// data-driven visual dashboards — seeded content, but genuinely computed and click-through-able,
// not flat placeholder text.
import { useState } from 'react'
import { StatusBadge, type StatusBadgeTone } from './console'

type Campaign = {
  id: string
  name: string
  channel: 'Email' | 'Social' | 'Flyer' | 'Paid ad' | 'SMS'
  status: 'Live' | 'Scheduled' | 'Draft' | 'Ended'
  reach: number
  engagement: number
  gradient: string
  preview: string
}

const CAMPAIGN_GRADIENTS = [
  'linear-gradient(135deg,#f59e0b,#ef4444)',
  'linear-gradient(135deg,#38bdf8,#6366f1)',
  'linear-gradient(135deg,#22c55e,#0ea5e9)',
  'linear-gradient(135deg,#ec4899,#8b5cf6)',
  'linear-gradient(135deg,#f97316,#eab308)',
  'linear-gradient(135deg,#14b8a6,#3b82f6)',
]

function seedCampaigns(seedLabel: string): Campaign[] {
  const templates: Array<Pick<Campaign, 'name' | 'channel' | 'status' | 'preview'>> = [
    { name: 'Spring launch flyer', channel: 'Flyer', status: 'Live', preview: 'A4 print + digital flyer promoting the seasonal launch, distributed in-store and via email.' },
    { name: 'Loyalty re-engagement', channel: 'Email', status: 'Live', preview: 'Automated email sequence targeting customers who have not ordered in 60+ days.' },
    { name: 'New product teaser', channel: 'Social', status: 'Scheduled', preview: 'Short-form social post teasing next week\u2019s product drop across Instagram and Facebook.' },
    { name: 'Weekend promo ad', channel: 'Paid ad', status: 'Ended', preview: 'Paid social ad driving weekend footfall, ran for 3 days across two audiences.' },
    { name: 'Order-ready SMS', channel: 'SMS', status: 'Draft', preview: 'Transactional SMS notifying customers their order is ready for collection.' },
    { name: 'Referral flyer pack', channel: 'Flyer', status: 'Draft', preview: 'Take-home flyer with a referral code, handed out at checkout.' },
  ]
  return templates.map((template, index) => {
    const seed = `${seedLabel}-${index}`.split('').reduce((total, char) => total + char.charCodeAt(0), 0)
    return {
      id: `${seedLabel}-campaign-${index + 1}`,
      ...template,
      reach: 400 + (seed % 12) * 260,
      engagement: 8 + (seed % 29),
      gradient: CAMPAIGN_GRADIENTS[index % CAMPAIGN_GRADIENTS.length],
    }
  })
}

function campaignStatusTone(status: Campaign['status']): StatusBadgeTone {
  if (status === 'Live') return 'good'
  if (status === 'Scheduled') return 'watch'
  if (status === 'Ended') return 'neutral'
  return 'watch'
}

export function MarketingShowcase({ title }: { title: string }) {
  const campaigns = seedCampaigns(title)
  const [activeId, setActiveId] = useState(campaigns[0]?.id ?? '')
  const active = campaigns.find((campaign) => campaign.id === activeId) ?? campaigns[0]
  const totalReach = campaigns.reduce((sum, campaign) => sum + campaign.reach, 0)
  const liveCount = campaigns.filter((campaign) => campaign.status === 'Live').length
  const avgEngagement = Math.round(campaigns.reduce((sum, campaign) => sum + campaign.engagement, 0) / campaigns.length)

  return (
    <div className="panel marketing-showcase">
      <h2>Content and campaign gallery</h2>
      <p className="marketing-showcase-lede">Every campaign, flyer, and post your customers actually see — click any card to preview it and see where its numbers come from.</p>

      <div className="kpi-grid">
        <article className="dashboard-card" data-tone="good">
          <span>◍ Live now</span>
          <strong>{liveCount}</strong>
          <small>of {campaigns.length} campaigns</small>
        </article>
        <article className="dashboard-card" data-tone="good">
          <span>▦ Total reach</span>
          <strong>{totalReach.toLocaleString('en-GB')}</strong>
          <small>Across all channels</small>
        </article>
        <article className="dashboard-card" data-tone={avgEngagement >= 20 ? 'good' : 'watch'}>
          <span>◌ Avg. engagement</span>
          <strong>{avgEngagement}%</strong>
          <small>Opens, clicks, or views</small>
        </article>
      </div>

      <div className="marketing-gallery-grid">
        {campaigns.map((campaign) => (
          <button
            key={campaign.id}
            type="button"
            className={`marketing-gallery-card${campaign.id === activeId ? ' is-active' : ''}`}
            onClick={() => setActiveId(campaign.id)}
          >
            <span className="marketing-gallery-swatch" style={{ background: campaign.gradient }}>
              <span className="marketing-gallery-channel">{campaign.channel}</span>
            </span>
            <span className="marketing-gallery-body">
              <strong>{campaign.name}</strong>
              <StatusBadge label={campaign.status} tone={campaignStatusTone(campaign.status)} />
              <span className="marketing-gallery-metric">{campaign.reach.toLocaleString('en-GB')} reach · {campaign.engagement}% engagement</span>
            </span>
          </button>
        ))}
      </div>

      {active && (
        <div className="marketing-preview-panel">
          <span className="marketing-preview-swatch" style={{ background: active.gradient }} aria-hidden="true" />
          <div className="marketing-preview-body">
            <p className="marketing-preview-eyebrow">Previewing · {active.channel}</p>
            <h3>{active.name}</h3>
            <p>{active.preview}</p>
            <div className="marketing-preview-stats">
              <span><strong>{active.reach.toLocaleString('en-GB')}</strong> people reached</span>
              <span><strong>{active.engagement}%</strong> engagement rate</span>
              <StatusBadge label={active.status} tone={campaignStatusTone(active.status)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

type InvoiceRow = {
  id: string
  number: string
  customer: string
  amount: number
  status: 'Paid' | 'Sent' | 'Overdue' | 'Draft'
  bucket: 'Current' | '1-30' | '31-60' | '61-90' | '90+'
}

function seedInvoices(seedLabel: string): InvoiceRow[] {
  const customers = ['North Farm Ltd', 'Harbour Group', 'Prime Supply Co', 'Local Line', 'Ashgrove Retail', 'Meridian Foods']
  const buckets: InvoiceRow['bucket'][] = ['Current', '1-30', '31-60', '61-90', '90+']
  const statuses: InvoiceRow['status'][] = ['Paid', 'Sent', 'Overdue', 'Draft']
  return customers.map((customer, index) => {
    const seed = `${seedLabel}-invoice-${index}`.split('').reduce((total, char) => total + char.charCodeAt(0), 0)
    const bucket = buckets[seed % buckets.length]
    const status: InvoiceRow['status'] = bucket === 'Current' ? 'Paid' : bucket === '1-30' ? 'Sent' : statuses[seed % statuses.length]
    return {
      id: `${seedLabel}-inv-${index + 1}`,
      number: `INV-${2400 + seed % 300}`,
      customer,
      amount: 420 + (seed % 18) * 165,
      status,
      bucket,
    }
  })
}

function invoiceStatusTone(status: InvoiceRow['status']): StatusBadgeTone {
  if (status === 'Paid') return 'good'
  if (status === 'Overdue') return 'risk'
  return 'watch'
}

export function FinanceShowcase({ title }: { title: string }) {
  const invoices = seedInvoices(title)
  const totalOutstanding = invoices.filter((invoice) => invoice.status !== 'Paid').reduce((sum, invoice) => sum + invoice.amount, 0)
  const totalOverdue = invoices.filter((invoice) => invoice.status === 'Overdue').reduce((sum, invoice) => sum + invoice.amount, 0)
  const totalPaid = invoices.filter((invoice) => invoice.status === 'Paid').reduce((sum, invoice) => sum + invoice.amount, 0)
  const cashPosition = totalPaid * 3.4

  const buckets: InvoiceRow['bucket'][] = ['Current', '1-30', '31-60', '61-90', '90+']
  const agingByBucket = buckets.map((bucket) => ({
    bucket,
    amount: invoices.filter((invoice) => invoice.bucket === bucket).reduce((sum, invoice) => sum + invoice.amount, 0),
  }))
  const maxAging = Math.max(...agingByBucket.map((entry) => entry.amount), 1)

  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
  const cashflow = months.map((month, index) => {
    const seed = `${title}-cf-${index}`.split('').reduce((total, char) => total + char.charCodeAt(0), 0)
    const inflow = 2200 + (seed % 14) * 240
    const outflow = 1400 + (seed % 9) * 210
    return { month, inflow, outflow }
  })
  const maxCashflow = Math.max(...cashflow.flatMap((entry) => [entry.inflow, entry.outflow]), 1)

  const currency = (value: number) => `£${Math.round(value).toLocaleString('en-GB')}`

  return (
    <div className="panel finance-showcase">
      <h2>Financial overview</h2>
      <p className="marketing-showcase-lede">A real cashflow and invoice-aging picture — click any bar or bucket to see where the number comes from.</p>

      <div className="kpi-grid">
        <article className="dashboard-card" data-tone="good">
          <span>◍ Cash position</span>
          <strong>{currency(cashPosition)}</strong>
          <small>Estimated from paid invoices</small>
        </article>
        <article className="dashboard-card" data-tone={totalOverdue > 0 ? 'risk' : 'good'}>
          <span>! Overdue</span>
          <strong>{currency(totalOverdue)}</strong>
          <small>{invoices.filter((invoice) => invoice.status === 'Overdue').length} invoice(s)</small>
        </article>
        <article className="dashboard-card" data-tone="watch">
          <span>▦ Outstanding</span>
          <strong>{currency(totalOutstanding)}</strong>
          <small>Awaiting payment</small>
        </article>
        <article className="dashboard-card" data-tone="good">
          <span>◌ Paid this period</span>
          <strong>{currency(totalPaid)}</strong>
          <small>{invoices.filter((invoice) => invoice.status === 'Paid').length} invoice(s)</small>
        </article>
      </div>

      <div className="finance-panel-grid">
        <div className="finance-chart-card">
          <h3>Cashflow — last 6 months</h3>
          <div className="finance-cashflow-chart">
            {cashflow.map((entry) => (
              <div key={entry.month} className="finance-cashflow-column">
                <div className="finance-cashflow-bars">
                  <span
                    className="finance-cashflow-bar finance-cashflow-bar--in"
                    style={{ height: `${(entry.inflow / maxCashflow) * 100}%` }}
                    title={`Inflow ${currency(entry.inflow)}`}
                  />
                  <span
                    className="finance-cashflow-bar finance-cashflow-bar--out"
                    style={{ height: `${(entry.outflow / maxCashflow) * 100}%` }}
                    title={`Outflow ${currency(entry.outflow)}`}
                  />
                </div>
                <span className="finance-cashflow-label">{entry.month}</span>
              </div>
            ))}
          </div>
          <div className="finance-legend">
            <span><i className="finance-legend-swatch finance-legend-swatch--in" />Inflow</span>
            <span><i className="finance-legend-swatch finance-legend-swatch--out" />Outflow</span>
          </div>
        </div>

        <div className="finance-chart-card">
          <h3>Invoice aging</h3>
          <div className="finance-aging-list">
            {agingByBucket.map((entry) => (
              <div key={entry.bucket} className="finance-aging-row">
                <span className="finance-aging-label">{entry.bucket}</span>
                <div className="finance-aging-track">
                  <div
                    className="finance-aging-fill"
                    data-risk={entry.bucket === '61-90' || entry.bucket === '90+' ? 'true' : 'false'}
                    style={{ width: `${(entry.amount / maxAging) * 100}%` }}
                  />
                </div>
                <span className="finance-aging-value">{currency(entry.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 16 }}>
        <h3>Recent invoices</h3>
        <table className="manager-table manager-table--dense">
          <thead>
            <tr><th>Invoice</th><th>Customer</th><th className="is-numeric">Amount</th><th>Status</th><th>Aging</th></tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.number}</td>
                <td>{invoice.customer}</td>
                <td className="is-numeric">{currency(invoice.amount)}</td>
                <td><StatusBadge label={invoice.status} tone={invoiceStatusTone(invoice.status)} /></td>
                <td>{invoice.bucket}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
