'use client'

import { brandIconLabel, type BrandIcon } from './brand-icons'
import foundingos from '../assets/fos/foundingos.png'
import retail from '../assets/fos/retail.png'
import finance from '../assets/fos/finance.png'
import marketing from '../assets/fos/marketing.png'
import logistics from '../assets/fos/logistics.png'
import legal from '../assets/fos/legal.png'
import health from '../assets/fos/health.png'
import talent from '../assets/fos/talent.png'
import hr from '../assets/fos/hr.png'
import intelligence from '../assets/fos/intelligence.png'
import superdash from '../assets/fos/superdash.png'

const icons = { foundingos, retail, finance, marketing, logistics, legal, health, talent, hr, intelligence, superdash }

export function FoundingOSBrandMark({ workspace, size }: { workspace?: BrandIcon; size?: number }) {
  const dimensions = size === undefined ? undefined : { width: size, height: size }
  return <span className="foundingos-brand-mark" style={size === undefined ? undefined : { ...dimensions, flexBasis: size }}><img alt={brandIconLabel(workspace)} height={size ?? 52} src={icons[workspace ?? 'foundingos'].src} style={dimensions} width={size ?? 52} /></span>
}
