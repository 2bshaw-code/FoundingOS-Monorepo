/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { FoundingOSFooter } from '@foundingos/ui/footer'
import './globals.css'
import './theme.css'
import type { Metadata, Viewport } from 'next'
import type { ReactNode, CSSProperties } from 'react'
import { cookies } from 'next/headers'
import { Sidebar } from '@foundingos/ui/sidebar'
import { FoundAI } from '@foundingos/ui/found-ai'
import { Topbar } from '@foundingos/ui/topbar'
import { brandConfig } from './brand-config'
import { SESSION_COOKIE, verifyToken } from './tester/session'
import { categorizeCredential } from './tester/tester-data'
import { brands } from '@foundingos/config'

// Real "add to home screen" support (installable web app) — the manifest itself lives in
// manifest.ts (auto-linked by Next.js); apple-touch-icon needs an explicit metadata entry
// since iOS Safari doesn't read the web manifest's icons for its home-screen icon.
export const metadata: Metadata = {
  icons: { apple: '/icons/apple-touch-icon.png' },
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'FoundingOS' },
}

export const viewport: Viewport = {
  themeColor: brandConfig.accent,
}

const HUB_BRAND_TINT_COOKIE = 'fo_hub_brand_tint'
const TINTABLE_BRANDS = ['retail', 'crypto', 'meat', 'talent', 'foundthat', 'finance', 'health', 'logistics'] as const

// Real fix for a genuine branding mismatch: arriving at this shared hub from a brand console
// (e.g. all-green FoundRetail, via its "Demos & Surveys" link) previously always showed
// FoundingOS's own fixed blue/rainbow theme — jarring next to whichever brand you came from.
// The middleware stores which brand you arrived from in a cookie; this reads it and tints the
// hub's accent to match, while everything else (the real "FoundingOS Console" name/copy)
// stays exactly the same, since this is still genuinely the one shared hub, not a rebrand.
function tintedBrandConfig() {
  const tint = cookies().get(HUB_BRAND_TINT_COOKIE)?.value
  const match = TINTABLE_BRANDS.find((slug) => slug === tint)
  if (!match) return brandConfig
  const accent = brands[match].brandColors.accent
  return { ...brandConfig, accent, colors: { ...brandConfig.colors, accent, primary: accent } }
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Real testers/survey-takers/investors/buyers/customers must NEVER see the console sidebar,
  // topbar, or FoundAI panel — no console navigation, no dashboard tiles, nothing beyond their
  // assigned demo/briefing and survey. Every real session of these categories is, by this
  // point, always redirected to /tester/demo/*, /tester/survey, or /investor — so this check
  // alone (independent of path) is enough to guarantee the console chrome never renders for
  // them. Free roam / lawyer / admin sessions are unaffected and see the full console shell.
  const token = cookies().get(SESSION_COOKIE)?.value
  const testerId = token ? await verifyToken('tester', token) : null
  const category = testerId ? categorizeCredential(testerId) : null
  const isRealTesterSession = category === 'tester' || category === 'survey' || category === 'investor' || category === 'buyer' || category === 'customer'
  const tinted = tintedBrandConfig()
  const tintStyle = { '--accent': tinted.colors.accent } as CSSProperties

  if (isRealTesterSession) {
    return (
      <html lang="en">
        <body className="min-h-screen bg-black tester-shell" style={tintStyle}>
          <main className="tester-shell-content">{children}</main>
        </body>
      </html>
    )
  }

  return (
    <html lang="en">
      <body className="min-h-screen flex bg-black console-shell-page">
        <Sidebar config={tinted} />
        <div className="flex-1 flex flex-col console-shell-main">
          <Topbar config={tinted} />
          <main className="console-shell-content">{children}</main>
        </div>
        <FoundAI brand={tinted} />
      <FoundingOSFooter /></body>
    </html>
  )
}

