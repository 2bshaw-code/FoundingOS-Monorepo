/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { TransactionsView } from '@foundingos/ui/modules/crypto-wallet-views'
import { brandConfig } from '../../brand-config'

export default function Page() {
  return <TransactionsView config={brandConfig} />
}
