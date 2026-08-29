/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { ComponentType, ReactNode } from 'react'
import { Navigate, Route } from 'react-router-dom'
import { ProtectedRoute } from '../auth'
import { FoundCryptoMerchantConsole } from './FoundCryptoMerchantConsole'
import { FoundCryptoOwnerConsole } from './FoundCryptoOwnerConsole'

type Wrapper = ComponentType<{ children: ReactNode }>

export function FoundCryptoConsoleRoutes({ Wrapper }: { Wrapper: Wrapper }) {
  return (
    <>
      <Route
        path="/crypto/console/manager"
        element={
          <ProtectedRoute roles={['crypto_trader']}>
            <Wrapper>
              <FoundCryptoOwnerConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/crypto/console/dashboard"
        element={
          <ProtectedRoute roles={['crypto_trader']}>
            <Wrapper>
              <FoundCryptoOwnerConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/crypto/console/settings"
        element={
          <ProtectedRoute roles={['crypto_trader']}>
            <Wrapper>
              <FoundCryptoOwnerConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/crypto/console/trader"
        element={
          <ProtectedRoute roles={['crypto_trader']}>
            <Wrapper>
              <FoundCryptoMerchantConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/crypto/console/automation"
        element={
          <ProtectedRoute roles={['crypto_trader']}>
            <Wrapper>
              <FoundCryptoMerchantConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/foundcrypto/chart-intelligence-dashboard"
        element={<Navigate to="/crypto/console/trader" replace />}
      />
      <Route
        path="/foundcrypto/trigger-configuration-engine"
        element={<Navigate to="/crypto/console/trader" replace />}
      />
      <Route path="/foundcrypto/auto-execution-controls" element={<Navigate to="/crypto/console/trader" replace />} />
      <Route path="/foundcrypto/portfolio-intelligence-panel" element={<Navigate to="/crypto/console/trader" replace />} />
      <Route path="/foundcrypto/whatsapp-trading-automation" element={<Navigate to="/crypto/console/trader" replace />} />
      <Route path="/foundcrypto/trader-console" element={<Navigate to="/crypto/console/manager" replace />} />
      <Route path="/foundcrypto/dashboard" element={<Navigate to="/crypto/console/manager" replace />} />
      <Route path="/foundcrypto/merchant-console" element={<Navigate to="/crypto/console/trader" replace />} />
      <Route path="/foundcrypto/trader" element={<Navigate to="/crypto/console/trader" replace />} />
      <Route path="/foundcrypto/operator" element={<Navigate to="/crypto/console/automation" replace />} />
      <Route path="/owner-console" element={<Navigate to="/crypto/console/manager" replace />} />
      <Route path="/merchant-console" element={<Navigate to="/crypto/console/manager" replace />} />
      <Route path="/foundcrypto/owner-console" element={<Navigate to="/crypto/console/manager" replace />} />
    </>
  )
}
