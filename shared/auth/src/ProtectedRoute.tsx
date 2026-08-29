/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { ReactNode } from 'react'

export function ProtectedRoute({ children, authenticated = false, publicRoute = false, fallback = null }: { children: ReactNode; authenticated?: boolean; publicRoute?: boolean; fallback?: ReactNode }) {
  return publicRoute || authenticated ? children : fallback
}