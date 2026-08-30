/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client';

import { useRouter } from 'next/navigation';
import { SuperDashCommands } from './SuperDashCommands';

export const useSuperDashCommandHandler = () => {
  const router = useRouter();

  return (cmd: string) => {
    const c = SuperDashCommands[cmd.toLowerCase()];
    if (!c) {
      alert('Unknown command');
      return;
    }

    switch (c.action) {
      case 'route':
        if (c.path) router.push(c.path);
        break;

      case 'refresh':
        router.refresh();
        break;

      case 'toggleHeatmap':
        document.body.classList.toggle('superdash-heatmap-off');
        break;

      case 'ai':
        alert(`FoundAI will optimize ${c.module} shortly.`);
        break;

      default:
        alert('Command recognized but not implemented.');
    }
  };
};
