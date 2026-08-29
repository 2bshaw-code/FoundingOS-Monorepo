/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { CRMBoard } from '@foundingos/ui/crm'
import { UpgradeScreen } from '@foundingos/ui/upgrade-screen'
import { featureForModule, hasFeature } from '@foundingos/ui/feature-gating'
import { brandConfig, customerAccess } from '../../brand-config'

export default function ConsoleCRMPage() {
  const feature = featureForModule('crm')

  if (!hasFeature(customerAccess, feature)) {
    return <UpgradeScreen feature={feature ?? 'crm'} requiredPackage="Pro" />
  }

  return <CRMBoard config={brandConfig} customerAccess={customerAccess} />
}
