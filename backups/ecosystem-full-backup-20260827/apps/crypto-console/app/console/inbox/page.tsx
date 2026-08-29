/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { ModuleHeader } from '@foundingos/ui/console'
import '@foundingos/ui/messaging.css'
import { brandConfig } from '../../brand-config'
import { InboxView } from './InboxView'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Unified inbox' }

export default function InboxPage() {
  return (
    <section className="console-page" style={{ ['--accent' as string]: brandConfig.colors.accent }}>
      <ModuleHeader
        config={brandConfig}
        title="Unified inbox"
        description="Internal messages, WhatsApp traffic, system and quantum alerts in one feed."
      />
      <InboxView />
    </section>
  )
}
