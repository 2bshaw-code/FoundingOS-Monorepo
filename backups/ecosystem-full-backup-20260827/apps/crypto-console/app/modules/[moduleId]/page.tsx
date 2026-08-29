/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { BrandModulePage } from '@foundingos/ui/console'
import { UpgradeScreen } from '@foundingos/ui/upgrade-screen'
import { featureForModule, hasFeature } from '@foundingos/ui/feature-gating'
import { brandConfig, customerAccess } from '../../brand-config'

export default function ModulePage({ params }: { params: { moduleId: string } }) {
  const feature = featureForModule(params.moduleId)

  if (!hasFeature(customerAccess, feature)) {
    return <UpgradeScreen feature={feature ?? params.moduleId} requiredPackage="Pro" />
  }

  return <BrandModulePage config={brandConfig} moduleId={params.moduleId} />
}
