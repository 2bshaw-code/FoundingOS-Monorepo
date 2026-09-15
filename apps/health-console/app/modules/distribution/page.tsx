/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { BrandDistributionModule } from '@foundingos/ui/modules/BrandDistributionModule'
import { brandConfig } from '../../brand-config'

// FoundHealth ships medical stock — chilled for temperature-sensitive supplies, standard for
// general stock, fragile for delicate equipment.
export default function Page() {
  return (
    <BrandDistributionModule
      config={brandConfig}
      transportTypes={['chilled', 'standard', 'fragile']}
      originLabel="FoundHealth central pharmacy store — Manchester"
      originLat={53.4808}
      originLng={-2.2426}
    />
  )
}
