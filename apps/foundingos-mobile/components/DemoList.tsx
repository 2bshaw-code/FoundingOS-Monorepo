/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import { BRANDS } from '../lib/brands'
import { MOBILE_DEMO_BRAND_CARDS } from '../lib/quantum-brand-uplift'
import { DemoCard } from './DemoCard'
import { QuantumSectionHeader, quantumSpace } from './QuantumUI'

type DemoListItem = {
  id: string
  previewImage: string
  route: string
  title: string
  description: string
  brandAccent: string
}

const brandBySlug = Object.fromEntries(BRANDS.map((brand) => [brand.slug, brand]))

const demoItems: DemoListItem[] = MOBILE_DEMO_BRAND_CARDS.map((demo) => ({
  id: demo.id,
  previewImage: demo.previewImage,
  route: demo.route,
  title: demo.title,
  description: demo.description,
  brandAccent: brandBySlug[demo.sourceBrandSlug]?.accent ?? brandBySlug.foundingos.accent,
}))

export function DemoList() {
  return (
    <View style={styles.wrap}>
      <QuantumSectionHeader label="Brand demos" />
      <View style={styles.grid}>
        {demoItems.map((demo) => (
          <DemoCard
            key={demo.id}
            previewImage={demo.previewImage}
            title={demo.title}
            description={demo.description}
            brandAccent={demo.brandAccent}
            onPress={() => router.push(demo.route)}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    gap: quantumSpace.md,
  },
  grid: {
    gap: quantumSpace.md,
  },
})
