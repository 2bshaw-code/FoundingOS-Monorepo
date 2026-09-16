/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useEffect, useState } from 'react'
import { ModuleHeader } from '@foundingos/ui/console'
import { brandConfig } from '../brand-config'
import { fetchDrivers, createDriver, fetchLatestDriverLocations, fetchVehicles, createVehicle, type Driver, type Vehicle, type DriverLocation } from '../lib/logistics-api'

export default function DriverDashboardPage() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [locations, setLocations] = useState<DriverLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [driverUserId, setDriverUserId] = useState('')
  const [vehicleName, setVehicleName] = useState('')
  const [vehiclePlate, setVehiclePlate] = useState('')

  const load = () => {
    setError('')
    Promise.all([fetchDrivers(), fetchVehicles(), fetchLatestDriverLocations()]).then(([driverList, vehicleList, locationList]) => {
      if (driverList === null) { setError('Could not load drivers right now.'); setLoading(false); return }
      setDrivers(driverList)
      setVehicles(vehicleList ?? [])
      setLocations(locationList ?? [])
      setLoading(false)
    })
  }

  useEffect(load, [])

  async function addDriver() {
    if (!driverUserId) return
    const created = await createDriver({ userId: driverUserId })
    if (!created) { setFeedback('Could not add this driver — please retry.'); return }
    setFeedback('✓ Driver added.')
    setDriverUserId('')
    load()
  }

  async function addVehicle() {
    if (!vehicleName || !vehiclePlate) return
    const created = await createVehicle({ name: vehicleName, plateNumber: vehiclePlate })
    if (!created) { setFeedback('Could not add this vehicle — please retry.'); return }
    setFeedback('✓ Vehicle added.')
    setVehicleName(''); setVehiclePlate('')
    load()
  }

  return (
    <div className="module-page">
      <ModuleHeader
        config={brandConfig}
        title="Driver Dashboard"
        description="Drivers, vehicles, and last-known live locations."
      />
      {loading ? <p>Loading drivers…</p> : null}
      {error ? <p className="module-error">{error}</p> : null}
      {feedback ? <p>{feedback}</p> : null}

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input value={driverUserId} onChange={(event) => setDriverUserId(event.target.value)} placeholder="User ID" />
        <button onClick={addDriver}>Add driver</button>
        <input value={vehicleName} onChange={(event) => setVehicleName(event.target.value)} placeholder="Vehicle name" />
        <input value={vehiclePlate} onChange={(event) => setVehiclePlate(event.target.value)} placeholder="Plate number" />
        <button onClick={addVehicle}>Add vehicle</button>
      </div>

      <h3>Drivers</h3>
      <div className="module-table">
        {drivers.map((driver) => {
          const location = locations.find((candidate) => candidate.driverId === driver.id)
          return (
            <div key={driver.id} className="module-row" style={{ borderColor: brandConfig.accent }}>
              <strong>{driver.name ?? driver.id.slice(0, 8)}</strong> · vehicle {driver.vehicleId ? driver.vehicleId.slice(0, 8) : 'none'}
              {location ? <div style={{ fontSize: 12, opacity: 0.7 }}>Last seen: {location.lat.toFixed(4)}, {location.lng.toFixed(4)} at {new Date(location.timestamp).toLocaleString('en-GB')}</div> : <div style={{ fontSize: 12, opacity: 0.7 }}>No location yet.</div>}
            </div>
          )
        })}
        {drivers.length === 0 ? <p>No drivers yet.</p> : null}
      </div>

      <h3 style={{ marginTop: 24 }}>Vehicles</h3>
      <div className="module-table">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="module-row" style={{ borderColor: brandConfig.accent }}>
            <strong>{vehicle.name}</strong> · {vehicle.plateNumber}
          </div>
        ))}
        {vehicles.length === 0 ? <p>No vehicles yet.</p> : null}
      </div>
    </div>
  )
}
