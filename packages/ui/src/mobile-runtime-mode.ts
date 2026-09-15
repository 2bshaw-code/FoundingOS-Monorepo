/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/

// Shared demo/production API base resolver for all mobile apps.
// In demo mode (EXPO_PUBLIC_APP_MODE=demo, the default whenever the flag is unset or any
// production credential is missing) every app talks to an in-process/local mock instead of
// the real console backend, so builds and previews never require network access or
// production credentials.
export const IS_DEMO_MODE = process.env.EXPO_PUBLIC_APP_MODE !== 'production'

// Base URL used only when IS_DEMO_MODE is false. Callers must not fetch this in demo mode.
export function resolveConsoleBase(productionUrl: string): string {
  return IS_DEMO_MODE ? 'demo://local-mock' : productionUrl
}
