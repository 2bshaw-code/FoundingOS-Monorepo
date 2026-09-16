/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import { ModuleHeader } from '@foundingos/ui/console'
import { brandConfig } from '../brand-config'
import { fetchDeliveryTasks, updateDeliveryTask, type DeliveryTask } from '../lib/logistics-api'

export default function DeliveryTaskListPage() {
  const [tasks, setTasks] = useState<DeliveryTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  const load = () => {
    setError('')
    fetchDeliveryTasks().then((data) => {
      if (data === null) { setError('Could not load delivery tasks right now.'); setLoading(false); return }
      setTasks(data)
      setLoading(false)
    })
  }

  useEffect(load, [])

  async function complete(taskId: string) {
    const updated = await updateDeliveryTask(taskId, { status: 'completed', completedAt: new Date().toISOString() })
    if (!updated) { setFeedback('Could not complete this task — please retry.'); return }
    setFeedback('✓ Delivery task completed.')
    load()
  }

  return (
    <div className="module-page">
      <ModuleHeader
        config={brandConfig}
        title="Delivery Tasks"
        description="Every delivery task across all shipments, driver-assigned or pending."
      />
      {loading ? <p>Loading delivery tasks…</p> : null}
      {error ? <p className="module-error">{error}</p> : null}
      {feedback ? <p>{feedback}</p> : null}
      {!loading && !error && tasks.length === 0 ? <p>No delivery tasks yet.</p> : null}
      <div className="module-table">
        {tasks.map((task) => (
          <div key={task.id} className="module-row" style={{ borderColor: brandConfig.accent }}>
            <strong>{task.status}</strong> · shipment {task.shipmentId.slice(0, 8)} · driver {task.driverId ? task.driverId.slice(0, 8) : 'unassigned'}
            {task.eta ? <div>ETA: {new Date(task.eta).toLocaleString('en-GB')}</div> : null}
            {task.status !== 'completed' ? (
              <button style={{ marginTop: 8 }} onClick={() => complete(task.id)}>Mark complete</button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
