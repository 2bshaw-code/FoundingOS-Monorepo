/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse, type NextRequest } from 'next/server'
import { getSession } from '../../../lib/session-auth'
import { evaluateCarrierOptions, haversineKm } from '@foundingos/db/distribution-service'

export const dynamic = 'force-dynamic'

// The AI rate/efficiency check — called by every brand's booking flow (and shown directly in
// FoundLogistics's own console) before a shipment is confirmed. Deterministic scoring model
// (cost, speed, reliability), not a live third-party carrier-rate API; the response makes that
// explicit via `basis`.
export async function POST(request: NextRequest) {
  const session = await getSession(request)
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const { transportType, weightKg, origin, destination } = body ?? {}
  if (!transportType || !origin?.lat || !destination?.lat) {
    return NextResponse.json({ error: 'transportType, origin {lat,lng} and destination {lat,lng} are required.' }, { status: 400 })
  }

  const distanceKm = haversineKm(origin, destination)
  const options = evaluateCarrierOptions({ transportType, distanceKm, weightKg: weightKg ?? 1 })

  return NextResponse.json({
    distanceKm,
    options,
    recommended: options.find((o) => o.recommended),
    basis: 'Deterministic AI rate/efficiency model — cost 35% / speed 35% / reliability 30%. Not a live third-party carrier quote.',
  })
}
