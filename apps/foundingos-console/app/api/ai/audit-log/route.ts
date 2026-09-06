/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse, type NextRequest } from 'next/server'
import { listAIAuditLog } from '../../../../../../services/ai/events/AuditLog.ts'
import { getSession } from '../../../lib/session-auth'

export async function GET(request: NextRequest) {
  const session = await getSession(request)
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })
  return NextResponse.json({ records: listAIAuditLog(session.id) })
}
