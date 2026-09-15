/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse, type NextRequest } from 'next/server'
import { getSession } from '../../../lib/session-auth'
import { recordProofOfDelivery } from '@foundingos/db/distribution-service'

export const dynamic = 'force-dynamic'

// Real proof-of-delivery capture — called by the driver's mobile app (or console, for manual
// entry) on completion of a stop. Marks the Shipment `delivered` and stores who signed, where,
// and when — the one source of truth every brand's tracking view reads from.
export async function POST(request: NextRequest) {
  const session = await getSession(request)
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  const body = await request.json().catch(() => null)
  if (!body?.shipmentId || !body?.recipientName) {
    return NextResponse.json({ error: 'shipmentId and recipientName are required.' }, { status: 400 })
  }

  const pod = await recordProofOfDelivery({
    shipmentId: body.shipmentId,
    recipientName: body.recipientName,
    signatureUrl: body.signatureUrl,
    photoUrl: body.photoUrl,
    lat: body.lat,
    lng: body.lng,
  })
  if (!pod) return NextResponse.json({ error: 'Database not configured.' }, { status: 503 })
  return NextResponse.json({ proofOfDelivery: pod })
}
