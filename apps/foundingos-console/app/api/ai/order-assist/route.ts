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
  const { brandSlug = 'retail', payload } = body

  return NextResponse.json({
    ok: true,
    endpoint: '/api/ai/order-assist',
    brandSlug,
    suggestion: {
      orderId: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: payload?.customerName || 'WhatsApp Customer',
      customerPhone: payload?.phone || '+254712345678',
      items: payload?.items || [{ name: 'Retail Pack A', quantity: 2, price: 29.99 }],
      totalAmount: payload?.totalAmount || 59.98,
      currency: payload?.currency || 'KES',
      confidenceScore: 0.96,
      status: 'draft_ready',
      whatsappPaymentLink: `https://wa.me/254712345678?text=Your+Order+ORD-59.98+is+ready.+Pay+via+M-Pesa%2FCard%3A+https%3A%2F%2Fpay.foundingos.com%2Ford-99`,
    },
    timestamp: new Date().toISOString(),
  })
}
