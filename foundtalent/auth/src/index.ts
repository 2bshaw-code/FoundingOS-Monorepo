/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { createAuthClient, submitPendingApplication as submitSharedPendingApplication } from '@founder-os/auth/client'

const API_BASE_URL = 'http://localhost:4003/api/v1'
const AUTH_BASE_URL = 'http://localhost:5050/api/v1/talent'

export const authClient = createAuthClient({
  baseUrl: API_BASE_URL,
  authBaseUrl: AUTH_BASE_URL,
  founderAuthUrl: AUTH_BASE_URL,
  storageKey: 'foundtalent',
})

export const submitPendingApplication = (accessToken: string) =>
  submitSharedPendingApplication('foundtalent', API_BASE_URL, accessToken)
