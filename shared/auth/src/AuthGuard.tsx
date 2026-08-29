/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { ReactNode } from 'react'
import { ProtectedRoute } from './ProtectedRoute.js'

export function AuthGuard({ children, authenticated = false, publicRoute = false, fallback = null }: { children: ReactNode; authenticated?: boolean; publicRoute?: boolean; fallback?: ReactNode }) {
  return <ProtectedRoute authenticated={authenticated} publicRoute={publicRoute} fallback={fallback}>{children}</ProtectedRoute>
}