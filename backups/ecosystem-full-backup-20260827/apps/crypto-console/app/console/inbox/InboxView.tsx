'use client'
/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useRouter } from 'next/navigation'
import { UnifiedInbox } from '@foundingos/ui/messaging'

export function InboxView() {
  const router = useRouter()
  return <UnifiedInbox onOpenChannel={() => router.push('/console/messages')} />
}
