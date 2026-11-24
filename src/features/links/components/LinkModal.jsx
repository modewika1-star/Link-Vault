import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { FiCheck, FiX } from 'react-icons/fi'
import linkSchema from '../validation/linkSchema'

const emptyValues = {
  title: '',
  url: '',
  description: '',
  coverImageUrl: '',
  notes: '',
  collectionId: '',
  favorite: false,
}

export default function LinkModal({ open, link, collections, onClose, onSave }) {
  const [previewLoading, setPreviewLoading] = useState(false)
  const formik = useFormik({
    initialValues: link
      ? {
          title: link.title || '',
          url: link.url || '',
          description: link.description || link.notes || '',
          coverImageUrl: link.coverImageUrl || '',
          notes: link.description ? link.notes || '' : '',
          collectionId: link.collectionId || '',
          favorite: Boolean(link.favorite),
        }
      : emptyValues,
    enableReinitialize: true,
    validationSchema: linkSchema,
    onSubmit: async (values, helpers) => {
      await onSave({
        ...values,
        title: values.title.trim(),
        url: values.url.trim(),
        description: values.description.trim(),
        coverImageUrl: values.coverImageUrl.trim() || null,
        notes: values.notes.trim(),
        collectionId: values.collectionId || null,
      })
      helpers.setSubmitting(false)
    },
  })

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (!open) setPreviewLoading(false)
  }, [open])

  if (!open) return null

  const titleError = formik.touched.title && formik.errors.title
  const urlError = formik.touched.url && formik.errors.url
  const descriptionError = formik.touched.description && formik.errors.description
  const imageError = formik.touched.coverImageUrl && formik.errors.coverImageUrl
  const notesError = formik.touched.notes && formik.errors.notes

  const fetchPreview = async () => {
    const url = formik.values.url.trim()
    if (!url) {
      formik.setFieldTouched('url', true)
      formik.setFieldError('url', 'Enter a URL before fetching its preview.')
      return
    }

    try {
      const parsed = new URL(url)
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Unsupported URL')
    } catch {
      formik.setFieldTouched('url', true)
      formik.setFieldError('url', 'Enter a valid HTTP or HTTPS URL.')
      return
    }

    setPreviewLoading(true)
    formik.setStatus('')
    try {
      const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`)
      if (!response.ok) throw new Error('Preview service unavailable')
      const result = await response.json()
      if (result.status !== 'success' || !result.data) throw new Error('No preview found')

      const data = result.data
      if (data.title) formik.setFieldValue('title', data.title.slice(0, 80))
      if (data.description) formik.setFieldValue('description', data.description.slice(0, 500))
      if (data.image?.url) formik.setFieldValue('coverImageUrl', data.image.url)
      formik.setStatus('Preview details loaded. Review them before saving.')
    } catch {
      formik.setStatus('Preview could not be loaded. You can still complete the fields manually.')
    } finally {
      setPreviewLoading(false)
    }
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section className="modal-panel link-modal-panel" role="dialog" aria-modal="true" aria-labelledby="link-modal-title">
        <header className="modal-header link-modal-header">
          <h2 id="link-modal-title">{link ? 'Edit Bookmark' : 'Add Bookmark'}</h2>
          <button className="icon-button subtle" type="button" onClick={onClose} aria-label="Close dialog">
            <FiX />
          </button>
        </header>

        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="modal-body link-modal-body">
            <label className="field">
              <span>URL <b>*</b></span>
              <div className="url-preview-row">
                <input
                  autoFocus
                  name="url"
                  type="url"
                  value={formik.values.url}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="https://example.com/article"
                  aria-invalid={Boolean(urlError)}
                />
                <button className="preview-button" type="button" onClick={fetchPreview} disabled={previewLoading}>
                  <svg
                    width="13.99"
                    height="13.99"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <circle cx="7" cy="7" r="5.83" stroke="#FE9A00" strokeWidth="1.16583" />
                    <path
                      d="M11.67 1.17V3.5M10.5 2.33H12.83M1.17 10.5H3.5V12.83"
                      stroke="#FE9A00"
                      strokeWidth="1.16583"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {previewLoading ? 'Fetching...' : 'Fetch Preview'}
                </button>
              </div>
              {urlError && <small className="field-error">{urlError}</small>}
              {formik.status && <small className="preview-status" role="status">{formik.status}</small>}
            </label>

            <label className="field">
              <span>Title <b>*</b></span>
              <input
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Page title"
                maxLength={80}
                aria-invalid={Boolean(titleError)}
              />
              {titleError && <small className="field-error">{titleError}</small>}
            </label>

            <label className="field">
              <span>Description</span>
              <textarea
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Short summary..."
                rows={2}
                maxLength={500}
                aria-invalid={Boolean(descriptionError)}
              />
              {descriptionError && <small className="field-error">{descriptionError}</small>}
            </label>

            <label className="field">
              <span>Cover Image URL</span>
              <input
                name="coverImageUrl"
                type="url"
                value={formik.values.coverImageUrl}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="https://example.com/og-image.png"
                aria-invalid={Boolean(imageError)}
              />
              {imageError && <small className="field-error">{imageError}</small>}
            </label>

            <label className="field">
              <span>Collection</span>
              <select name="collectionId" value={formik.values.collectionId} onChange={formik.handleChange}>
                <option value="">No collection</option>
                {collections.map((item) => (
                  <option value={item.id} key={item.id}>{item.name}</option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Notes</span>
              <textarea
                name="notes"
                value={formik.values.notes}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Personal notes or key takeaways..."
                rows={2}
                maxLength={2000}
              />
              <span className="field-foot">
                {notesError ? <small className="field-error">{notesError}</small> : <small>Optional</small>}
                <small>{formik.values.notes.length}/2,000</small>
              </span>
            </label>
          </div>

          <footer className="modal-footer">
            <button className="button button-secondary" type="button" onClick={onClose}>Cancel</button>
            <button className="button button-primary" type="submit" disabled={formik.isSubmitting}>
              <FiCheck />
              {formik.isSubmitting ? 'Saving...' : link ? 'Save Bookmark' : 'Save Bookmark'}
            </button>
          </footer>
        </form>
      </section>
    </div>
  )
}
