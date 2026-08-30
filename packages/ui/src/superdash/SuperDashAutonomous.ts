/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { SuperDashTileData } from './getSuperDashTiles';

export interface SuperDashAutonomousAction {
  module: string;
  action: 'auto-optimize' | 'auto-coach';
  message: string;
}

export const SuperDashAutonomous = (tiles: SuperDashTileData[]): SuperDashAutonomousAction[] => {
  return tiles
    .map((t) => {
      const s = parseFloat(t.score);

      if (s >= 1.35) {
        return { module: t.id, action: 'auto-optimize' as const, message: `${t.id} is surging — auto-optimization triggered.` };
      }

      if (s <= 0.7) {
        return { module: t.id, action: 'auto-coach' as const, message: `${t.id} is degrading — auto-coaching triggered.` };
      }

      return null;
    })
    .filter((a): a is SuperDashAutonomousAction => a !== null);
};
