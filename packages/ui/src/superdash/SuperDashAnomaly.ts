/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { SuperDashTileData } from './getSuperDashTiles';

export const SuperDashAnomaly = (tiles: SuperDashTileData[]): string[] => {
  return tiles
    .map((t) => {
      const s = parseFloat(t.score);

      if (s - 1.0 >= 0.3) return `⚡ Anomaly: ${t.id} spiked unexpectedly.`;
      if (1.0 - s >= 0.3) return `⚠️ Anomaly: ${t.id} dropped sharply.`;

      return null;
    })
    .filter((a): a is string => a !== null);
};
