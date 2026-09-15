/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse, type NextRequest } from 'next/server'
import { getSession } from '../../../lib/session-auth'
import { listAllShipments, updateShipmentStatus } from '@foundingos/db/distribution-service'

export const dynamic = 'force-dynamic'

// FoundLogistics's own carrier-side view: every shipment booked into it by any brand
// (FoundRetail, FoundMeat, FoundHealth, ...), across every status. This is the real queue a
// depot dispatcher works from — not a per-brand filtered list.
export async function GET(request: NextRequest) {
  const session = await getSession(request)
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  const shipments = await listAllShipments()
  return NextResponse.json({ shipments })
}

// Real status transition (e.g. dispatcher marks a shipment as packed/collected) — the only
// way a Shipment's status field is ever mutated outside of booking/POD capture.
export async function PATCH(request: NextRequest) {
  const session = await getSession(request)
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  const body = await request.json().catch(() => null)
  if (!body?.shipmentId || !body?.status) {
    return NextResponse.json({ error: 'shipmentId and status are required.' }, { status: 400 })
  }

  const updated = await updateShipmentStatus(body.shipmentId, body.status)
  if (!updated) return NextResponse.json({ error: 'Database not configured.' }, { status: 503 })
  return NextResponse.json({ shipment: updated })
}
