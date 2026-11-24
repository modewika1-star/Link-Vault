import * as Yup from 'yup'

const isHttpUrl = (value) => {
  if (!value) return false

  try {
    const parsedUrl = new URL(value)
    return ['http:', 'https:'].includes(parsedUrl.protocol) && Boolean(parsedUrl.hostname)
  } catch {
    return false
  }
}

const title = Yup.string()
  .trim()
  .required('Please enter a title')
  .max(80, 'Title must be 80 characters or less')

const url = Yup.string()
  .trim()
  .required('Please enter a URL')
  .test(
    'valid-http-url',
    'This is not a valid URL. Enter a valid URL, e.g. https://example.com.',
    (value) => !value || isHttpUrl(value),
  )

const optionalDescription = Yup.string()
  .trim()
  .max(500, 'Description must be 500 characters or less')

const requiredDescription = Yup.string()
  .trim()
  .required('Please enter a description')
  .max(500, 'Description must be 500 characters or less')

const optionalCoverImageUrl = Yup.string()
  .trim()
  .nullable()
  .transform((value) => value || null)
  .test(
    'valid-http-image-url',
    'This is not a valid image URL. Enter an image URL, e.g. https://example.com/image.png.',
    (value) => !value || isHttpUrl(value),
  )

const requiredCoverImageUrl = optionalCoverImageUrl.required('Please add a cover image URL')

const optionalFields = {
  notes: Yup.string().max(2000, 'Notes must be 2,000 characters or less'),
  collectionId: Yup.string().nullable(),
  favorite: Yup.boolean(),
}

// New bookmarks need complete card details. Existing bookmarks can still be edited
// without forcing older saved entries to have a description or cover image.
const linkSchema = Yup.object({
  title,
  url,
  description: requiredDescription,
  coverImageUrl: requiredCoverImageUrl,
  ...optionalFields,
})

export const editLinkSchema = Yup.object({
  title,
  url,
  description: optionalDescription,
  coverImageUrl: optionalCoverImageUrl,
  ...optionalFields,
})

export default linkSchema
