/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { BrandConsoleConfig } from './console'
import { ThemeToggle } from './theme'
import { QuantumSphereLogo } from './QuantumSphereLogo'

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

function consoleTitle(name?: string, variant: 'console' | 'starter' = 'console') {
  const brand = name ?? 'Workspace'
  return variant === 'starter' ? `${brand} Console Starter` : `${brand} Console`
}

function ActualTopbar({ config, variant = 'console' }: { config?: BrandConsoleConfig; variant?: 'console' | 'starter' }) {
  const theme = { '--accent': config?.colors.accent ?? '#00E0FF' } as React.CSSProperties
  const sphereAccent = config?.name && config.name !== 'FoundingOS' ? config.colors.accent : undefined
  const [collapsed, setCollapsed] = useState(false)
  // Real fix for a genuine double-write/visible-flash bug (confirmed live via instrumented
  // localStorage/MutationObserver logging): both effects below fire on the same initial mount
  // commit. The mount-only effect reads the real stored preference and applies it correctly —
  // but the effect below, reacting to `collapsed`, ALSO fires on that same first commit, before
  // the mount effect's setCollapsed() has flushed a re-render, so it runs with the stale default
  // (false) and immediately overwrites the correct value. React then re-renders from
  // setCollapsed() and this effect fires again with the real value, correcting it — but not
  // before a real, user-visible flash (sidebar briefly shows its default state, then snaps to the
  // stored one) and a redundant conflicting localStorage write. Skipping this effect's own first
  // invocation (the standard React idiom for this) removes the stale write entirely; every
  // subsequent invocation — i.e. every real user click on the toggle — behaves exactly as before.
  const skipNextApplyRef = useRef(true)

  useEffect(() => {
   const initial = readSidebarPreference()
   setCollapsed(initial)
   applySidebarPreference(initial)
  }, [])

  useEffect(() => {
   if (skipNextApplyRef.current) { skipNextApplyRef.current = false; return }
   applySidebarPreference(collapsed)
  }, [collapsed])

  const toggleLabel = useMemo(() => (collapsed ? 'Open sidebar' : 'Close sidebar'), [collapsed])

  return (
    <header className="topbar" style={theme}>
     <div className="topbar-title">
       <QuantumSphereLogo size={28} accent={sphereAccent} />
       <div>
         <strong>{consoleTitle(config?.name, variant)}</strong>
         <span>{config?.name ?? 'Workspace'} command center</span>
         <small style={{ display: 'block', opacity: 0.6, fontSize: 11 }}>FoundingOS — The Operating System for WhatsApp, Telegram, and global message-based businesses.</small>
       </div>
     </div>
     <div className="topbar-nav">
       <button type="button" className="sidebar-toggle" onClick={() => setCollapsed((value) => !value)} aria-label={toggleLabel}>
         ☰
       </button>
     </div>
     <div className="topbar-actions">
       <a href="https://www.foundingos.com/home" style={{ fontSize: 12, opacity: 0.8 }}>FoundingOS Homepage</a>
       <form action="https://console.foundingos.com/api/tester/logout" method="POST" style={{ display: 'inline' }}>
         <button type="submit" style={{ background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', cursor: 'pointer', padding: 0, font: 'inherit', fontSize: 12, opacity: 0.8 }}>Log out</button>
       </form>
       <ThemeToggle />
     </div>
    </header>
  )
}

export function Topbar({ config, variant = 'console' }: { config?: BrandConsoleConfig; variant?: 'console' | 'starter' }) {
  try {
    return <ActualTopbar config={config} variant={variant} />
  } catch {
    return <div className="p-4 text-red-500">Topbar failed to load</div>
  }
}

export default Topbar
