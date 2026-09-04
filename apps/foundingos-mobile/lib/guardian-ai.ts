/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Same real warning shapes as the web Guardian page (see
// packages/ui/src/superdash/SuperDashSurveyGuardian.ts, the one real source of these
// strings, and packages/ui/src/guardian-ai.tsx for the identical web-side logic this
// mirrors), in the standard "What I noticed / Why it matters / What you can do" format.
// There is no real automated "fix" for any of these — they're observations about survey
// engagement and route health, not something a button can repair — so "what you can do" is
// always "go look," never a fabricated one-click fix.
export type GuardianExplanation = { whatINoticed: string; whyItMatters: string; whatYouCanDo: string; investigateLabel: string }

export function explainGuardianWarning(warning: string): GuardianExplanation {
  if (warning.includes('no tester submissions yet')) {
    return {
      whatINoticed: warning,
      whyItMatters: 'It isn\u2019t broken \u2014 just low engagement so far.',
      whatYouCanDo: 'Invite a few more testers, or check back later.',
      investigateLabel: 'Open SuperDash',
    }
  }
  if (warning.includes('missing/blank answer')) {
    return {
      whatINoticed: warning,
      whyItMatters: 'A question may have been unclear, or a tester skipped it on purpose.',
      whatYouCanDo: 'Take a quick look at the responses when you have a moment.',
      investigateLabel: 'Review responses',
    }
  }
  if (warning.includes('route(s) are not responding correctly')) {
    return {
      whatINoticed: warning,
      whyItMatters: 'Could be a real outage, or just a temporary blip \u2014 not yet clear which.',
      whatYouCanDo: 'Check again shortly to see if it clears up on its own.',
      investigateLabel: 'Check again',
    }
  }
  return {
    whatINoticed: warning,
    whyItMatters: 'Guardian flagged this as worth a look.',
    whatYouCanDo: 'Take a look when you can \u2014 nothing urgent.',
    investigateLabel: 'Open SuperDash',
  }
}
