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
import { brandConfig } from './brand-config'

export default function RootLayout({ children }: { children: ReactNode }) {
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
