/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse, type NextRequest } from 'next/server'
import { getPrismaClient } from '@foundingos/db'

export const dynamic = 'force-dynamic'

// Public, unauthenticated order tracking for FoundLogistics's own public website — unlike the
// brand consoles' /api/track (scoped to one brandSlug), this looks across every brand it
// carries for, since a visitor to the carrier's own site won't know which brand shipped it.
export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get('reference')?.trim()
  if (!reference) return NextResponse.json({ error: 'A reference number is required.' }, { status: 400 })

  const prisma = getPrismaClient()
  if (!prisma) return NextResponse.json({ error: 'Tracking is not available right now.' }, { status: 503 })

  const shipment = await prisma.shipment.findFirst({
    where: { reference },
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
