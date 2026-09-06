/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse, type NextRequest } from 'next/server'
import { getSession } from '../../../lib/session-auth'

export async function POST(request: NextRequest) {
  const session = await getSession(request)
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  return NextResponse.json({
    ok: true,
    boltOn: 'financeExpense',
    expenseRecord: {
      receiptId: `RCP-${Math.floor(1000 + Math.random() * 9000)}`,
      merchant: 'Fuel Station West',
      category: 'Travel & Transportation',
      subtotal: 84.50,
      tax: 13.52,
      totalAmount: 98.02,
      currency: 'USD',
      autoReconciled: true,
    },
    timestamp: new Date().toISOString(),
  })
}
