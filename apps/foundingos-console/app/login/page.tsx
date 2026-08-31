/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { redirect } from 'next/navigation'

// Force dynamic rendering so this always issues a real HTTP redirect (not just a
// client-hydration-driven one from a statically prerendered page).
export const dynamic = 'force-dynamic'

// Legacy stub removed — every login request across the ecosystem now goes
// through the single, real Quantum login gate at www.foundingos.com.
export default function Login() {
  redirect('https://www.foundingos.com/')
}
