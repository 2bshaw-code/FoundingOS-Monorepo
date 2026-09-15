/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { FoundingOSFooter } from '@foundingos/ui/footer'
import type { ReactNode } from 'react'
import { FounderGlobalisationProvider } from './founder-globalisation'

export default function FounderLayout({ children }: { children: ReactNode }) {
  return <FounderGlobalisationProvider>{children}</FounderGlobalisationProvider>
}
