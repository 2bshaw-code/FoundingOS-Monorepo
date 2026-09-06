/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/

// Placeholder entry point for real NextAuth sign-in once Commercial Mode is
// active. Deliberately does not implement real auth UI here — that remains
// out of scope until real credentials/backend activation is requested.
export default function SignInPlaceholderPage() {
  return (
    <section className="q-shell">
      <QuantumHeader
        brand={brands.foundingos}
        eyebrow="FoundingOS · Commercial Mode"
        title="Sign in"
        description="Commercial Mode is active. Real sign-in is not yet implemented — this is a placeholder entry point."
      />
    </section>
  )
}
import { brands } from '@foundingos/config'
import { QuantumHeader } from '@foundingos/ui/quantum'
