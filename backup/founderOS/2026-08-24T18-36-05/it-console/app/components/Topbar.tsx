'use client'

import { Topbar } from '@foundingos/ui/topbar'
import { brandConfig } from '../brand-config'

export default function BrandTopbar() {
  return <Topbar config={brandConfig} />
}
