/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

// Guardian + AI Fusion — every real Guardian alert (see
// packages/ui/src/superdash/SuperDashSurveyGuardian.ts, the only real source of these
// strings) gets a plain-language explanation and a real "Investigate" link. There is no
// real automated "fix" for any of these three real warning shapes (they're observations
// about survey engagement and route health, not something a button can repair), so the
// honest action is always "go look at the real page that shows this," never a fabricated
// one-click fix.
import Link from 'next/link'
import { useAIAssistance } from './ai-assistance'

type GuardianExplanation = { explanation: string; investigateHref: string; investigateLabel: string }

export function explainGuardianWarning(warning: string): GuardianExplanation {
  if (warning.includes('no tester submissions yet')) {
    return {
      explanation: 'Nobody has completed this survey yet. It isn\u2019t broken \u2014 just low engagement so far. You could invite a few more testers.',
      investigateHref: '/superdashboard',
      investigateLabel: 'Open SuperDash',
    }
  }
  if (warning.includes('missing/blank answer')) {
    return {
      explanation: 'Some testers left one or more answers blank. Worth a quick look in case a question was confusing.',
      investigateHref: '/superdashboard',
      investigateLabel: 'Review responses',
    }
  }
  if (warning.includes('route(s) are not responding correctly')) {
    return {
      explanation: 'One or more brand websites returned an error when Guardian checked them just now \u2014 could be a real outage or a temporary blip. Worth checking again shortly.',
      investigateHref: '/superdashboard',
      investigateLabel: 'Check again',
    }
  }
  return {
    explanation: 'Guardian flagged this \u2014 take a look when you can.',
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
            <p className="guardian-alert-raw">{warning}</p>
            {info && (
              <div className="ai-hint-banner guardian-ai-hint">
                <span className="ai-insight-badge">AI</span>
                <div className="ai-hint-body">
                  <p>{info.explanation}</p>
                  <Link href={info.investigateHref} className="ai-hint-cta">Investigate — {info.investigateLabel}</Link>
                </div>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
