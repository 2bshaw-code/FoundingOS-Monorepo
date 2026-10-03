import type { Post } from './founder-types'
import { MARKETING_MEDIA, MARKETING_SOCIAL_POSTS, marketingMediaPath, marketingMediaUrl, marketingSocialPostPath } from './marketing-media'

export function fullPostCaption(post: Pick<Post, 'text' | 'hashtags'>) {
  const tags = post.hashtags.trim()
  return tags && !post.text.includes(tags) ? `${post.text}\n\n${tags}` : post.text
}

export function postPreviewMedia(post: Pick<Post, 'text' | 'previewImage'>) {
  const links = post.text.split(/\s+/)
  const image = post.previewImage || MARKETING_SOCIAL_POSTS.map(marketingSocialPostPath).find((path) => links.includes(`https://www.foundingos.com${path}`) || links.includes(path))
  const video = MARKETING_MEDIA.find((media) => links.includes(marketingMediaUrl(media)) || links.includes(marketingMediaPath(media)))
  return { image, video: video ? marketingMediaPath(video) : undefined }
}
