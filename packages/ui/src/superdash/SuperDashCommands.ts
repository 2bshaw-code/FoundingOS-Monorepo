/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export const SuperDashCommands: Record<string, { action: string; path?: string; module?: string }> = {
  'open marketing': { action: 'route', path: '/modules/marketing' },
  'open accounting': { action: 'route', path: '/modules/accounting' },
  'open messaging': { action: 'route', path: '/modules/messaging' },
  'open customer service': { action: 'route', path: '/modules/customer-service' },
  'open foundai demo': { action: 'route', path: '/modules/foundai-demo' },

  'refresh dashboard': { action: 'refresh' },
  'toggle heatmap': { action: 'toggleHeatmap' },

  'ai: optimize marketing': { action: 'ai', module: 'marketing' },
  'ai: optimize accounting': { action: 'ai', module: 'accounting' },
  'ai: optimize messaging': { action: 'ai', module: 'messaging' },
};
