/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Navigate, Route, Routes } from 'react-router-dom'
import { FoundRetailLogin } from '../../foundretail-site/FoundRetailLogin'
import { FoundRetailPackageApplication, FoundRetailPackageDetails } from '../../foundretail-site/FoundRetailPackageFlow'
import { FoundRetailSite } from '../../foundretail-site/FoundRetailSite'

export function FoundRetailWebsite() {
  return (
    <Routes>
      <Route path="/" element={<FoundRetailSite />} />
      <Route path="/console" element={<Navigate to="/retail/console/manager" replace />} />
      <Route path="/console/login" element={<FoundRetailLogin />} />
      <Route path="/console/dashboard" element={<Navigate to="/retail/console/manager" replace />} />
      <Route path="/console/*" element={<Navigate to="/retail/console/manager" replace />} />
      <Route path="/foundretail-site" element={<FoundRetailSite />} />
      <Route path="/foundretail-site/packages/:planId" element={<FoundRetailPackageDetails />} />
      <Route path="/foundretail-site/packages/:planId/apply" element={<FoundRetailPackageApplication />} />
      <Route path="/foundretail" element={<FoundRetailSite />} />
      <Route path="/foundretail/packages/:planId" element={<FoundRetailPackageDetails />} />
      <Route path="/foundretail/packages/:planId/apply" element={<FoundRetailPackageApplication />} />
      <Route path="/foundretail/packages/merchant" element={<Navigate to="/foundretail/packages/staff" replace />} />
      <Route path="/foundretail/packages/owner" element={<Navigate to="/foundretail/packages/manager" replace />} />
      <Route path="/foundretail/packages/staff" element={<FoundRetailPackageDetails />} />
      <Route path="/foundretail/packages/manager" element={<FoundRetailPackageDetails />} />
      <Route path="/retail/auth/login" element={<FoundRetailLogin />} />
      <Route path="/foundretail-site/login" element={<Navigate to="/retail/auth/login" replace />} />
      <Route path="/foundretail/login" element={<Navigate to="/retail/auth/login" replace />} />
    </Routes>
  )
}
