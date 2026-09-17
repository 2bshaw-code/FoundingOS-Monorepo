import { redirect } from 'next/navigation'

export const metadata = { title: 'Deprecated | FoundingOS' }

export default function DeprecatedScrapingDashboardPage() {
  redirect('/dashboard')
}
