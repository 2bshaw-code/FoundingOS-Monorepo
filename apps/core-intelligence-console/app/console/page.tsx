/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { BrandDashboard } from '@foundingos/ui/console'
import { brandConfig } from '../brand-config'

export default function ConsolePage() {
  return <BrandDashboard config={brandConfig} />
}
