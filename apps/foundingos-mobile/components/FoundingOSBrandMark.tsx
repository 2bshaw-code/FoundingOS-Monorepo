import { Image, type ImageSourcePropType } from 'react-native'
import { workspaceBrandIcons, type WorkspaceBrandIcon } from '@foundingos/ui/brand-icons'

const icons: Record<WorkspaceBrandIcon | 'foundingos', ImageSourcePropType> = {
  foundingos: require('../assets/brand/foundingos.png'),
  retail: require('../assets/brand/retail.png'),
  finance: require('../assets/brand/finance.png'),
  marketing: require('../assets/brand/marketing.png'),
  logistics: require('../assets/brand/logistics.png'),
  legal: require('../assets/brand/legal.png'),
  health: require('../assets/brand/health.png'),
  talent: require('../assets/brand/talent.png'),
  hr: require('../assets/brand/hr.png'),
  intelligence: require('../assets/brand/intelligence.png'),
}

export function FoundingOSBrandMark({ workspace, size = 52 }: { workspace?: WorkspaceBrandIcon; size?: number }) {
  return <Image accessibilityLabel={workspace ? `${workspaceBrandIcons[workspace].label} workspace logo` : 'FoundingOS logo'} resizeMode="contain" source={icons[workspace ?? 'foundingos']} style={{ width: size, height: size }} />
}
