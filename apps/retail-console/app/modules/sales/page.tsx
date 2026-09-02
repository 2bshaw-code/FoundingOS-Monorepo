/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { SalesModule } from '@foundingos/ui/modules/sales'
import { brandConfig } from '../../brand-config'

export default function Page() {
  return <SalesModule config={brandConfig} />
}
