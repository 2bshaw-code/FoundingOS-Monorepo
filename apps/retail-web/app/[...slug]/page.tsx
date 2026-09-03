/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { redirect } from 'next/navigation'

// Required (non-optional) catch-all: matches any path with at least one segment that isn't
// already handled by a more specific route (e.g. a typo'd URL). It deliberately does NOT
// match "/" itself, so the real root page.tsx (Landing) is never shadowed. Redirects to the
// full marketing site, preserving the previous "always show something useful" behavior.
export default function CatchAllPage() {
  redirect('/website')
}
