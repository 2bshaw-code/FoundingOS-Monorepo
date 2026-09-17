/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import Link from 'next/link'
import type { BrandConsoleConfig } from './console'

function ActualSidebar({ config }: { config?: BrandConsoleConfig }) {
  const theme = { '--accent': config?.colors.accent ?? '#4A90E2' } as React.CSSProperties
  const grouped: Record<string, Array<{ label: string; href: string; icon: string }>> = {
    'Core.Operations': [
      { label: 'Retail', href: '/modules/retail', icon: '▣' },
      { label: 'Logistics', href: '/modules/logistics', icon: '↗' },
      { label: 'Finance', href: '/modules/finance', icon: '£' },
      { label: 'Marketing', href: '/marketing', icon: '◎' },
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
          {items.map((item) => (
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

export function Sidebar({ config }: { config?: BrandConsoleConfig }) {
  try {
    return <ActualSidebar config={config} />
  } catch {
    return <div className="p-4 text-red-500">Sidebar failed to load</div>
  }
}

export default Sidebar
