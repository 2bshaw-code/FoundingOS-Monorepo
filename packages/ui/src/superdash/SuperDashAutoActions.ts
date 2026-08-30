/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export interface SuperDashAutoAction {
  type: 'auto-highlight' | 'auto-coach';
  message: string;
}

export const SuperDashAutoActions = (score: string, moduleId: string): SuperDashAutoAction | null => {
  const s = parseFloat(score);

  if (s >= 1.3) {
    return {
      type: 'auto-highlight',
      message: `${moduleId} is surging — highlight recommended.`,
    };
  }

  if (s <= 0.75) {
    return {
      type: 'auto-coach',
      message: `${moduleId} is dropping — FoundAI coaching recommended.`,
    };
  }

  return null;
};
