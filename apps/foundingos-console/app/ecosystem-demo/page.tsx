/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_COOKIE, verifyToken } from '../tester/session'
import { EcosystemDemoEngine } from './EcosystemDemoEngine'

// Admin-only — this is a promo-recording tool, not a tester-facing surface. Properly gated
// (matches /founder/manual's pattern), unlike the /founder page's pre-existing gap fixed
// earlier this session.
export default async function EcosystemDemoPage() {
  const adminToken = cookies().get(ADMIN_COOKIE)?.value
  const adminId = adminToken ? await verifyToken('admin', adminToken) : null
  if (adminId !== 'super-founder-admin') redirect('/tester/login')

  return <EcosystemDemoEngine />
}
