/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { createAuthClient } from '@founder-os/auth/client'
import { AuthWrapper } from '@founder-os/auth/AuthWrapper'
import { AuthGuard } from '@founder-os/auth/AuthGuard'
import { ProtectedRoute as SharedProtectedRoute } from '@founder-os/auth/ProtectedRoute'
import { AuthLayout } from '@founder-os/ui/AuthLayout'
import { ErrorBoundary } from '@founder-os/ui/ErrorBoundary'
import { Fallback } from '@founder-os/ui/Fallback'
import { PageContainer } from '@founder-os/ui/PageContainer'
import { ProtectedLayout } from '@founder-os/ui/ProtectedLayout'
import { FounderOsLogo } from '@founder-os/ui/logo'
import { founderOsTheme } from '@founder-os/ui/theme'
import { LoginForm } from '@founder-os/ui'

const founderApiUrl = `${import.meta.env.VITE_FOUNDER_API_URL.replace(/\/+$/, '')}/api/v1`
const founderAuthUrl = `${founderApiUrl}/founder`
export const authClient = createAuthClient({ baseUrl: founderApiUrl, authBaseUrl: founderAuthUrl, storageKey: 'founder-os' })
const founderMasterRole = 'founder_master'
const allowedRoles = [founderMasterRole]

export function LoginPage() {
  const navigate = useNavigate()

  const finish = async (email: string, password: string) => {
    if (!email.trim() || !password.trim()) {
      throw new Error('Please enter both your email and password.')
    }

    await authClient.login(email, password)
    navigate('/console')
  }

  return (
    <ErrorBoundary fallback={<Fallback />}>
      <AuthWrapper>
        <AuthLayout logo={<FounderOsLogo className="founder-os-logo" />} theme={founderOsTheme}>
          <AuthGuard publicRoute>
            <SharedProtectedRoute publicRoute>
              <ProtectedLayout>
                <PageContainer>
                  <div className="mb-5 space-y-3">
                    <h2 className="text-2xl font-bold text-slate-900">FoundingOS unified sign in</h2>
                    <p className="text-sm text-slate-600">Sign in with your approved FoundingOS account.</p>
                    <p className="rounded-lg bg-sky-50 px-3 py-2 text-sm text-sky-900">
                      Demo founder access: <strong>bobby@founder.master</strong> / <strong>Password123!</strong>
                    </p>
                  </div>
                  <LoginForm
                    title="FoundingOS sign in"
                    onLogin={async (email, password) => finish(email, password)}
                    onPasskeyLogin={async (email) => finish(email, 'passkey')}
                  />
                </PageContainer>
              </ProtectedLayout>
            </SharedProtectedRoute>
          </AuthGuard>
        </AuthLayout>
      </AuthWrapper>
    </ErrorBoundary>
  )
}
export function ProtectedRoute({ children }: { children: ReactNode }) { const user = authClient.getUser(); const authenticated = Boolean(authClient.getAccessToken() && user && user.role === founderMasterRole); return <ErrorBoundary fallback={<Fallback />}><SharedProtectedRoute authenticated={authenticated} fallback={<Navigate to="/console" replace />}>{children}</SharedProtectedRoute></ErrorBoundary> }
export function LogoutButton() { const navigate = useNavigate(); return <button onClick={async () => { await authClient.logout(); navigate('/console') }}>Logout</button> }
export function AuthGate() {
  const location = useLocation()
  const user = authClient.getUser()
  const authenticated = Boolean(authClient.getAccessToken() && user && user.role === founderMasterRole)
  if (authenticated) return <Outlet />
  const next = `${location.pathname}${location.search}${location.hash}`
  return <Navigate to="/console" replace />
}
