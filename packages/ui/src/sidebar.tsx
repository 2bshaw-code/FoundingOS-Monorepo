/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import Link from 'next/link'
import type { BrandConsoleConfig } from './console'

function consoleTitle() {
  return 'FoundingOS Console'
}

function ActualSidebar({ config }: { config?: BrandConsoleConfig }) {
  const theme = { '--accent': config?.colors.accent ?? '#4A90E2' } as React.CSSProperties
  const grouped = {
    'Operations Suite': [
      { label: 'Retail', href: '/modules/retail', icon: '▣', section: 'Operations Suite' },
      { label: 'Logistics', href: '/modules/logistics', icon: '↗', section: 'Operations Suite' },
      { label: 'Finance', href: '/modules/finance', icon: '£', section: 'Operations Suite' },
    ],
    'Workforce Suite': [
      { label: 'Talent', href: '/modules/talent', icon: '◍', section: 'Workforce Suite' },
      { label: 'Health', href: '/modules/health', icon: '+', section: 'Workforce Suite' },
    ],
    'Intelligence Suite': [
      { label: 'SuperDashboard', href: '/dashboard', icon: '▦', section: 'Intelligence Suite' },
      { label: 'Mapping', href: '/modules/mapping', icon: '⌖', section: 'Intelligence Suite' },
      { label: 'Orchestration', href: '/modules/orchestration', icon: '↻', section: 'Intelligence Suite' },
      { label: 'ITOps', href: '/modules/itops', icon: '⚙', section: 'Intelligence Suite' },
    ],
  }

  return (
    <aside className="sidebar" style={theme}>
      <Link className="sidebar-brand" href="/console">
        <span className="brand-logo">{config?.logo ?? 'F'}</span>
        <div>
          <strong>{consoleTitle()}</strong>
          <span>FoundingOS</span>
        </div>
      </Link>

      <div className="nav-card-grid">
        {Object.entries(grouped).map(([section, sectionItems]) => (
          <div key={section} className="nav-section">
            <p className="nav-section-label">{section}</p>
            {sectionItems.map((item) => (
              <Link key={item.href} className="nav-card" href={item.href}>
                <span className="nav-card-icon">{item.icon}</span>
                <div>
                  <strong>{item.label}</strong>
                  <p>{item.label} workspace</p>
                </div>
              </Link>
            ))}
          </div>
        ))}
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
