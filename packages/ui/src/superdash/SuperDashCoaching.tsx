/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export const SuperDashCoaching = ({ moduleId, score }: { moduleId: string; score: number }) => {
  const s = score;

  const steps =
    s >= 1.2
      ? ['Review high-performing segments.', 'Double down on successful patterns.', 'Expand winning workflows.']
      : s >= 1.0
      ? ['Identify stable workflows.', 'Tune messaging or timing.', 'Optimize one bottleneck.']
      : s >= 0.8
      ? ['Check engagement drop-off.', 'Review module configuration.', 'Run FoundAI diagnostics.']
      : ['Audit module setup.', 'Review brand intelligence alignment.', 'Apply FoundAI optimization suggestions.'];

  return (
    <div className="premium-card premium-fade-in" style={{ marginTop: 24, padding: 16 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Coaching Mode — {moduleId}</h3>
      <ul style={{ fontSize: 12, color: 'var(--muted-foreground, #9ca3af)', listStyle: 'none', padding: 0, margin: 0 }}>
        {steps.map((step, index) => (
          <li key={index} style={{ marginBottom: 4 }}>• {step}</li>
        ))}
      </ul>
    </div>
  );
};
