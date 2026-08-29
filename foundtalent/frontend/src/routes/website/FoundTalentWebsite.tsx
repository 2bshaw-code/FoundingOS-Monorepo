/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Navigate, Route, Routes } from 'react-router-dom'
import { FoundTalentLogin } from '../../foundtalent-site/FoundTalentLogin'
import { FoundTalentPackageApplication, FoundTalentPackageDetails } from '../../foundtalent-site/FoundTalentPackageFlow'
import { FoundTalentSite } from '../../foundtalent-site/FoundTalentSite'

export function FoundTalentWebsite() {
  return (
    <Routes>
      <Route path="/" element={<FoundTalentSite />} />
      <Route path="/console" element={<Navigate to="/talent/console/manager" replace />} />
      <Route path="/console/login" element={<FoundTalentLogin />} />
      <Route path="/console/dashboard" element={<Navigate to="/talent/console/manager" replace />} />
      <Route path="/console/*" element={<Navigate to="/talent/console/manager" replace />} />
      <Route path="/foundtalent-site" element={<FoundTalentSite />} />
      <Route path="/foundtalent-site/packages/:planId" element={<FoundTalentPackageDetails />} />
      <Route path="/foundtalent-site/packages/:planId/apply" element={<FoundTalentPackageApplication />} />
      <Route path="/foundtalent" element={<FoundTalentSite />} />
      <Route path="/foundtalent/packages/:planId" element={<FoundTalentPackageDetails />} />
      <Route path="/foundtalent/packages/:planId/apply" element={<FoundTalentPackageApplication />} />
      <Route path="/talent/auth/login" element={<FoundTalentLogin />} />
      <Route path="/foundtalent-site/login" element={<Navigate to="/talent/auth/login" replace />} />
      <Route path="/foundtalent/login" element={<Navigate to="/talent/auth/login" replace />} />
    </Routes>
  )
}
