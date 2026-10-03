import { Image, type ImageSourcePropType } from 'react-native'
import { brandIconLabel, type BrandIcon } from '@foundingos/ui/brand-icons'

const icons: Record<BrandIcon | 'foundingos', ImageSourcePropType> = {
  foundingos: require('../assets/brand/foundingos.png'),
  superdash: require('../assets/brand/superdash.png'),
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

export function FoundingOSBrandMark({ workspace, size = 52 }: { workspace?: BrandIcon; size?: number }) {
  return <Image accessibilityLabel={brandIconLabel(workspace)} resizeMode="contain" source={icons[workspace ?? 'foundingos']} style={{ width: size, height: size }} />
}
