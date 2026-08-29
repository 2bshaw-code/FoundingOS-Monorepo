/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { ComponentType, ReactNode } from 'react'
import { Navigate, Route } from 'react-router-dom'
import { ProtectedRoute } from '../auth'
import { FoundRetailMerchantConsole } from './FoundRetailMerchantConsole'
import { FoundRetailOwnerConsole } from './FoundRetailOwnerConsole'

type Wrapper = ComponentType<{ children: ReactNode }>

export function FoundRetailConsoleRoutes({ Wrapper }: { Wrapper: Wrapper }) {
  return (
    <>
      <Route
        path="/retail/console/manager"
        element={
          <ProtectedRoute roles={['retail_manager']}>
            <Wrapper>
              <FoundRetailOwnerConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/retail/console/dashboard"
        element={
          <ProtectedRoute roles={['retail_manager']}>
            <Wrapper>
              <FoundRetailOwnerConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/retail/console/settings"
        element={
          <ProtectedRoute roles={['retail_manager']}>
            <Wrapper>
              <FoundRetailOwnerConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/retail/console/support"
        element={
          <ProtectedRoute roles={['retail_manager', 'retail_staff']}>
            <FoundRetailMerchantConsole />
          </ProtectedRoute>
        }
      />
      <Route
        path="/retail/console/analytics"
        element={
          <ProtectedRoute roles={['retail_manager', 'retail_staff']}>
            <Wrapper>
              <FoundRetailOwnerConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route path="/foundretail/retail-manager-console" element={<Navigate to="/retail/console/manager" replace />} />
      <Route path="/foundretail/staff-console" element={<Navigate to="/retail/console/support" replace />} />
      <Route path="/foundretail/dashboard" element={<Navigate to="/retail/console/manager" replace />} />
      <Route path="/foundretail/merchant-console" element={<Navigate to="/retail/console/support" replace />} />
      <Route path="/foundretail/staff" element={<Navigate to="/retail/console/support" replace />} />
      <Route path="/foundretail/manager" element={<Navigate to="/retail/console/manager" replace />} />
      <Route path="/owner-console" element={<Navigate to="/retail/console/manager" replace />} />
      <Route path="/merchant-console" element={<Navigate to="/retail/console/support" replace />} />
      <Route path="/foundretail/owner-console" element={<Navigate to="/retail/console/manager" replace />} />
    </>
  )
}
