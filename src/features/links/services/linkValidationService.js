import api from '../../../lib/axios.js'

const MICROLINK_ENDPOINT = 'https://api.microlink.io/'
const IMAGE_LOAD_TIMEOUT = 12_000

function createFieldError(message, field) {
  const error = new Error(message)
  error.field = field
  return error
}

function parseHttpUrl(value, field, message) {
  try {
    const parsedUrl = new URL(String(value || '').trim())
    if (!['http:', 'https:'].includes(parsedUrl.protocol) || !parsedUrl.hostname) {
      throw new Error('Unsupported protocol')
    }
    return parsedUrl
  } catch {
    throw createFieldError(message, field)
  }
}

export async function verifyBookmarkUrl(value, request = api.get) {
  const parsedUrl = parseHttpUrl(
    value,
    'url',
    'Enter a valid HTTP or HTTPS link before saving.',
  )

  let response
  try {
    response = await request(MICROLINK_ENDPOINT, {
      params: { url: parsedUrl.href },
      timeout: 15_000,
    })
  } catch {
    throw createFieldError(
      'This website could not be reached. Check the URL and try again.',
      'url',
    )
  }

  const result = response?.data
  const statusCode = Number(result?.data?.statusCode)

  if (
    result?.status !== 'success' ||
    !Number.isInteger(statusCode) ||
    statusCode < 200 ||
    statusCode >= 400
  ) {
    throw createFieldError(
      'This website could not be reached. Check the URL and try again.',
      'url',
    )
  }

  return result.data
}

export function verifyCoverImage(value, ImageConstructor = globalThis.Image) {
  const parsedUrl = parseHttpUrl(
    value,
    'coverImageUrl',
    'Enter a valid HTTP or HTTPS image URL.',
  )

  if (typeof ImageConstructor !== 'function') {
    return Promise.reject(
      createFieldError('Image verification is unavailable in this browser.', 'coverImageUrl'),
    )
  }

  return new Promise((resolve, reject) => {
    const image = new ImageConstructor()
    let settled = false

    const finish = (error) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      image.onload = null
      image.onerror = null

      if (error) reject(error)
      else resolve(true)
    }

    const timer = setTimeout(() => {
      finish(createFieldError('The cover image took too long to load. Try another image URL.', 'coverImageUrl'))
    }, IMAGE_LOAD_TIMEOUT)

    image.onload = () => {
      if (image.naturalWidth > 0) {
        finish()
      } else {
        finish(createFieldError('The cover image could not be loaded. Try another image URL.', 'coverImageUrl'))
      }
    }

    image.onerror = () => {
      finish(createFieldError('The cover image could not be loaded. Try another image URL.', 'coverImageUrl'))
    }

    image.src = parsedUrl.href

    if (image.complete) {
      if (image.naturalWidth > 0) {
        finish()
      } else {
        finish(createFieldError('The cover image could not be loaded. Try another image URL.', 'coverImageUrl'))
      }
    }
  })
}
