/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { redirect } from 'next/navigation'

// Legacy stub removed — every login request across the ecosystem now goes
// through the single, real Quantum login gate at www.foundingos.com.
export default function Page() {
  redirect('https://www.foundingos.com/')
}
