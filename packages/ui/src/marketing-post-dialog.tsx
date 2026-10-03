'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { Post } from './founder-types'
import { fullPostCaption, postPreviewMedia } from './marketing-post-preview'

export function MarketingPostDialog({ post, example, onClose }: { post: Post; example: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const [notice, setNotice] = useState('')
  const [mediaError, setMediaError] = useState('')
  const media = postPreviewMedia(post)
  const caption = fullPostCaption(post)

  useEffect(() => {
    const element = dialog.current
    if (element && !element.open) element.showModal()
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(caption)
      setNotice('Full caption copied.')
    } catch (error) {
      setNotice(error instanceof Error ? `Could not copy: ${error.message}. Select the caption to copy manually.` : 'Could not copy. Select the caption to copy manually.')
    }
  }
  const close = () => {
    dialog.current?.close()
    onClose()
  }

  return <dialog ref={dialog} className="sd-post-dialog" aria-labelledby={titleId} onCancel={(event) => { event.preventDefault(); close() }} onClose={onClose} onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); close() } }}>
    <header><div><small>{example ? 'Example post · not a real publication' : `${post.channel || 'No channel'} · ${post.status}`}</small><h2 id={titleId}>{post.title}</h2></div><button autoFocus onClick={close} type="button">Close preview</button></header>
    <dl><div><dt>Channel</dt><dd>{post.channel || 'Not selected'}</dd></div><div><dt>Status</dt><dd>{post.status}</dd></div><div><dt>Scheduled for</dt><dd>{post.dueDate ? new Date(post.dueDate).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : 'Not scheduled'}</dd></div>{post.campaign ? <div><dt>Campaign</dt><dd>{post.campaign}</dd></div> : null}</dl>
    {media.image ? <img className="sd-post-dialog-image" src={media.image} alt={post.title} onError={() => setMediaError('The image could not load. Try the download link below.')} /> : null}
    {media.video ? <video className="sd-post-dialog-image" controls playsInline preload="metadata" onError={() => setMediaError('The video could not load. Try the download link below.')}><source src={media.video} type="video/mp4" /></video> : null}
    {mediaError ? <p className="sd-error" role="alert">{mediaError}</p> : null}
    <h3>Full caption</h3><p className="sd-post-dialog-caption">{caption || 'No caption yet.'}</p>
    {!example && (media.image || media.video) ? <p className="sd-muted">A media link or preview is not proof of a native social upload or publication.</p> : null}
    <footer><button onClick={() => void copy()} type="button">Copy full caption</button>{media.image ? <a href={media.image} download>Download image</a> : null}{media.video ? <a href={media.video} download>Download video</a> : null}{!example && post.publishedUrl ? <a href={post.publishedUrl} target="_blank" rel="noreferrer">View published post</a> : null}</footer>
    {notice ? <p role="status">{notice}</p> : null}
  </dialog>
}
