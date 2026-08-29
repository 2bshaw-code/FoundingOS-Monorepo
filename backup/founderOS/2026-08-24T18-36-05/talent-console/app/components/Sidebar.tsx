'use client'

import { Sidebar } from '@foundingos/ui/sidebar'
import { brandConfig } from '../brand-config'

export default function BrandSidebar() {
  return <Sidebar config={brandConfig} />
}
