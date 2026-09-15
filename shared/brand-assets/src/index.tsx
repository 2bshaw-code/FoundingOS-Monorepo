/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
const intelligenceMark = new URL('../assets/core_intelligence-mark.svg', import.meta.url).href
const operationsMark = new URL('../assets/core_operations-mark.svg', import.meta.url).href
const workforceMark = new URL('../assets/core_workforce-mark.svg', import.meta.url).href

type BrandMarkProps = { className?: string }

export function IntelligenceBrandMark({ className = 'h-10 w-10' }: BrandMarkProps) {
  return <img className={className} src={intelligenceMark} alt="Core Intelligence" draggable={false} />
}

export function CoreOperationsBrandMark({ className = 'h-10 w-10' }: BrandMarkProps) {
  return <img className={className} src={operationsMark} alt="Core Operations" draggable={false} />
}

export function CoreWorkforceBrandMark({ className = 'h-10 w-10' }: BrandMarkProps) {
  return <img className={className} src={workforceMark} alt="Core Workforce" draggable={false} />
}

export const protectedBrandAssets = Object.freeze({
  core_intelligence: Object.freeze({ color: '#FFD600', src: intelligenceMark }),
  core_operations: Object.freeze({ color: '#0EA5E9', src: operationsMark }),
  core_workforce: Object.freeze({ color: '#F97316', src: workforceMark }),
})
