/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { ComponentType, ReactNode } from 'react'
import { Navigate, Route } from 'react-router-dom'
import { ProtectedRoute } from '../auth'
import { FoundMeatMerchantConsole } from './FoundMeatMerchantConsole'
import { FoundMeatOwnerConsole } from './FoundMeatOwnerConsole'

type Wrapper = ComponentType<{ children: ReactNode }>

export function FoundMeatConsoleRoutes({ Wrapper }: { Wrapper: Wrapper }) {
  return (
    <>
      <Route
        path="/meat/console/manager"
        element={
          <ProtectedRoute roles={['meat_supplier']}>
            <Wrapper>
              <FoundMeatOwnerConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/meat/console/dashboard"
        element={
          <ProtectedRoute roles={['meat_supplier']}>
            <Wrapper>
              <FoundMeatOwnerConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/meat/console/settings"
        element={
          <ProtectedRoute roles={['meat_supplier']}>
            <Wrapper>
              <FoundMeatOwnerConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/meat/console/supplier"
        element={
          <ProtectedRoute roles={['meat_supplier']}>
            <Wrapper>
              <FoundMeatOwnerConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/meat/console/buyer"
        element={
          <ProtectedRoute roles={['meat_buyer']}>
            <FoundMeatMerchantConsole />
          </ProtectedRoute>
        }
      />
      <Route
        path="/meat/console/logistics"
        element={
          <ProtectedRoute roles={['meat_supplier', 'meat_buyer']}>
            <FoundMeatMerchantConsole />
          </ProtectedRoute>
        }
      />
      <Route path="/foundmeat/supplier-console" element={<Navigate to="/meat/console/supplier" replace />} />
      <Route path="/foundmeat/buyer-console/:merchantId" element={<Navigate to="/meat/console/buyer" replace />} />
      <Route path="/foundmeat/owner" element={<Navigate to="/meat/console/manager" replace />} />
      <Route path="/foundmeat/console/:merchantId" element={<Navigate to="/meat/console/buyer" replace />} />
    </>
  )
}
