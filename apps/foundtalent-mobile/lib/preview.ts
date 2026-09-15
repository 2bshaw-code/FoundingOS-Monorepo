/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { dayIndex, pickDaily } from './daily'

// Real preview content for the pre-login landing screen — pulled from this brand's own real
// console dashboard sample data (apps/talent-console/app/brand-config.ts), reframed as
// "why sign up" highlights so a visitor can see what FoundTalent actually does before
// creating an account. Tailored to this brand's specific business, not a generic template.
export const PREVIEW = {
  heroLabel: "Live across your hiring pipeline",
  sectionLabel: "Today's hottest roles",
  items:   [
    {
      "title": "Store Manager",
      "meta": "42 candidates \u00b7 Ava recruiting",
      "tag": "Hot role"
    },
    {
      "title": "Data Analyst",
      "meta": "31 candidates \u00b7 Noah recruiting",
      "tag": "Active"
    },
    {
      "title": "Recruiter",
      "meta": "22 candidates \u00b7 Mia recruiting",
      "tag": "New"
    }
  ],
  leaderboard:   [
    {
      "rank": 1,
      "name": "Store Manager",
      "region": "Ava\u2019s pipeline",
      "metric": "42 candidates",
      "trend": "Hot role"
    },
    {
      "rank": 2,
      "name": "Data Analyst",
      "region": "Noah\u2019s pipeline",
      "metric": "31 candidates",
      "trend": "Active"
    },
    {
      "rank": 3,
      "name": "Recruiter",
      "region": "Mia\u2019s pipeline",
      "metric": "22 candidates",
      "trend": "New"
    }
  ],
  hooks:   [
    "8 new applicants since yesterday — sign in to review them.",
    "Store Manager just crossed 42 candidates — sign in to shortlist.",
    "Mia's Recruiter pipeline has 4 new candidates waiting — sign in to review."
  ],
  insights:   [
    "AI insight: Store Manager roles are attracting candidates twice as fast as Recruiter roles — AI suggests reusing that listing's wording for open Recruiter roles.",
    "AI insight: candidates who apply within 24 hours of a post going live are 30% more likely to be shortlisted.",
    "AI insight: Noah's Data Analyst pipeline has the highest interview-to-offer rate of the three roles this month."
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
