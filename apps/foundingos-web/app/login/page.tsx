/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { brands } from '@foundingos/config'
import { coreOperationsApiRoot, isAllowedReturnTo, TENANT_REFRESH_COOKIE, TENANT_SESSION_COOKIE } from '../../src/tenant-session'
import { AutoHandoff } from './auto-handoff'
import { LoginForm } from './login-form'

export const dynamic = 'force-dynamic'

// The single, real sign-in gate for FoundingOS accounts — apps/foundingos-console's own
// /login redirects here (with ?returnTo pointing back to its /session/handoff), and
// /invite/[token] links here once an invited teammate finishes setting a password.
//
// This is a server component specifically so it can check for an *already-valid* website
// session before ever showing the form: without this, a user who is already signed in on
// the website would still be asked to type their password again every time they reached the
// console via /login?returnTo=... — defeating the point of a unified session. If a live
// session exists and returnTo is present, this silently completes the handoff instead.
export default async function LoginPage({ searchParams }: { searchParams: { returnTo?: string } }) {
  const returnTo = searchParams.returnTo || ''
  const token = cookies().get(TENANT_SESSION_COOKIE)?.value
  const refreshToken = cookies().get(TENANT_REFRESH_COOKIE)?.value
  const apiRoot = coreOperationsApiRoot()

  if (token && refreshToken && apiRoot) {
    const valid = await fetch(`${apiRoot}/auth/me`, {
      headers: { authorization: 'Bearer ' + token },
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    }).then((response) => response.ok).catch(() => false)

    if (valid) {
      if (returnTo && isAllowedReturnTo(returnTo, brands.foundingos.consoleUrl)) {
        const url = `${returnTo}#token=${encodeURIComponent(token)}&refreshToken=${encodeURIComponent(refreshToken)}`
        return <AutoHandoff url={url} />
      }
      redirect('/workspace')
    }
  }

  return <LoginForm returnTo={returnTo} />
}
