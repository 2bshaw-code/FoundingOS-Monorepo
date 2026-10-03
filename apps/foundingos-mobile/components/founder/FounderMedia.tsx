import { useState } from 'react'
import { Image, Modal, Platform, ScrollView, Share, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useVideoPlayer, VideoView } from 'expo-video'
import { File, Paths } from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import * as Clipboard from 'expo-clipboard'
import { MARKETING_MEDIA, MARKETING_SOCIAL_POSTS, marketingMediaPath, marketingSocialPostPath, marketingSocialPostText, type MarketingSocialPost } from '@foundingos/ui/marketing-media'
import { fullPostCaption, postPreviewMedia } from '@foundingos/ui/marketing-post-preview'
import type { FounderPost } from '../../lib/core-operations-api'
import { QuantumButton, QuantumCard, QuantumNotice, QuantumText, SuperDashTheme } from '../QuantumUI'

const mediaUrl = (path: string) => path.startsWith('/') ? `https://www.foundingos.com${path}` : path

export function NativeVideo({ path }: { path: string }) {
  const [error, setError] = useState('')
  const player = useVideoPlayer(mediaUrl(path), (instance) => {
    instance.addListener('statusChange', ({ status, error: videoError }) => {
      setError(status === 'error' ? videoError?.message || 'The video could not be played. Check your connection.' : '')
    })
  })
  return <View>{error ? <QuantumNotice tone="danger">{error}</QuantumNotice> : null}<VideoView player={player} nativeControls contentFit="contain" style={styles.video} /></View>
}

export function FounderMediaLibrary({ onUsePost }: { onUsePost?: (post: MarketingSocialPost) => void }) {
  const [video, setVideo] = useState<string | null>(null)
  const [busy, setBusy] = useState('')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const run = async (key: string, action: () => Promise<void>) => {
    setBusy(key); setError(''); setNotice('')
    try { await action() } catch (err) { setError(err instanceof Error ? err.message : 'Could not complete the media action.') }
    finally { setBusy('') }
  }
  const shareFile = (path: string) => run(path, async () => {
    if (Platform.OS === 'web' || !await Sharing.isAvailableAsync()) throw new Error('File sharing needs the installed iOS or Android app.')
    const file = await File.downloadFileAsync(mediaUrl(path), Paths.cache, { idempotent: true })
    try { await Sharing.shareAsync(file.uri, { mimeType: path.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg', dialogTitle: 'Save or share FoundingOS media' }) }
    finally { if (file.exists) file.delete() }
  })
  return <View style={styles.stack}>
    <QuantumCard>
      <QuantumText variant="h2">Marketing media library</QuantumText>
      <QuantumText>Seven approved videos and seven screenshot posts, matching the Mac app. Preview videos inside the app; use the native share sheet to save or share files.</QuantumText>
      <QuantumText variant="caption">Captions are editable. Linked drafts do not upload native image/video attachments to social platforms. Download and upload manually for native social posts.</QuantumText>
    </QuantumCard>
    {error ? <QuantumNotice tone="danger">{error}</QuantumNotice> : null}
    {notice ? <QuantumNotice tone="success">{notice}</QuantumNotice> : null}
    {MARKETING_MEDIA.map((item) => {
      const path = marketingMediaPath(item)
      return <QuantumCard key={item.file}>
        <QuantumText variant="h3">{item.title}</QuantumText><QuantumText variant="caption">{item.format}</QuantumText>
        <QuantumButton tone="secondary" onPress={() => setVideo(path)}>Preview video</QuantumButton>
        <QuantumButton disabled={Boolean(busy)} onPress={() => void shareFile(path)}>{busy === path ? 'Downloading…' : 'Save / share video'}</QuantumButton>
      </QuantumCard>
    })}
    {MARKETING_SOCIAL_POSTS.map((post) => {
      const path = marketingSocialPostPath(post)
      return <QuantumCard key={post.file}>
        <Image accessibilityLabel={post.title} source={{ uri: mediaUrl(path) }} resizeMode="contain" style={styles.image} onError={() => setError(`Could not load "${post.title}". Check your connection.`)} />
        <QuantumText variant="h3">{post.title}</QuantumText><QuantumText variant="caption">{post.channel} · {post.format}</QuantumText>
        <QuantumText>{marketingSocialPostText(post)}</QuantumText>
        <QuantumButton disabled={Boolean(busy)} tone="secondary" onPress={() => void run(post.file, async () => { await Clipboard.setStringAsync(marketingSocialPostText(post)); setNotice('Caption copied.') })}>Copy caption</QuantumButton>
        <QuantumButton disabled={Boolean(busy)} tone="secondary" onPress={() => void shareFile(path)}>{busy === path ? 'Downloading…' : 'Save / share image'}</QuantumButton>
        {onUsePost ? <QuantumButton onPress={() => onUsePost(post)}>Use caption and image link</QuantumButton> : null}
      </QuantumCard>
    })}
    <Modal visible={Boolean(video)} animationType="slide" onRequestClose={() => setVideo(null)}>
      <SuperDashTheme><SafeAreaView style={styles.modal}><QuantumButton tone="secondary" onPress={() => setVideo(null)}>Close video</QuantumButton>{video ? <NativeVideo key={video} path={video} /> : null}</SafeAreaView></SuperDashTheme>
    </Modal>
  </View>
}

export function FounderPostPreview({ post, onClose }: { post: FounderPost | null; onClose: () => void }) {
  const [error, setError] = useState('')
  const media = post ? postPreviewMedia(post) : { image: undefined, video: undefined }
  return <Modal visible={Boolean(post)} animationType="slide" onRequestClose={onClose}>
    <SuperDashTheme><SafeAreaView style={styles.modal}><ScrollView contentContainerStyle={styles.stack}>
      <QuantumButton tone="secondary" onPress={onClose}>Close preview</QuantumButton>
      {post ? <>
        <QuantumText variant="h2">{post.title}</QuantumText><QuantumText>{post.channel} · {post.status}</QuantumText>
        <QuantumText variant="caption">{post.dueDate ? `Scheduled: ${new Date(post.dueDate).toLocaleString('en-GB')}` : 'Not scheduled'}{post.campaign ? ` · ${post.campaign}` : ''}</QuantumText>
        {error ? <QuantumNotice tone="danger">{error}</QuantumNotice> : null}
        {media.image ? <Image accessibilityLabel={post.title} source={{ uri: mediaUrl(media.image) }} resizeMode="contain" style={styles.image} onError={() => setError('Could not load the post image. Check your connection.')} /> : null}
        {media.video ? <NativeVideo key={media.video} path={media.video} /> : null}
        <QuantumText>{fullPostCaption(post)}</QuantumText>
        {post.publishedUrl ? <QuantumText>Published link: {post.publishedUrl}</QuantumText> : null}
        <QuantumButton onPress={() => { void Clipboard.setStringAsync(fullPostCaption(post)).catch((err: unknown) => setError(err instanceof Error ? err.message : 'Could not copy caption.')) }}>Copy full caption</QuantumButton>
        <QuantumButton tone="secondary" onPress={() => { void Share.share({ message: fullPostCaption(post) }).catch((err: unknown) => setError(err instanceof Error ? err.message : 'Could not share caption.')) }}>Share caption</QuantumButton>
        <QuantumText variant="caption">Previewing does not save or publish this post.</QuantumText>
      </> : null}
    </ScrollView></SafeAreaView></SuperDashTheme>
  </Modal>
}

const styles = StyleSheet.create({
  stack: { gap: 16 }, image: { width: '100%', height: 320, borderRadius: 12, backgroundColor: '#050b16' },
  video: { width: '100%', height: 320, backgroundColor: '#050b16' },
  modal: { flex: 1, padding: 16, backgroundColor: '#0d2a4a', gap: 16 },
})
