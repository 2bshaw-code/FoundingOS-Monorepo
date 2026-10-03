'use client'

import { useState } from 'react'
import { MARKETING_MEDIA, MARKETING_SOCIAL_POSTS, marketingMediaPath, marketingSocialPostPath, marketingSocialPostText, type MarketingMedia, type MarketingSocialPost } from './marketing-media'

export function MarketingMediaLibrary({ onSelect, onSelectPost }: { onSelect?: (media: MarketingMedia) => void; onSelectPost?: (post: MarketingSocialPost) => void }) {
  const [failed, setFailed] = useState<string[]>([])
  const [copyNotice, setCopyNotice] = useState('')
  const copyPost = async (post: MarketingSocialPost) => {
    try {
      await navigator.clipboard.writeText(marketingSocialPostText(post))
      setCopyNotice(`Caption copied: ${post.title}`)
    } catch (error) {
      setCopyNotice(error instanceof Error ? `Could not copy caption: ${error.message}. Select the caption below to copy manually.` : 'Could not copy caption. Select it below to copy manually.')
    }
  }
  return <section className="sd-panel sd-wide sd-media-library" aria-label="Marketing media library">
    <h2>Media library</h2>
    <p className="sd-muted">Seven videos and seven screenshot social posts for FoundingOS promotion. Captions are editable drafts; illustrated businesses and conversations use sample data.</p>
    <h3>Screenshot social posts</h3>
    <p className="sd-muted">Download a JPG and copy its caption for a native image post. Use caption and image link to prepare a linked draft in FoundAI posts; this does not attach or upload the image to a social network.</p>
    {copyNotice ? <p role="status">{copyNotice}</p> : null}
    <div className="sd-media-grid">
      {MARKETING_SOCIAL_POSTS.map((post) => <article key={post.file}>
        <img alt={`${post.title}, screenshot from the FoundingOS promotional video`} loading="lazy" src={marketingSocialPostPath(post)} onError={() => setFailed((current) => current.includes(post.file) ? current : [...current, post.file])} />
        <h3>{post.title}</h3><small>{post.format} · Suggested channel: {post.channel}</small>
        {failed.includes(post.file) ? <p className="sd-error" role="alert">This image could not load. Try downloading the JPG directly.</p> : null}
        <p className="sd-social-caption">{post.caption}</p><p>{post.hashtags}</p>
        <div className="sd-form-row">
          <a download={post.file} href={marketingSocialPostPath(post)}>Download JPG</a>
          <button onClick={() => void copyPost(post)} type="button">Copy caption</button>
          {onSelectPost ? <button onClick={() => onSelectPost(post)} type="button">Use caption and image link</button> : null}
        </div>
      </article>)}
    </div>
    <h3>Promotional videos</h3>
    <p className="sd-muted">Use a video link in a draft or scheduled post. Native video uploads to social networks are not supported yet. Download the MP4 to upload it manually.</p>
    {!onSelect ? <p><a href="/superdash#marketing/posts">Open the post composer to use a video link</a></p> : null}
    <div className="sd-media-grid">
      {MARKETING_MEDIA.map((media) => <article key={media.file}>
        <video aria-label={`${media.title} (${media.format})`} controls playsInline preload="none" onError={() => setFailed((current) => current.includes(media.file) ? current : [...current, media.file])}>
          <source src={marketingMediaPath(media)} type="video/mp4" />
        </video>
        <h3>{media.title}</h3><small>{media.format}</small>
        {failed.includes(media.file) ? <p className="sd-error" role="alert">This video could not load. Try opening the MP4 directly.</p> : null}
        <div className="sd-form-row">
          <a href={marketingMediaPath(media)} target="_blank" rel="noreferrer">Open video</a>
          <a download={media.file} href={marketingMediaPath(media)}>Download MP4</a>
          {onSelect ? <button onClick={() => onSelect(media)} type="button">Use video link</button> : null}
        </div>
      </article>)}
    </div>
  </section>
}
