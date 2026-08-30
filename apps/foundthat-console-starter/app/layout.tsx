/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { FoundingOSFooter } from '@foundingos/ui/footer'
import './globals.css'
import './theme.css'
import type { ReactNode } from 'react'
import { Sidebar } from '@foundingos/ui/sidebar'
import { FoundAI } from '@foundingos/ui/found-ai'
import { Topbar } from '@foundingos/ui/topbar'
import { LockdownBanner } from '@foundingos/ui/lockdown-banner'
import { brandConfig } from './brand-config'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex bg-black console-shell-page">
        <Sidebar config={brandConfig} variant="starter" />
        <div className="flex-1 flex flex-col console-shell-main">
          <Topbar config={brandConfig} variant="starter" />
          <LockdownBanner brandName={brandConfig.name} logo={brandConfig.logo} accent={brandConfig.accent} />
          <main className="console-shell-content lockdown-readonly">{children}</main>
        </div>
        <FoundAI brand={brandConfig} />
      <FoundingOSFooter /></body>
    </html>
  )
}
