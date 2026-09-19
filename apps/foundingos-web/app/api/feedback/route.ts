import { NextRequest, NextResponse } from 'next/server'
import { parsePreviewFeedback, savePreviewFeedback } from '../../../src/preview-feedback'
import { readSiteAccess, SITE_ACCESS_COOKIE } from '../../../src/site-access'

export async function POST(request: NextRequest) {
  if (request.headers.get('origin') !== request.nextUrl.origin) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }
  const access = readSiteAccess(request.cookies.get(SITE_ACCESS_COOKIE)?.value)
  if (!access) return NextResponse.json({ error: 'Your preview session has expired. Please sign in again.' }, { status: 401 })
  const feedback = parsePreviewFeedback(await request.json())
  if (!feedback) return NextResponse.json({ error: 'Please complete the required survey questions.' }, { status: 400 })
  await savePreviewFeedback(access.email, feedback)
  return NextResponse.json({ success: true })
}
