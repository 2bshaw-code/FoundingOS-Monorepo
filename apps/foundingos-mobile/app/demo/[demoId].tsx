/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useMemo, useState } from 'react'
import { Image, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { QuantumButton, QuantumCard, QuantumScreen, QuantumSectionHeader, QuantumText, quantumSpace, useActiveQuantumTheme } from '../../components/QuantumUI'
import { getMobileQuantumBrandUpliftForDemo } from '../../lib/quantum-brand-uplift'

const demoCompletedKey = (demoId: string) => `fo_demo_completed_${demoId}`

function titleFromDemoId(demoId: string) {
  return demoId.split('-').filter(Boolean).map((part) => part[0]?.toUpperCase() + part.slice(1)).join(' ')
}

export default function MobileDemoScreen() {
  const router = useRouter()
  const { demoId: rawDemoId } = useLocalSearchParams<{ demoId?: string }>()
  const demoId = rawDemoId ?? 'marketing-suite'
  const title = titleFromDemoId(demoId)
  const theme = useActiveQuantumTheme()
  const { height, width } = useWindowDimensions()
  const [activeStep, setActiveStep] = useState(0)
  const { brand, uplift } = useMemo(() => getMobileQuantumBrandUpliftForDemo(demoId), [demoId])
  const images = uplift.demoImageRequirements
  const steps = uplift.demoSteps

  async function completeDemo() {
    await SecureStore.setItemAsync(demoCompletedKey(demoId), 'true')
    router.replace(`/survey/${demoId}`)
  }

  return (
    <QuantumScreen>
      <QuantumCard accent={brand.accent ?? theme.accent} style={[styles.viewer, { minHeight: Math.max(320, height * 0.5) }]}>
        <QuantumSectionHeader label={`How to use ${title}`} action={<QuantumText variant="h3" color={brand.accent}>{uplift.icon}</QuantumText>} />
        <View style={styles.story}>
          <QuantumText>{uplift.story}</QuantumText>
          <QuantumText variant="caption" color={theme.subtextColor}>Sphere variant: {uplift.sphereVariant}</QuantumText>
        </View>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => setActiveStep(Math.round(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width))}
        >
          {images.map((image, index) => (
            <View style={[styles.imageSlide, { width: width - quantumSpace.lg * 4 }]} key={image.uri}>
              <Image source={{ uri: image.uri }} resizeMode="contain" style={styles.image} />
              <QuantumText variant="caption" color={theme.subtextColor} align="center">
                {image.caption}
              </QuantumText>
            </View>
          ))}
        </ScrollView>
        <QuantumText variant="caption" color={theme.accent} align="center">
          Screenshot {activeStep + 1} of {images.length}
        </QuantumText>
        <View style={styles.steps}>
          {steps.map((step, index) => (
            <View style={styles.stepRow} key={step}>
              <QuantumText variant="caption" color={theme.accent}>{index + 1}</QuantumText>
              <QuantumText>{step}</QuantumText>
            </View>
          ))}
        </View>
        <QuantumButton onPress={completeDemo}>Continue to Survey</QuantumButton>
      </QuantumCard>
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  viewer: { gap: quantumSpace.md },
  story: { gap: quantumSpace.xs },
  imageSlide: { gap: quantumSpace.sm, justifyContent: 'center', padding: quantumSpace.sm, width: 320 },
  image: { borderRadius: 12, height: 220, width: '100%' },
  steps: { gap: quantumSpace.sm },
  stepRow: { alignItems: 'center', flexDirection: 'row', gap: quantumSpace.md },
})
