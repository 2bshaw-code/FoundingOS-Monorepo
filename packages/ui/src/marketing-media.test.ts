import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { test } from 'node:test'
import { MARKETING_MEDIA, MARKETING_SOCIAL_POSTS, isPublicMarketingMedia, marketingMediaPath, marketingMediaUrl, marketingSocialPostPath, marketingSocialPostText, withMarketingMediaLink } from './marketing-media'

test('the seven approved promotional videos exist in the website public assets', () => {
  assert.equal(MARKETING_MEDIA.length, 7)
  assert.equal(new Set(MARKETING_MEDIA.map((media) => media.file)).size, 7)
  for (const media of MARKETING_MEDIA) {
    assert.ok(existsSync(new URL(`../../../apps/foundingos-web/public${marketingMediaPath(media)}`, import.meta.url)), media.file)
    assert.equal(isPublicMarketingMedia(marketingMediaPath(media)), true)
  }
})

test('public media allowlist does not exempt private pages or unapproved files', () => {
  for (const path of ['/superdash', '/app/intelligence', '/media/marketing-library/private.mp4', '/media/marketing-library/private.jpg', '/media/marketing-library/FoundingOS-Controlled-Buyer-Demonstration.jpg', '/media/marketing-library/', `${marketingMediaPath(MARKETING_MEDIA[0])}/private`, '/media/marketing-library/../private.mp4']) {
    assert.equal(isPublicMarketingMedia(path), false, path)
  }
})

test('seven screenshot posts pair approved video frames with usable captions', () => {
  assert.equal(MARKETING_SOCIAL_POSTS.length, 7)
  assert.equal(new Set(MARKETING_SOCIAL_POSTS.map((post) => post.file)).size, 7)
  for (const post of MARKETING_SOCIAL_POSTS) {
    assert.ok(MARKETING_MEDIA.some((media) => media.file.replace(/\.mp4$/, '.jpg') === post.file))
    const image = readFileSync(new URL(`../../../apps/foundingos-web/public${marketingSocialPostPath(post)}`, import.meta.url))
    assert.equal(image.readUInt16BE(0), 0xffd8, 'Expected a real JPEG')
    assert.ok(image.length > 10000)
    assert.equal(isPublicMarketingMedia(marketingSocialPostPath(post)), true)
    assert.ok(post.caption.includes('https://www.foundingos.com'))
    assert.ok(marketingSocialPostText(post).endsWith(post.hashtags))
    assert.ok(post.caption.length > 100 && post.caption.length < 2000)
  }
})
test('using a video preserves existing post text and does not duplicate its link', () => {
  const media = MARKETING_MEDIA[0]
  const text = withMarketingMediaLink('Our new product', media)
  assert.equal(text, `Our new product\n\n${marketingMediaUrl(media)}`)
  assert.equal(withMarketingMediaLink(text, media), text)
  assert.equal(withMarketingMediaLink('', media), marketingMediaUrl(media))
})

test('Core Intelligence and founder SuperDash keep distinct navigation destinations', () => {
  const directory = readFileSync(new URL('./workspace-test-page.tsx', import.meta.url), 'utf8')
  assert.match(directory, /slug: 'intelligence', label: 'Core Intelligence'/)
  assert.match(directory, /AccountNavLinks variant="card"/)
  const nav = readFileSync(new URL('./account-nav.tsx', import.meta.url), 'utf8')
  assert.doesNotMatch(nav, /if \(!superDash\) return null/)
  assert.match(nav, /Founder, partner and investor access required/)
  assert.match(nav, /href="\/superdash"/)
})
