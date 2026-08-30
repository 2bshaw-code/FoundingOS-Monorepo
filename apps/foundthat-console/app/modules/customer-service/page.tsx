/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { BrandModulePage } from '@foundingos/ui/console'
import { brandConfig } from '../../brand-config'

export default function Page() {
  return <BrandModulePage config={brandConfig} moduleId="customer-service" />
}
