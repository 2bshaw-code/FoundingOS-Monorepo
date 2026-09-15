/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { ComponentType, ReactNode } from 'react'
import { Navigate, Route } from 'react-router-dom'
import { ProtectedRoute } from '../auth'
import { CoreWorkforceApplicantConsole } from './CoreWorkforceApplicantConsole'
import { CoreWorkforceRecruiterConsole } from './CoreWorkforceRecruiterConsole'
import { CoreWorkforceWorkforceConsole } from './CoreWorkforceWorkforceConsole'
import { CoreWorkforceOwnerConsole } from './CoreWorkforceOwnerConsole'

type Wrapper = ComponentType<{ children: ReactNode }>

export function CoreWorkforceConsoleRoutes({ Wrapper }: { Wrapper: Wrapper }) {
  return (
    <>
      <Route
        path="/talent/console/dashboard"
        element={
          <ProtectedRoute roles={['talent_manager']}>
            <Wrapper>
              <CoreWorkforceOwnerConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/talent/console/settings"
        element={
          <ProtectedRoute roles={['talent_manager']}>
            <Wrapper>
              <CoreWorkforceOwnerConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/talent/console/manager"
        element={
          <ProtectedRoute roles={['talent_manager']}>
            <Wrapper>
              <CoreWorkforceOwnerConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/talent/console/workforce"
        element={
          <ProtectedRoute roles={['workforce_intel']}>
            <Wrapper>
              <CoreWorkforceWorkforceConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/talent/console/recruiter"
        element={
          <ProtectedRoute roles={['recruiter']}>
            <Wrapper>
              <CoreWorkforceRecruiterConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/talent/console/applicant"
        element={
          <ProtectedRoute roles={['applicant']}>
            <Wrapper>
              <CoreWorkforceApplicantConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/talent/console/operations"
        element={
          <ProtectedRoute roles={['talent_manager', 'recruiter']}>
            <Wrapper>
              <CoreWorkforceRecruiterConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route path="/core_workforce/talent-manager-console" element={<Navigate to="/talent/console/manager" replace />} />
      <Route path="/core_workforce/workforce-intelligence-console" element={<Navigate to="/talent/console/workforce" replace />} />
      <Route path="/core_workforce/recruiter-console/:merchantId" element={<Navigate to="/talent/console/recruiter" replace />} />
      <Route path="/core_workforce/applicant-console/:merchantId" element={<Navigate to="/talent/console/applicant" replace />} />
      <Route path="/core_workforce/owner" element={<Navigate to="/talent/console/manager" replace />} />
      <Route path="/core_workforce/console/:merchantId" element={<Navigate to="/talent/console/recruiter" replace />} />
    </>
  )
}
