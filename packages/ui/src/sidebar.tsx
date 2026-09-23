/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import Link from 'next/link'
import type { PlanTier, SuiteKey } from '@foundingos/config/suites'
import { isModuleVisibleAtTier } from '@foundingos/config/suites'
import type { BrandConsoleConfig } from './console'

// Phase 27: maps this Sidebar's hardcoded display-name groups onto the
// SuiteKey vocabulary moduleMinTier is keyed by, so tier filtering can reuse
// the one canonical mapping in packages/config instead of duplicating it here.
const SUITE_KEY_BY_NAME: Record<string, SuiteKey> = {
  'Core.Operations': 'core_operations',
  'Core.Workforce': 'core_workforce',
  'Core.Intelligence': 'core_intelligence',
}

function ActualSidebar({ config, planTier }: { config?: BrandConsoleConfig; planTier?: PlanTier }) {
  const theme = { '--accent': config?.colors.accent ?? '#4A90E2' } as React.CSSProperties
  const grouped: Record<string, Array<{ label: string; href: string; icon: string }>> = {
    'Core.Operations': [
      { label: 'Orders', href: '/modules/orders', icon: '▦' },
      { label: 'Inventory', href: '/modules/inventory', icon: '▣' },
      { label: 'Customers', href: '/modules/customers', icon: '◍' },
      { label: 'Accounting', href: '/modules/accounting', icon: '£' },
      { label: 'Delivery', href: '/modules/logistics', icon: '↗' },
      { label: 'Marketing', href: '/marketing', icon: '◎' },
      { label: 'Messaging', href: '/modules/messaging', icon: '✉' },
      { label: 'Monitoring', href: '/modules/monitoring', icon: '◈' },
      { label: 'Fulfilment-to-Cash', href: '/fulfilment-to-cash', icon: '⇄' },
    ],
    'Core.Workforce': [
      { label: 'Talent', href: '/modules/talent', icon: '◍' },
      { label: 'Workers', href: '/modules/workforce', icon: '◎' },
      { label: 'Payroll', href: '/modules/payroll', icon: '◌' },
    ],
    'Core.Intelligence': [
      { label: 'Event Feed', href: '/dashboard', icon: '▦' },
      { label: 'Insights', href: '/insights', icon: '✦' },
      { label: 'Predictive Ops', href: '/modules/intelligence', icon: '⚡' },
    ],
  }
  const suiteName = config?.name ?? 'Core.Operations'
  const items = grouped[suiteName] ?? grouped['Core.Operations']
  // Graceful fallback (Phase 27 spec requirement): with no planTier supplied
  // (the common case today — no console app currently sources a real tenant
  // session/license; see docs/permissions.md and docs/restructure-summary.md),
  // every module stays visible exactly as before this change.
  const suiteKey = SUITE_KEY_BY_NAME[suiteName]
  const visibleItems = planTier && suiteKey ? items.filter((item) => isModuleVisibleAtTier(suiteKey, item.label, planTier)) : items

  return (
    <aside className="sidebar" style={theme}>
      <Link className="sidebar-brand" href="/console">
        <span className="brand-logo">{config?.logo ?? 'FO'}</span>
        <div>
          <strong>FoundingOS</strong>
          <span>OS Suite</span>
        </div>
      </Link>

      <div className="nav-card-grid">
        <div className="nav-section">
          <p className="nav-section-label">{suiteName}</p>
          {visibleItems.map((item) => (
            <Link key={item.href} className="nav-card" href={item.href}>
              <span className="nav-card-icon">{item.icon}</span>
              <div>
                <strong>{item.label}</strong>
                <p>{suiteName} workspace</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}

export function Sidebar({ config, planTier }: { config?: BrandConsoleConfig; planTier?: PlanTier }) {
  try {
    return <ActualSidebar config={config} planTier={planTier} />
  } catch {
    return <div className="p-4 text-red-500">Sidebar failed to load</div>
  }
}

export default Sidebar
