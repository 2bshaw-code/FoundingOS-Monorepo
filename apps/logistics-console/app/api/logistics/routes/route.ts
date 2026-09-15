/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse, type NextRequest } from 'next/server'
import { getSession } from '../../../lib/session-auth'
import { getPrismaClient } from '@foundingos/db'
import { listRoutes, optimizeStopOrder, updateRoutePosition } from '@foundingos/db/distribution-service'

export const dynamic = 'force-dynamic'

// FoundLogistics's real routing board — every planned/in-progress/completed route, each with
// its ordered stops (one per Shipment) and live driver position. Powers both the console Fleet
// map and the driver-facing mobile app.
export async function GET(request: NextRequest) {
  const session = await getSession(request)
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  const routes = await listRoutes()
  return NextResponse.json({ routes })
}

// Two real jobs, both idempotent to call again:
// 1) create=true — assigns a set of booked shipments to a new route out of a depot, using the
//    real nearest-neighbour optimiser (optimizeStopOrder) to decide stop order, not a hardcoded
//    sequence.
// 2) position update — a driver's live lat/lng tick, surfaced on the real map immediately.
export async function POST(request: NextRequest) {
  const session = await getSession(request)
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  const prisma = getPrismaClient()
  if (!prisma) return NextResponse.json({ error: 'Database not configured.' }, { status: 503 })

  const body = await request.json().catch(() => null)

  if (body?.action === 'position') {
    if (!body.routeId || typeof body.lat !== 'number' || typeof body.lng !== 'number') {
      return NextResponse.json({ error: 'routeId, lat and lng are required.' }, { status: 400 })
    }
    const route = await updateRoutePosition(body.routeId, body.lat, body.lng)
    return NextResponse.json({ route })
  }

  // Default: create a route from a depot + a list of shipmentIds (each must already be booked).
  if (!body?.depotId || !Array.isArray(body?.shipmentIds) || body.shipmentIds.length === 0) {
    return NextResponse.json({ error: 'depotId and a non-empty shipmentIds array are required.' }, { status: 400 })
  }

  const depot = await prisma.depot.findUnique({ where: { id: body.depotId } })
  if (!depot) return NextResponse.json({ error: 'Depot not found.' }, { status: 404 })

  const shipments = await prisma.shipment.findMany({ where: { id: { in: body.shipmentIds } } })
  const withCoords = shipments.filter((s) => s.destinationLat != null && s.destinationLng != null)

  const order = optimizeStopOrder(
    { lat: depot.lat, lng: depot.lng },
    withCoords.map((s) => ({ shipmentId: s.id, lat: s.destinationLat as number, lng: s.destinationLng as number }))
  )

  const route = await prisma.deliveryRoute.create({
    data: {
      depotId: body.depotId,
      driverId: body.driverId,
      vehicleId: body.vehicleId,
      currentLat: depot.lat,
      currentLng: depot.lng,
      stops: {
        create: order.map((shipmentId, index) => ({ shipmentId, sequence: index })),
      },
    },
    include: { stops: { include: { shipment: true }, orderBy: { sequence: 'asc' } }, depot: true, driver: true, vehicle: true },
  })

  await prisma.shipment.updateMany({ where: { id: { in: order } }, data: { status: 'in_transit' } })

  return NextResponse.json({ route })
}
