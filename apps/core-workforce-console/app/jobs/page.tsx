/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import { ModuleHeader } from '@foundingos/ui/console'
import { brandConfig } from '../brand-config'
import { fetchJobs, createJob, type Job } from '../lib/workforce-api'

export default function JobBoardPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [title, setTitle] = useState('')
  const [department, setDepartment] = useState('')

  const load = () => {
    setError('')
    fetchJobs().then((data) => {
      if (data === null) { setError('Could not load jobs right now.'); setLoading(false); return }
      setJobs(data)
      setLoading(false)
    })
  }

  useEffect(load, [])

  async function postJob() {
    if (!title) { setFeedback('Enter a job title.'); return }
    const created = await createJob({ title, department, status: 'open' })
    if (!created) { setFeedback('Could not post this job — please retry.'); return }
    setFeedback('✓ Job posted.')
    setTitle(''); setDepartment('')
    load()
  }

  return (
    <div className="module-page">
      <ModuleHeader
        config={brandConfig}
        title="Job Board"
        description="Post open roles and track them through to hire."
      />
      {feedback ? <p>{feedback}</p> : null}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Job title" />
        <input value={department} onChange={(event) => setDepartment(event.target.value)} placeholder="Department" />
        <button onClick={postJob}>Post job</button>
      </div>

      {loading ? <p>Loading jobs…</p> : null}
      {error ? <p className="module-error">{error}</p> : null}
      {!loading && !error && jobs.length === 0 ? <p>No jobs posted yet.</p> : null}
      <div className="module-table">
        {jobs.map((job) => (
          <div key={job.id} className="module-row" style={{ borderColor: brandConfig.accent }}>
            <strong>{job.title}</strong>{job.department ? ` · ${job.department}` : ''}
            <div>{job.status}</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>{new Date(job.createdAt).toLocaleString('en-GB')}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
