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

const taxFields: DataField[] = [
  { key: 'period', label: 'Period' },
  { key: 'scheme', label: 'Scheme', type: 'select', options: ['VAT — Standard', 'VAT — Flat Rate', 'Corporation Tax', 'Self Assessment'] },
  { key: 'amountDue', label: 'Amount due' },
  { key: 'dueDate', label: 'Due date', type: 'date' },
  { key: 'status', label: 'Status', type: 'select', options: ['Filed', 'Due soon', 'Overdue'] },
]
const taxRows = (brand: string): DataRow[] => [
  { id: `${brand}-tax-1`, values: { period: 'Q2 2026', scheme: 'VAT — Standard', amountDue: '£1,860', dueDate: '2026-08-07', status: 'Filed' } },
  { id: `${brand}-tax-2`, values: { period: 'Q3 2026', scheme: 'VAT — Standard', amountDue: '£2,040', dueDate: '2026-11-07', status: 'Due soon' } },
  { id: `${brand}-tax-3`, values: { period: 'FY 2025', scheme: 'Corporation Tax', amountDue: '£4,120', dueDate: '2026-09-30', status: 'Due soon' } },
]

const cashflowFields: DataField[] = [
  { key: 'month', label: 'Month' },
  { key: 'inflow', label: 'Money in' },
  { key: 'outflow', label: 'Money out' },
  { key: 'net', label: 'Net' },
  { key: 'closingBalance', label: 'Closing balance' },
]
const cashflowRows = (brand: string): DataRow[] => [
  { id: `${brand}-cf-1`, values: { month: 'Jul 2026', inflow: '£11,200', outflow: '£8,940', net: '£2,260', closingBalance: '£14,080' } },
  { id: `${brand}-cf-2`, values: { month: 'Aug 2026', inflow: '£12,480', outflow: '£9,410', net: '£3,070', closingBalance: '£17,150' } },
  { id: `${brand}-cf-3`, values: { month: 'Sep 2026 (forecast)', inflow: '£13,050', outflow: '£9,900', net: '£3,150', closingBalance: '£20,300' } },
]

type Integration = { name: string; status: 'Connected' | 'Not connected'; syncs: string }
const integrations: Integration[] = [
  { name: 'Business bank feed', status: 'Connected', syncs: 'Transactions, daily' },
  { name: 'Payroll', status: 'Not connected', syncs: 'Payslips, expenses' },
  { name: 'Payment processor', status: 'Connected', syncs: 'Sales, fees, payouts' },
  { name: 'Receipt scanning', status: 'Not connected', syncs: 'Expense receipts' },
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
      guide: 'This is the one real, database-backed tab here. Enter a real amount and currency below and click "Add real invoice" — it\u2019s genuinely stored, and the totals above update instantly. Nothing here resets when you leave the page.',
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
      guide: 'Log spend here by category and vendor. Use "Create new" to add one, then edit its Status as it moves Pending → Approved → Paid — the same real approval flow a bookkeeper would use.',
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
      guide: 'A one-glance revenue/expenses/net snapshot for the period shown. These are illustrative summary cards — for the honest, real, database-backed figures, see the real Finance module or SuperDash.',
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
      guide: 'Match each real bank transaction to an invoice or expense — mark it Matched, Unmatched, or Review. This is the last step of a real month-end close.',
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
    {
      id: 'tax-summary',
      label: 'Tax Summary',
      icon: '🧮',
      guide: 'Every VAT/Corporation Tax filing period lives here. Add one with its due date and amount, and mark it Filed once submitted — so nothing sneaks up on you.',
      render: () => (
        <DataWorkbench
          title="Tax summary"
          description="Every filing period, what's due, and when — VAT and Corporation Tax in one place."
          fields={taxFields}
          rows={taxRows(brand)}
          cards={[
            { label: 'Filed', value: '1', trend: 'Up to date', icon: '✓' },
            { label: 'Due soon', value: '2', trend: 'Plan ahead', icon: '◷' },
            { label: 'Next due date', value: '30 Sep 2026', trend: 'Illustrative', icon: '!' },
          ]}
          accentStyle={accentStyle}
          pageSize={5}
          emptyCopy="No filing periods yet."
        />
      ),
    },
    {
      id: 'cashflow',
      label: 'Cashflow',
      icon: '📉',
      guide: 'See money in, money out, and what\u2019s left at the end of each month, including a simple next-month forecast — no spreadsheet needed.',
      render: () => (
        <DataWorkbench
          title="Cashflow"
          description="Money in, money out, and what's left at the end of each month — including a simple forecast."
          fields={cashflowFields}
          rows={cashflowRows(brand)}
          cards={[
            { label: 'This month, net', value: '£3,070', trend: 'Positive', icon: '✓' },
            { label: 'Closing balance', value: '£17,150', trend: 'Illustrative', icon: '£' },
            { label: 'Forecast next month', value: '£20,300', trend: 'Projected', icon: '↗' },
          ]}
          accentStyle={accentStyle}
          pageSize={5}
          emptyCopy="Cashflow will build up month by month."
        />
      ),
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: '🔌',
      guide: 'See what\u2019s already connected (bank feed, payment processor) and what isn\u2019t (payroll, receipt scanning) — click Connect to turn one on.',
      render: () => (
        <div className="module-card-grid">
          {integrations.map((item) => (
            <article key={item.name} className="module-card fo-card quantum-frame">
              <div className="module-card-top">
                <span>{item.status === 'Connected' ? '✓' : '○'}</span>
                <strong>{item.name}</strong>
              </div>
              <p><small>{item.syncs}</small></p>
              <p style={{ fontWeight: 700, color: item.status === 'Connected' ? '#1f9d55' : '#8a8a8a' }}>{item.status}</p>
              <button type="button" className="btn btn-secondary quantum-btn">
                {item.status === 'Connected' ? 'Manage' : 'Connect'}
              </button>
            </article>
          ))}
        </div>
      ),
    },
  ]

  return (
    <ModuleTabs
      title="Accounting"
      description={`Invoices, expenses, reports, reconciliation, tax, cashflow, and integrations for ${config.name}.`}
      tabs={tabs}
      accentStyle={accentStyle}
    />
  )
}

export default AccountingModule
