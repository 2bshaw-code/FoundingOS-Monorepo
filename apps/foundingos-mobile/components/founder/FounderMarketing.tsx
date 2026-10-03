/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// SuperDash Marketing: grow FoundingOS itself — sign-up funnel, FoundAI post writer,
// content calendar, and the publishing queue (autopilot posts Approved posts when due).
import { useCallback, useEffect, useState } from 'react'
import { Alert, Image, Pressable, Share, StyleSheet, View } from 'react-native'
import { marketingSocialPostPath, type MarketingSocialPost } from '@foundingos/ui/marketing-media'
import { fullPostCaption, postPreviewMedia } from '@foundingos/ui/marketing-post-preview'
import { isDemoData } from '../../lib/demo-data'
import { FounderPostPreview } from './FounderMedia'
import { deleteFounderPost, fetchFounderMarketing, publishSocialNow, saveFounderPost, updateFounderPost, writeFoundAiPost, type FounderMarketing, type FounderPost } from '../../lib/core-operations-api'
import { MonthCalendar, dayKey } from '../MonthCalendar'
import { QuantumButton, QuantumCard, QuantumNotice, QuantumPill, QuantumSectionHeader, QuantumText, QuantumTextInput, quantumColors, quantumSpace } from '../QuantumUI'

const CHANNELS = ['LinkedIn', 'Instagram', 'Facebook', 'TikTok', 'Email']
const SOCIAL = ['LinkedIn', 'Instagram', 'Facebook']

export function FounderMarketingPanel({ reloadKey, readOnly = false, selectedMedia }: { reloadKey: number; readOnly?: boolean; selectedMedia?: MarketingSocialPost | null }) {
  const [data, setData] = useState<FounderMarketing | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState('')
  const [day, setDay] = useState(() => dayKey(new Date(Date.now() + 24 * 3600_000)))
  const [time, setTime] = useState('10:00')
  const [topic, setTopic] = useState('')
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [channel, setChannel] = useState('LinkedIn')
  const [selectedPost, setSelectedPost] = useState<FounderPost | null>(null)
  const writeDisabled = readOnly || isDemoData()
  useEffect(() => {
    if (!selectedMedia) return
    setTitle(selectedMedia.title); setChannel(selectedMedia.channel)
    setText(`${selectedMedia.caption}\n\nhttps://www.foundingos.com${marketingSocialPostPath(selectedMedia)}`)
    setHashtags(selectedMedia.hashtags)
  }, [selectedMedia])

  const load = useCallback(async () => {
    try { setData(await fetchFounderMarketing()); setError('') } catch (err: any) { setError(err?.message || 'Could not load marketing.') }
  }, [])
  useEffect(() => { void load() }, [load, reloadKey])

  const run = async (key: string, task: () => Promise<void>) => {
    if (writeDisabled) { setError('This view is read-only. Use live figures with founder access to make changes.'); return }
    setBusy(key); setError(''); setNotice('')
    try { await task() } catch (err: any) { setError(err?.message || 'Something went wrong.') } finally { setBusy('') }
  }
  const draft = () => run('draft', async () => {
    const result = await writeFoundAiPost({ topic: topic || 'Why small businesses let FoundingOS run their operations', type: 'Social post', tone: 'Professional', platform: channel, previous: text || undefined })
    setTitle(result.headline)
    setText(`${result.body}${result.cta ? `\n\n${result.cta}` : ''}`)
    setHashtags(result.hashtags.map((tag) => (tag.startsWith('#') ? tag : `#${tag}`)).join(' '))
  })
  const save = (status: 'Approved' | 'Draft') => run(status, async () => {
    if (!/^([01]?\d|2[0-3]):[0-5]\d$/.test(time)) throw new Error('Enter a valid time in HH:MM format.')
    const [hours, minutes] = time.split(':').map(Number)
    const due = new Date(`${day}T00:00:00`); due.setHours(hours, minutes, 0, 0)
    await saveFounderPost({ title, text, hashtags, channel, dueDate: due.toISOString(), status })
    setNotice(status === 'Approved' ? 'Scheduled — FoundAI publishes it when it is due.' : 'Saved as a draft.')
    setTitle(''); setText(''); setHashtags('')
    await load()
  })
  const publish = (post: FounderPost) => run(post.id, async () => { await publishSocialNow(post.id); setNotice('Published ✓'); await load() })
  const update = (post: FounderPost, status: string) => run(post.id, async () => { await updateFounderPost(post.id, { status }); await load() })
  const remove = (post: FounderPost) => Alert.alert('Delete post?', post.title, [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => void run(post.id, async () => { await deleteFounderPost(post.id); await load() }) }])

  const f = data?.funnel
  const posts = data?.posts ?? []
  const items = posts.filter((post) => post.dueDate || post.publishedAt).map((post) => ({ id: post.id, date: (post.publishedAt || post.dueDate)!, title: post.title, tone: (post.status === 'Published' ? 'good' : post.status === 'Approved' ? 'info' : 'muted') as 'good' | 'info' | 'muted' }))
  const onDay = posts.filter((post) => { const at = post.publishedAt || post.dueDate; return at ? dayKey(new Date(at)) === day : false })
  const queue = posts.filter((post) => post.status !== 'Published').sort((a, b) => (a.dueDate || '9').localeCompare(b.dueDate || '9'))
  const maxWeek = Math.max(1, ...(f?.signupsByWeek.map((week) => week.signups) ?? [1]))

  return (
    <View style={styles.wrap}>
      {error ? <QuantumNotice tone="danger">{error}</QuantumNotice> : null}
      {notice ? <QuantumNotice tone="success">{notice}</QuantumNotice> : null}
      <View style={styles.kpis}>
        <Kpi label="Sign-ups · 30d" value={String(f?.signups30d ?? 0)} sub={`${f?.signups7d ?? 0} this week`} />
        <Kpi label="Free → paid" value={`${f?.conversionPct ?? 0}%`} sub={`${f?.paying ?? 0} of ${f?.customers ?? 0}`} />
        <Kpi label="Scheduled" value={String(queue.filter((post) => post.status === 'Approved').length)} sub={`${queue.filter((post) => post.status === 'Draft').length} drafts`} />
        <Kpi label="Channels" value={[data?.channels.linkedin ? 'LinkedIn' : '', data?.channels.facebookInstagram ? 'Meta' : ''].filter(Boolean).join(' + ') || 'None'} sub={data?.channels.linkedin || data?.channels.facebookInstagram ? 'auto-publishing' : 'connect on the web'} alert={Boolean(data && !data.channels.linkedin && !data.channels.facebookInstagram)} />
      </View>

      <QuantumSectionHeader label="Content calendar" />
      <QuantumCard>
        <MonthCalendar items={items} onSelectDay={setDay} selectedDay={day} />
        <QuantumText variant="label">{new Date(`${day}T12:00:00`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</QuantumText>
        {onDay.length ? onDay.map((post) => <PostCard readOnly={writeDisabled} onPreview={setSelectedPost} busy={busy === post.id} key={post.id} onDelete={remove} onPublish={publish} onUpdate={update} post={post} />) : <QuantumText variant="caption" color={quantumColors.neutral300}>Nothing on this day — the post you write below will be scheduled here.</QuantumText>}
      </QuantumCard>

      <QuantumSectionHeader label="Write a post with FoundAI" />
      <QuantumCard>
        <QuantumTextInput onChangeText={setTopic} placeholder="What should it be about?" value={topic} />
        <View style={styles.pills}>{CHANNELS.map((item) => <QuantumPill active={channel === item} key={item} onPress={() => setChannel(item)}>{item}</QuantumPill>)}</View>
        <QuantumButton disabled={writeDisabled || busy === 'draft'} tone="secondary" onPress={draft}>{busy === 'draft' ? 'FoundAI is writing…' : text ? 'Another version' : 'Draft it with FoundAI'}</QuantumButton>
        <QuantumTextInput onChangeText={setTitle} placeholder="Headline" value={title} />
        <QuantumTextInput multiline onChangeText={setText} placeholder="Post text" style={styles.body} value={text} />
        <QuantumTextInput onChangeText={setHashtags} placeholder="#hashtags" value={hashtags} />
        <View style={styles.row}>
          <QuantumText variant="caption" style={styles.flex}>Posts on {new Date(`${day}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} at</QuantumText>
          <QuantumTextInput onChangeText={setTime} placeholder="10:00" style={styles.time} value={time} />
        </View>
        <View style={styles.row}>
          <QuantumButton disabled={writeDisabled || !title || !text || Boolean(busy)} style={styles.flex} onPress={() => save('Approved')}>{busy === 'Approved' ? 'Scheduling…' : 'Schedule'}</QuantumButton>
          <QuantumButton disabled={writeDisabled || !title || !text || Boolean(busy)} style={styles.flex} tone="secondary" onPress={() => save('Draft')}>Save draft</QuantumButton>
        </View>
        <QuantumText variant="caption">{writeDisabled ? 'View-only / example mode: saving and publishing are disabled. ' : ''}Media links are saved as text, not native social attachments.</QuantumText>
      </QuantumCard>

      <QuantumSectionHeader label="Sign-ups by week" />
      <QuantumCard>
        <View style={styles.bars}>{f?.signupsByWeek.map((week) => <View key={week.weekOf} style={[styles.bar, { height: `${Math.max(4, (week.signups / maxWeek) * 100)}%` }]} />)}</View>
      </QuantumCard>

      <QuantumSectionHeader label={`Queue · ${queue.length}`} />
      {queue.map((post) => <QuantumCard key={post.id}><PostCard readOnly={writeDisabled} onPreview={setSelectedPost} busy={busy === post.id} onDelete={remove} onPublish={publish} onUpdate={update} post={post} /></QuantumCard>)}
      <FounderPostPreview key={selectedPost?.id ?? 'closed'} post={selectedPost} onClose={() => setSelectedPost(null)} />
      {!queue.length ? <QuantumText variant="caption" color={quantumColors.neutral300}>No posts waiting.</QuantumText> : null}
    </View>
  )
}

function PostCard({ post, busy, readOnly, onPreview, onPublish, onUpdate, onDelete }: { post: FounderPost; busy: boolean; readOnly: boolean; onPreview: (post: FounderPost) => void; onPublish: (post: FounderPost) => void; onUpdate: (post: FounderPost, status: string) => void; onDelete: (post: FounderPost) => void }) {
  const [shareError, setShareError] = useState('')
  const image = postPreviewMedia(post).image
  return (
    <View style={styles.post}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Preview ${post.title}`} onPress={() => onPreview(post)}>
        <QuantumText variant="label">{post.title}</QuantumText>
        {image ? <Image source={{ uri: image.startsWith('/') ? `https://www.foundingos.com${image}` : image }} accessibilityLabel={post.title} resizeMode="contain" style={{ height: 180, width: '100%' }} onError={() => setShareError('Could not load post image. Check your connection.')} /> : null}
      </Pressable>
      <QuantumText variant="caption" color={quantumColors.neutral300}>{post.channel} · {post.status}{post.dueDate ? ` · ${new Date(post.dueDate).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}` : ''}</QuantumText>
      <QuantumText variant="caption" numberOfLines={4}>{post.text}</QuantumText>
      <QuantumButton tone="secondary" onPress={() => onPreview(post)}>Preview post</QuantumButton>
      {shareError ? <QuantumNotice tone="danger">{shareError}</QuantumNotice> : null}
      {post.status !== 'Published' && !readOnly ? (
        <View style={styles.pills}>
          {post.status === 'Draft' ? <QuantumPill onPress={busy ? undefined : () => onUpdate(post, 'Approved')}>Approve</QuantumPill> : null}
          {SOCIAL.includes(post.channel) ? <QuantumPill onPress={busy ? undefined : () => onPublish(post)}>Publish now</QuantumPill> : <QuantumPill onPress={busy ? undefined : () => onUpdate(post, 'Published')}>Mark published</QuantumPill>}
          <QuantumPill onPress={() => { void Share.share({ message: fullPostCaption(post) }).catch((err: unknown) => setShareError(err instanceof Error ? err.message : 'Could not share caption.')) }}>Share</QuantumPill>
          <QuantumPill onPress={busy ? undefined : () => onDelete(post)}>Delete</QuantumPill>
        </View>
      ) : null}
    </View>
  )
}

function Kpi({ label, value, sub, alert }: { label: string; value: string; sub: string; alert?: boolean }) {
  return (
    <View style={[styles.kpi, alert ? styles.kpiAlert : null]}>
      <QuantumText variant="caption" color={quantumColors.neutral300}>{label}</QuantumText>
      <QuantumText variant="h3">{value}</QuantumText>
      <QuantumText variant="caption" color={quantumColors.neutral300}>{sub}</QuantumText>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { gap: quantumSpace.sm },
  flex: { flex: 1 },
  kpis: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  kpi: { width: '48%', flexGrow: 1, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.04)', padding: quantumSpace.md, gap: 2 },
  kpiAlert: { borderColor: '#FBBF24', backgroundColor: 'rgba(251,191,36,0.08)' },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  body: { minHeight: 120, textAlignVertical: 'top' },
  time: { width: 84, textAlign: 'center' },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 90 },
  bar: { flex: 1, backgroundColor: '#38BDF8', borderRadius: 4 },
  post: { gap: 4, paddingVertical: 6 },
})
