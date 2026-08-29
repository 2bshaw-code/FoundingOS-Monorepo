/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { ReactNode } from 'react'

export default function ConsoleLayout({ children }: { children: ReactNode }) {
  return <div className="console-shell-layout">{children}</div>
}
