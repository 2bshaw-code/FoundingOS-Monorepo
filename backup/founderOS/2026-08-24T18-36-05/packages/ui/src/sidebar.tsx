import Link from 'next/link'
import type { BrandConsoleConfig } from './console'

function consoleTitle(name?: string) {
  switch (name) {
    case 'FoundRetail':
      return 'Retail Manager Console'
    case 'FoundMeat':
      return 'Meat Operations Console'
    case 'FoundIT':
      return 'IT Command Console'
    case 'FoundTalent':
      return 'Talent Command Console'
    case 'FoundCrypto':
      return 'Crypto Command Console'
    default:
      return `${name ?? 'Workspace'} Console`
  }
}

function ActualSidebar({ config }: { config?: BrandConsoleConfig }) {
  const theme = { '--accent': config?.colors.accent ?? '#4A90E2' } as React.CSSProperties
  const defaultItems = [
    { label: 'Dashboard', href: '/dashboard', icon: '▦', section: 'Core' },
    { label: 'CRM', href: '/crm', icon: '◎', section: 'Core' },
    { label: 'Modules', href: '/modules/overview', icon: '▣', section: 'Operations' },
    { label: 'Activity', href: '/modules/activity-log', icon: '◌', section: 'Analytics' },
    { label: 'Settings', href: '/settings', icon: '⚙', section: 'Settings' },
  ]
  const items = config?.navigation ?? defaultItems
  const grouped = {
    Core: items.filter((item) => item.section === 'Core' || item.href === '/dashboard' || item.href === '/crm'),
    Operations: items.filter((item) => item.section === 'Operations' || item.href.startsWith('/modules/')),
    Analytics: items.filter((item) => item.section === 'Analytics' || item.label === 'Activity'),
    Settings: items.filter((item) => item.section === 'Settings' || item.href === '/settings'),
  }
  if (grouped.Analytics.length === 0) {
    grouped.Analytics = [{ label: 'Activity', href: '/modules/activity-log', icon: '◌', section: 'Analytics' }]
  }

  return (
    <aside className="sidebar" style={theme}>
      <Link className="sidebar-brand" href="/dashboard">
        <span className="brand-logo">{config?.logo ?? 'F'}</span>
        <div>
          <strong>{consoleTitle(config?.name)}</strong>
          <span>{config?.name ?? 'FounderOS'}</span>
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
