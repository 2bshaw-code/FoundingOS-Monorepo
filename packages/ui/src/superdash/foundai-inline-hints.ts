/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export const FoundAIInlineHints = (brand: string, moduleId: string, score: string) => {
  const s = parseFloat(score);

  if (s >= 1.2) return `Top performer for ${brand} right now.`;
  if (s >= 1.0) return `Trending steady — worth a quick check-in.`;
  if (s >= 0.8) return `Slightly below target — a small tweak could help.`;
  return `Needs attention — engagement is cooling off.`;
};
