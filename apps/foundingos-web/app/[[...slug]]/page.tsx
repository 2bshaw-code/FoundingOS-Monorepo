/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { FounderLauncher } from '@foundingos/ui'
import { notFound, redirect } from 'next/navigation'

// /pricing and /contact are sections on the homepage, not separate pages —
// redirect straight to the matching anchor so nav links actually go somewhere.
const anchoredPages: Record<string, string> = { pricing: '/#pricing', contact: '/#contact' }
const pages = new Set(['about', 'pricing', 'contact'])

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params
  const page = slug[0] || 'home'
  if (page === 'home') return <FounderLauncher />
  if (!pages.has(page)) notFound()
  if (page in anchoredPages) redirect(anchoredPages[page])
  return <FounderLauncher page={page} />
}