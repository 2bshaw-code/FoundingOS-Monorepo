/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useState } from 'react'
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import { sendProductRating } from '../lib/core-operations-api'
import { QuantumButton, QuantumCard, QuantumText, QuantumTextInput, quantumSpace } from './QuantumUI'

// Private 1–5 star rating sent only to the FoundingOS team (shown in SuperDash, never published).
export function ProductRatingCard() {
  const [score, setScore] = useState(0)
  const [comment, setComment] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const submit = async () => {
    setState('sending')
    try {
      await sendProductRating({ score, comment, surface: Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'mobile', page: 'app/account' })
      setState('sent')
    } catch (error) {
      setState('error')
      setMessage(error instanceof Error ? error.message : 'Could not send your rating.')
    }
  }

  if (state === 'sent') return <QuantumCard><QuantumText variant="h3">Thank you</QuantumText><QuantumText variant="caption">Your rating was sent privately to the FoundingOS team.</QuantumText></QuantumCard>
  return (
    <QuantumCard>
      <QuantumText variant="h3">Rate FoundingOS</QuantumText>
      <QuantumText variant="caption">Private feedback for the FoundingOS team. It is not published.</QuantumText>
      <View accessibilityLabel="Your rating" style={styles.stars}>
        {[1, 2, 3, 4, 5].map((value) => (
          <Pressable accessibilityLabel={`${value} star${value === 1 ? '' : 's'}`} accessibilityRole="button" accessibilityState={{ selected: score === value }} hitSlop={6} key={value} onPress={() => setScore(value)}>
            <Text style={[styles.star, value <= score ? styles.starOn : null]}>★</Text>
          </Pressable>
        ))}
      </View>
      <QuantumTextInput maxLength={1000} multiline onChangeText={setComment} placeholder="What should we improve? (optional)" value={comment} />
      {state === 'error' ? <QuantumText variant="caption" color="#b42318">{message}</QuantumText> : null}
      <QuantumButton disabled={!score || state === 'sending'} onPress={() => { void submit() }}>{state === 'sending' ? 'Sending…' : 'Send rating'}</QuantumButton>
    </QuantumCard>
  )
}

const styles = StyleSheet.create({
  stars: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.xs, marginVertical: quantumSpace.xs },
  star: { color: '#c5ceda', fontSize: 32, lineHeight: 38 },
  starOn: { color: '#f5a623' },
})
