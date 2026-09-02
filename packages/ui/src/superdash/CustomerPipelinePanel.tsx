/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Honest "customer pipeline" view — server component (no client fetch needed, data is
// already computed server-side by customer-pipeline-store.server.ts and passed in as
// props). Read-only: no outbound communication, no editing, no export — a segmentation/
// lead-scoring VIEW over real SurveyEntry rows already in the database, clearly labeled as
// synthetic/demo data throughout. Types are defined locally (not imported from the
// foundingos-console app) to keep this shared package decoupled from any one app.
export type PipelineStage = 'new' | 'engaged' | 'qualified' | 'opportunity'

export type PipelineContact = {
  contactId: string
  brand: string
  categories: string[]
  submissionCount: number
  firstSeen: string
  lastSeen: string
  leadScore: number
  stage: PipelineStage
}

const STAGE_LABELS: Record<PipelineStage, string> = {
  new: 'New',
  engaged: 'Engaged',
  qualified: 'Qualified',
  opportunity: 'Opportunity',
}

export function CustomerPipelinePanel({
  contacts,
  stageCounts,
  brandCounts,
  totalContacts,
  totalSubmissions,
}: {
  contacts: PipelineContact[]
  stageCounts: Record<PipelineStage, number>
  brandCounts: Record<string, number>
  totalContacts: number
  totalSubmissions: number
}) {
  return (
    <div className="stack">
      <article className="panel wide fo-card">
        <h2>Customer pipeline — built from real survey submissions</h2>
        <p><small>
          Every contact below is a real distinct tester/session id that has submitted at least one real survey
          response — grouped and scored using a simple, transparent formula (submission count + category spread).
          This is synthetic/demo segmentation over real database rows, not real external customer data. Read-only:
          no editing, no export, and NOTHING here triggers any outbound communication to anyone.
        </small></p>
      </article>

      <article className="panel wide fo-card">
        <h2>Pipeline overview</h2>
        <div className="kpi-grid">
          <article className="dashboard-card fo-card good"><span>◎</span><strong>{totalContacts}</strong><small>Total contacts</small></article>
          <article className="dashboard-card fo-card good"><span>◌</span><strong>{totalSubmissions}</strong><small>Total submissions</small></article>
          <article className="dashboard-card fo-card good"><span>◆</span><strong>{stageCounts.opportunity}</strong><small>Opportunities</small></article>
          <article className="dashboard-card fo-card good"><span>▣</span><strong>{stageCounts.qualified}</strong><small>Qualified</small></article>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          {Object.entries(brandCounts).map(([brand, count]) => (
            <small key={brand} className="found-ai-chip">{brand}: {count}</small>
          ))}
        </div>
      </article>

      <article className="panel wide fo-card">
        <h2>Contacts by lead score</h2>
        {contacts.length === 0 ? (
          <p><small>No survey submissions yet — the pipeline populates as brand websites' surveys receive real responses.</small></p>
        ) : (
          <table className="superdashboard-brand-table">
            <thead>
              <tr><th>Contact</th><th>Brand</th><th>Stage</th><th>Lead score</th><th>Submissions</th><th>Categories touched</th><th>Last seen</th></tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.contactId}>
                  <td>{contact.contactId}</td>
                  <td>{contact.brand}</td>
                  <td>{STAGE_LABELS[contact.stage]}</td>
                  <td>{contact.leadScore}</td>
                  <td>{contact.submissionCount}</td>
                  <td>{contact.categories.join(', ')}</td>
                  <td>{new Date(contact.lastSeen).toLocaleString('en-GB', { timeZone: 'UTC' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </article>
    </div>
  )
}

export default CustomerPipelinePanel
