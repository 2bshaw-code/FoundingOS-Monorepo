/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export function GET() {
	return Response.json({ error: 'Authentication disabled' }, { status: 410 })
}

export function POST() {
	return Response.json({ error: 'Authentication disabled' }, { status: 410 })
}