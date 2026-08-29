import type { ReactNode } from 'react'
import { FounderGlobalisationProvider } from '../founder/founder-globalisation'

export default function ConsoleLayout({ children }: { children: ReactNode }) {
  return <FounderGlobalisationProvider>{children}</FounderGlobalisationProvider>
}
