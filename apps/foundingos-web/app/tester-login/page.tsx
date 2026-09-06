/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { redirect } from 'next/navigation'
import { TesterLoginForm } from '@foundingos/ui/onboarding/TesterLoginForm'
import { isCommercialMode } from '@foundingos/config/commercial-mode'

export default function TesterLoginPage() {
  // Commercial Mode bypasses Tester Login entirely and routes to the (future)
  // real sign-in flow instead — this never touches the NextAuth config itself.
  if (isCommercialMode()) {
    redirect('/auth/signin')
  }

  return (
    <section className="q-shell q-centered-shell">
      <TesterLoginForm />
    </section>
  )
}
