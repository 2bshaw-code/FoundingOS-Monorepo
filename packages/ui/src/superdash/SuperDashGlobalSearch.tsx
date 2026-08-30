/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client';

import { useState } from 'react';
import { SuperDashCommands } from './SuperDashCommands';
import type { SuperDashTileData } from './getSuperDashTiles';

export const SuperDashGlobalSearch = ({ tiles, onCommand }: { tiles: SuperDashTileData[]; onCommand: (cmd: string) => void }) => {
  const [value, setValue] = useState('');

  const results = [
    ...tiles.map((t) => ({ type: 'module', label: t.id, path: t.href })),
    ...Object.keys(SuperDashCommands).map((c) => ({ type: 'command', label: c, path: undefined })),
  ].filter((r) => r.label.toLowerCase().includes(value.toLowerCase()));

  return (
    <div className="premium-card premium-fade-in" style={{ marginTop: 24, padding: 16 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Global Search</h3>

      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search modules, commands, AI…"
        style={{ width: '100%' }}
      />

      {value ? (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {results.map((r, i) => (
            <div
              key={i}
              style={{ cursor: 'pointer', fontSize: 12 }}
              onClick={() => (r.type === 'module' ? onCommand(`open ${r.label}`) : onCommand(r.label))}
            >
              {r.type}: {r.label}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
