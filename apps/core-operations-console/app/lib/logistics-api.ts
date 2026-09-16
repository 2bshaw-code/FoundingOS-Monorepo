import { coreApiFetch } from './retail-api'

// Logistics Console spec models: Shipment, DeliveryTask, Route, Driver, Vehicle, LocationHistory.
export type Shipment = { id: string; orderId: string; driverId?: string | null; routeId?: string | null; status: string; createdAt: string; updatedAt: string }
export type DeliveryTask = { id: string; shipmentId: string; driverId?: string | null; status: string; eta?: string | null; startedAt?: string | null; completedAt?: string | null }
export type LogisticsRoute = { id: string; waypoints: unknown; distanceKm?: number | null; durationMin?: number | null }
export type Driver = { id: string; userId: string; vehicleId?: string | null; name?: string | null; phone?: string | null }
export type Vehicle = { id: string; name: string; plateNumber: string }
export type DriverLocation = { driverId: string; lat: number; lng: number; timestamp: string }

export const fetchShipments = () => coreApiFetch<Shipment[]>('/logistics/shipments')
export const createShipment = (payload: Record<string, unknown>) =>
  coreApiFetch<Shipment>('/logistics/shipments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
export const updateShipment = (id: string, payload: Record<string, unknown>) =>
  coreApiFetch<Shipment>(`/logistics/shipments/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })

export const fetchDeliveryTasks = (shipmentId?: string) =>
  coreApiFetch<DeliveryTask[]>(`/logistics/tasks${shipmentId ? `?shipmentId=${shipmentId}` : ''}`)
export const createDeliveryTask = (payload: Record<string, unknown>) =>
  coreApiFetch<DeliveryTask>('/logistics/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
export const updateDeliveryTask = (id: string, payload: Record<string, unknown>) =>
  coreApiFetch<DeliveryTask>(`/logistics/tasks/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })

export const fetchRoutes = () => coreApiFetch<LogisticsRoute[]>('/logistics/routes')
export const createRoute = (payload: Record<string, unknown>) =>
  coreApiFetch<LogisticsRoute>('/logistics/routes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })

export const fetchDrivers = () => coreApiFetch<Driver[]>('/logistics/drivers')
export const createDriver = (payload: Record<string, unknown>) =>
  coreApiFetch<Driver>('/logistics/drivers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
export const updateDriver = (id: string, payload: Record<string, unknown>) =>
  coreApiFetch<Driver>(`/logistics/drivers/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })

export const fetchVehicles = () => coreApiFetch<Vehicle[]>('/logistics/vehicles')
export const createVehicle = (payload: Record<string, unknown>) =>
  coreApiFetch<Vehicle>('/logistics/vehicles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })

export const fetchLatestDriverLocations = () => coreApiFetch<DriverLocation[]>('/logistics/locations/latest')
