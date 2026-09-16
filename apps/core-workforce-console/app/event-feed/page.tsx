/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { ModuleHeader } from '@foundingos/ui/console'
import { EventFeed } from '@foundingos/ui/event-feed'
import { brandConfig } from '../brand-config'

const OPS_API_BASE = process.env.NEXT_PUBLIC_CORE_OPERATIONS_API_URL || 'https://core-operations-api.foundingos.com/api/v1'

export default function EventFeedPage() {
  return (
    <div className="module-page">
      <ModuleHeader
        config={brandConfig}
        title="Event Feed"
        description="Live activity across Retail, Logistics, Finance, Talent, and Health."
      />
      <EventFeed apiBase={OPS_API_BASE} />
    </div>
  )
}
