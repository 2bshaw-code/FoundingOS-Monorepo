import Link from 'next/link'
import type { BrandConsoleConfig } from './console'
import { ThemeToggle } from './theme'

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

function ActualTopbar({ config }: { config?: BrandConsoleConfig }) {
  const theme = { '--accent': config?.colors.accent ?? '#4A90E2' } as React.CSSProperties
  return (
   <header className="topbar" style={theme}>
     <div className="topbar-title">
       <span className="brand-logo small">{config?.logo ?? 'F'}</span>
       <div>
          <strong>{consoleTitle(config?.name)}</strong>
          <span>{config?.name ?? 'Workspace'} command center</span>
        </div>
      </div>
      <div className="topbar-nav">
        <Link className="topbar-chip" href="/dashboard">Dashboard</Link>
        <details className="topbar-dropdown">
          <summary className="topbar-chip">Modules</summary>
          <div className="topbar-dropdown-panel">
            <span>Use the sidebar for module navigation.</span>
          </div>
        </details>
      </div>
      <div className="topbar-actions">
        <ThemeToggle />
      </div>
    </header>
  )
}

export function Topbar({ config }: { config?: BrandConsoleConfig }) {
  try {
    return <ActualTopbar config={config} />
  } catch {
    return <div className="p-4 text-red-500">Topbar failed to load</div>
  }
}

export default Topbar
