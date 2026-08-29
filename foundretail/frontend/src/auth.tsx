/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { authClient, submitPendingApplication } from '@foundretail/auth'
export { authClient, submitPendingApplication }
import { AuthLayout } from '@founder-os/ui/AuthLayout'
import { ErrorBoundary } from '@founder-os/ui/ErrorBoundary'
import { Fallback } from '@founder-os/ui/Fallback'
import { PageContainer } from '@founder-os/ui/PageContainer'
import { LoginForm, FoundRetailLogo } from '@founder-os/ui'

const founderRoles = ['founder_master']
const allowedRoles = ['retail_manager', 'retail_staff']
const loginPath = '/console/login'
export function consolePathForUser(user: { id: string; role: string; tenantId?: string | null }) {
	if (founderRoles.includes(user.role)) return loginPath
	switch (user.role) {
		case 'retail_manager':
			return '/console/dashboard'
		case 'retail_staff':
			return '/console/dashboard'
		default:
			return loginPath
	}
}
export function LoginPage() { const navigate = useNavigate(); const [searchParams] = useSearchParams(); const finish = async (result: Awaited<ReturnType<typeof authClient.login>>) => { await submitPendingApplication(result.accessToken); const next = searchParams.get('next'); const target = next?.startsWith('/console/') ? next : consolePathForUser(result.user); navigate(target) }; return <ErrorBoundary fallback={<Fallback/>}><AuthLayout brandName="FoundRetail" logo={<FoundRetailLogo/>}><PageContainer><LoginForm title="FoundRetail sign in" onLogin={async (email, password) => finish(await authClient.login(email, password))} onPasskeyLogin={async (email) => finish(await authClient.loginWithPasskey(email))} /></PageContainer></AuthLayout></ErrorBoundary> }
export function AuthGate() {
  const location = useLocation()
  const user = authClient.getUser()
  const hasSession = Boolean(authClient.getAccessToken() && user)
  if (hasSession) return <Outlet />
  const next = `${location.pathname}${location.search}${location.hash}`
  return <Navigate to={`${loginPath}?next=${encodeURIComponent(next)}`} replace />
}
export function ProtectedRoute({ children, roles = allowedRoles }: { children: ReactNode; roles?: string[] }) { const user = authClient.getUser(); const hasSession = Boolean(authClient.getAccessToken() && user); const authenticated = Boolean(hasSession && user && roles.includes(user.role)); const fallbackPath = hasSession && user && allowedRoles.includes(user.role) ? consolePathForUser(user) : loginPath; if (!authenticated) return <Navigate to={fallbackPath} replace />; return <>{children}</> }
export function LogoutButton() { const navigate = useNavigate(); return <button onClick={async () => { await authClient.logout(); navigate(loginPath) }}>Logout</button> }
