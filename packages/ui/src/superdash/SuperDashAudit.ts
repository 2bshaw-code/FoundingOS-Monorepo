/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { SuperDashTileData } from './getSuperDashTiles';

export interface SuperDashAuditEntry {
  module: string;
  health: 'healthy' | 'weak' | 'critical';
}

export const SuperDashAudit = (tiles: SuperDashTileData[]): SuperDashAuditEntry[] => {
  return tiles.map((t) => {
    const s = parseFloat(t.score);

    return {
      module: t.id,
      health: s >= 1.0 ? 'healthy' : s >= 0.8 ? 'weak' : 'critical',
    };
  });
};
