/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Navigate, Route, Routes } from 'react-router-dom'
import { CoreOperationsLogin } from '../../core_operations-site/CoreOperationsLogin'
import { CoreOperationsPackageApplication, CoreOperationsPackageDetails } from '../../core_operations-site/CoreOperationsPackageFlow'
import { CoreOperationsSite } from '../../core_operations-site/CoreOperationsSite'

export function CoreOperationsWebsite() {
  return (
    <Routes>
      <Route path="/" element={<CoreOperationsSite />} />
      <Route path="/console" element={<Navigate to="/retail/console/manager" replace />} />
      <Route path="/console/login" element={<CoreOperationsLogin />} />
      <Route path="/console/dashboard" element={<Navigate to="/retail/console/manager" replace />} />
      <Route path="/console/*" element={<Navigate to="/retail/console/manager" replace />} />
      <Route path="/core_operations-site" element={<CoreOperationsSite />} />
      <Route path="/core_operations-site/packages/:planId" element={<CoreOperationsPackageDetails />} />
      <Route path="/core_operations-site/packages/:planId/apply" element={<CoreOperationsPackageApplication />} />
      <Route path="/core_operations" element={<CoreOperationsSite />} />
      <Route path="/core_operations/packages/:planId" element={<CoreOperationsPackageDetails />} />
      <Route path="/core_operations/packages/:planId/apply" element={<CoreOperationsPackageApplication />} />
      <Route path="/core_operations/packages/merchant" element={<Navigate to="/core_operations/packages/staff" replace />} />
      <Route path="/core_operations/packages/owner" element={<Navigate to="/core_operations/packages/manager" replace />} />
      <Route path="/core_operations/packages/staff" element={<CoreOperationsPackageDetails />} />
      <Route path="/core_operations/packages/manager" element={<CoreOperationsPackageDetails />} />
      <Route path="/retail/auth/login" element={<CoreOperationsLogin />} />
      <Route path="/core_operations-site/login" element={<Navigate to="/retail/auth/login" replace />} />
      <Route path="/core_operations/login" element={<Navigate to="/retail/auth/login" replace />} />
    </Routes>
  )
}
