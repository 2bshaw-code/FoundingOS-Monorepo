/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client';

import { useEffect, useState } from 'react';
import type { SuperDashTileData } from './getSuperDashTiles';

export const SuperDashNotifications = ({ tiles }: { tiles: SuperDashTileData[] }) => {
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    const newAlerts = tiles
      .map((t) => {
        const s = parseFloat(t.score);
        if (s >= 1.3) return `🔥 ${t.id} is surging — Quantum spike detected`;
        if (s <= 0.75) return `⚠️ ${t.id} is dropping — FoundAI coaching suggested`;
        return null;
      })
      .filter((a): a is string => Boolean(a));

    setAlerts(newAlerts);
  }, [tiles]);

  if (!alerts.length) return null;

  return (
    <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {alerts.map((a, i) => (
        <div key={i} className="premium-card" style={{ padding: '8px 12px', fontSize: 12 }}>
          {a}
        </div>
      ))}
    </div>
  );
};
