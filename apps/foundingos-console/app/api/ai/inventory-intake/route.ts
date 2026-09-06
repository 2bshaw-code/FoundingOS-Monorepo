/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse, type NextRequest } from 'next/server'
import { getSession } from '../../../lib/session-auth'

export async function POST(request: NextRequest) {
  const session = await getSession(request)
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const { brandSlug = 'retail', actionType, payload } = body

  const detectedItem = payload?.itemName || payload?.query || 'Detected Product Stock'
  const detectedQty = payload?.quantity || payload?.count || 12
  const confidence = 0.94

  return NextResponse.json({
    ok: true,
    endpoint: '/api/ai/inventory-intake',
    brandSlug,
    actionType: actionType || 'INVENTORY_INTAKE',
    suggestion: {
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      name: detectedItem,
      suggestedQuantity: detectedQty,
      unitPrice: payload?.unitPrice || 45.0,
      confidenceScore: confidence,
      status: 'pending_confirmation',
      whatsappMessage: `📦 AI Inventory Alert: Stock entry proposed for ${detectedItem} (Qty: ${detectedQty}). Reply YES to confirm.`,
    },
    timestamp: new Date().toISOString(),
  })
}
