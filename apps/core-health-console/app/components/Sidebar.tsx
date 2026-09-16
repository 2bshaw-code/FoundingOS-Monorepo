/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { Sidebar } from '@foundingos/ui/sidebar'
import { brandConfig } from '../brand-config'

export default function BrandSidebar() {
  return <Sidebar config={brandConfig} />
}
