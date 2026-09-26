/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { router } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Pressable, RefreshControl, StyleSheet, View } from 'react-native'
import {
  MarketingCampaign,
  MarketingWorkspace,
  SocialPost,
  createMarketingCampaign,
  createMarketingSocialPost,
  fetchMarketingWorkspace,
  generateMarketingMedia,
  getSession,
  updateMarketingCampaign,
  updateMarketingSocialPost,
} from '../../../lib/core-operations-api'
import {
  QuantumButton,
  QuantumCard,
  QuantumMetric,
  QuantumNotice,
  QuantumScreen,
  QuantumSectionHeader,
  QuantumText,
  QuantumTextInput,
  quantumSpace,
  useActiveQuantumTheme,
} from '../../../components/QuantumUI'
import { FoundAiPostWriter } from '../../../components/FoundAi'

type CampaignDraft = {
  status: string
  scheduledAt: string
  impressions: string
  engagements: string
  conversions: string
  revenuePounds: string
}

type PostDraft = {
  content: string
  status: string
  scheduledAt: string
  autoPost: boolean
}

function formatPence(pence: number | null | undefined): string {
  if (!pence) return '£0'
  return `£${(pence / 100).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return 'Not scheduled'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'Invalid date'
  return date.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function parsePlatforms(value: string) {
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
}

function parseOptionalIso(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return undefined
  const parsed = new Date(trimmed)
  if (Number.isNaN(parsed.getTime())) throw new Error('Enter a valid ISO or local date/time for scheduling.')
  return parsed.toISOString()
}

function buildCampaignDraft(campaign: MarketingCampaign): CampaignDraft {
  return {
    status: campaign.status,
    scheduledAt: campaign.scheduledAt ?? '',
    impressions: String(campaign.impressions ?? 0),
    engagements: String(campaign.engagements ?? 0),
    conversions: String(campaign.conversions ?? 0),
    revenuePounds: String((campaign.revenuePence ?? 0) / 100),
  }
}

function buildPostDraft(post: SocialPost): PostDraft {
  return {
    content: post.content,
    status: post.status,
    scheduledAt: post.scheduledAt ?? '',
    autoPost: Boolean(post.autoPost),
  }
}

export default function MarketingScreen() {
  const theme = useActiveQuantumTheme()
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [workspace, setWorkspace] = useState<MarketingWorkspace | null>(null)
  const [notice, setNotice] = useState('')
  const [campaignName, setCampaignName] = useState('')
  const [campaignObjective, setCampaignObjective] = useState('')
  const [campaignAudience, setCampaignAudience] = useState('')
  const [campaignPlatforms, setCampaignPlatforms] = useState('whatsapp, instagram')
  const [campaignScheduledAt, setCampaignScheduledAt] = useState('')
  const [postContent, setPostContent] = useState('')
  const [postPlatforms, setPostPlatforms] = useState('whatsapp')
  const [postScheduledAt, setPostScheduledAt] = useState('')
  const [postAutoPost, setPostAutoPost] = useState(false)
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('')
  const [generationFormat, setGenerationFormat] = useState('Campaign copy')
  const [generationBrief, setGenerationBrief] = useState('')
  const [busy, setBusy] = useState<string | null>(null)
  const [campaignDrafts, setCampaignDrafts] = useState<Record<string, CampaignDraft>>({})
  const [postDrafts, setPostDrafts] = useState<Record<string, PostDraft>>({})
  const [expandedCampaignId, setExpandedCampaignId] = useState<string | null>(null)
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null)

  const load = useCallback(async () => {
    const session = await getSession()
    setConnected(Boolean(session))
    if (!session) {
      setLoading(false)
      return
    }
    const nextWorkspace = await fetchMarketingWorkspace().catch(() => null)
    setWorkspace(nextWorkspace)
    if (nextWorkspace) {
      setCampaignDrafts(Object.fromEntries(nextWorkspace.campaigns.map((campaign) => [campaign.id, buildCampaignDraft(campaign)])))
      setPostDrafts(Object.fromEntries(nextWorkspace.socialPosts.map((post) => [post.id, buildPostDraft(post)])))
      if (!selectedCampaignId && nextWorkspace.campaigns[0]) setSelectedCampaignId(nextWorkspace.campaigns[0].id)
    }
    setLoading(false)
  }, [selectedCampaignId])

  useEffect(() => {
    load()
  }, [load])

  const campaigns = workspace?.campaigns ?? []
  const socialPosts = workspace?.socialPosts ?? []
  const mediaHistory = workspace?.media ?? []

  const totals = useMemo(() => ({
    campaigns: workspace?.metrics.campaigns ?? 0,
    scheduledPosts: workspace?.metrics.scheduledPosts ?? 0,
    conversions: workspace?.metrics.conversions ?? 0,
    revenuePence: workspace?.metrics.revenuePence ?? 0,
  }), [workspace])

  const setCampaignDraft = (campaignId: string, patch: Partial<CampaignDraft>) => {
    setCampaignDrafts((current) => ({ ...current, [campaignId]: { ...current[campaignId], ...patch } }))
  }

  const setPostDraft = (postId: string, patch: Partial<PostDraft>) => {
    setPostDrafts((current) => ({ ...current, [postId]: { ...current[postId], ...patch } }))
  }

  const handleCreateCampaign = async () => {
    if (!campaignName.trim()) {
      setNotice('Campaign name is required.')
      return
    }
    setBusy('create-campaign')
    try {
      await createMarketingCampaign({
        name: campaignName.trim(),
        objective: campaignObjective.trim() || undefined,
        audience: campaignAudience.trim() || undefined,
        platforms: parsePlatforms(campaignPlatforms),
        scheduledAt: parseOptionalIso(campaignScheduledAt),
      })
      setCampaignName('')
      setCampaignObjective('')
      setCampaignAudience('')
      setCampaignScheduledAt('')
      setNotice('Campaign created.')
      await load()
    } catch (error: any) {
      setNotice(error?.message || 'Campaign could not be created.')
    } finally {
      setBusy(null)
    }
  }

  const handleSaveCampaign = async (campaign: MarketingCampaign) => {
    const draft = campaignDrafts[campaign.id]
    if (!draft) return
    setBusy(`campaign-${campaign.id}`)
    try {
      await updateMarketingCampaign(campaign.id, {
        status: draft.status,
        scheduledAt: draft.scheduledAt.trim() ? parseOptionalIso(draft.scheduledAt) : null,
        impressions: Number(draft.impressions || 0),
        engagements: Number(draft.engagements || 0),
        conversions: Number(draft.conversions || 0),
        revenuePence: Math.round(Number(draft.revenuePounds || 0) * 100),
      })
      setNotice('Campaign updated.')
      await load()
    } catch (error: any) {
      setNotice(error?.message || 'Campaign update failed.')
    } finally {
      setBusy(null)
    }
  }

  const handleCreatePost = async () => {
    if (!postContent.trim()) {
      setNotice('Post content is required.')
      return
    }
    setBusy('create-post')
    try {
      await createMarketingSocialPost({
        campaignId: selectedCampaignId || undefined,
        content: postContent.trim(),
        platforms: parsePlatforms(postPlatforms),
        scheduledAt: parseOptionalIso(postScheduledAt),
        autoPost: postAutoPost,
      })
      setPostContent('')
      setPostScheduledAt('')
      setPostAutoPost(false)
      setNotice('Social post created.')
      await load()
    } catch (error: any) {
      setNotice(error?.message || 'Social post could not be created.')
    } finally {
      setBusy(null)
    }
  }

  const handleSavePost = async (post: SocialPost) => {
    const draft = postDrafts[post.id]
    if (!draft) return
    setBusy(`post-${post.id}`)
    try {
      await updateMarketingSocialPost(post.id, {
        content: draft.content,
        status: draft.status,
        scheduledAt: draft.scheduledAt.trim() ? parseOptionalIso(draft.scheduledAt) : null,
        autoPost: draft.autoPost,
      })
      setNotice('Social post updated.')
      await load()
    } catch (error: any) {
      setNotice(error?.message || 'Social post update failed.')
    } finally {
      setBusy(null)
    }
  }

  const handleGenerate = async () => {
    if (!generationBrief.trim()) {
      setNotice('Generation brief is required.')
      return
    }
    setBusy('generate-media')
    try {
      await generateMarketingMedia({ format: generationFormat.trim() || 'Campaign copy', brief: generationBrief.trim() })
      setGenerationBrief('')
      setNotice('Content generated and saved to history.')
      await load()
    } catch (error: any) {
      setNotice(error?.message || 'Content generation failed.')
    } finally {
      setBusy(null)
    }
  }

  if (loading) {
    return (
      <QuantumScreen scroll={false} contentStyle={styles.center}>
        <ActivityIndicator color={theme.accent} />
      </QuantumScreen>
    )
  }

  return (
    <QuantumScreen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false) }} tintColor={theme.accent} />}>
      <QuantumCard accent={theme.accent}>
        <QuantumText variant="overline" color={theme.accent}>Core.Operations · Marketing</QuantumText>
        <QuantumText variant="h1">Marketing Console</QuantumText>
        <QuantumText color={theme.subtextColor}>
          Real campaigns and social posts from the live backend. FoundAI writes posts in your brand voice, and Autopilot publishes approved posts to Facebook, Instagram and LinkedIn once connected.
        </QuantumText>
      </QuantumCard>

      {connected ? <FoundAiPostWriter /> : null}

      {notice ? <QuantumNotice tone="info">{notice}</QuantumNotice> : null}
      {!connected ? (
        <View style={{ gap: quantumSpace.sm }}>
          <QuantumNotice tone="warning">Sign in with your Core.Operations account to manage live marketing records.</QuantumNotice>
          <QuantumButton onPress={() => router.replace({ pathname: '/', params: { returnTo: '/(app)/(tabs)/marketing' } })}>Sign in</QuantumButton>
        </View>
      ) : null}
      {connected && !workspace ? <QuantumNotice tone="danger">Marketing data could not be loaded. Pull to refresh.</QuantumNotice> : null}

      {workspace ? (
        <>
          <View style={styles.metricRow}>
            <QuantumMetric label="Campaigns" value={totals.campaigns} tone="info" />
            <QuantumMetric label="Scheduled posts" value={totals.scheduledPosts} tone="watch" />
            <QuantumMetric label="Conversions" value={totals.conversions} tone="good" />
            <QuantumMetric label="Revenue" value={formatPence(totals.revenuePence)} tone="good" />
          </View>

          <QuantumCard accent={theme.accent}>
            <QuantumText variant="h3">Create campaign</QuantumText>
            <QuantumTextInput value={campaignName} onChangeText={setCampaignName} placeholder="Campaign name" />
            <QuantumTextInput value={campaignObjective} onChangeText={setCampaignObjective} placeholder="Objective" />
            <QuantumTextInput value={campaignAudience} onChangeText={setCampaignAudience} placeholder="Audience" />
            <QuantumTextInput value={campaignPlatforms} onChangeText={setCampaignPlatforms} placeholder="Platforms, comma-separated" />
            <QuantumTextInput value={campaignScheduledAt} onChangeText={setCampaignScheduledAt} placeholder="Optional schedule (ISO or local date/time)" />
            <QuantumButton onPress={handleCreateCampaign} disabled={busy === 'create-campaign'}>
              {busy === 'create-campaign' ? 'Saving…' : 'Create campaign'}
            </QuantumButton>
          </QuantumCard>

          <QuantumSectionHeader label="Live campaigns" />
          {campaigns.length === 0 ? (
            <QuantumNotice>No campaigns have been created yet for this tenant.</QuantumNotice>
          ) : (
            campaigns.map((campaign) => {
              const draft = campaignDrafts[campaign.id] ?? buildCampaignDraft(campaign)
              const expanded = expandedCampaignId === campaign.id
              return (
                <QuantumCard key={campaign.id} accent={theme.accent}>
                  <Pressable onPress={() => setExpandedCampaignId(expanded ? null : campaign.id)}>
                    <View style={styles.rowBetween}>
                      <View style={styles.flex}>
                        <QuantumText variant="h3">{campaign.name}</QuantumText>
                        <QuantumText variant="caption" color={theme.subtextColor}>{campaign.objective} · {campaign.audience}</QuantumText>
                      </View>
                      <QuantumText variant="caption" color={theme.accent}>{campaign.status.toUpperCase()}</QuantumText>
                    </View>
                    <QuantumText variant="caption" color={theme.subtextColor}>Scheduled {formatDate(campaign.scheduledAt)}</QuantumText>
                    <QuantumText variant="caption" color={theme.subtextColor}>Platforms: {campaign.platforms.join(', ') || 'None recorded'}</QuantumText>
                    {campaign.caption ? <QuantumText>{campaign.caption}</QuantumText> : null}
                    {campaign.hashtags ? <QuantumText variant="caption" color={theme.subtextColor}>{campaign.hashtags}</QuantumText> : null}
                  </Pressable>
                  {expanded ? (
                    <View style={styles.editorStack}>
                      {campaign.idea ? <QuantumText variant="caption" color={theme.subtextColor}>Idea: {campaign.idea}</QuantumText> : null}
                      {campaign.adCopy ? <QuantumText variant="caption" color={theme.subtextColor}>Ad copy: {campaign.adCopy}</QuantumText> : null}
                      <QuantumTextInput value={draft.status} onChangeText={(value) => setCampaignDraft(campaign.id, { status: value })} placeholder="Status" />
                      <QuantumTextInput value={draft.scheduledAt} onChangeText={(value) => setCampaignDraft(campaign.id, { scheduledAt: value })} placeholder="Schedule" />
                      <QuantumTextInput value={draft.impressions} onChangeText={(value) => setCampaignDraft(campaign.id, { impressions: value })} placeholder="Impressions" keyboardType="numeric" />
                      <QuantumTextInput value={draft.engagements} onChangeText={(value) => setCampaignDraft(campaign.id, { engagements: value })} placeholder="Engagements" keyboardType="numeric" />
                      <QuantumTextInput value={draft.conversions} onChangeText={(value) => setCampaignDraft(campaign.id, { conversions: value })} placeholder="Conversions" keyboardType="numeric" />
                      <QuantumTextInput value={draft.revenuePounds} onChangeText={(value) => setCampaignDraft(campaign.id, { revenuePounds: value })} placeholder="Revenue (£)" keyboardType="numeric" />
                      <QuantumButton onPress={() => handleSaveCampaign(campaign)} disabled={busy === `campaign-${campaign.id}`}>
                        {busy === `campaign-${campaign.id}` ? 'Saving…' : 'Save campaign updates'}
                      </QuantumButton>
                    </View>
                  ) : null}
                </QuantumCard>
              )
            })
          )}

          <QuantumCard accent={theme.accent}>
            <QuantumText variant="h3">Create social post</QuantumText>
            {campaigns.length ? (
              <View style={styles.chipRow}>
                {campaigns.map((campaign) => (
                  <QuantumButton key={campaign.id} tone={selectedCampaignId === campaign.id ? 'primary' : 'secondary'} onPress={() => setSelectedCampaignId(campaign.id)}>
                    {campaign.name}
                  </QuantumButton>
                ))}
              </View>
            ) : null}
            <QuantumTextInput value={postContent} onChangeText={setPostContent} placeholder="Write the post content" multiline style={styles.multiline} />
            <QuantumTextInput value={postPlatforms} onChangeText={setPostPlatforms} placeholder="Platforms, comma-separated" />
            <QuantumTextInput value={postScheduledAt} onChangeText={setPostScheduledAt} placeholder="Optional schedule (ISO or local date/time)" />
            <QuantumButton tone={postAutoPost ? 'primary' : 'secondary'} onPress={() => setPostAutoPost((value) => !value)}>
              {postAutoPost ? 'Auto-post enabled' : 'Auto-post disabled'}
            </QuantumButton>
            <QuantumButton onPress={handleCreatePost} disabled={busy === 'create-post'}>
              {busy === 'create-post' ? 'Saving…' : 'Create social post'}
            </QuantumButton>
          </QuantumCard>

          <QuantumSectionHeader label="Social publishing queue" />
          {socialPosts.length === 0 ? (
            <QuantumNotice>No social posts have been created yet.</QuantumNotice>
          ) : (
            socialPosts.map((post) => {
              const draft = postDrafts[post.id] ?? buildPostDraft(post)
              const expanded = expandedPostId === post.id
              return (
                <QuantumCard key={post.id} accent={theme.accent}>
                  <Pressable onPress={() => setExpandedPostId(expanded ? null : post.id)}>
                    <View style={styles.rowBetween}>
                      <QuantumText variant="h3" style={styles.flex}>{post.status.toUpperCase()}</QuantumText>
                      <QuantumText variant="caption" color={theme.accent}>{post.autoPost ? 'AUTO-POST' : 'MANUAL'}</QuantumText>
                    </View>
                    <QuantumText>{post.content}</QuantumText>
                    <QuantumText variant="caption" color={theme.subtextColor}>Platforms: {post.platforms.join(', ') || 'None recorded'}</QuantumText>
                    <QuantumText variant="caption" color={theme.subtextColor}>Scheduled {formatDate(post.scheduledAt)}</QuantumText>
                  </Pressable>
                  {expanded ? (
                    <View style={styles.editorStack}>
                      <QuantumTextInput value={draft.content} onChangeText={(value) => setPostDraft(post.id, { content: value })} multiline style={styles.multiline} />
                      <QuantumTextInput value={draft.status} onChangeText={(value) => setPostDraft(post.id, { status: value })} placeholder="Status" />
                      <QuantumTextInput value={draft.scheduledAt} onChangeText={(value) => setPostDraft(post.id, { scheduledAt: value })} placeholder="Schedule" />
                      <QuantumButton tone={draft.autoPost ? 'primary' : 'secondary'} onPress={() => setPostDraft(post.id, { autoPost: !draft.autoPost })}>
                        {draft.autoPost ? 'Auto-post enabled' : 'Auto-post disabled'}
                      </QuantumButton>
                      <QuantumButton onPress={() => handleSavePost(post)} disabled={busy === `post-${post.id}`}>
                        {busy === `post-${post.id}` ? 'Saving…' : 'Save post updates'}
                      </QuantumButton>
                    </View>
                  ) : null}
                </QuantumCard>
              )
            })
          )}

          <QuantumCard accent={theme.accent}>
            <QuantumText variant="h3">Generate content</QuantumText>
            <QuantumText variant="caption" color={theme.subtextColor}>This live endpoint generates text/copy from your operational context and stores the result in history. It does not generate images.</QuantumText>
            <QuantumTextInput value={generationFormat} onChangeText={setGenerationFormat} placeholder="Format" />
            <QuantumTextInput value={generationBrief} onChangeText={setGenerationBrief} placeholder="Brief" multiline style={styles.multiline} />
            <QuantumButton onPress={handleGenerate} disabled={busy === 'generate-media'}>
              {busy === 'generate-media' ? 'Generating…' : 'Generate campaign copy'}
            </QuantumButton>
          </QuantumCard>

          <QuantumSectionHeader label="Generated copy history" />
          {mediaHistory.length === 0 ? (
            <QuantumNotice>No generated copy is stored yet.</QuantumNotice>
          ) : (
            mediaHistory.map((entry) => (
              <QuantumCard key={entry.id} accent={theme.accent}>
                <View style={styles.rowBetween}>
                  <QuantumText variant="h3" style={styles.flex}>{entry.format}</QuantumText>
                  <QuantumText variant="caption" color={theme.accent}>{formatDate(entry.createdAt)}</QuantumText>
                </View>
                <QuantumText variant="caption" color={theme.subtextColor}>{entry.brief}</QuantumText>
                <QuantumText>{entry.output}</QuantumText>
              </QuantumCard>
            ))
          )}
        </>
      ) : null}
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: quantumSpace.md },
  flex: { flex: 1 },
  metricRow: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  editorStack: { gap: quantumSpace.sm },
  multiline: { minHeight: 96, textAlignVertical: 'top' },
})
