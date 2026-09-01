/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { FoundingOSFooter } from '@foundingos/ui/footer'
import './globals.css'
import './theme.css'
import type { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { Sidebar } from '@foundingos/ui/sidebar'
import { FoundAI } from '@foundingos/ui/found-ai'
import { Topbar } from '@foundingos/ui/topbar'
import { brandConfig } from './brand-config'
import { SESSION_COOKIE, verifyToken } from './tester/session'
import { categorizeCredential } from './tester/tester-data'

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

  if (isRealTesterSession) {
    return (
      <html lang="en">
        <body className="min-h-screen bg-black tester-shell">
          <main className="tester-shell-content">{children}</main>
        </body>
      </html>
    )
  }

  return (
    <html lang="en">
      <body className="min-h-screen flex bg-black console-shell-page">
        <Sidebar config={brandConfig} />
        <div className="flex-1 flex flex-col console-shell-main">
          <Topbar config={brandConfig} />
          <main className="console-shell-content">{children}</main>
        </div>
        <FoundAI brand={brandConfig} />
      <FoundingOSFooter /></body>
    </html>
  )
}
