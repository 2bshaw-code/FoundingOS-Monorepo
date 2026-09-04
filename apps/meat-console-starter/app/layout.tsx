/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { FoundingOSFooter } from '@foundingos/ui/footer'
import './globals.css'
import './theme.css'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Sidebar } from '@foundingos/ui/sidebar'
import { FoundAI } from '@foundingos/ui/found-ai'
import { Topbar } from '@foundingos/ui/topbar'
import { brandConfig } from './brand-config'

// Real "add to home screen" support (installable web app) — the manifest itself lives in
// manifest.ts (auto-linked by Next.js); apple-touch-icon needs an explicit metadata entry
// since iOS Safari doesn't read the web manifest's icons for its home-screen icon.
export const metadata: Metadata = {
  icons: { apple: '/icons/apple-touch-icon.png' },
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: brandConfig.name },
}

export const viewport: Viewport = {
  themeColor: brandConfig.accent,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex bg-black console-shell-page">
        <Sidebar config={brandConfig} variant="starter" />
        <div className="flex-1 flex flex-col console-shell-main">
          <Topbar config={brandConfig} variant="starter" />
          <main className="console-shell-content">{children}</main>
        </div>
        <FoundAI brand={brandConfig} />
      <FoundingOSFooter /></body>
    </html>
  )
}
