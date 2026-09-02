/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { PortfolioView } from '@foundingos/ui/modules/crypto-wallet-views'
import { brandConfig } from '../../brand-config'

export default function Page() {
  return <PortfolioView config={brandConfig} />
}
