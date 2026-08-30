/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export type CoreModuleId =
  | 'marketing'
  | 'accounting'
  | 'messaging'
  | 'customer-service'
  | 'foundai-demo';

export interface CoreModuleConfig {
  id: CoreModuleId;
  label: string;
  description: string;
  icon?: string;
  path: string;
}

export const CORE_MODULES: CoreModuleConfig[] = [
  {
    id: 'marketing',
    label: 'Marketing',
    description: 'Plan, launch, and track campaigns across your brand ecosystem.',
    path: '/modules/marketing',
    icon: 'megaphone',
  },
  {
    id: 'accounting',
    label: 'Accounting',
    description: 'Invoices, revenue, and financial health in one streamlined view.',
    path: '/modules/accounting',
    icon: 'banknotes',
  },
  {
    id: 'messaging',
    label: 'Messaging',
    description: 'Conversations, notifications, and outreach across all channels.',
    path: '/modules/messaging',
    icon: 'chat-bubble-left-right',
  },
  {
    id: 'customer-service',
    label: 'Customer Service',
    description: 'Tickets, SLAs, and customer happiness dashboards.',
    path: '/modules/customer-service',
    icon: 'lifebuoy',
  },
  {
    id: 'foundai-demo',
    label: 'FoundAI Demo',
    description: 'AI-powered workflows and suggestions tailored to this console.',
    path: '/modules/foundai-demo',
    icon: 'sparkles',
  },
];
