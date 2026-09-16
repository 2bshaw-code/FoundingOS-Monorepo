/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import { ModuleHeader } from '@foundingos/ui/console'
import { brandConfig } from '../brand-config'
import { fetchWorkers, createWorker, type Worker } from '../lib/workforce-api'

export default function WorkerDirectoryPage() {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('')

  const load = () => {
    setError('')
    fetchWorkers().then((data) => {
      if (data === null) { setError('Could not load workers right now.'); setLoading(false); return }
      setWorkers(data)
      setLoading(false)
    })
  }

  useEffect(load, [])

  async function addWorker() {
    if (!name || !role) { setFeedback('Enter a name and role.'); return }
    const created = await createWorker({ name, role, employmentType: 'full_time' })
    if (!created) { setFeedback('Could not add this worker — please retry.'); return }
    setFeedback('✓ Worker added.')
    setName(''); setRole('')
    load()
  }

  return (
    <div className="module-page">
      <ModuleHeader
        config={brandConfig}
        title="Worker Directory"
        description="Every active worker, their role, and employment type."
      />
      {feedback ? <p>{feedback}</p> : null}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" />
        <input value={role} onChange={(event) => setRole(event.target.value)} placeholder="Role" />
        <button onClick={addWorker}>Add worker</button>
      </div>

      {loading ? <p>Loading workers…</p> : null}
      {error ? <p className="module-error">{error}</p> : null}
      {!loading && !error && workers.length === 0 ? <p>No workers yet.</p> : null}
      <div className="module-table">
        {workers.map((worker) => (
          <div key={worker.id} className="module-row" style={{ borderColor: brandConfig.accent }}>
            <strong>{worker.name}</strong> · {worker.role} · {worker.employmentType}{worker.region ? ` · ${worker.region}` : ''}
          </div>
        ))}
      </div>
    </div>
  )
}
