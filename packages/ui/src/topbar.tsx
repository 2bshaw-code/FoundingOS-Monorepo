/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { BrandConsoleConfig } from './console'
import { ThemeToggle } from './theme'

function ActualTopbar({ config }: { config?: BrandConsoleConfig }) {
  const theme = { '--accent': config?.colors.accent ?? '#4A90E2' } as React.CSSProperties
  const [collapsed, setCollapsed] = useState(false)
  const toggleLabel = useMemo(() => (collapsed ? 'Open sidebar' : 'Close sidebar'), [collapsed])

  return (
    <header className="topbar" style={theme}>
      <div className="topbar-title">
        <span className="brand-logo small">{config?.logo ?? 'FO'}</span>
        <div>
          <strong>FoundingOS</strong>
          <span>Operating system</span>
        </div>
      </div>
      <div className="topbar-nav">
        <button type="button" className="sidebar-toggle" onClick={() => setCollapsed((value) => !value)} aria-label={toggleLabel}>
          ☰
        </button>
        <Link className="topbar-chip" href="/console">Console</Link>
        <Link className="topbar-chip" href="/dashboard">Event Feed</Link>
        <Link className="topbar-chip" href="/fulfilment-to-cash">Fulfilment</Link>
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
