import { PasswordField } from './password-field'

export default function SiteAccessPage({ searchParams }: { searchParams: { returnTo?: string; error?: string } }) {
  return <main className="complete-workspace-access">
    <section>
      <div className="complete-workspace-access-brand"><span>F</span><div><strong>FoundingOS</strong><small>Private product preview</small></div></div>
      <p className="eyebrow">Invitation only</p>
      <h1>Sign in to FoundingOS</h1>
      <p>Use your email address and the shared invitation password to explore the complete FoundingOS system.</p>
      <form action="/api/access/login" method="post">
        <input name="returnTo" type="hidden" value={searchParams.returnTo || '/'} />
        <label>Email address<input autoComplete="email" autoFocus name="email" required type="email" /></label>
        <PasswordField label="Invitation password" minLength={8} name="password" />
        {searchParams.error ? <div className="complete-workspace-error" role="alert">That email or password was not accepted. Please try again.</div> : null}
        <button className="retail-app-primary" type="submit">Open FoundingOS</button>
      </form>
      <small className="site-access-note">Access expires after seven days. Your email is recorded so we can support your preview and understand product interest.</small>
    </section>
  </main>
}
