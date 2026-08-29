/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { ComponentType, ReactNode } from 'react'
import { Navigate, Route } from 'react-router-dom'
import { ProtectedRoute } from '../auth'
import { FoundTalentApplicantConsole } from './FoundTalentApplicantConsole'
import { FoundTalentRecruiterConsole } from './FoundTalentRecruiterConsole'
import { FoundTalentWorkforceConsole } from './FoundTalentWorkforceConsole'
import { FoundTalentOwnerConsole } from './FoundTalentOwnerConsole'

type Wrapper = ComponentType<{ children: ReactNode }>

export function FoundTalentConsoleRoutes({ Wrapper }: { Wrapper: Wrapper }) {
  return (
    <>
      <Route
        path="/talent/console/dashboard"
        element={
          <ProtectedRoute roles={['talent_manager']}>
            <Wrapper>
              <FoundTalentOwnerConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/talent/console/settings"
        element={
          <ProtectedRoute roles={['talent_manager']}>
            <Wrapper>
              <FoundTalentOwnerConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/talent/console/manager"
        element={
          <ProtectedRoute roles={['talent_manager']}>
            <Wrapper>
              <FoundTalentOwnerConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/talent/console/workforce"
        element={
          <ProtectedRoute roles={['workforce_intel']}>
            <Wrapper>
              <FoundTalentWorkforceConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/talent/console/recruiter"
        element={
          <ProtectedRoute roles={['recruiter']}>
            <Wrapper>
              <FoundTalentRecruiterConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/talent/console/applicant"
        element={
          <ProtectedRoute roles={['applicant']}>
            <Wrapper>
              <FoundTalentApplicantConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/talent/console/operations"
        element={
          <ProtectedRoute roles={['talent_manager', 'recruiter']}>
            <Wrapper>
              <FoundTalentRecruiterConsole />
            </Wrapper>
          </ProtectedRoute>
        }
      />
      <Route path="/foundtalent/talent-manager-console" element={<Navigate to="/talent/console/manager" replace />} />
      <Route path="/foundtalent/workforce-intelligence-console" element={<Navigate to="/talent/console/workforce" replace />} />
      <Route path="/foundtalent/recruiter-console/:merchantId" element={<Navigate to="/talent/console/recruiter" replace />} />
      <Route path="/foundtalent/applicant-console/:merchantId" element={<Navigate to="/talent/console/applicant" replace />} />
      <Route path="/foundtalent/owner" element={<Navigate to="/talent/console/manager" replace />} />
      <Route path="/foundtalent/console/:merchantId" element={<Navigate to="/talent/console/recruiter" replace />} />
    </>
  )
}
