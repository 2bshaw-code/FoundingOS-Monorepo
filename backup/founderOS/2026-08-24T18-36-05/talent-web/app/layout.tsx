import '@foundingos/ui/styles.css'
export const metadata = { title: 'FoundTalent', description: 'FoundTalent public website.' }
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html> }