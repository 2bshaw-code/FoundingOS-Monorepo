/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { MessagingModule } from '@foundingos/ui/modules/messaging'
import { brandConfig } from '../../brand-config'

export default function Page() {
  return <MessagingModule config={brandConfig} />
}
