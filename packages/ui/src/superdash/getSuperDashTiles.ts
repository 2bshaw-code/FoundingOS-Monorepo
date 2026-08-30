/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { CORE_MODULES } from '@foundingos/config/modules';
import { QUANTUM_REGISTRY } from '@foundingos/config/quantum';
import { FoundAIInlineHints } from './foundai-inline-hints';
import { FoundAIVoicePrompt } from './foundai-voice';

export interface SuperDashTileData {
  id: string;
  title: string;
  description: string;
  href: string;
  score: string;
  aiHint: string;
  aiVoice: string;
}

export function getSuperDashTiles(brand = 'foundingos'): SuperDashTileData[] {
  return CORE_MODULES.map((m) => {
    const q = QUANTUM_REGISTRY.modules.find((x) => x.id === m.id)?.qde.score ?? 1;
    const score = q.toFixed(2);

    return {
      id: m.id,
      title: m.label,
      description: m.description,
      href: m.path,
      score,
      aiHint: FoundAIInlineHints(brand, m.id, score),
      aiVoice: FoundAIVoicePrompt(brand, m.id, score),
    };
  });
}
