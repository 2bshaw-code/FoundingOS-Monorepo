/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

// Guardian + AI Fusion — every real Guardian alert (see
// packages/ui/src/superdash/SuperDashSurveyGuardian.ts, the only real source of these
// strings) gets a plain-language explanation and a real "Investigate" link, in the
// standard "What I noticed / Why it matters / What you can do" format. There is no real
// automated "fix" for any of these three real warning shapes (they're observations about
// survey engagement and route health, not something a button can repair), so "what you can
// do" is always "go look at the real page that shows this," never a fabricated one-click fix.
import Link from 'next/link'
import { useAIAssistance } from './ai-assistance'

type GuardianExplanation = { whatINoticed: string; whyItMatters: string; whatYouCanDo: string; investigateHref: string; investigateLabel: string }

export function explainGuardianWarning(warning: string): GuardianExplanation {
  if (warning.includes('no tester submissions yet')) {
    return {
      whatINoticed: warning,
      whyItMatters: 'It isn\u2019t broken \u2014 just low engagement so far.',
      whatYouCanDo: 'Invite a few more testers, or check back later.',
      investigateHref: '/superdashboard',
      investigateLabel: 'Open SuperDash',
    }
  }
  if (warning.includes('missing/blank answer')) {
    return {
      whatINoticed: warning,
      whyItMatters: 'A question may have been unclear, or a tester skipped it on purpose.',
      whatYouCanDo: 'Take a quick look at the responses when you have a moment.',
      investigateHref: '/superdashboard',
      investigateLabel: 'Review responses',
    }
  }
  if (warning.includes('route(s) are not responding correctly')) {
    return {
      whatINoticed: warning,
      whyItMatters: 'Could be a real outage, or just a temporary blip \u2014 not yet clear which.',
      whatYouCanDo: 'Check again shortly to see if it clears up on its own.',
      investigateHref: '/superdashboard',
      investigateLabel: 'Check again',
    }
  }
  return {
    whatINoticed: warning,
    whyItMatters: 'Guardian flagged this as worth a look.',
    whatYouCanDo: 'Take a look when you can \u2014 nothing urgent.',
    investigateHref: '/superdashboard',
    investigateLabel: 'Open SuperDash',
  }
}

export function GuardianAlertList({ warnings }: { warnings: string[] }) {
  const aiEnabled = useAIAssistance()

  if (warnings.length === 0) {
    return <p><small>No warnings — every category has submissions and every route is responding.</small></p>
  }

  return (
    <ul className="guardian-alert-list">
      {warnings.map((warning) => {
        const info = aiEnabled ? explainGuardianWarning(warning) : null
        return (
          <li key={warning} className="guardian-alert-item">
            {info ? (
              <div className="ai-hint-banner guardian-ai-hint">
                <span className="ai-insight-badge">AI</span>
                <div className="ai-hint-body guardian-tone-spec">
                  <p><strong>What I noticed:</strong> {info.whatINoticed}</p>
                  <p><strong>Why it matters:</strong> {info.whyItMatters}</p>
                  <p><strong>What you can do:</strong> {info.whatYouCanDo}</p>
                  <Link href={info.investigateHref} className="ai-hint-cta">Investigate — {info.investigateLabel}</Link>
                </div>
              </div>
            ) : (
              <p className="guardian-alert-raw">{warning}</p>
            )}
          </li>
        )
      })}
    </ul>
  )
}
