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

const LITE_KEY = 'foundingos-lite-mode'

function readCookieLite(): boolean | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)foundingos-lite=(1|0)/)
  if (!match) return null
  return match[1] === '1'
}

function readStoredLite(): boolean {
  if (typeof window === 'undefined') return false
  const local = window.localStorage.getItem(LITE_KEY)
  if (local === '1') return true
  if (local === '0') return false
  const cookieValue = readCookieLite()
  if (cookieValue !== null) return cookieValue
  // Sensible default for the target market: a slow connection (2G/3G, or a browser/data-saver
  // proxy reporting "slow-2g"/"2g") starts in Lite mode automatically so a first-time visitor
  // on constrained data never has to wait through the full quantum visuals to find the toggle.
  const nav = window.navigator as Navigator & { connection?: { effectiveType?: string; saveData?: boolean } }
  const conn = nav.connection
  if (conn?.saveData) return true
  if (conn?.effectiveType === 'slow-2g' || conn?.effectiveType === '2g') return true
  return false
}

function applyLite(lite: boolean) {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.lite = lite ? 'true' : 'false'
  document.cookie = `foundingos-lite=${lite ? '1' : '0'}; path=/; max-age=31536000; SameSite=Lax`
  window.localStorage.setItem(LITE_KEY, lite ? '1' : '0')
}

// Data Saver / low-end device mode — turns off the heaviest visual cost centers (blur/backdrop-
// filter layers, particle/Lottie-style ambient animation, large gradient repaints) so the app
// stays fast and cheap-on-data on the low-end Android hardware and slow/metered connections
// common across our target developing-world markets. Every visual it disables is purely
// decorative — no functionality changes, same real information density, just lighter to render
// and ship over the wire.
export function LiteModeToggle({ className = 'theme-toggle lite-mode-toggle' }: { className?: string }) {
  const [lite, setLite] = useState(false)
  const skipNextApplyRef = useRef(true)

  useEffect(() => {
    const initial = readStoredLite()
    setLite(initial)
    applyLite(initial)
  }, [])

  useEffect(() => {
    if (skipNextApplyRef.current) { skipNextApplyRef.current = false; return }
    applyLite(lite)
  }, [lite])

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === LITE_KEY) {
        const next = event.newValue === '1'
        setLite(next)
        applyLite(next)
      }
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  return (
    <button
      type="button"
      className={className}
      aria-pressed={lite}
      title="Turn off heavy visual effects to save data and run faster on low-end devices"
      onClick={() => setLite((value) => !value)}
    >
      {lite ? '⚡ Lite mode on' : '⚡ Lite mode'}
    </button>
  )
}
