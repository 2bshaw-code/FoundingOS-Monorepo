/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import Link from 'next/link'
import type { BrandConsoleConfig } from './console'
import { ThemeToggle } from './theme'

function ActualTopbar({ config }: { config?: BrandConsoleConfig }) {
  const theme = { '--accent': config?.colors.accent ?? '#4A90E2' } as React.CSSProperties
  const suiteName = config?.name ?? 'FoundingOS'

  return (
    <header className="topbar" style={theme}>
      <div className="topbar-title">
        <span className="brand-logo small">{config?.logo ?? 'FO'}</span>
        <div>
          <strong>FoundingOS</strong>
          <span>{suiteName}</span>
        </div>
      </div>
      <div className="topbar-nav">
        <Link className="topbar-chip" href="/dashboard">Overview</Link>
        <Link className="topbar-chip" href="/dashboard">Event Feed</Link>
        {suiteName === 'Core.Operations' && <Link className="topbar-chip" href="/fulfilment-to-cash">Fulfilment</Link>}
        {suiteName === 'Core.Operations' && <Link className="topbar-chip" href="/marketing">Marketing</Link>}
        <Link className="topbar-chip" href="/intelligence">Intelligence</Link>
      </div>
      <div className="topbar-actions">
        <span className="environment-badge"><i /> Demo environment</span>
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
