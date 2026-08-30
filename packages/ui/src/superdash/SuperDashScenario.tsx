/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export const SuperDashScenario = ({ moduleId, score }: { moduleId: string; score: string }) => {
  const s = parseFloat(score);

  const scenarios = [
    `If ${moduleId} improves by 10%, Quantum score becomes ${(s * 1.1).toFixed(2)}`,
    `If ${moduleId} drops by 10%, Quantum score becomes ${(s * 0.9).toFixed(2)}`,
    `If brand intelligence shifts +5%, score becomes ${(s + 0.05).toFixed(2)}`,
  ];

  return (
    <div className="premium-card premium-fade-in" style={{ marginTop: 24, padding: 16 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Scenario Mode</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
        {scenarios.map((scenario, i) => (
          <div key={i}>{scenario}</div>
        ))}
      </div>
    </div>
  );
};
