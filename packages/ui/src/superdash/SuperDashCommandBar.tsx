/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client';

import { useState } from 'react';

export const SuperDashCommandBar = ({ onCommand }: { onCommand: (cmd: string) => void }) => {
  const [value, setValue] = useState('');

  const handle = () => {
    if (!value.trim()) return;
    onCommand(value.trim());
    setValue('');
  };

  return (
    <div className="premium-card premium-fade-in" style={{ marginTop: 24, padding: 16 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Command Mode</h3>

      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => event.key === 'Enter' && handle()}
        placeholder="Type a command…"
        style={{ width: '100%' }}
      />

      <button type="button" className="btn btn-primary btn-premium" style={{ marginTop: 12 }} onClick={handle}>
        Execute
      </button>
    </div>
  );
};
