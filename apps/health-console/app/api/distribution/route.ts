/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse, type NextRequest } from 'next/server'
import { getSession } from '../../lib/session-auth'
import { bookShipment, listShipmentsForBrand } from '@foundingos/db/distribution-service'

export const dynamic = 'force-dynamic'

// FoundHealth's real distribution/fulfillment view — every shipment this brand has ever booked
// into FoundLogistics (our internal carrier), regardless of status. This is what backs the
// brand console's "Distribution" tab, replacing the old static demo orders table.
export async function GET(request: NextRequest) {
  const session = await getSession(request)
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  const shipments = await listShipmentsForBrand('health')
  return NextResponse.json({ shipments })
}

// The real booking action: FoundHealth hands a shipment to FoundLogistics, exactly like handing a
// parcel to a courier — bookShipment() itself runs the AI rate/efficiency engine, persists the
// recommended quote, and creates the Shipment in `booked` status ready for FoundLogistics to
// route.
export async function POST(request: NextRequest) {
  const session = await getSession(request)
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const {
    reference,
    transportType,
    originAddress,
    origin,
    destinationName,
    destinationAddress,
    destination,
    weightKg,
    declaredValue,
    currency,
  } = body ?? {}

  if (!reference || !transportType || !originAddress || !origin?.lat || !destinationName || !destinationAddress || !destination?.lat || !weightKg) {
    return NextResponse.json(
      {
        error:
          'reference, transportType, originAddress, origin {lat,lng}, destinationName, destinationAddress, destination {lat,lng} and weightKg are required.',
      },
      { status: 400 }
    )
  }

  const result = await bookShipment({
    brandSlug: 'health',
    reference,
    transportType,
    originAddress,
    originLat: origin.lat,
    originLng: origin.lng,
    destinationName,
    destinationAddress,
    destinationLat: destination.lat,
    destinationLng: destination.lng,
    weightKg,
    declaredValue,
    currency,
  })

  if (!result.ok) return NextResponse.json({ error: 'Database not configured.' }, { status: 503 })

  return NextResponse.json(result)
}
