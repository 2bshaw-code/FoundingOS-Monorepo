/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import RetailWebsite from './website/page'

// Root path now renders the real FoundRetail marketing site directly. It previously
// rendered the decorative Landing "Sign In" form (which never checked any real
// credential — it unconditionally proceeded on submit) as a stand-in login gate; that
// role is now filled by the real unified Quantum login + shared session check in
// layout.tsx, so this page only ever renders for an already-authenticated (admin/free
// roam) visitor and should show the real site, not a fake login screen.
export default function RootPage() {
  return <RetailWebsite />
}
