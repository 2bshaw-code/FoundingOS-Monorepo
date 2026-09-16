/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { router } from 'expo-router'
import { BRAND } from '../../lib/brand'
import { fetchClinicFeed, type ScheduleItem, type StaffingRow } from '../../lib/clinic-feed'
import { getHealthActions, recordScheduleAction, type ScheduleAction } from '../../lib/health-actions'

const KIND_ICON: Record<string, string> = { supply: '💊', outreach: '🚐', equipment: '🛠️', staffing: '👥' }

// Clinic Schedule — upcoming clinic-wide events (supply deliveries, mobile outreach visits,
// equipment maintenance, staff shift rotations) plus who's on shift right now, with
// confirm/reschedule actions that honestly record locally on this device
// (lib/health-actions.ts). This is clinic operations scheduling, not one patient's personal
// appointment book.
export default function AppointmentsScreen() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [staffing, setStaffing] = useState<StaffingRow[]>([])
  const [actions, setActions] = useState<Record<string, ScheduleAction>>({})
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [disclaimer, setDisclaimer] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      const [feed, local] = await Promise.all([fetchClinicFeed(), getHealthActions()])
      if (feed) {
        setSchedule(feed.schedule)
        setStaffing(feed.staffing)
        setDisclaimer(feed.disclaimer)
      } else {
        setError('Could not load the clinic schedule. Pull down to try again.')
      }
      setActions(local.scheduleActions)
    } catch {
      setError('Could not load the clinic schedule. Pull down to try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function handleAction(scheduleId: string, status: 'confirmed' | 'rescheduled') {
    setBusyId(scheduleId)
    try {
      const note = status === 'rescheduled' ? 'Reschedule requested — a coordinator will follow up.' : undefined
      const action = await recordScheduleAction(scheduleId, status, note)
      setActions((prev) => ({ ...prev, [scheduleId]: action }))
    } finally {
      setBusyId(null)
    }
  }

  function statusLabel(scheduleId: string, serverStatus: ScheduleItem['status']): { text: string; color: string } {
    const local = actions[scheduleId]
    if (local?.status === 'confirmed') return { text: '✓ Confirmed (on this device)', color: '#00FF66' }
    if (local?.status === 'rescheduled') return { text: '↻ Reschedule requested (on this device)', color: '#FFDD00' }
    if (serverStatus === 'scheduled') return { text: 'Scheduled', color: '#b9c2cf' }
    return { text: serverStatus, color: '#b9c2cf' }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={BRAND.accent} />
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 120}}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={BRAND.accent} />}
    >
      <Text style={styles.intro}>Clinic schedule — deliveries, outreach, maintenance and shifts. Confirm or request a reschedule below.</Text>
      {disclaimer ? <Text style={styles.disclaimer}>⚠ {disclaimer}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Pressable style={[styles.navButton, { borderColor: BRAND.accent }]} onPress={() => router.push('/patients')}>
          <Text style={[styles.navButtonText, { color: BRAND.accent }]}>Patients</Text>
        </Pressable>
        <Pressable style={[styles.navButton, { borderColor: BRAND.accent }]} onPress={() => router.push('/medical-billing')}>
          <Text style={[styles.navButtonText, { color: BRAND.accent }]}>Medical Billing</Text>
        </Pressable>
      </View>

      {staffing.length ? (
        <View style={[styles.card, { borderColor: BRAND.accent }]}>
          <Text style={styles.cardTitle}>On shift now</Text>
          {staffing.map((row) => (
            <View key={row.role} style={styles.staffRow}>
              <Text style={styles.staffRole}>{row.role}</Text>
              <Text style={styles.staffCount}>{row.onShiftNow}/{row.total}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {!loading && schedule.length === 0 && !error ? <Text style={styles.empty}>Nothing scheduled.</Text> : null}

      {schedule.map((item) => {
        const status = statusLabel(item.id, item.status)
        const isConfirmed = actions[item.id]?.status === 'confirmed'
        const isRescheduled = actions[item.id]?.status === 'rescheduled'
        return (
          <View key={item.id} style={[styles.card, { borderColor: BRAND.accent }]}>
            <Text style={styles.cardTitle}>{KIND_ICON[item.kind] ?? '•'} {item.title}</Text>
            <Text style={styles.cardMeta}>{item.detail}</Text>
            <Text style={styles.cardTime}>{new Date(item.timestamp).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</Text>
            <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>

            <View style={styles.actionRow}>
              <Pressable
                disabled={busyId === item.id || isConfirmed}
                style={[styles.actionButton, { backgroundColor: BRAND.accent, opacity: isConfirmed ? 0.5 : 1 }]}
                onPress={() => handleAction(item.id, 'confirmed')}
              >
                <Text style={styles.actionButtonText}>{isConfirmed ? 'Confirmed' : 'Confirm'}</Text>
              </Pressable>
              <Pressable
                disabled={busyId === item.id || isRescheduled}
                style={[styles.actionButtonOutline, { borderColor: BRAND.accent, opacity: isRescheduled ? 0.5 : 1 }]}
                onPress={() => handleAction(item.id, 'rescheduled')}
              >
                <Text style={[styles.actionButtonOutlineText, { color: BRAND.accent }]}>{isRescheduled ? 'Requested' : 'Reschedule'}</Text>
              </Pressable>
            </View>
          </View>
        )
      })}

      <Text style={styles.footnote}>Confirm/reschedule actions are recorded on this device only — there is no live scheduling system connected yet.</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F2942' },
  navButton: { borderWidth: 1, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14 },
  navButtonText: { fontSize: 12, fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F2942' },
  intro: { color: '#b9c2cf', fontSize: 13, marginBottom: 2 },
  disclaimer: { color: '#FFDD00', fontSize: 11, marginBottom: 4 },
  error: { color: '#ff5470', fontSize: 13 },
  empty: { color: '#b9c2cf', fontSize: 13 },
  card: { backgroundColor: '#11161f', borderWidth: 1, borderRadius: 16, padding: 14, gap: 4 },
  cardTitle: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  cardMeta: { color: '#b9c2cf', fontSize: 12 },
  cardTime: { color: '#5b6472', fontSize: 12, marginTop: 2 },
  statusText: { fontSize: 12, fontWeight: '700', marginTop: 4 },
  staffRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  staffRole: { color: '#b9c2cf', fontSize: 13 },
  staffCount: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  actionButton: { flex: 1, borderRadius: 999, paddingVertical: 10, alignItems: 'center' },
  actionButtonText: { color: '#071014', fontWeight: '800', fontSize: 13 },
  actionButtonOutline: { flex: 1, borderRadius: 999, paddingVertical: 10, alignItems: 'center', borderWidth: 1.5 },
  actionButtonOutlineText: { fontWeight: '800', fontSize: 13 },
  footnote: { color: '#5b6472', fontSize: 11, textAlign: 'center', marginTop: 4, marginBottom: 20 },
})
