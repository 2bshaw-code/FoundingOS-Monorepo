/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { ComponentType, ReactNode } from 'react'
import { Navigate, Route } from 'react-router-dom'
import { ProtectedRoute } from '../auth'
import { FoundThisMerchantConsole } from './FoundThisMerchantConsole'
import { FoundThisOwnerConsole } from './FoundThisOwnerConsole'

type Wrapper = ComponentType<{ children: ReactNode }>

export function FoundThisConsoleRoutes({ Wrapper }: { Wrapper: Wrapper }) {
  return (
    <>
      <Route
        path="/it/console/manager"
        element={
          <ProtectedRoute roles={['it_intelligence']}>
            <Wrapper>
              <FoundThisOwnerConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/it/console/dashboard"
        element={
          <ProtectedRoute roles={['it_intelligence']}>
            <Wrapper>
              <FoundThisOwnerConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/it/console/settings"
        element={
          <ProtectedRoute roles={['it_intelligence']}>
            <Wrapper>
              <FoundThisOwnerConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/it/console/intelligence"
        element={
          <ProtectedRoute roles={['it_intelligence']}>
            <Wrapper>
              <FoundThisOwnerConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/it/console/dataops"
        element={
          <ProtectedRoute roles={['it_dataops']}>
            <FoundThisMerchantConsole />
          </ProtectedRoute>
        }
      />
      <Route
        path="/it/console/analytics"
        element={
          <ProtectedRoute roles={['it_intelligence', 'it_dataops']}>
            <Wrapper>
              <FoundThisOwnerConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route path="/foundit/data-operations-console/:merchantId" element={<Navigate to="/it/console/dataops" replace />} />
      <Route path="/foundit/intelligence-console" element={<Navigate to="/it/console/manager" replace />} />
      <Route path="/foundit/owner" element={<Navigate to="/it/console/manager" replace />} />
      <Route path="/foundit/console/:merchantId" element={<Navigate to="/it/console/dataops" replace />} />
    </>
  )
}
