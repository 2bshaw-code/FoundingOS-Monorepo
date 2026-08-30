/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { FoundAI } from '../found-ai';
import type { BrandConsoleConfig } from '../console';

export const FoundAIDemoModule = ({ brand }: { brand: BrandConsoleConfig }) => (
  <div className="space-y-4 premium-fade-in">
    <h1 className="text-2xl font-semibold">FoundAI Demo</h1>
    <p className="text-sm text-muted-foreground">
      Try AI-powered suggestions and workflows tailored to this console.
    </p>
    <FoundAI brand={brand} />
  </div>
);
