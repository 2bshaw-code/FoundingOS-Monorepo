/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { BrandDistributionModule } from '@foundingos/ui/modules/BrandDistributionModule'
import { brandConfig } from '../../brand-config'

// FoundRetail ships standard goods and fragile items — no cold-chain requirement.
export default function Page() {
  return (
    <BrandDistributionModule
      config={brandConfig}
      transportTypes={['standard', 'fragile', 'bulk']}
      originLabel="FoundRetail warehouse — London"
      originLat={51.5072}
      originLng={-0.1276}
    />
  )
}
