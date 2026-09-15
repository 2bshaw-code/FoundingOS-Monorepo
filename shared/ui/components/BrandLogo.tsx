/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// DEPRECATED / UNUSED: superseded by packages/ui and packages/config's suite
// registry. Not imported by any app in this repository. Retained only for
// historical reference; do not add new imports of this module.
export type BrandSlug = 'founding-os' | 'core_operations' | 'foundmeat' | 'foundthis' | 'core_workforce' | 'foundcrypto' | 'founder-os' | 'core_intelligence'

const monogram = ({ primary, secondary, className, mark }: { primary: string; secondary: string; className?: string; mark: string }) => (
  <svg className={className} viewBox="0 0 48 48" role="img" aria-label={mark}>
    <defs>
      <linearGradient id={`bg-${mark.replace(/\s+/g, '-')}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#08111d" />
        <stop offset="100%" stopColor="#111827" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="14" fill={`url(#bg-${mark.replace(/\s+/g, '-')})`} />
    <rect x="3" y="3" width="42" height="42" rx="12" fill={primary} opacity="0.9" />
    <text x="13" y="31" fontSize="25" fontWeight="700" fontFamily="Inter, Segoe UI, sans-serif" fill="white" letterSpacing="-1.5">{primaryLetter(mark)}</text>
    <text x="28" y="19" fontSize="12" fontWeight="700" fontFamily="Inter, Segoe UI, sans-serif" fill={secondary} letterSpacing="0.2">{secondaryLetter(mark)}</text>
  </svg>
)

const primaryLetter = (mark: string) => mark === 'FoundingOS' ? 'F' : mark === 'CoreOperations' ? 'F' : mark === 'FoundMeat' ? 'F' : mark === 'Intelligence' ? 'F' : mark === 'CoreWorkforce' ? 'F' : mark === 'FoundCrypto' ? 'F' : 'F'
const secondaryLetter = (mark: string) => mark === 'FoundingOS' ? 'O' : mark === 'CoreOperations' ? 'r' : mark === 'FoundMeat' ? 'M' : mark === 'Intelligence' ? 'I' : mark === 'CoreWorkforce' ? 'T' : mark === 'FoundCrypto' ? 'C' : 'C'

function FounderOsMark({ className }: { className?: string }) {
  return monogram({ primary: '#003366', secondary: '#8BBEFF', className, mark: 'FoundingOS' })
}

function RetailMark({ className }: { className?: string }) {
  return monogram({ primary: '#25D366', secondary: '#0f172a', className, mark: 'CoreOperations' })
}

function MeatMark({ className }: { className?: string }) {
  return monogram({ primary: '#B00020', secondary: '#FDECEC', className, mark: 'FoundMeat' })
}

function ItMark({ className }: { className?: string }) {
  return monogram({ primary: '#FFD600', secondary: '#2E2E2E', className, mark: 'Intelligence' })
}

function TalentMark({ className }: { className?: string }) {
  return monogram({ primary: '#F97316', secondary: '#fff7ed', className, mark: 'CoreWorkforce' })
}

function CryptoMark({ className }: { className?: string }) {
  return monogram({ primary: '#7C3AED', secondary: '#EDE9FE', className, mark: 'FoundCrypto' })
}

export function BrandLogo({ brand, className = 'h-11 w-11' }: { brand: BrandSlug; className?: string }) {
  switch (brand) {
    case 'founding-os':
    case 'founder-os':
      return <FounderOsMark className={className} />
    case 'core_operations':
      return <RetailMark className={className} />
    case 'foundmeat':
      return <MeatMark className={className} />
    case 'foundthis':
    case 'core_intelligence':
      return <ItMark className={className} />
    case 'core_workforce':
      return <TalentMark className={className} />
    case 'foundcrypto':
      return <CryptoMark className={className} />
    default:
      return <FounderOsMark className={className} />
  }
}
