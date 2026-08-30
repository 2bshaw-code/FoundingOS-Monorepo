/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { SuperDashHeatmap } from './SuperDashHeatmap';

export interface SuperDashTileProps {
  title: string;
  description: string;
  icon?: string;
  href: string;
  score: string;
  aiHint?: string;
  aiVoice?: string;
}

export const SuperDashTile = ({ title, description, href, score, aiHint, aiVoice }: SuperDashTileProps) => {
  return (
    <a href={href} className="premium-card premium-fade-in quantum-tile" style={{ display: 'block', padding: 16, textDecoration: 'none', color: 'inherit' }}>
      <SuperDashHeatmap score={score} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{title}</h3>
          <p style={{ fontSize: 12, color: 'var(--muted-foreground, #9ca3af)', marginTop: 4 }}>{description}</p>
        </div>
        <span style={{ fontSize: 12, color: 'var(--muted-foreground, #9ca3af)', fontFamily: 'monospace' }}>Q:{score}</span>
      </div>

      {aiHint ? (
        <div style={{ position: 'relative', zIndex: 1, marginTop: 12, fontSize: 12, fontStyle: 'italic', opacity: 0.8 }}>
          {aiHint}
        </div>
      ) : null}

      {aiVoice ? (
        <div style={{ position: 'relative', zIndex: 1, marginTop: 8, fontSize: 12, fontWeight: 500, color: 'var(--accent, inherit)' }}>
          {aiVoice}
        </div>
      ) : null}

      <div className="quantum-tile-border" aria-hidden="true" />
    </a>
  );
};
