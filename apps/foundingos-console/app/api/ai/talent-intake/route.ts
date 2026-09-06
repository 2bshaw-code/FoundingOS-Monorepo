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
  const { brandSlug = 'talent', payload } = body

  return NextResponse.json({
    ok: true,
    endpoint: '/api/ai/talent-intake',
    brandSlug,
    suggestion: {
      candidateId: `TAL-${Math.floor(1000 + Math.random() * 9000)}`,
      name: payload?.candidateName || 'Alex Mercer',
      roleExtracted: payload?.role || 'Senior Full-Stack Engineer',
      yearsExperience: payload?.experience || 6,
      skills: payload?.skills || ['React Native', 'TypeScript', 'Node.js', 'PostgreSQL'],
      matchScore: 0.92,
      whatsappContactMessage: `👋 Hi Alex, FoundingOS AI matched your profile for the Senior Engineer role. Let us know if you are open to a brief chat!`,
    },
    timestamp: new Date().toISOString(),
  })
}
