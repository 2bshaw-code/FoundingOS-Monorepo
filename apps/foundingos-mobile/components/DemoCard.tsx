/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useState } from 'react'
import { Image, Pressable, StyleSheet, View } from 'react-native'
import { QuantumCard, QuantumText, quantumColors, quantumRadius, quantumSpace } from './QuantumUI'

export type DemoCardProps = {
  previewImage: string
  title: string
  description: string
  brandAccent: string
  onPress?: () => void
}

export function DemoCard({ previewImage, title, description, brandAccent, onPress }: DemoCardProps) {
  const [imageUnavailable, setImageUnavailable] = useState(false)

  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <QuantumCard accent={brandAccent} style={styles.card}>
        <View style={[styles.previewFrame, { borderColor: brandAccent }]}>
          {imageUnavailable ? (
            <View style={styles.previewFallback}>
              <View style={[styles.fallbackOrb, { borderColor: brandAccent }]} />
              <QuantumText variant="caption" color={brandAccent} align="center">
                Preview image pending
              </QuantumText>
            </View>
          ) : (
            <Image
              source={{ uri: previewImage }}
              resizeMode="cover"
              style={styles.previewImage}
              onError={() => setImageUnavailable(true)}
              accessibilityLabel={`${title} preview image`}
            />
          )}
        </View>
        <View style={styles.copy}>
          <QuantumText variant="h3">{title}</QuantumText>
          <QuantumText variant="caption" color={quantumColors.neutral200}>
            {description}
          </QuantumText>
        </View>
      </QuantumCard>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    gap: quantumSpace.md,
  },
  previewFrame: {
    height: 132,
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: quantumRadius.lg,
    backgroundColor: quantumColors.neutral800,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: quantumSpace.sm,
    padding: quantumSpace.md,
  },
  fallbackOrb: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
  },
  copy: {
    gap: quantumSpace.xs,
  },
})
