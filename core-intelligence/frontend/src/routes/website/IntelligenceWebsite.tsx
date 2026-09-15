/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Navigate, Route, Routes } from 'react-router-dom'
import { IntelligenceLogin } from '../../core_intelligence-site/IntelligenceLogin'
import { IntelligencePackageApplication, IntelligencePackageDetails } from '../../core_intelligence-site/IntelligencePackageFlow'
import { IntelligenceSite } from '../../core_intelligence-site/IntelligenceSite'

export function IntelligenceWebsite() {
  return (
    <Routes>
      <Route path="/" element={<IntelligenceSite />} />
      <Route path="/console" element={<Navigate to="/it/console/manager" replace />} />
      <Route path="/console/login" element={<IntelligenceLogin />} />
      <Route path="/console/dashboard" element={<Navigate to="/it/console/manager" replace />} />
      <Route path="/console/*" element={<Navigate to="/it/console/manager" replace />} />
      <Route path="/core_intelligence-site" element={<IntelligenceSite />} />
      <Route path="/core_intelligence-site/packages/:planId" element={<IntelligencePackageDetails />} />
      <Route path="/core_intelligence-site/packages/:planId/apply" element={<IntelligencePackageApplication />} />
      <Route path="/core_intelligence" element={<IntelligenceSite />} />
      <Route path="/core_intelligence/packages/:planId" element={<IntelligencePackageDetails />} />
      <Route path="/core_intelligence/packages/:planId/apply" element={<IntelligencePackageApplication />} />
      <Route path="/it/auth/login" element={<IntelligenceLogin />} />
      <Route path="/core_intelligence-site/login" element={<Navigate to="/it/auth/login" replace />} />
      <Route path="/core_intelligence/login" element={<Navigate to="/it/auth/login" replace />} />
    </Routes>
  )
}
