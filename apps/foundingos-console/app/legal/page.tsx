/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE, verifyToken } from '../tester/session'
import { getTester } from '../tester/store.server'
import { categorizeCredential } from '../tester/tester-data'
import { listLegalAcceptances } from '../tester/legal-acceptance-store.server'
import { LEGAL_DOCUMENTS, LEGAL_CONTENT_VERSION } from '../tester/legal-content'

// Real, read-only Legal Reviewer view — the real agreement text plus the real,
// immutable acceptance log, gated to sessions whose credential category is genuinely
// 'lawyer' (LAW-REVIEW). No write actions.
export default async function LegalPage() {
  const token = cookies().get(SESSION_COOKIE)?.value
  const testerId = token ? await verifyToken('tester', token) : null
  if (!testerId) redirect('/tester/login')

  const tester = await getTester(testerId)
  if (!tester || categorizeCredential(testerId) !== 'lawyer') redirect('/tester/login')

  const acceptances = await listLegalAcceptances()

  return (
    <section className="stack">
      <header className="module-header">
        <p>FoundingOS Legal Review</p>
        <h1>Welcome, {tester.email}</h1>
        <span>Current agreement version {LEGAL_CONTENT_VERSION} and the real, immutable acceptance log.</span>
      </header>

      <div className="console-grid">
        <article className="panel wide fo-card">
          <h2>Agreements (v{LEGAL_CONTENT_VERSION})</h2>
          {LEGAL_DOCUMENTS.map((doc) => (
            <details key={doc.id} className="tester-legal-doc">
              <summary>{doc.title}</summary>
              <p>{doc.body}</p>
            </details>
          ))}
        </article>

        <article className="panel wide fo-card">
          <h2>Acceptance log</h2>
          {acceptances.length === 0 ? (
            <p><small>No acceptance records yet (Demo Mode has no database configured, or nobody has signed in since this database was provisioned).</small></p>
          ) : (
            <table className="superdashboard-brand-table">
              <thead>
                <tr><th>Email</th><th>Version</th><th>Timestamp</th></tr>
              </thead>
              <tbody>
                {acceptances.map((entry, index) => (
                  <tr key={`${entry.email}-${entry.timestamp.toISOString()}-${index}`}>
                    <td>{entry.email}</td>
                    <td>{entry.version}</td>
                    <td>{entry.timestamp.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </article>
      </div>
    </section>
  )
}
