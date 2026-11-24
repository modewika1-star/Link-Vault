import test from 'node:test'
import assert from 'node:assert/strict'
import linkSchema from '../src/features/links/validation/linkSchema.js'

const base = {
  title: 'Useful website',
  url: 'https://example.com',
  notes: '',
  collectionId: '',
  favorite: false,
}

test('accepts secure HTTP and HTTPS bookmarks', async () => {
  await assert.doesNotReject(() => linkSchema.validate({ ...base, url: 'https://example.com' }))
  await assert.doesNotReject(() => linkSchema.validate({ ...base, url: 'http://example.com' }))
})

test('rejects unsafe or unsupported URL protocols', async () => {
  for (const url of ['javascript:alert(1)', 'ftp://example.com/file', 'file:///etc/passwd', 'example.com']) {
    await assert.rejects(() => linkSchema.validate({ ...base, url }))
  }
})

test('requires a non-empty title and URL', async () => {
  await assert.rejects(() => linkSchema.validate({ ...base, title: '   ' }))
  await assert.rejects(() => linkSchema.validate({ ...base, url: '' }))
})

test('limits optional notes to 2,000 characters', async () => {
  await assert.doesNotReject(() => linkSchema.validate({ ...base, notes: 'n'.repeat(2000) }))
  await assert.rejects(() => linkSchema.validate({ ...base, notes: 'n'.repeat(2001) }))
})

test('accepts optional HTTP and HTTPS cover images', async () => {
  await assert.doesNotReject(() => linkSchema.validate({ ...base, coverImageUrl: '' }))
  await assert.doesNotReject(() => linkSchema.validate({ ...base, coverImageUrl: 'https://example.com/cover.png' }))
})

test('rejects unsupported cover image protocols', async () => {
  await assert.rejects(() => linkSchema.validate({ ...base, coverImageUrl: 'javascript:alert(1)' }))
  await assert.rejects(() => linkSchema.validate({ ...base, coverImageUrl: 'ftp://example.com/cover.png' }))
})
