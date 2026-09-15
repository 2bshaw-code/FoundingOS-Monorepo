/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { BrandSettingsPage } from '@foundingos/ui/console'
import { brandConfig } from '../brand-config'

export default function Settings() {
  return <BrandSettingsPage config={brandConfig} />
}
