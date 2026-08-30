/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/

// Placeholder entry point for real NextAuth sign-in once Commercial Mode is
// active. Deliberately does not implement real auth UI here — that remains
// out of scope until real credentials/backend activation is requested.
export default function SignInPlaceholderPage() {
  return (
    <section className="stack" style={{ padding: '48px 24px' }}>
      <header className="module-header header-premium">
        <p>FoundingOS · Commercial Mode</p>
        <h1>Sign in</h1>
        <span>Commercial Mode is active. Real sign-in is not yet implemented — this is a placeholder entry point.</span>
      </header>
    </section>
  )
}
