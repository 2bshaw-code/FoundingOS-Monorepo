import assert from 'node:assert/strict'
import { test } from 'node:test'
import { fullPostCaption, postPreviewMedia } from './marketing-post-preview'

test('preview preserves the full caption and includes hashtags exactly once', () => {
  const text = 'A full caption. '.repeat(40)
  assert.equal(fullPostCaption({ text, hashtags: '#FoundingOS #Retail' }), `${text}\n\n#FoundingOS #Retail`)
  assert.equal(fullPostCaption({ text: `${text}\n\n#FoundingOS #Retail`, hashtags: '#FoundingOS #Retail' }), `${text}\n\n#FoundingOS #Retail`)
  assert.equal(fullPostCaption({ text, hashtags: '' }), text)
})

test('preview resolves both demo images and approved live post media links', () => {
  const image = '/media/marketing-library/FoundingOS-Social-Product-Photo.jpg'
  const video = '/media/marketing-library/FoundingOS-Legal-16x9.mp4'
  assert.equal(postPreviewMedia({ text: '', previewImage: image }).image, image)
  assert.deepEqual(postPreviewMedia({ text: `Caption\n\nhttps://www.foundingos.com${image}\nhttps://www.foundingos.com${video}` }), { image, video })
  assert.deepEqual(postPreviewMedia({ text: `https://untrusted.example${image}\nhttps://www.foundingos.com${video}.private` }), { image: undefined, video: undefined })
  assert.deepEqual(postPreviewMedia({ text: 'Text-only draft' }), { image: undefined, video: undefined })
})
