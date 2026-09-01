/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { FoundingOSFooter } from '@foundingos/ui/footer'
import '@foundingos/ui/styles.css'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// Shared FoundingOS session — same cookie names/secret/verification as
// foundingos-console/app/tester/session.ts, duplicated here (pure Web Crypto, works in
// this Server Component's Node.js runtime) so this app can recognize the one real session
// set on the shared .foundingos.com cookie domain, without any new files (no middleware.ts
// exists in this app, so the root layout is the real gate for every page it renders).
const SESSION_COOKIE = 'fo_tester_session'
const ADMIN_COOKIE = 'fo_tester_admin_session'
const SESSION_SECRET = process.env.TESTER_SESSION_SECRET ?? 'founderos-tester-program-dev-secret'
const encoder = new TextEncoder()
const decoder = new TextDecoder()

function fromBase64Url(value: string): Uint8Array {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function getKey() {
  return crypto.subtle.importKey('raw', encoder.encode(SESSION_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'])
}

async function verifyToken(scope: 'tester' | 'admin', token: string): Promise<string | null> {
  const [payloadPart, signaturePart] = token.split('.')
  if (!payloadPart || !signaturePart) return null
  let payload: string
  try {
    payload = decoder.decode(fromBase64Url(payloadPart))
  } catch {
    return null
  }
  const key = await getKey()
  const valid = await crypto.subtle.verify('HMAC', key, fromBase64Url(signaturePart) as BufferSource, encoder.encode(payload))
  if (!valid) return null
  const [tokenScope, id] = payload.split(':')
  if (tokenScope !== scope || !id) return null
  return id
}

const QUANTUM_LOGIN_URL = 'https://www.foundingos.com/'
const SURVEY_URL = 'https://console.foundingos.com/tester/survey'
const FREE_ROAM_IDS = new Set(['juliet', 'tester-10', 'survey-demo', 'investor-alpha', 'investor-omega', 'lawyer-review'])

async function enforceQuantumGate(): Promise<'admin' | 'free-roam'> {
  const jar = cookies()
  const adminToken = jar.get(ADMIN_COOKIE)?.value
  const adminId = adminToken ? await verifyToken('admin', adminToken) : null
  if (adminId) return 'admin' // Admin: unrestricted, full access.

  const sessionToken = jar.get(SESSION_COOKIE)?.value
  const testerId = sessionToken ? await verifyToken('tester', sessionToken) : null
  if (!testerId) redirect(QUANTUM_LOGIN_URL)
  if (!FREE_ROAM_IDS.has(testerId)) redirect(SURVEY_URL) // Tester/Survey: survey only, never this site.
  return 'free-roam' // Free Roam (+ investor/lawyer): read-only view — allowed to render.
}

// Small persistent session bar — logout + a way back to the FoundingOS Homepage, visible
// to whichever real session (admin/free roam) is allowed to see this page at all (testers
// are always redirected away before reaching here).
function SessionBar({ role }: { role: 'admin' | 'free-roam' }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'flex-end', padding: '8px 16px', fontSize: 12, opacity: 0.8 }}>
      <span>{role === 'admin' ? 'Admin session' : 'Free roam session (read-only)'}</span>
      <a href="https://www.foundingos.com/home">FoundingOS Homepage</a>
      <form action="https://console.foundingos.com/api/tester/logout" method="POST" style={{ display: 'inline' }}>
        <button type="submit" style={{ background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', cursor: 'pointer', padding: 0, font: 'inherit' }}>Log out</button>
      </form>
    </div>
  )
}

export const metadata = { title: 'FoundRetail', description: 'FoundRetail public website.' }

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const role = await enforceQuantumGate()
  return <html lang="en"><body><SessionBar role={role} />{children}<FoundingOSFooter /></body></html>
}
