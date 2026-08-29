/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export type BrandSlug = 'founding-os' | 'foundretail' | 'foundmeat' | 'foundthis' | 'foundtalent' | 'foundcrypto' | 'founder-os' | 'foundit'

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

const primaryLetter = (mark: string) => mark === 'FoundingOS' ? 'F' : mark === 'FoundRetail' ? 'F' : mark === 'FoundMeat' ? 'F' : mark === 'FoundThis' ? 'F' : mark === 'FoundTalent' ? 'F' : 'F'
const secondaryLetter = (mark: string) => mark === 'FoundingOS' ? 'O' : mark === 'FoundRetail' ? 'r' : mark === 'FoundMeat' ? 'M' : mark === 'FoundThis' ? 'I' : mark === 'FoundTalent' ? 'T' : 'C'

function FounderOsMark({ className }: { className?: string }) {
  return monogram({ primary: '#003366', secondary: '#8BBEFF', className, mark: 'FoundingOS' })
}

function RetailMark({ className }: { className?: string }) {
  return monogram({ primary: '#25D366', secondary: '#0f172a', className, mark: 'FoundRetail' })
}

function MeatMark({ className }: { className?: string }) {
  return monogram({ primary: '#B00020', secondary: '#FDECEC', className, mark: 'FoundMeat' })
}

function ItMark({ className }: { className?: string }) {
  return monogram({ primary: '#FFD600', secondary: '#2E2E2E', className, mark: 'FoundThis' })
}

function TalentMark({ className }: { className?: string }) {
  return monogram({ primary: '#F97316', secondary: '#fff7ed', className, mark: 'FoundTalent' })
}

function CryptoMark({ className }: { className?: string }) {
  return monogram({ primary: '#7C3AED', secondary: '#EDE9FE', className, mark: 'FoundCrypto' })
}

export function BrandLogo({ brand, className = 'h-11 w-11' }: { brand: BrandSlug; className?: string }) {
  switch (brand) {
    case 'founding-os':
    case 'founder-os':
      return <FounderOsMark className={className} />
    case 'foundretail':
      return <RetailMark className={className} />
    case 'foundmeat':
      return <MeatMark className={className} />
    case 'foundthis':
    case 'foundit':
      return <ItMark className={className} />
    case 'foundtalent':
      return <TalentMark className={className} />
    case 'foundcrypto':
      return <CryptoMark className={className} />
    default:
      return <FounderOsMark className={className} />
  }
}
