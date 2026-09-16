/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { CRMBoard } from '@foundingos/ui/crm'
import { brandConfig } from '../brand-config'

export default function CRMPage() {
  return <CRMBoard config={brandConfig} />
}
