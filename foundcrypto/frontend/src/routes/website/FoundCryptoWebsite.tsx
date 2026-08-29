/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Navigate, Route, Routes } from 'react-router-dom'
import { FoundCryptoLogin } from '../../foundcrypto-site/FoundCryptoLogin'
import { FoundCryptoPackageApplication, FoundCryptoPackageDetails } from '../../foundcrypto-site/FoundCryptoPackageFlow'
import { FoundCryptoSite } from '../../foundcrypto-site/FoundCryptoSite'

export function FoundCryptoWebsite() {
  return (
    <Routes>
      <Route path="/" element={<FoundCryptoSite />} />
      <Route path="/console" element={<Navigate to="/crypto/console/manager" replace />} />
      <Route path="/console/login" element={<FoundCryptoLogin />} />
      <Route path="/console/dashboard" element={<Navigate to="/crypto/console/manager" replace />} />
      <Route path="/console/*" element={<Navigate to="/crypto/console/manager" replace />} />
      <Route path="/foundcrypto" element={<FoundCryptoSite />} />
      <Route path="/foundcrypto/packages/:planId" element={<FoundCryptoPackageDetails />} />
      <Route path="/foundcrypto/packages/:planId/apply" element={<FoundCryptoPackageApplication />} />
      <Route path="/foundcrypto/packages/merchant" element={<Navigate to="/foundcrypto/packages/trader" replace />} />
      <Route path="/foundcrypto/packages/owner" element={<Navigate to="/foundcrypto/packages/operator" replace />} />
      <Route path="/crypto/auth/login" element={<FoundCryptoLogin />} />
      <Route path="/foundcrypto/login" element={<Navigate to="/crypto/auth/login" replace />} />
    </Routes>
  )
}
