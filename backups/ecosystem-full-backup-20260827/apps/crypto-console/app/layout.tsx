/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { FoundingOSFooter } from '@foundingos/ui/footer'
import { brandKeyFromName } from '@foundingos/ui/logos'
import './globals.css'
import './theme.css'
import type { ReactNode } from 'react'
import { BobAI } from '@foundingos/ui/bob-ai'
import { ConsoleShell } from '@foundingos/ui/console-shell'
import { brandConfig, customerAccess } from './brand-config'
import { CONSOLE_IDENTITIES } from './console.config'

// usePathname() inside ConsoleShell cannot be statically prerendered.
export const dynamic = 'force-dynamic'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex bg-black console-shell-page">
        <ConsoleShell config={brandConfig} customerAccess={customerAccess} identities={CONSOLE_IDENTITIES}>
          {children}
        </ConsoleShell>
        <BobAI brand={brandConfig} />
      <FoundingOSFooter brand={brandKeyFromName(brandConfig.name)} /></body>
    </html>
  )
}
