import { BrandSettingsPage } from '@foundingos/ui/console'
import { brandConfig } from '../brand-config'

export default function Settings() {
  return <BrandSettingsPage config={brandConfig} />
}
