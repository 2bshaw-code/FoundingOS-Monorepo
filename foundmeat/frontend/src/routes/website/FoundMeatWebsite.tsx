/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Navigate, Route, Routes } from 'react-router-dom'
import { FoundMeatLogin } from '../../foundmeat-site/FoundMeatLogin'
import { FoundMeatPackageApplication, FoundMeatPackageDetails } from '../../foundmeat-site/FoundMeatPackageFlow'
import { FoundMeatSite } from '../../foundmeat-site/FoundMeatSite'

export function FoundMeatWebsite() {
  return (
    <Routes>
      <Route path="/" element={<FoundMeatSite />} />
      <Route path="/console" element={<Navigate to="/meat/console/manager" replace />} />
      <Route path="/console/login" element={<FoundMeatLogin />} />
      <Route path="/console/dashboard" element={<Navigate to="/meat/console/manager" replace />} />
      <Route path="/console/*" element={<Navigate to="/meat/console/manager" replace />} />
      <Route path="/foundmeat-site" element={<FoundMeatSite />} />
      <Route path="/foundmeat-site/packages/:planId" element={<FoundMeatPackageDetails />} />
      <Route path="/foundmeat-site/packages/:planId/apply" element={<FoundMeatPackageApplication />} />
      <Route path="/foundmeat" element={<FoundMeatSite />} />
      <Route path="/foundmeat/packages/:planId" element={<FoundMeatPackageDetails />} />
      <Route path="/foundmeat/packages/:planId/apply" element={<FoundMeatPackageApplication />} />
      <Route path="/meat/auth/login" element={<FoundMeatLogin />} />
      <Route path="/foundmeat-site/login" element={<Navigate to="/meat/auth/login" replace />} />
      <Route path="/foundmeat/login" element={<Navigate to="/meat/auth/login" replace />} />
    </Routes>
  )
}
