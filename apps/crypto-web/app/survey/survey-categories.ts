/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Shared tester survey categories, matching the same 10 keys used by FoundRetail's
// survey-feed pipeline, so categoryBreakdown is structurally identical across every brand.
export const SURVEY_CATEGORIES = [
  { slug: 'sales', label: 'Sales' },
  { slug: 'marketing', label: 'Marketing' },
  { slug: 'product', label: 'Product' },
  { slug: 'support', label: 'Support' },
  { slug: 'operations', label: 'Operations' },
  { slug: 'finance', label: 'Finance' },
  { slug: 'retailexp', label: 'Customer Experience' },
  { slug: 'uxui', label: 'UX/UI' },
  { slug: 'branding', label: 'Branding' },
  { slug: 'competitor', label: 'Competitor Analysis' },
] as const
