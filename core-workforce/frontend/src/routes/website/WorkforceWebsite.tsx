/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Navigate, Route, Routes } from 'react-router-dom'
import { CoreWorkforceLogin } from '../../core_workforce-site/CoreWorkforceLogin'
import { CoreWorkforcePackageApplication, CoreWorkforcePackageDetails } from '../../core_workforce-site/CoreWorkforcePackageFlow'
import { CoreWorkforceSite } from '../../core_workforce-site/CoreWorkforceSite'

export function CoreWorkforceWebsite() {
  return (
    <Routes>
      <Route path="/" element={<CoreWorkforceSite />} />
      <Route path="/console" element={<Navigate to="/talent/console/manager" replace />} />
      <Route path="/console/login" element={<CoreWorkforceLogin />} />
      <Route path="/console/dashboard" element={<Navigate to="/talent/console/manager" replace />} />
      <Route path="/console/*" element={<Navigate to="/talent/console/manager" replace />} />
      <Route path="/core_workforce-site" element={<CoreWorkforceSite />} />
      <Route path="/core_workforce-site/packages/:planId" element={<CoreWorkforcePackageDetails />} />
      <Route path="/core_workforce-site/packages/:planId/apply" element={<CoreWorkforcePackageApplication />} />
      <Route path="/core_workforce" element={<CoreWorkforceSite />} />
      <Route path="/core_workforce/packages/:planId" element={<CoreWorkforcePackageDetails />} />
      <Route path="/core_workforce/packages/:planId/apply" element={<CoreWorkforcePackageApplication />} />
      <Route path="/talent/auth/login" element={<CoreWorkforceLogin />} />
      <Route path="/core_workforce-site/login" element={<Navigate to="/talent/auth/login" replace />} />
      <Route path="/core_workforce/login" element={<Navigate to="/talent/auth/login" replace />} />
    </Routes>
  )
}
