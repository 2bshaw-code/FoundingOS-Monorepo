/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { FoundingOSFooter } from '@foundingos/ui/footer'
import { FoundAI } from '@foundingos/ui/found-ai'
import '@foundingos/ui/styles.css'

export const metadata = { title: 'FoundingOS', description: 'Unified multi-brand SaaS launcher.' }

const FOUNDINGOS_BRAND = { name: 'FoundingOS', accent: '#00E0FF' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <FoundAI brand={FOUNDINGOS_BRAND} />
        <FoundingOSFooter />
      </body>
    </html>
  )
}