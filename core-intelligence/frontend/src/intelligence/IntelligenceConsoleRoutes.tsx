/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { ComponentType, ReactNode } from 'react'
import { Navigate, Route } from 'react-router-dom'
import { ProtectedRoute } from '../auth'
import { IntelligenceMerchantConsole } from './IntelligenceMerchantConsole'
import { IntelligenceOwnerConsole } from './IntelligenceOwnerConsole'

type Wrapper = ComponentType<{ children: ReactNode }>

export function IntelligenceConsoleRoutes({ Wrapper }: { Wrapper: Wrapper }) {
  return (
    <>
      <Route
        path="/it/console/manager"
        element={
          <ProtectedRoute roles={['it_intelligence']}>
            <Wrapper>
              <IntelligenceOwnerConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/it/console/dashboard"
        element={
          <ProtectedRoute roles={['it_intelligence']}>
            <Wrapper>
              <IntelligenceOwnerConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/it/console/settings"
        element={
          <ProtectedRoute roles={['it_intelligence']}>
            <Wrapper>
              <IntelligenceOwnerConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/it/console/intelligence"
        element={
          <ProtectedRoute roles={['it_intelligence']}>
            <Wrapper>
              <IntelligenceOwnerConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/it/console/dataops"
        element={
          <ProtectedRoute roles={['it_dataops']}>
            <IntelligenceMerchantConsole />
          </ProtectedRoute>
        }
      />
      <Route
        path="/it/console/analytics"
        element={
          <ProtectedRoute roles={['it_intelligence', 'it_dataops']}>
            <Wrapper>
              <IntelligenceOwnerConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route path="/core_intelligence/data-operations-console/:merchantId" element={<Navigate to="/it/console/dataops" replace />} />
      <Route path="/core_intelligence/intelligence-console" element={<Navigate to="/it/console/manager" replace />} />
      <Route path="/core_intelligence/owner" element={<Navigate to="/it/console/manager" replace />} />
      <Route path="/core_intelligence/console/:merchantId" element={<Navigate to="/it/console/dataops" replace />} />
    </>
  )
}
