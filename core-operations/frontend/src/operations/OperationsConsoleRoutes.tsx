/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { ComponentType, ReactNode } from 'react'
import { Navigate, Route } from 'react-router-dom'
import { ProtectedRoute } from '../auth'
import { CoreOperationsMerchantConsole } from './CoreOperationsMerchantConsole'
import { CoreOperationsOwnerConsole } from './CoreOperationsOwnerConsole'

type Wrapper = ComponentType<{ children: ReactNode }>

export function CoreOperationsConsoleRoutes({ Wrapper }: { Wrapper: Wrapper }) {
  return (
    <>
      <Route
        path="/retail/console/manager"
        element={
          <ProtectedRoute roles={['retail_manager']}>
            <Wrapper>
              <CoreOperationsOwnerConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/retail/console/dashboard"
        element={
          <ProtectedRoute roles={['retail_manager']}>
            <Wrapper>
              <CoreOperationsOwnerConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/retail/console/settings"
        element={
          <ProtectedRoute roles={['retail_manager']}>
            <Wrapper>
              <CoreOperationsOwnerConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/retail/console/support"
        element={
          <ProtectedRoute roles={['retail_manager', 'retail_staff']}>
            <CoreOperationsMerchantConsole />
          </ProtectedRoute>
        }
      />
      <Route
        path="/retail/console/analytics"
        element={
          <ProtectedRoute roles={['retail_manager', 'retail_staff']}>
            <Wrapper>
              <CoreOperationsOwnerConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route path="/core_operations/retail-manager-console" element={<Navigate to="/retail/console/manager" replace />} />
      <Route path="/core_operations/staff-console" element={<Navigate to="/retail/console/support" replace />} />
      <Route path="/core_operations/dashboard" element={<Navigate to="/retail/console/manager" replace />} />
      <Route path="/core_operations/merchant-console" element={<Navigate to="/retail/console/support" replace />} />
      <Route path="/core_operations/staff" element={<Navigate to="/retail/console/support" replace />} />
      <Route path="/core_operations/manager" element={<Navigate to="/retail/console/manager" replace />} />
      <Route path="/owner-console" element={<Navigate to="/retail/console/manager" replace />} />
      <Route path="/merchant-console" element={<Navigate to="/retail/console/support" replace />} />
      <Route path="/core_operations/owner-console" element={<Navigate to="/retail/console/manager" replace />} />
    </>
  )
}
