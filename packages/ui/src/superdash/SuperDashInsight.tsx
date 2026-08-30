/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { SuperDashTileData } from './getSuperDashTiles';

export const SuperDashInsight = ({ tiles }: { tiles: SuperDashTileData[] }) => {
  const insights = tiles.map((t) => {
    const s = parseFloat(t.score);

    if (s >= 1.2) return `${t.id} is outperforming expectations — leverage momentum.`;
    if (s >= 1.0) return `${t.id} is stable — maintain current workflows.`;
    if (s >= 0.8) return `${t.id} is weakening — review configuration soon.`;

    return `${t.id} is underperforming — immediate attention recommended.`;
  });

  return (
    <div className="premium-card premium-fade-in" style={{ marginTop: 24, padding: 16 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Insight Mode</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
        {insights.map((insight, idx) => (
          <div key={idx}>{insight}</div>
        ))}
      </div>
    </div>
  );
};
