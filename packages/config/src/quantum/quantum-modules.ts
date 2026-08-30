/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { CORE_MODULES } from '../modules';

export const QUANTUM_MODULE_HOOKS = CORE_MODULES.map((m) => ({
  id: m.id,
  weight: 0.8,
  brandAffinity: 'inherit',
  qde: {
    score: 1,
    context: `module:${m.id}`,
  },
  qol: {
    orchestration: `module:${m.id}:orchestrate`,
  },
}));
