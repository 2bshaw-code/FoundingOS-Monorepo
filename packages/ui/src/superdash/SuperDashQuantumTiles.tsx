/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { getSuperDashTiles } from './getSuperDashTiles';
import { SuperDashTile } from './SuperDashTile';

export const SuperDashQuantumTiles = () => {
  const tiles = getSuperDashTiles();

  return (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
      {tiles.map((t) => (
        <SuperDashTile key={t.id} {...t} />
      ))}
    </div>
  );
};
