/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
const foundThisMark = new URL('../assets/foundit-mark.svg?protected=dc7d4d73', import.meta.url).href
const foundMeatMark = new URL('../assets/foundmeat-mark.svg?protected=6cdb12ac', import.meta.url).href
const foundTalentMark = new URL('../assets/foundtalent-mark.svg?protected=b86684c0', import.meta.url).href

type BrandMarkProps = { className?: string }

export function FoundThisBrandMark({ className = 'h-10 w-10' }: BrandMarkProps) {
  return <img className={className} src={foundThisMark} alt="FoundThis" draggable={false} />
}

export function FoundMeatBrandMark({ className = 'h-10 w-10' }: BrandMarkProps) {
  return <img className={className} src={foundMeatMark} alt="FoundMeat" draggable={false} />
}

export function FoundTalentBrandMark({ className = 'h-10 w-10' }: BrandMarkProps) {
  return <img className={className} src={foundTalentMark} alt="FoundTalent" draggable={false} />
}

export const protectedBrandAssets = Object.freeze({
  foundthis: Object.freeze({ color: '#FFD600', src: foundThisMark }),
  foundit: Object.freeze({ color: '#FFD600', src: foundThisMark }),
  foundmeat: Object.freeze({ color: '#B00020', src: foundMeatMark }),
  foundtalent: Object.freeze({ color: '#F97316', src: foundTalentMark }),
})
