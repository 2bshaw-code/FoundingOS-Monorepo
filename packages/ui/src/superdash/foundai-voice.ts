/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export const FoundAIVoicePrompt = (brand: string, moduleId: string, score: string) => {
  const s = parseFloat(score);

  if (s >= 1.2)
    return `"${brand} is showing strong momentum in ${moduleId}. Keep pushing — this is a high-impact zone."`;

  if (s >= 1.0)
    return `"${moduleId} is performing well for ${brand}. A quick optimization could amplify results."`;

  if (s >= 0.8)
    return `"${moduleId} is steady, but there's room for improvement. Want help tuning it?"`;

  return `"${moduleId} is cooling off. I can help revive engagement when you're ready."`;
};
