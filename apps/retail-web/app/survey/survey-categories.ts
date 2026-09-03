/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Ten tester survey categories for the FoundRetail brand website, mirroring the category
// set used across the FoundingOS tester program. This is a brand-scoped, additive survey
// flow (localStorage/local-file only) — it does not read or write the centralized
// foundingos-console tester/survey system.
export type SurveyCategory = {
  slug: string
  label: string
  questions: string[]
}

export const SURVEY_CATEGORIES: SurveyCategory[] = [
  {
    slug: 'sales',
    label: 'Sales',
    questions: [
      'What would make it easier for your team to close a sale using FoundRetail?',
      'What information do you wish you had at the point of sale?',
    ],
  },
  {
    slug: 'marketing',
    label: 'Marketing',
    questions: [
      'What marketing channels matter most for your retail business?',
      'What would make FoundRetail easier to promote to your customers?',
    ],
  },
  {
    slug: 'product',
    label: 'Product',
    questions: [
      'Which product features feel essential vs. nice-to-have?',
      'What is missing from the current product catalogue experience?',
    ],
  },
  {
    slug: 'support',
    label: 'Support',
    questions: [
      'How do you prefer to get help when something goes wrong?',
      'What is the most frustrating support experience you\u2019ve had with retail software?',
    ],
  },
  {
    slug: 'operations',
    label: 'Operations',
    questions: [
      'What operational task takes up the most time in your day?',
      'What would you automate first if you could?',
    ],
  },
  {
    slug: 'finance',
    label: 'Finance',
    questions: [
      'What financial reporting do you check most often?',
      'What pricing model feels fairest for a business your size?',
    ],
  },
  {
    slug: 'retailexp',
    label: 'Retail Experience',
    questions: [
      'What does a great in-store or online retail experience look like to you?',
      'What has frustrated you most as a retail customer?',
    ],
  },
  {
    slug: 'uxui',
    label: 'UX/UI',
    questions: [
      'What is your first impression of the FoundRetail interface?',
      'What would you change about the navigation or layout?',
    ],
  },
  {
    slug: 'branding',
    label: 'Branding',
    questions: [
      'Does the FoundRetail brand feel trustworthy and premium to you?',
      'What would make the branding feel more distinctive?',
    ],
  },
  {
    slug: 'competitor',
    label: 'Competitor Analysis',
    questions: [
      'What other retail tools have you used or considered?',
      'What does FoundRetail do better — or worse — than those alternatives?',
    ],
  },
]

export function findSurveyCategory(slug: string): SurveyCategory | undefined {
  return SURVEY_CATEGORIES.find((category) => category.slug === slug)
}
