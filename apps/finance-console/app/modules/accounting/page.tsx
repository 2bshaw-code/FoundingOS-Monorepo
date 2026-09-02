/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { AccountingModule } from '@foundingos/ui/modules/accounting'
import { brandConfig } from '../../brand-config'

export default function Page() {
  return <AccountingModule config={brandConfig} />
}
