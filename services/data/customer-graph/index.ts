/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export function getCustomerGraph(customerId?: string) {
  return {
    customerId: customerId ?? 'aggregate',
    nodes: ['profile', 'orders', 'support', 'campaigns', 'payments'],
    isolation: 'tenant-and-brand-scoped',
  }
}
