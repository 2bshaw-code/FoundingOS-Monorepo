/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse, type NextRequest } from 'next/server'
import { getPrismaClient } from '@foundingos/db'

export const dynamic = 'force-dynamic'

// Public, unauthenticated order tracking — deliberately outside the session-gated /api/distribution
// route: a customer tracking their own delivery has no console login. Looked up by reference
// (+ optional destination name as a light check) and only ever returns delivery-safe fields —
// no internal routing/driver/vehicle data.
export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get('reference')?.trim()
  if (!reference) return NextResponse.json({ error: 'A reference number is required.' }, { status: 400 })

  const prisma = getPrismaClient()
  if (!prisma) return NextResponse.json({ error: 'Tracking is not available right now.' }, { status: 503 })

  const shipment = await prisma.shipment.findFirst({
    where: { reference, brandSlug: 'health' },
    include: { proofOfDelivery: true },
  })
  if (!shipment) return NextResponse.json({ error: 'No shipment found for that reference.' }, { status: 404 })

  return NextResponse.json({
    reference: shipment.reference,
    status: shipment.status,
    transportType: shipment.transportType,
    destinationName: shipment.destinationName,
    eta: shipment.eta,
    deliveredAt: shipment.proofOfDelivery?.deliveredAt ?? null,
    recipientName: shipment.proofOfDelivery?.recipientName ?? null,
  })
}
