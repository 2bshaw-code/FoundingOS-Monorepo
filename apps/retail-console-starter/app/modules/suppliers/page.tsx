/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { SuppliersView } from '@foundingos/ui/modules/retail-operations-views'
import { brandConfig } from '../../brand-config'

export default function Page() {
  return <SuppliersView config={brandConfig} />
}
