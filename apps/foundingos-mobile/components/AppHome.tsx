/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// The app's front page for people who haven't signed in yet: what FoundingOS is, an animated
// FoundAI scene (the same story as the website hero), what FoundAI does in each workspace,
// how it works, and pricing. Many customers will only ever use the app, so this is the pitch.
import { useEffect, useRef, useState } from 'react'
import { Animated, Easing, StyleSheet, View } from 'react-native'
import { QuantumText, quantumColors, quantumRadius, quantumSpace } from './QuantumUI'

const GREEN = '#24C47A'
const BLUE = '#38BDF8'
const AMBER = '#FBBF24'

type Scene = { time: string; area: string; text: string; detail: string; ask?: boolean; write?: boolean }
const SCENES: Scene[] = [
  { time: '08:02', area: 'Finance', text: 'Sent invoice INV-1042 to Hart & Co', detail: '£1,240 · due 14 Oct · emailed' },
  { time: '08:04', area: 'Retail', text: 'Oat milk low — reordered 24', detail: 'Supplier emailed · £86, inside your limit' },
  { time: '08:07', area: 'Logistics', text: 'Missed delivery — rebooked', detail: 'WhatsApp sent · tomorrow 10–12' },
  { time: '08:11', area: 'Marketing', text: 'Wrote 5 posts for the autumn menu', detail: 'Instagram · Facebook · Mon–Fri', write: true },
  { time: '08:15', area: 'Finance', text: 'Chased 2 overdue invoices', detail: '£3,180 outstanding' },
  { time: '08:19', area: 'Retail', text: 'Refund £420 for order #8812', detail: 'Over your £250 limit — needs you', ask: true },
]
const STEP_MS = 1500

function FeedRow({ scene, approved }: { scene: Scene; approved: boolean }) {
  const enter = useRef(new Animated.Value(0)).current
  const pulse = useRef(new Animated.Value(1)).current
  useEffect(() => {
    Animated.timing(enter, { toValue: 1, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start()
  }, [enter])
  useEffect(() => {
    if (!scene.ask || approved) { pulse.setValue(1); return }
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 0.35, duration: 550, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 550, useNativeDriver: true }),
    ]))
    loop.start()
    return () => loop.stop()
  }, [scene.ask, approved, pulse])
  const isAsk = scene.ask && !approved
  const tint = isAsk ? AMBER : scene.write ? '#C084FC' : GREEN
  return (
    <Animated.View style={[styles.row, isAsk ? styles.rowAsk : scene.ask ? styles.rowApproved : null, { opacity: enter, transform: [{ translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }]}>
      <Animated.View style={[styles.dot, { backgroundColor: `${tint}30`, opacity: pulse }]}>
        <QuantumText variant="caption" color={tint}>{isAsk ? '!' : '✓'}</QuantumText>
      </Animated.View>
      <View style={styles.flex}>
        <QuantumText variant="overline" color={BLUE}>{scene.area}</QuantumText>
        <QuantumText variant="caption" color="#F1F5F9">{scene.text}</QuantumText>
        <QuantumText variant="caption" color={quantumColors.neutral300} style={styles.small}>{scene.ask && approved ? 'You approved · refund issued · customer told' : scene.detail}</QuantumText>
        {isAsk ? (
          <View style={styles.askButtons}>
            <View style={styles.approve}><QuantumText variant="caption" color="#04111f">Approve</QuantumText></View>
            <View style={styles.decline}><QuantumText variant="caption" color={quantumColors.neutral100}>Decline</QuantumText></View>
          </View>
        ) : null}
      </View>
      <QuantumText variant="caption" color={quantumColors.neutral500} style={styles.small}>{scene.time}</QuantumText>
    </Animated.View>
  )
}

export function FoundAiMovie() {
  const [step, setStep] = useState(0)
  const [cycle, setCycle] = useState(0)
  const total = SCENES.length + 3
  useEffect(() => {
    const timer = setInterval(() => setStep((current) => {
      const next = (current + 1) % total
      if (next === 0) setCycle((value) => value + 1)
      return next
    }), STEP_MS)
    return () => clearInterval(timer)
  }, [total])
  const approved = step >= SCENES.length + 1
  const shown = SCENES.slice(0, Math.min(step + 1, SCENES.length))
  const done = shown.filter((scene) => !scene.ask).length + (approved ? 1 : 0)
  return (
    <View accessibilityLabel="Animation of FoundAI running a business morning" style={styles.movie}>
      <View style={styles.movieBar}>
        <View style={styles.barDot} /><View style={styles.barDot} /><View style={styles.barDot} />
        <QuantumText variant="caption" color={quantumColors.neutral300} style={styles.barTitle}>FoundAI · Autopilot</QuantumText>
        <QuantumText variant="caption" color={GREEN}>● {step < SCENES.length - 1 ? 'Working…' : 'Live'}</QuantumText>
      </View>
      <View style={styles.movieHead}>
        <View style={styles.flex}>
          <QuantumText variant="label" color="#ffffff">Good morning. I&apos;ve got this.</QuantumText>
          <QuantumText variant="caption" color={quantumColors.neutral300} style={styles.small}>Your business, running itself since 08:00</QuantumText>
        </View>
        <View style={styles.count}>
          <QuantumText variant="h2" color="#34D399">{done}</QuantumText>
          <QuantumText variant="caption" color={quantumColors.neutral300} style={styles.small}>done</QuantumText>
        </View>
      </View>
      <View style={styles.feed}>
        {shown.map((scene) => <FeedRow approved={approved} key={`${cycle}-${scene.time}`} scene={scene} />)}
      </View>
      <View style={[styles.foot, { opacity: approved ? 1 : 0 }]}>
        <QuantumText variant="caption" color="#D1FAE5">{SCENES.length} jobs handled. 1 needed you — one tap.</QuantumText>
      </View>
    </View>
  )
}

const POINTS = [
  { title: 'Does the work', body: 'Sends invoices, chases payments, reorders stock, rebooks deliveries, writes and publishes posts.', tint: GREEN },
  { title: 'Asks for approval', body: 'Refunds, big spends, job offers and anything regulated wait for your tap.', tint: AMBER },
  { title: 'You set the rules', body: 'Auto, Ask me or Off for each kind of work, plus your own spend limit.', tint: BLUE },
]

const WORKSPACES = [
  { name: 'Retail', icon: '🛍', does: 'Takes orders, tracks stock, reorders from suppliers, handles returns.' },
  { name: 'Finance', icon: '💷', does: 'Sends invoices, chases late payers, matches bank lines, approves bills.' },
  { name: 'Marketing', icon: '📣', does: 'Plans campaigns, writes posts in your voice, publishes on schedule.' },
  { name: 'Logistics', icon: '🚚', does: 'Assigns drivers, plans routes, messages customers, rebooks misses.' },
  { name: 'Talent', icon: '👥', does: 'Screens applicants, schedules interviews, prepares offers and payroll.' },
  { name: 'Health', icon: '🩺', does: 'Confirms appointments, follows up patients, prepares claims.' },
  { name: 'Intelligence', icon: '✦', does: 'Spots risks and trends across everything and tells you what to do.' },
]

const STEPS = [
  { n: '1', title: 'Tell it about your business', body: 'Add your products, customers and team — or connect WhatsApp, email and payments.' },
  { n: '2', title: 'Choose your rules', body: 'Decide what FoundAI may do on its own and what it must ask you first.' },
  { n: '3', title: 'Let it run', body: 'FoundAI works through the day. You get a tap when something needs a human.' },
]

export function AppHomeSections() {
  return (
    <View style={styles.sections}>
      <View style={styles.block}>
        {POINTS.map((point) => (
          <View key={point.title} style={styles.point}>
            <QuantumText variant="label" color={point.tint}>✓</QuantumText>
            <View style={styles.flex}>
              <QuantumText variant="label">{point.title}</QuantumText>
              <QuantumText variant="caption" color={quantumColors.neutral200}>{point.body}</QuantumText>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.block}>
        <QuantumText variant="overline" color={GREEN}>One app for the whole business</QuantumText>
        <QuantumText variant="h2">What FoundAI runs for you</QuantumText>
        {WORKSPACES.map((item) => (
          <View key={item.name} style={styles.card}>
            <QuantumText variant="h3">{item.icon}</QuantumText>
            <View style={styles.flex}>
              <QuantumText variant="label">{item.name}</QuantumText>
              <QuantumText variant="caption" color={quantumColors.neutral200}>{item.does}</QuantumText>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.block}>
        <QuantumText variant="overline" color={BLUE}>How it works</QuantumText>
        <QuantumText variant="h2">Up and running in an afternoon</QuantumText>
        {STEPS.map((item) => (
          <View key={item.n} style={styles.card}>
            <View style={styles.stepNumber}><QuantumText variant="label" color="#04111f">{item.n}</QuantumText></View>
            <View style={styles.flex}>
              <QuantumText variant="label">{item.title}</QuantumText>
              <QuantumText variant="caption" color={quantumColors.neutral200}>{item.body}</QuantumText>
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.block, styles.pricing]}>
        <QuantumText variant="overline" color={GREEN}>Simple pricing</QuantumText>
        <QuantumText variant="h2">Start free. Core from £19/month.</QuantumText>
        <QuantumText variant="caption" color={quantumColors.neutral200}>Add only the workspaces you need — Finance, Logistics, Talent, Health, Intelligence — as bolt-ons. No lock-in.</QuantumText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  small: { fontSize: 12, lineHeight: 16, fontWeight: '600' },
  movie: { backgroundColor: '#0B1324', borderRadius: quantumRadius.lg, borderWidth: 1, borderColor: 'rgba(148,163,184,0.22)', overflow: 'hidden', shadowColor: BLUE, shadowOpacity: 0.25, shadowRadius: 24, shadowOffset: { width: 0, height: 10 } },
  movieBar: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: quantumSpace.md, paddingVertical: quantumSpace.sm, backgroundColor: '#0F1A30' },
  barDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#334155' },
  barTitle: { flex: 1, marginLeft: 6, fontSize: 12 },
  movieHead: { flexDirection: 'row', alignItems: 'center', padding: quantumSpace.md, gap: quantumSpace.md },
  count: { alignItems: 'center', backgroundColor: 'rgba(36,196,122,0.12)', borderColor: 'rgba(36,196,122,0.3)', borderWidth: 1, borderRadius: quantumRadius.md, paddingHorizontal: quantumSpace.md, paddingVertical: 2 },
  feed: { paddingHorizontal: quantumSpace.sm, gap: 6, minHeight: 440 },
  row: { flexDirection: 'row', gap: quantumSpace.sm, padding: quantumSpace.sm, borderRadius: quantumRadius.md, backgroundColor: 'rgba(148,163,184,0.07)', borderWidth: 1, borderColor: 'rgba(148,163,184,0.12)' },
  rowAsk: { borderColor: 'rgba(251,191,36,0.55)', backgroundColor: 'rgba(251,191,36,0.09)' },
  rowApproved: { borderColor: 'rgba(36,196,122,0.45)', backgroundColor: 'rgba(36,196,122,0.1)' },
  dot: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  askButtons: { flexDirection: 'row', gap: quantumSpace.sm, marginTop: 6 },
  approve: { backgroundColor: GREEN, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4 },
  decline: { borderColor: 'rgba(148,163,184,0.35)', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4 },
  foot: { margin: quantumSpace.sm, padding: quantumSpace.sm, borderRadius: quantumRadius.md, backgroundColor: 'rgba(36,196,122,0.15)' },
  sections: { gap: quantumSpace.xxl },
  block: { gap: quantumSpace.md },
  point: { flexDirection: 'row', gap: quantumSpace.md },
  card: { flexDirection: 'row', gap: quantumSpace.md, alignItems: 'center', padding: quantumSpace.md, borderRadius: quantumRadius.md, backgroundColor: 'rgba(148,163,184,0.07)', borderWidth: 1, borderColor: 'rgba(148,163,184,0.14)' },
  stepNumber: { width: 30, height: 30, borderRadius: 15, backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center' },
  pricing: { padding: quantumSpace.lg, borderRadius: quantumRadius.lg, backgroundColor: 'rgba(36,196,122,0.1)', borderWidth: 1, borderColor: 'rgba(36,196,122,0.3)' },
})
