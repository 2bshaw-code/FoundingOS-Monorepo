/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useRef, useState } from 'react'
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio'
import type { File } from 'expo-file-system'
import type { FounderOverview } from '../lib/core-operations-api'
import { createSpokenSummary } from '../lib/voice'
import { QuantumButton, QuantumCard, QuantumText, quantumColors } from './QuantumUI'

function briefingText(data: FounderOverview, demo: boolean): string {
  const pendingRequests = data.upgradeRequests.filter((request) => request.pending.length).length
  const platformStatus = data.monitoring.apiOk
    ? `The platform API is responding, with database latency of ${Math.round(data.monitoring.dbLatencyMs)} milliseconds.`
    : 'The platform API needs attention.'
  return [
    demo ? 'Example data briefing.' : 'Founder SuperDash briefing.',
    `${data.subscriptions.customers} total customers, including ${data.subscriptions.paying} paying.`,
    `Monthly recurring revenue is ${data.finance.mrrGbp.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 })}, with annual recurring revenue of ${data.finance.arrGbp.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 })}.`,
    `${data.subscriptions.new7d} new customers in the last seven days and ${data.subscriptions.new30d} in the last thirty days.`,
    `${pendingRequests} upgrade request${pendingRequests === 1 ? '' : 's'} pending review.`,
    platformStatus,
  ].join(' ')
}

export function SpokenSuperDashBriefing({ data, demo }: { data: FounderOverview; demo: boolean }) {
  const text = briefingText(data, demo)
  const [generatingAudio, setGeneratingAudio] = useState(false)
  const [audioError, setAudioError] = useState('')
  const player = useAudioPlayer(null)
  const playerStatus = useAudioPlayerStatus(player)
  const audioFile = useRef<File | null>(null)
  const audioText = useRef<string | null>(null)
  const requestController = useRef<AbortController | null>(null)

  useEffect(() => () => {
    requestController.current?.abort()
    player.pause()
    audioFile.current?.delete()
  }, [player])

  useEffect(() => {
    requestController.current?.abort()
    player.pause()
    audioFile.current?.delete()
    audioFile.current = null
    audioText.current = null
  }, [player, text])

  async function handleListenPress() {
    setAudioError('')
    if (generatingAudio) return
    if (playerStatus.playing) {
      player.pause()
      return
    }
    if (audioFile.current && audioText.current === text) {
      await player.seekTo(0)
      player.play()
      return
    }

    const controller = new AbortController()
    requestController.current = controller
    setGeneratingAudio(true)
    try {
      player.pause()
      audioFile.current?.delete()
      audioFile.current = null
      audioText.current = null
      const file = await createSpokenSummary(text, controller.signal)
      if (controller.signal.aborted) {
        file.delete()
        return
      }
      audioFile.current = file
      audioText.current = text
      player.replace(file.uri)
      player.play()
    } catch (error) {
      if (!controller.signal.aborted) {
        setAudioError(error instanceof Error ? error.message : 'Could not generate spoken audio. Please try again.')
      }
    } finally {
      if (requestController.current === controller) requestController.current = null
      setGeneratingAudio(false)
    }
  }

  return (
    <QuantumCard>
      <QuantumText variant="label">Daily briefing</QuantumText>
      <QuantumText variant="caption" color={quantumColors.neutral300}>
        Listen to a spoken summary of the figures shown here.
      </QuantumText>
      <QuantumButton disabled={generatingAudio} onPress={handleListenPress}>
        {generatingAudio ? 'Preparing briefing…' : playerStatus.playing ? 'Pause briefing' : 'Listen to briefing'}
      </QuantumButton>
      <QuantumText variant="caption" color={quantumColors.neutral300}>
        Summary text is sent to ElevenLabs to generate audio.
      </QuantumText>
      {audioError ? <QuantumText variant="caption" color="#F87171">{audioError}</QuantumText> : null}
    </QuantumCard>
  )
}
