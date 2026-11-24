import test from 'node:test'
import assert from 'node:assert/strict'
import { verifyBookmarkUrl, verifyCoverImage } from '../src/features/links/services/linkValidationService.js'

test('verifies a bookmark through Microlink and accepts a successful HTTP response', async () => {
  let requestedUrl = ''

  const result = await verifyBookmarkUrl('https://example.com', async (endpoint, options) => {
    assert.equal(endpoint, 'https://api.microlink.io/')
    requestedUrl = options.params.url
    return { data: { status: 'success', data: { statusCode: 200, url: 'https://example.com/' } } }
  })

  assert.equal(requestedUrl, 'https://example.com/')
  assert.equal(result.statusCode, 200)
})

test('rejects non-successful pages and unsuccessful Microlink responses', async () => {
  await assert.rejects(
    () => verifyBookmarkUrl('https://example.com/missing', async () => ({
      data: { status: 'success', data: { statusCode: 404 } },
    })),
    { field: 'url' },
  )

  await assert.rejects(
    () => verifyBookmarkUrl('https://example.com', async () => ({
      data: { status: 'fail', data: { code: 'EUNREACHABLE' } },
    })),
    { field: 'url' },
  )
})

test('does not make a request for an invalid bookmark URL', async () => {
  let requestMade = false

  await assert.rejects(
    () => verifyBookmarkUrl('javascript:alert(1)', async () => {
      requestMade = true
    }),
    { field: 'url' },
  )

  assert.equal(requestMade, false)
})

test('rejects a bookmark when the verification service cannot be reached', async () => {
  await assert.rejects(
    () => verifyBookmarkUrl('https://example.com', async () => {
      throw new Error('Network error')
    }),
    { field: 'url' },
  )
})

test('accepts a cover image after the browser successfully loads it', async () => {
  class LoadedImage {
    constructor() {
      this.complete = false
      this.naturalWidth = 0
    }

    set src(value) {
      this.url = value
      this.complete = true
      this.naturalWidth = 640
    }
  }

  await assert.doesNotReject(() => verifyCoverImage('https://example.com/cover.png', LoadedImage))
})

test('rejects a cover image when the browser cannot load it', async () => {
  class BrokenImage {
    constructor() {
      this.complete = false
      this.naturalWidth = 0
    }

    set src(value) {
      this.url = value
      this.complete = true
    }
  }

  await assert.rejects(
    () => verifyCoverImage('https://example.com/missing.png', BrokenImage),
    { field: 'coverImageUrl' },
  )
})
