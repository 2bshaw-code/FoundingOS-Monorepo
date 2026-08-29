/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import type { BrandConsoleConfig } from './console'
import { ThemeToggle } from './theme'

const SIDEBAR_KEY = 'foundingos-sidebar-collapsed'

function readSidebarPreference() {
  if (typeof window === 'undefined') return false
  const stored = window.localStorage.getItem(SIDEBAR_KEY)
  if (stored === 'true') return true
  if (stored === 'false') return false
  return window.matchMedia('(max-width: 1120px)').matches
}

function applySidebarPreference(collapsed: boolean) {
  if (typeof document === 'undefined') return
  document.body.dataset.sidebarCollapsed = collapsed ? 'true' : 'false'
  window.localStorage.setItem(SIDEBAR_KEY, String(collapsed))
}

function consoleTitle(name?: string) {
  switch (name) {
    case 'FoundRetail':
      return 'Retail Manager Console'
    case 'FoundMeat':
      return 'Meat Operations Console'
    case 'FoundThat':
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
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
   const initial = readSidebarPreference()
   setCollapsed(initial)
   applySidebarPreference(initial)
  }, [])

  useEffect(() => {
   applySidebarPreference(collapsed)
  }, [collapsed])

  const toggleLabel = useMemo(() => (collapsed ? 'Open sidebar' : 'Close sidebar'), [collapsed])

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
       <button type="button" className="sidebar-toggle" onClick={() => setCollapsed((value) => !value)} aria-label={toggleLabel}>
         ☰
       </button>
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
