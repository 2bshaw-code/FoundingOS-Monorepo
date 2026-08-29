/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { MarketingSuite } from '@foundingos/ui/marketing'
import { brandConfig } from '../brand-config'

export const metadata = { title: 'Marketing Suite' }

export default function MarketingPage() {
  return <MarketingSuite config={brandConfig} />
}
