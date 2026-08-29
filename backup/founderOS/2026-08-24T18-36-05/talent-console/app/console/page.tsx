import { BrandDashboard } from '@foundingos/ui/console'
import { brandConfig } from '../brand-config'

export default function ConsolePage() {
  return <BrandDashboard config={brandConfig} />
}
