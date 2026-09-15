/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { createAuthClient, submitPendingApplication as submitSharedPendingApplication } from '@founder-os/auth/client'

const API_BASE_URL = 'http://localhost:4002/api/v1'

export const authClient = createAuthClient({
  baseUrl: API_BASE_URL,
  authBaseUrl: `${API_BASE_URL}/it`,
  founderAuthUrl: API_BASE_URL,
  storageKey: 'core_intelligence',
})

export const submitPendingApplication = (accessToken: string) =>
  submitSharedPendingApplication('core_intelligence', API_BASE_URL, accessToken)
