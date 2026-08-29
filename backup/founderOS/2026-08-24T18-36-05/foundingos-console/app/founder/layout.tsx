import type { ReactNode } from 'react'
import { FounderGlobalisationProvider } from './founder-globalisation'

export default function FounderLayout({ children }: { children: ReactNode }) {
  return <FounderGlobalisationProvider>{children}</FounderGlobalisationProvider>
}
