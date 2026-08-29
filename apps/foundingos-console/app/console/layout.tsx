/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { FoundingOSFooter } from '@foundingos/ui/footer'
import type { ReactNode } from 'react'
import { FounderGlobalisationProvider } from '../founder/founder-globalisation'

export default function ConsoleLayout({ children }: { children: ReactNode }) {
  return <FounderGlobalisationProvider>{children}</FounderGlobalisationProvider>
}
