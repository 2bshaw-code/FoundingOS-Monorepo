/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { BrandDistributionModule } from '@foundingos/ui/modules/BrandDistributionModule'
import { brandConfig } from '../../brand-config'

// FoundMeat needs cold-chain transport — chilled/frozen are the realistic default options.
export default function Page() {
  return (
    <BrandDistributionModule
      config={brandConfig}
      transportTypes={['chilled', 'frozen', 'standard']}
      originLabel="FoundMeat processing depot — Birmingham"
      originLat={52.4862}
      originLng={-1.8904}
    />
  )
}
