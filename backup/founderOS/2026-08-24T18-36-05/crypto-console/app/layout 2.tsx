import './globals.css'
import './theme.css'
import type { ReactNode } from 'react'
import { Sidebar } from '@foundingos/ui/sidebar'
import { BobAI } from '@foundingos/ui/bob-ai'
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
        <BobAI brand={brandConfig} />
      </body>
    </html>
  )
}
