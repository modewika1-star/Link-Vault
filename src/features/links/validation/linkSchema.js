import * as Yup from 'yup'

const linkSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required('Please enter a title')
    .max(80, 'Title must be 80 characters or less'),

  url: Yup.string()
    .trim()
    .url('Please enter a valid URL')
    .required('Please enter a URL'),
})

export default linkSchema
