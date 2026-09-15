/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { dayIndex, pickDaily } from './daily'

// Real preview content for the pre-login landing screen — pulled from this brand's own real
// console dashboard sample data (apps/health-console/app/brand-config.ts), reframed as
// "why sign up" highlights so a visitor can see what FoundHealth actually does before
// creating an account. Tailored to this brand's specific business, not a generic template.
export const PREVIEW = {
  heroLabel: "Live across your clinics",
  sectionLabel: "Today's clinic highlights",
  items:   [
    {
      "title": "Manchester Central",
      "meta": "82% capacity \u00b7 Healthy",
      "tag": "Monitor"
    },
    {
      "title": "Leeds North",
      "meta": "94% capacity \u00b7 Busy",
      "tag": "Review"
    },
    {
      "title": "142 appointments today",
      "meta": "+8 vs yesterday",
      "tag": "On track"
    }
  ],
  leaderboard:   [
    {
      "rank": 1,
      "name": "Leeds North",
      "region": "Leeds, UK",
      "metric": "94% capacity",
      "trend": "Busy"
    },
    {
      "rank": 2,
      "name": "Manchester Central",
      "region": "Manchester, UK",
      "metric": "82% capacity",
      "trend": "Healthy"
    },
    {
      "rank": 3,
      "name": "Bristol West",
      "region": "Bristol, UK",
      "metric": "68% capacity",
      "trend": "Stable"
    }
  ],
  hooks:   [
    "Avg wait time down 4 min this week — sign in for the full picture.",
    "Leeds North is at 94% capacity right now — sign in to see if it needs support.",
    "142 appointments booked today, +8 vs yesterday — sign in to see today's schedule."
  ],
  insights:   [
    "AI insight: Leeds North is running busier than Manchester Central this week — AI suggests shifting a float clinician there ahead of peak hours.",
    "AI insight: average wait time has fallen for 3 weeks straight — AI attributes it to the new triage flow at Bristol West.",
    "AI insight: compliance score is highest at Manchester Central — AI suggests reviewing its checklist as the template for other clinics."
  ],
}

// Rotates daily so repeat visitors see something new: same real hook/insight pool and same
// real items/leaderboard data as above, but the featured hook+insight and the item/leaderboard
// display order change once every day (deterministic per day, not random per load).
function rotate<T>(list: T[], amount: number): T[] {
  const n = list.length
  if (n === 0) return list
  const shift = ((amount % n) + n) % n
  return [...list.slice(shift), ...list.slice(0, shift)]
}

export const PREVIEW_TODAY = {
  ...PREVIEW,
  hook: pickDaily(PREVIEW.hooks),
  insight: pickDaily(PREVIEW.insights, 1),
  items: rotate(PREVIEW.items, dayIndex(PREVIEW.items.length)),
  leaderboard: rotate(PREVIEW.leaderboard, dayIndex(PREVIEW.leaderboard.length)),
}
