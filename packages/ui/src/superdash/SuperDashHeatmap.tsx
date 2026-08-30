/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export const SuperDashHeatmap = ({ score }: { score: string }) => {
  const s = parseFloat(score);

  let tone = 'quantum-heatmap-low';
  if (s >= 1.2) tone = 'quantum-heatmap-high';
  else if (s >= 1.0) tone = 'quantum-heatmap-good';
  else if (s >= 0.8) tone = 'quantum-heatmap-watch';

  return <div className={`quantum-heatmap ${tone}`} aria-hidden="true" />;
};
