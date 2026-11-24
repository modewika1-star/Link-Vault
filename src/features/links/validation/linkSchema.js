import * as Yup from 'yup'

const linkSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required('Please enter a title')
    .max(80, 'Title must be 80 characters or less'),

  url: Yup.string()
    .trim()
    .required('Please enter a URL')
    .url('Please enter a valid URL')
    .test(
      'http-or-https',
      'Only HTTP and HTTPS links are supported',
      (value) => {
        if (!value) return false
        try {
          const parsedUrl = new URL(value)
          return (
            (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') &&
            Boolean(parsedUrl.hostname)
          )
        } catch {
          return false
        }
      },
    ),

  notes: Yup.string().max(2000, 'Notes must be 2,000 characters or less'),
  collectionId: Yup.string().nullable(),
  favorite: Yup.boolean(),
})

export default linkSchema
