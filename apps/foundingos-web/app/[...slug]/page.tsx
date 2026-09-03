/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { FounderLauncher } from '@foundingos/ui'
import { notFound } from 'next/navigation'

const pages = new Set(['home', 'about', 'pricing', 'contact'])

// Required (non-optional) catch-all — deliberately does NOT match "/" itself, so the
// real root page.tsx (the Quantum login gate) is never shadowed. /home is the real
// Homepage destination testers/admin/free-roam land on after logging in at "/".
export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params
  const page = slug[0] || 'home'
  if (!pages.has(page)) notFound()
  return <FounderLauncher />
}