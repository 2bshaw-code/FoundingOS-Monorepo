export function GET() {
	return Response.json({ error: 'Authentication disabled' }, { status: 410 })
}

export function POST() {
	return Response.json({ error: 'Authentication disabled' }, { status: 410 })
}