/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { CustomerServiceModule } from '@foundingos/ui/modules/customer-service'
import { brandConfig } from '../../brand-config'

export default function Page() {
  return <CustomerServiceModule config={brandConfig} />
}
