/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import Link from 'next/link'
import { Megaphone, Banknote, MessageCircle, LifeBuoy, Sparkles, type LucideIcon } from 'lucide-react'
import type { BrandConsoleConfig } from './console'
import { QuantumSphereLogo } from './QuantumSphereLogo'
import { qColors } from './quantum'

// Some brand-config nav items carry named icon strings (from earlier module-icon data) instead of
// the glyph characters most items use. Without this map those strings rendered as literal leftover
// text (e.g. "megaphone") in the sidebar. Anything not in this map is treated as an already-valid
// glyph/character icon and rendered as-is.
const NAMED_ICONS: Record<string, LucideIcon> = {
  megaphone: Megaphone,
  banknotes: Banknote,
  'chat-bubble-left-right': MessageCircle,
  lifebuoy: LifeBuoy,
  sparkles: Sparkles,
}

function resolveIcon(icon: string) {
  const NamedIcon = NAMED_ICONS[icon]
  return NamedIcon ? <NamedIcon size={16} /> : icon
}

function consoleTitle(name?: string, variant: 'console' | 'starter' = 'console') {
  const brand = name ?? 'Workspace'
  return variant === 'starter' ? `${brand} Console Starter` : `${brand} Console`
}

function ActualSidebar({ config, variant = 'console' }: { config?: BrandConsoleConfig; variant?: 'console' | 'starter' }) {
  const theme = { '--accent': config?.colors.accent ?? qColors.foundingos } as React.CSSProperties
  const sphereAccent = config?.name && config.name !== 'FoundingOS' ? config.colors.accent : undefined
  const defaultItems = [
    { label: 'Dashboard', href: '/dashboard', icon: '▦', section: 'Core' },
    { label: 'CRM', href: '/crm', icon: '◎', section: 'Core' },
    { label: 'Modules', href: '/modules/overview', icon: '▣', section: 'Operations' },
    { label: 'Activity', href: '/modules/activity-log', icon: '◌', section: 'Analytics' },
    { label: 'Settings', href: '/settings', icon: '⚙', section: 'Settings' },
  ]
  const items = config?.navigation ?? defaultItems
  const sectionFor = (item: (typeof items)[number]): 'Core' | 'Operations' | 'Analytics' | 'Settings' => {
    if (item.section === 'Core' || item.section === 'Operations' || item.section === 'Analytics' || item.section === 'Settings') return item.section
    if (item.href === '/dashboard' || item.href === '/crm') return 'Core'
    if (item.href === '/settings') return 'Settings'
    if (item.label === 'Activity') return 'Analytics'
    if (item.href.startsWith('/modules/')) return 'Operations'
    return 'Operations'
  }
  const grouped = {
    Core: items.filter((item) => sectionFor(item) === 'Core'),
    Operations: items.filter((item) => sectionFor(item) === 'Operations'),
    Analytics: items.filter((item) => sectionFor(item) === 'Analytics'),
    Settings: items.filter((item) => sectionFor(item) === 'Settings'),
  }
  if (grouped.Analytics.length === 0) {
    grouped.Analytics = [{ label: 'Activity', href: '/modules/activity-log', icon: '◌', section: 'Analytics' }]
  }

  return (
    <aside className="sidebar" style={theme}>
      <Link className="sidebar-brand" href="/console">
        <QuantumSphereLogo size={38} accent={sphereAccent} />
        <div>
          <strong>{consoleTitle(config?.name, variant)}</strong>
          <span>{config?.name ?? 'Workspace'}</span>
        </div>
      </Link>

      <div className="nav-card-grid">
        {Object.entries(grouped).map(([section, sectionItems]) => (
          <div key={section} className="nav-section">
            <p className="nav-section-label">{section}</p>
            {sectionItems.map((item) => (
              <Link key={item.href} className="nav-card q-list-row" href={item.href}>
                <span className="nav-card-icon">{resolveIcon(item.icon)}</span>
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

export function Sidebar({ config, variant = 'console' }: { config?: BrandConsoleConfig; variant?: 'console' | 'starter' }) {
  try {
    return <ActualSidebar config={config} variant={variant} />
  } catch {
    return <div className="p-4 text-red-500">Sidebar failed to load</div>
  }
}

export default Sidebar
