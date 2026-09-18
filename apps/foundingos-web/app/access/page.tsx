export default function SiteAccessPage({ searchParams }: { searchParams: { returnTo?: string; error?: string } }) {
  return <main className="complete-workspace-access">
    <section>
      <div className="complete-workspace-access-brand"><span>F</span><div><strong>FoundingOS</strong><small>Private product preview</small></div></div>
      <p className="eyebrow">Invitation only</p>
      <h1>Enter the preview password</h1>
      <p>This private environment contains interactive FoundingOS workspaces for invited testers.</p>
      <form action="/api/access/login" method="post">
        <input name="returnTo" type="hidden" value={searchParams.returnTo || '/'} />
        <label>Shared password<input autoComplete="current-password" autoFocus minLength={8} name="password" required type="password" /></label>
        {searchParams.error ? <div className="complete-workspace-error" role="alert">That password was not accepted. Please try again.</div> : null}
        <button className="retail-app-primary" type="submit">Open FoundingOS</button>
      </form>
      <a className="site-access-admin" href="https://console.foundingos.com/tester/login">Founder or administrator? Sign in with your account →</a>
      <small className="site-access-note">Access expires after seven days. Do not forward customer or provider credentials.</small>
    </section>
  </main>
}
