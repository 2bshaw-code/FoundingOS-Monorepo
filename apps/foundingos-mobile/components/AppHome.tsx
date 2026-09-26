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
type Reel = { greeting: string; since: string; approvedText: string; scenes: Scene[] }

// Each loop plays a different business and time of day so the demo never looks canned.
const REELS: Reel[] = [
  {
    greeting: 'Good morning. I\'ve got this.', since: 'Your café, running itself since 08:00', approvedText: 'You approved · refund issued · customer told',
    scenes: [
      { time: '08:02', area: 'Finance', text: 'Sent invoice INV-1042 to Hart & Co', detail: '£1,240 · due 14 Oct · emailed' },
      { time: '08:04', area: 'Retail', text: 'Oat milk running low — reordered 24', detail: 'Supplier emailed · £86, inside your £250 limit' },
      { time: '08:07', area: 'Logistics', text: 'Missed delivery — customer rebooked', detail: 'WhatsApp sent · new slot tomorrow 10–12' },
      { time: '08:11', area: 'Marketing', text: 'Wrote 5 posts for the autumn menu', detail: 'Instagram · Facebook · scheduled Mon–Fri', write: true },
      { time: '08:15', area: 'Finance', text: 'Chased 2 overdue invoices', detail: 'Friendly reminders · £3,180 outstanding' },
      { time: '08:19', area: 'Retail', text: 'Refund of £420 for order #8812', detail: 'Over your £250 limit — needs you', ask: true },
    ],
  },
  {
    greeting: 'Busy lunchtime. All handled.', since: 'Your boutique, on autopilot since 12:00', approvedText: 'You approved · offer sent · start date booked',
    scenes: [
      { time: '12:03', area: 'Retail', text: '14 online orders picked and packed', detail: 'Labels printed · courier booked for 3pm' },
      { time: '12:06', area: 'Marketing', text: 'Flash sale post is live', detail: '20% off knitwear · 312 views so far', write: true },
      { time: '12:10', area: 'Retail', text: 'Replied to 9 WhatsApp questions', detail: 'Sizes, stock and opening hours' },
      { time: '12:14', area: 'Talent', text: 'Screened 23 applicants for Saturday staff', detail: 'Shortlisted 3 · interviews offered Thursday' },
      { time: '12:18', area: 'Finance', text: 'Matched 41 card payments to sales', detail: 'Bank reconciled · £2,960 today' },
      { time: '12:21', area: 'Talent', text: 'Job offer to Priya — £11.80/hr', detail: 'Hiring decisions need you', ask: true },
    ],
  },
  {
    greeting: 'Evening wrap-up. Tomorrow is ready.', since: 'Your delivery firm, closing out the day', approvedText: 'You approved · PO sent to supplier',
    scenes: [
      { time: '18:02', area: 'Logistics', text: '47 of 48 drops completed', detail: 'Proof of delivery captured · 1 retry tomorrow' },
      { time: '18:05', area: 'Logistics', text: 'Planned tomorrow\'s 6 routes', detail: 'Saves 38 miles vs today' },
      { time: '18:09', area: 'Finance', text: 'Invoiced 12 customers for today', detail: '£6,480 · paid by card link' },
      { time: '18:12', area: 'Intelligence', text: 'Fuel spend up 14% this week', detail: 'Flagged van 3 — tyre pressure check booked' },
      { time: '18:16', area: 'Marketing', text: 'Drafted a review request to 40 customers', detail: 'Sends tomorrow 9am', write: true },
      { time: '18:20', area: 'Finance', text: 'New tyres order — £1,150', detail: 'Over your £500 purchase limit — needs you', ask: true },
    ],
  },
  {
    greeting: 'Clinic is running smoothly.', since: 'Your practice, on autopilot since 07:30', approvedText: 'You approved · cover shift confirmed',
    scenes: [
      { time: '07:32', area: 'Health', text: 'Sent 18 appointment reminders', detail: 'WhatsApp · 2 rebooked themselves' },
      { time: '07:36', area: 'Health', text: 'Filled a cancelled 10:40 slot', detail: 'Offered to the waiting list · accepted' },
      { time: '07:41', area: 'Finance', text: 'Submitted 6 insurance claims', detail: '£1,870 · tracking payment' },
      { time: '07:45', area: 'Retail', text: 'Gloves and gauze reordered', detail: 'Below minimum stock · £64' },
      { time: '07:49', area: 'Marketing', text: 'Wrote a flu-jab reminder post', detail: 'Facebook · Instagram · Friday', write: true },
      { time: '07:53', area: 'Talent', text: 'Locum cover for Dr Shah — £420', detail: 'Staffing costs need you', ask: true },
    ],
  },
]
const STEP_MS = 1500

function FeedRow({ scene, approved, approvedText }: { scene: Scene; approved: boolean; approvedText: string }) {
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
        <QuantumText variant="caption" color={quantumColors.neutral300} style={styles.small}>{scene.ask && approved ? approvedText : scene.detail}</QuantumText>
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
  const reel = REELS[cycle % REELS.length]
  const SCENES = reel.scenes
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
          <QuantumText variant="label" color="#ffffff">{reel.greeting}</QuantumText>
          <QuantumText variant="caption" color={quantumColors.neutral300} style={styles.small}>{reel.since}</QuantumText>
        </View>
        <View style={styles.count}>
          <QuantumText variant="h2" color="#34D399">{done}</QuantumText>
          <QuantumText variant="caption" color={quantumColors.neutral300} style={styles.small}>done</QuantumText>
        </View>
      </View>
      <View style={styles.feed}>
        {shown.map((scene) => <FeedRow approved={approved} approvedText={reel.approvedText} key={`${cycle}-${scene.time}`} scene={scene} />)}
      </View>
      <View style={[styles.foot, { opacity: approved ? 1 : 0 }]}>
        <QuantumText variant="caption" color="#D1FAE5">{SCENES.length} jobs handled. 1 needed you — one tap.</QuantumText>
      </View>
    </View>
  )
}

const WA_GREEN = '#25D366'
const CHAT: Array<{ from: 'you' | 'foundai'; text: string }> = [
  { from: 'you', text: 'Who owes me money this week?' },
  { from: 'foundai', text: 'Three customers owe £1,240. Harbour Cafe is 9 days late on £620.' },
  { from: 'foundai', text: 'FoundAI needs your OK: send Harbour Cafe a payment reminder (£620). Reply YES or NO.' },
  { from: 'you', text: 'YES' },
  { from: 'foundai', text: 'Done ✅ Reminder sent and logged.' },
]

// WhatsApp is the front door: owners chat with FoundAI and approve its work by replying YES.
export function WhatsAppHero() {
  return (
    <View style={styles.block}>
      <QuantumText variant="overline" color={WA_GREEN}>WhatsApp is the front door</QuantumText>
      <QuantumText variant="h2">Run the whole business from one chat</QuantumText>
      <QuantumText variant="caption" color={quantumColors.neutral200}>Text FoundAI in plain words and it answers from your real invoices, orders and stock. When it needs a decision it messages you — reply YES or NO.</QuantumText>
      <View style={styles.waPhone}>
        <View style={styles.waHead}>
          <View style={styles.waAvatar}><QuantumText variant="label" color="#04111f">F</QuantumText></View>
          <View><QuantumText variant="label" color="#fff">FoundAI</QuantumText><QuantumText style={styles.small} color="#CFE9DA">WhatsApp Business · online</QuantumText></View>
        </View>
        <View style={styles.waChat}>
          {CHAT.map((line, index) => (
            <View key={index} style={[styles.waBubble, line.from === 'you' ? styles.waYou : styles.waBot]}>
              <QuantumText variant="caption" color="#0B1324">{line.text}</QuantumText>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

const POINTS = [
  { title: 'Lives in WhatsApp', body: 'Ask questions, take orders and approve work in the chat you already open all day.', tint: WA_GREEN },
  { title: 'Does the work', body: 'Sends invoices, chases payments, reorders stock, rebooks deliveries, writes and publishes posts.', tint: GREEN },
  { title: 'Asks for approval', body: 'Refunds, big spends, job offers and anything regulated wait for your YES on WhatsApp.', tint: AMBER },
  { title: 'You set the rules', body: 'Auto, Ask me or Off for each kind of work, plus your own spend limit.', tint: BLUE },
]

const WORKSPACES = [
  { name: 'Retail', icon: '🛍', does: 'Takes orders, tracks stock, reorders from suppliers, handles returns.' },
  { name: 'Finance', icon: '💷', does: 'Sends invoices, chases late payers, matches bank lines, approves bills.' },
  { name: 'Marketing', icon: '📣', does: 'Plans campaigns, writes posts in your voice, publishes on schedule.' },
  { name: 'Logistics', icon: '🚚', does: 'Assigns drivers, plans routes, messages customers, rebooks misses.' },
  { name: 'Talent', icon: '🎯', does: 'Screens applicants, schedules interviews, chases references and prepares offers.' },
  { name: 'HR', icon: '👥', does: 'Fills rota gaps, approves timesheets, tracks holiday and sickness, prepares payroll inputs.' },
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
        <QuantumText variant="caption" color={quantumColors.neutral200}>Retail & Logistics, Talent and HR are £19/month each — take one or combine them. Add Finance or Intelligence when you need them. WhatsApp included. No lock-in.</QuantumText>
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
  waPhone: { borderRadius: quantumRadius.lg, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(37,211,102,0.35)' },
  waHead: { flexDirection: 'row', alignItems: 'center', gap: quantumSpace.sm, padding: quantumSpace.md, backgroundColor: '#075E54' },
  waAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: WA_GREEN, alignItems: 'center', justifyContent: 'center' },
  waChat: { gap: 8, padding: quantumSpace.md, backgroundColor: '#ECE5DD' },
  waBubble: { maxWidth: '85%', paddingHorizontal: 10, paddingVertical: 7, borderRadius: 10 },
  waYou: { alignSelf: 'flex-end', backgroundColor: '#DCF8C6' },
  waBot: { alignSelf: 'flex-start', backgroundColor: '#FFFFFF' },
  pricing: { padding: quantumSpace.lg, borderRadius: quantumRadius.lg, backgroundColor: 'rgba(36,196,122,0.1)', borderWidth: 1, borderColor: 'rgba(36,196,122,0.3)' },
})
