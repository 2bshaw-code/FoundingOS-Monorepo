/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export const SuperDashTimeline = ({ history }: { history: number[] }) => {
  return (
    <div className="premium-card premium-fade-in" style={{ marginTop: 24, padding: 16 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Timeline Mode</h3>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        {history.map((h, i) => (
          <div
            key={i}
            style={{ width: 8, borderRadius: 4, background: 'var(--accent, rgba(74,144,226,0.4))', height: `${h * 20}px` }}
          />
        ))}
      </div>
    </div>
  );
};
