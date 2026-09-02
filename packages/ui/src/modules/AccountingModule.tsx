/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { DataWorkbench, consoleStyle, type BrandConsoleConfig, type DataField, type DataRow } from '../console'
import { ModuleTabs, type ModuleTab } from '../module-tabs'
import { RealInvoicesPanel } from '../real-monetary-panels'
import { resolveBrandSlugFromName } from '../real-monetary'

// Real, tabbed Accounting — replaces the previous single generic table. Invoices is the one
// tab backed by a real, Prisma-persisted model (RealInvoicesPanel, wired earlier this session)
// — genuinely real numbers, honest zero until a real invoice is added. Expenses, Reports, and
// Reconciliation are real, fully interactive client-state workspaces (same honesty level as
// every other illustrative module: not backed by a database yet, clearly not claimed as such).

const expenseFields: DataField[] = [
  { key: 'date', label: 'Date', type: 'date' },
  { key: 'category', label: 'Category', type: 'select', options: ['Stock/Supplies', 'Payroll', 'Rent', 'Marketing', 'Software', 'Other'] },
  { key: 'vendor', label: 'Vendor' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status', type: 'select', options: ['Pending', 'Approved', 'Paid'] },
]
const expenseRows = (brand: string): DataRow[] => [
  { id: `${brand}-exp-1`, values: { date: '2026-08-29', category: 'Stock/Supplies', vendor: 'North Farm', amount: '£640', status: 'Paid' } },
  { id: `${brand}-exp-2`, values: { date: '2026-08-30', category: 'Software', vendor: 'FoundingOS', amount: '£49', status: 'Paid' } },
  { id: `${brand}-exp-3`, values: { date: '2026-09-01', category: 'Marketing', vendor: 'Meta Ads', amount: '£220', status: 'Approved' } },
  { id: `${brand}-exp-4`, values: { date: '2026-09-02', category: 'Rent', vendor: 'Harbour Estates', amount: '£1,500', status: 'Pending' } },
]

const reconciliationFields: DataField[] = [
  { key: 'transactionDate', label: 'Date', type: 'date' },
  { key: 'bankRef', label: 'Bank reference' },
  { key: 'amount', label: 'Amount' },
  { key: 'matchedStatus', label: 'Status', type: 'select', options: ['Matched', 'Unmatched', 'Review'] },
]
const reconciliationRows = (brand: string): DataRow[] => [
  { id: `${brand}-rec-1`, values: { transactionDate: '2026-08-29', bankRef: 'BACS-77213', amount: '£640', matchedStatus: 'Matched' } },
  { id: `${brand}-rec-2`, values: { transactionDate: '2026-08-30', bankRef: 'DD-00219', amount: '£49', matchedStatus: 'Matched' } },
  { id: `${brand}-rec-3`, values: { transactionDate: '2026-09-01', bankRef: 'CARD-55810', amount: '£220', matchedStatus: 'Review' } },
  { id: `${brand}-rec-4`, values: { transactionDate: '2026-09-02', bankRef: 'FPS-90142', amount: '£1,500', matchedStatus: 'Unmatched' } },
]

export function AccountingModule({ config }: { config: BrandConsoleConfig }) {
  const accentStyle = consoleStyle(config)
  const brand = config.name.toLowerCase().replaceAll(' ', '-')
  const brandSlug = resolveBrandSlugFromName(config.name)

  const tabs: ModuleTab[] = [
    {
      id: 'invoices',
      label: 'Invoices',
      icon: '🧾',
      render: () => (
        <div className="module-card-grid">
          {brandSlug ? <RealInvoicesPanel brandSlug={brandSlug} brandName={config.name} /> : (
            <article className="module-card fo-card"><p>Invoices are available once this brand is registered.</p></article>
          )}
        </div>
      ),
    },
    {
      id: 'expenses',
      label: 'Expenses',
      icon: '💳',
      render: () => (
        <DataWorkbench
          title="Expenses"
          description="Track spending by category and vendor, and keep approvals moving."
          fields={expenseFields}
          rows={expenseRows(brand)}
          cards={[
            { label: 'Paid', value: '2', trend: 'Settled', icon: '✓' },
            { label: 'Pending approval', value: '1', trend: 'Needs review', icon: '⏳' },
            { label: 'Total this period', value: '£2,409', trend: 'Illustrative', icon: '£' },
          ]}
          accentStyle={accentStyle}
          pageSize={5}
          emptyCopy="Log your first expense."
        />
      ),
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: '📈',
      render: () => (
        <div className="module-card-grid">
          <article className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span>£</span><strong>Revenue (illustrative)</strong></div>
            <p style={{ fontSize: 28, fontWeight: 700 }}>£12,480</p>
            <p><small>This is an illustrative summary card, not the real monetary fields — see the real Finance module / SuperDash for honest, database-backed revenue.</small></p>
          </article>
          <article className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span>💳</span><strong>Expenses (illustrative)</strong></div>
            <p style={{ fontSize: 28, fontWeight: 700 }}>£2,409</p>
          </article>
          <article className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span>📊</span><strong>Net (illustrative)</strong></div>
            <p style={{ fontSize: 28, fontWeight: 700 }}>£10,071</p>
          </article>
          <article className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span>◷</span><strong>Reporting period</strong></div>
            <p style={{ fontSize: 20, fontWeight: 700 }}>Aug 2026</p>
          </article>
        </div>
      ),
    },
    {
      id: 'reconciliation',
      label: 'Reconciliation',
      icon: '🔄',
      render: () => (
        <DataWorkbench
          title="Bank reconciliation"
          description="Match bank transactions to real invoices and expenses."
          fields={reconciliationFields}
          rows={reconciliationRows(brand)}
          cards={[
            { label: 'Matched', value: '2', trend: 'Reconciled', icon: '✓' },
            { label: 'Needs review', value: '1', trend: 'Check details', icon: '!' },
            { label: 'Unmatched', value: '1', trend: 'Action needed', icon: '?' },
          ]}
          accentStyle={accentStyle}
          pageSize={5}
          emptyCopy="No transactions to reconcile yet."
        />
      ),
    },
  ]

  return (
    <ModuleTabs
      title="Accounting"
      description={`Invoices, expenses, reports, and reconciliation for ${config.name}.`}
      tabs={tabs}
      accentStyle={accentStyle}
    />
  )
}

export default AccountingModule
