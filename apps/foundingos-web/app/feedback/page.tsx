import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { readSiteAccess, SITE_ACCESS_COOKIE } from '../../src/site-access'
import { PreviewFeedbackForm } from './preview-feedback-form'

export default function FeedbackPage() {
  const access = readSiteAccess(cookies().get(SITE_ACCESS_COOKIE)?.value)
  if (!access) redirect('/access?returnTo=%2Ffeedback')
  return <PreviewFeedbackForm email={access.email} />
}
