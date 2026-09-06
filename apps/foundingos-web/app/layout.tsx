/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { FoundingOSFooter } from '@foundingos/ui/footer'
import { FoundAI } from '@foundingos/ui/found-ai'
import { brands } from '@foundingos/config'
import { QuantumBackground } from '@foundingos/ui/quantum'
import '@foundingos/ui/styles.css'

export const metadata = { title: 'FoundingOS', description: 'Unified multi-brand SaaS launcher.' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QuantumBackground brand={brands.foundingos}>
          {children}
          <FoundAI brand={brands.foundingos} />
          <FoundingOSFooter />
        </QuantumBackground>
      </body>
    </html>
  )
}