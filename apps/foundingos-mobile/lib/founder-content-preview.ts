import type { Post } from '@foundingos/ui/founder-types'
import { isPublicMarketingMedia } from '@foundingos/ui/marketing-media'
import type { WorkspaceRecordDTO } from './core-operations-api'

const text = (value: unknown) => typeof value === 'string' ? value : ''
export function workspaceContentPost(record: WorkspaceRecordDTO): Post {
  const data = record.data ?? {}
  const attachment = text(data.attachment).replace(/^https:\/\/www\.foundingos\.com/, '')
  const images = Array.isArray(data.images) ? data.images : []
  const lastImage = images[images.length - 1]
  const image = lastImage && typeof lastImage === 'object' ? text(lastImage.url) : ''
  return {
    id: record.id, title: record.name, status: record.status, channel: text(data.channel) || 'Not specified',
    text: text(data.postText) || text(data.text) || text(data.body) || text(data.secondary),
    hashtags: text(data.hashtags), campaign: text(data.campaign), dueDate: text(data.dueDate) || null,
    publishedAt: text(data.publishedAt) || null, publishedUrl: text(data.publishedUrl) || null,
    updatedAt: record.updatedAt,
    previewImage: image || (isPublicMarketingMedia(attachment) && attachment.endsWith('.jpg') ? attachment : undefined),
  }
}
