/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ModuleHeader } from '@foundingos/ui/console'
import { brandConfig } from '../../brand-config'
import { fetchShipments, updateShipment, fetchDeliveryTasks, createDeliveryTask, updateDeliveryTask, fetchDrivers, type Shipment, type DeliveryTask, type Driver } from '../../lib/logistics-api'

export default function ShipmentDetailPage() {
  const params = useParams<{ shipmentId: string }>()
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [tasks, setTasks] = useState<DeliveryTask[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  const load = () => {
    setError('')
    Promise.all([fetchShipments(), fetchDeliveryTasks(params.shipmentId), fetchDrivers()]).then(([shipments, taskList, driverList]) => {
      if (shipments === null) { setError('Could not load this shipment right now.'); setLoading(false); return }
      setShipment(shipments.find((candidate) => candidate.id === params.shipmentId) ?? null)
      setTasks(taskList ?? [])
      setDrivers(driverList ?? [])
      setLoading(false)
    })
  }

  useEffect(load, [params.shipmentId])

  async function assignDriver(driverId: string) {
    if (!shipment) return
    const updated = await updateShipment(shipment.id, { driverId, status: 'assigned' })
    if (!updated) { setFeedback('Could not assign a driver — please retry.'); return }
    setFeedback('✓ Driver assigned.')
    load()
  }

  async function transition(status: string) {
    if (!shipment) return
    const updated = await updateShipment(shipment.id, { status })
    if (!updated) { setFeedback('Could not update shipment status — please retry.'); return }
    setFeedback(`✓ Shipment marked ${status}.`)
    load()
  }

  async function addTask() {
    if (!shipment) return
    const created = await createDeliveryTask({ shipmentId: shipment.id, driverId: shipment.driverId, status: 'pending' })
    if (!created) { setFeedback('Could not create a delivery task — please retry.'); return }
    setFeedback('✓ Delivery task created.')
    load()
  }

  async function completeTask(taskId: string) {
    const updated = await updateDeliveryTask(taskId, { status: 'completed', completedAt: new Date().toISOString() })
    if (!updated) { setFeedback('Could not complete this task — please retry.'); return }
    setFeedback('✓ Delivery task completed.')
    load()
  }

  return (
    <div className="module-page">
      <ModuleHeader
        config={brandConfig}
        title="Shipment Detail"
        description="Assign a driver, track delivery tasks, and mark the shipment complete."
      />
      {loading ? <p>Loading shipment…</p> : null}
      {error ? <p className="module-error">{error}</p> : null}
      {feedback ? <p>{feedback}</p> : null}
      {!loading && !error && !shipment ? <p>Shipment not found.</p> : null}

      {shipment ? (
        <div className="module-row" style={{ borderColor: brandConfig.accent }}>
          <h2>Shipment {shipment.id.slice(0, 8)}</h2>
          <p>Order: {shipment.orderId}</p>
          <p>Status: {shipment.status}</p>
          <p>Driver: {shipment.driverId ?? 'unassigned'}</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <button onClick={() => transition('in_transit')}>Mark in transit</button>
            <button onClick={() => transition('delivered')}>Mark delivered</button>
            <button onClick={addTask}>Add delivery task</button>
          </div>
          <h3 style={{ marginTop: 16 }}>Assign driver</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {drivers.map((driver) => (
              <button key={driver.id} onClick={() => assignDriver(driver.id)}>{driver.name ?? driver.id.slice(0, 8)}</button>
            ))}
          </div>
          <h3 style={{ marginTop: 16 }}>Delivery tasks</h3>
          <div className="module-table">
            {tasks.map((task) => (
              <div key={task.id} className="module-row" style={{ borderColor: brandConfig.accent }}>
                <strong>{task.status}</strong>{task.eta ? ` · ETA ${new Date(task.eta).toLocaleString('en-GB')}` : ''}
                {task.status !== 'completed' ? (
                  <button style={{ marginLeft: 8 }} onClick={() => completeTask(task.id)}>Mark complete</button>
                ) : null}
              </div>
            ))}
            {tasks.length === 0 ? <p>No delivery tasks yet.</p> : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
