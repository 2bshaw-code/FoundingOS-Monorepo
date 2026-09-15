/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { createAuthClient, submitPendingApplication as submitSharedPendingApplication } from '@founder-os/auth/client'

const API_BASE_URL = 'http://localhost:4000/api/v1'

export const authClient = createAuthClient({
  baseUrl: API_BASE_URL,
  authBaseUrl: `${API_BASE_URL}/retail`,
  founderAuthUrl: API_BASE_URL,
  storageKey: 'core_operations',
})

export const submitPendingApplication = (accessToken: string) =>
  submitSharedPendingApplication('core_operations', API_BASE_URL, accessToken)
