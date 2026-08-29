/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { ReactNode } from 'react'

export function AuthWrapper({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <main className={`min-h-screen ${className}`}>{children}</main>
}