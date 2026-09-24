/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { brands } from '@foundingos/config'
import { QuantumCard, QuantumHeader, qText } from '@foundingos/ui/quantum'
import { coreOperationsApiRoot, TENANT_SESSION_COOKIE } from '../../src/tenant-session'
import { SignOutButton } from './sign-out-button'

// Force dynamic rendering — this page reads the caller's session cookie on every request.
export const dynamic = 'force-dynamic'

type TenantUser = { id: string; email: string; role: string; tenantId: string | null; name?: string | null }

async function currentTenantUser(): Promise<TenantUser | null> {
  const token = cookies().get(TENANT_SESSION_COOKIE)?.value
  const apiRoot = coreOperationsApiRoot()
  if (!token || !apiRoot) return null
  try {
    const response = await fetch(`${apiRoot}/auth/me`, {
      headers: { authorization: `Bearer ${token}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    })
    if (!response.ok) return null
    const body = await response.json() as { success?: boolean; user?: TenantUser }
    return body.success && body.user ? body.user : null
  } catch {
    return null
  }
}

// Real, working landing page for a signed-in account — replaces the previous /login
// redirect to a non-existent /survey route. The console (apps/foundingos-console) now
// shares this session too: the link below goes through the console's own /login, which
// silently completes using this same session instead of asking for a password again (see
// apps/foundingos-web/app/login/page.tsx and apps/foundingos-console/app/session/handoff).
export default async function WorkspacePage() {
  const user = await currentTenantUser()
  if (!user) redirect('/login')

  return (
    <main className="q-shell q-login-shell">
      <QuantumHeader
        brand={brands.foundingos}
        eyebrow="Signed in"
        title={`Welcome back${user.name ? `, ${user.name}` : ''}`}
        description={`Signed in as ${user.email} (${user.role.replaceAll('_', ' ')}).`}
      />
      <QuantumCard brand={brands.foundingos}>
        <p className={qText.body}>
          Your FoundingOS account is active. Open your console to work in Core.Operations, Core.Workforce, and
          Core.Intelligence, or continue on the mobile app.
        </p>
        <p className={qText.caption}>
          You will not be asked to sign in again — the console recognizes this same account.
        </p>
        <div className="q-form-stack">
          <a className="q-button q-button-primary" href={`${brands.foundingos.consoleUrl}/login`}>
            Open FoundingOS console
          </a>
          <SignOutButton />
        </div>
      </QuantumCard>
    </main>
  )
}
