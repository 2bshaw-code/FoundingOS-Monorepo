/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Navigate, Route, Routes } from 'react-router-dom'
import { FoundThisLogin } from '../../foundit-site/FoundThisLogin'
import { FoundThisPackageApplication, FoundThisPackageDetails } from '../../foundit-site/FoundThisPackageFlow'
import { FoundThisSite } from '../../foundit-site/FoundThisSite'

export function FoundThisWebsite() {
  return (
    <Routes>
      <Route path="/" element={<FoundThisSite />} />
      <Route path="/console" element={<Navigate to="/it/console/manager" replace />} />
      <Route path="/console/login" element={<FoundThisLogin />} />
      <Route path="/console/dashboard" element={<Navigate to="/it/console/manager" replace />} />
      <Route path="/console/*" element={<Navigate to="/it/console/manager" replace />} />
      <Route path="/foundit-site" element={<FoundThisSite />} />
      <Route path="/foundit-site/packages/:planId" element={<FoundThisPackageDetails />} />
      <Route path="/foundit-site/packages/:planId/apply" element={<FoundThisPackageApplication />} />
      <Route path="/foundit" element={<FoundThisSite />} />
      <Route path="/foundit/packages/:planId" element={<FoundThisPackageDetails />} />
      <Route path="/foundit/packages/:planId/apply" element={<FoundThisPackageApplication />} />
      <Route path="/it/auth/login" element={<FoundThisLogin />} />
      <Route path="/foundit-site/login" element={<Navigate to="/it/auth/login" replace />} />
      <Route path="/foundit/login" element={<Navigate to="/it/auth/login" replace />} />
    </Routes>
  )
}
