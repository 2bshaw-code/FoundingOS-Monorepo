/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { MarketingModule } from '@foundingos/ui/modules/marketing'
import { brandConfig } from '../../brand-config'

export default function Page() {
  return <MarketingModule config={brandConfig} />
}
