/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Same real warning shapes as the web Guardian page (see
// packages/ui/src/superdash/SuperDashSurveyGuardian.ts, the one real source of these
// strings, and packages/ui/src/guardian-ai.tsx for the identical web-side logic this
// mirrors). There is no real automated "fix" for any of these — they're observations about
// survey engagement and route health, not something a button can repair — so the honest
// action is always "go look," never a fabricated one-click fix.
export type GuardianExplanation = { explanation: string; investigateLabel: string }

export function explainGuardianWarning(warning: string): GuardianExplanation {
  if (warning.includes('no tester submissions yet')) {
    return {
      explanation: 'Nobody has completed this survey yet. It isn\u2019t broken \u2014 just low engagement so far. You could invite a few more testers.',
      investigateLabel: 'Open SuperDash',
    }
  }
  if (warning.includes('missing/blank answer')) {
    return {
      explanation: 'Some testers left one or more answers blank. Worth a quick look in case a question was confusing.',
      investigateLabel: 'Review responses',
    }
  }
  if (warning.includes('route(s) are not responding correctly')) {
    return {
      explanation: 'One or more brand websites returned an error when Guardian checked them just now \u2014 could be a real outage or a temporary blip. Worth checking again shortly.',
      investigateLabel: 'Check again',
    }
  }
  return {
    explanation: 'Guardian flagged this \u2014 take a look when you can.',
    investigateLabel: 'Open SuperDash',
  }
}
