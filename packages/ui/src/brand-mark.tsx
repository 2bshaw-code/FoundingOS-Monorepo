'use client'

import { workspaceBrandIcons, type WorkspaceBrandIcon } from './brand-icons'
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

const icons = { foundingos, retail, finance, marketing, logistics, legal, health, talent, hr, intelligence }

export function FoundingOSBrandMark({ workspace }: { workspace?: WorkspaceBrandIcon }) {
  return <span className="foundingos-brand-mark"><img alt={workspace ? `${workspaceBrandIcons[workspace].label} workspace logo` : 'FoundingOS logo'} height={52} src={icons[workspace ?? 'foundingos'].src} width={52} /></span>
}
