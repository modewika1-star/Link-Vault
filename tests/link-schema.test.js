import test from 'node:test'
import assert from 'node:assert/strict'
import linkSchema, { editLinkSchema } from '../src/features/links/validation/linkSchema.js'

const base = {
  title: 'Useful website',
  url: 'https://example.com',
  description: 'A useful page with details.',
  coverImageUrl: 'https://example.com/cover.png',
  notes: '',
  collectionId: '',
  favorite: false,
}

test('accepts bookmarks with required details and HTTP or HTTPS URLs', async () => {
  await assert.doesNotReject(() => linkSchema.validate(base))
  await assert.doesNotReject(() => linkSchema.validate({ ...base, url: 'http://example.com' }))
})

test('rejects unsafe or unsupported bookmark URL protocols', async () => {
  for (const url of ['javascript:alert(1)', 'ftp://example.com/file', 'file:///etc/passwd', 'example.com']) {
    await assert.rejects(() => linkSchema.validate({ ...base, url }))
  }
})

test('requires a title, URL, description, and cover image for new bookmarks', async () => {
  await assert.rejects(() => linkSchema.validate({ ...base, title: '   ' }))
  await assert.rejects(() => linkSchema.validate({ ...base, url: '' }))
  await assert.rejects(() => linkSchema.validate({ ...base, description: '   ' }))
  await assert.rejects(() => linkSchema.validate({ ...base, coverImageUrl: '' }))
})

test('keeps notes optional and limits them to 2,000 characters', async () => {
  await assert.doesNotReject(() => linkSchema.validate({ ...base, notes: '' }))
  await assert.doesNotReject(() => linkSchema.validate({ ...base, notes: 'n'.repeat(2000) }))
  await assert.rejects(() => linkSchema.validate({ ...base, notes: 'n'.repeat(2001) }))
})

test('accepts valid HTTP and HTTPS cover image URLs', async () => {
  await assert.doesNotReject(() => linkSchema.validate(base))
  await assert.doesNotReject(() => linkSchema.validate({ ...base, coverImageUrl: 'http://example.com/cover.png' }))
})

test('rejects malformed or unsupported cover image URLs', async () => {
  for (const coverImageUrl of ['not-a-url', 'javascript:alert(1)', 'ftp://example.com/cover.png']) {
    await assert.rejects(() => linkSchema.validate({ ...base, coverImageUrl }))
  }
})

test('allows older bookmarks without optional description and cover image to be edited', async () => {
  await assert.doesNotReject(() => editLinkSchema.validate({
    ...base,
    description: '',
    coverImageUrl: '',
  }))
})
