/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import { ModuleHeader } from '@foundingos/ui/console'
import { brandConfig } from '../brand-config'
import { fetchApplicants, moveApplicantStage, type Applicant } from '../lib/workforce-api'

const STAGES = ['applied', 'screening', 'interview', 'offer', 'hired']

export default function ApplicantPipelinePage() {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  const load = () => {
    setError('')
    fetchApplicants().then((data) => {
      if (data === null) { setError('Could not load applicants right now.'); setLoading(false); return }
      setApplicants(data)
      setLoading(false)
    })
  }

  useEffect(load, [])

  async function advance(applicant: Applicant) {
    const nextStage = STAGES[Math.min(STAGES.indexOf(applicant.stage) + 1, STAGES.length - 1)]
    const updated = await moveApplicantStage(applicant.id, nextStage)
    if (!updated) { setFeedback('Could not move this applicant — please retry.'); return }
    setFeedback(`✓ Moved to ${nextStage}.`)
    load()
  }

  return (
    <div className="module-page">
      <ModuleHeader
        config={brandConfig}
        title="Applicant Pipeline"
        description="Applicants moving through applied → screening → interview → offer → hired."
      />
      {loading ? <p>Loading applicants…</p> : null}
      {error ? <p className="module-error">{error}</p> : null}
      {feedback ? <p>{feedback}</p> : null}
      {!loading && !error && applicants.length === 0 ? <p>No applicants yet.</p> : null}
      <div className="module-table">
        {applicants.map((applicant) => (
          <div key={applicant.id} className="module-row" style={{ borderColor: brandConfig.accent }}>
            <strong>{applicant.name}</strong> · {applicant.stage}
            {applicant.stage !== 'hired' ? (
              <button style={{ marginLeft: 8 }} onClick={() => advance(applicant)}>Advance stage</button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
