/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { ModuleHeader } from '@foundingos/ui/console'
import '@foundingos/ui/messaging.css'
import { brandConfig } from '../../brand-config'
import { ChannelWorkspace } from '@foundingos/ui/messaging'
import { CrossBrandChannels } from '@foundingos/ui/global-messaging'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Messages' }

export default function MessagesPage() {
  return (
    <section className="console-page" style={{ ['--accent' as string]: brandConfig.colors.accent }}>
      <ModuleHeader
        config={brandConfig}
        title="Messages"
        description="Direct, group, and cross-brand channels with threads and read receipts."
      />
      <ChannelWorkspace currentUser={brandConfig.name} />
      <div style={{ marginTop: 22 }}>
        <CrossBrandChannels currentBrand="crypto" currentUser={brandConfig.name} />
      </div>
    </section>
  )
}
