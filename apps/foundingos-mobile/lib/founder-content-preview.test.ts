import assert from 'node:assert/strict'
import test from 'node:test'
import { workspaceContentPost } from './founder-content-preview'

test('native content preview reads the same stored caption and approved screenshot as web', () => {
  const record = { id: 'content-1', reference: 'SOCIAL-1', name: 'Full post', status: 'Draft', ownerId: null, valuePence: null, version: 1, updatedAt: '2026-10-03T10:00:00Z', data: { postText: 'A complete caption '.repeat(40), hashtags: '#FoundingOS', channel: 'Instagram', attachment: '/media/marketing-library/FoundingOS-Social-Product-Photo.jpg', dueDate: '2026-10-05' } }
  const preview = workspaceContentPost(record)
  assert.equal(preview.text, record.data.postText)
  assert.equal(preview.previewImage, record.data.attachment)
  assert.equal(preview.channel, 'Instagram')
  assert.equal(preview.publishedAt, null)
  assert.equal(workspaceContentPost({ ...record, data: { ...record.data, attachment: '/private/documents/file.jpg' } }).previewImage, undefined)
})
