/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { DistributionModule } from '@foundingos/ui/modules/DistributionModule'
import { brandConfig } from '../../brand-config'

export default function Page() {
  return <DistributionModule config={brandConfig} />
}
