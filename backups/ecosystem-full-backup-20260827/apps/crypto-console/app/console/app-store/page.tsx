/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { ModuleHeader } from '@foundingos/ui/console'
import { AppStore } from '@foundingos/ui/app-store'
import '@foundingos/ui/messaging.css'
import { brandConfig } from '../../brand-config'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'App Store' }

export default function AppStorePage() {
  return (
    <section className="console-page" style={{ ['--accent' as string]: brandConfig.colors.accent }}>
      <ModuleHeader
        config={brandConfig}
        title="App Store"
        description="Modules available to this console, with routes, versions and required permissions."
      />
      <AppStore />
    </section>
  )
}
