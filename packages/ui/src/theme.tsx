/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useRef, useState } from 'react'

const THEME_KEY = 'foundingos-theme'
type ThemeMode = 'night' | 'day'

function readCookieTheme(): ThemeMode | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)foundingos-theme=(night|day)/)
  return (match?.[1] as ThemeMode | undefined) ?? null
}

function readStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'night'
  const local = window.localStorage.getItem(THEME_KEY)
  if (local === 'night' || local === 'day') return local
  return readCookieTheme() ?? 'night'
}

function applyTheme(mode: ThemeMode) {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = mode
  document.documentElement.style.colorScheme = mode === 'day' ? 'light' : 'dark'
  document.cookie = `${THEME_KEY}=${mode}; path=/; max-age=31536000; SameSite=Lax`
  window.localStorage.setItem(THEME_KEY, mode)
}

export function ThemeToggle({ className = 'theme-toggle' }: { className?: string }) {
  const [mode, setMode] = useState<ThemeMode>('night')
  // Same real double-write/flash bug as topbar.tsx's sidebar-collapse state, same fix: skip this
  // effect's own first invocation so it doesn't fire with the stale 'night' default on the same
  // initial commit as the mount effect below (which already applies the real stored value) —
  // see topbar.tsx for the full empirically-confirmed root-cause writeup.
  const skipNextApplyRef = useRef(true)

  useEffect(() => {
    const initial = readStoredTheme()
    setMode(initial)
    applyTheme(initial)
  }, [])

  useEffect(() => {
    if (skipNextApplyRef.current) { skipNextApplyRef.current = false; return }
    applyTheme(mode)
  }, [mode])

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === THEME_KEY && (event.newValue === 'night' || event.newValue === 'day')) {
        setMode(event.newValue)
        applyTheme(event.newValue)
      }
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  return (
    <button type="button" className={className} onClick={() => setMode(mode === 'night' ? 'day' : 'night')}>
      {mode === 'night' ? 'Night' : 'Day'} mode
    </button>
  )
}

export default ThemeToggle
