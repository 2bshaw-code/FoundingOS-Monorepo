/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { redirect } from 'next/navigation'
import { brands } from '@foundingos/config'

// Force dynamic rendering so this always issues a real HTTP redirect (not just a
// client-hydration-driven one from a statically prerendered page).
export const dynamic = 'force-dynamic'

// Real single sign-in gate: this app has no login form of its own — it sends the visitor to
// the one real, working login at foundingos-web (apps/foundingos-web/app/login/page.tsx),
// with a returnTo that bounces them straight back here, already signed in, via
// /session/handoff. Previously this just redirected to the website's homepage, which had no
// way back into the console at all.
export default function Login() {
  const consoleUrl = brands.foundingos.consoleUrl.replace(/\/+$/, '')
  const returnTo = encodeURIComponent(`${consoleUrl}/session/handoff`)
  redirect(`${brands.foundingos.webUrl.replace(/\/+$/, '')}/login?returnTo=${returnTo}`)
}
