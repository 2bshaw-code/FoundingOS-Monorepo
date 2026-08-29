/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { Topbar } from '@foundingos/ui/topbar'
import { brandConfig } from '../brand-config'

export default function BrandTopbar() {
  return <Topbar config={brandConfig} />
}
