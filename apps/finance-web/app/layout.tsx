/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { FoundingOSFooter } from '@foundingos/ui/footer'
import '@foundingos/ui/styles.css'
export const metadata = { title: 'FoundFinance', description: 'FoundFinance public website.' }
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}<FoundingOSFooter /></body></html> }