import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { FiCheck, FiX } from 'react-icons/fi'
import linkSchema, { editLinkSchema } from '../validation/linkSchema'
import { verifyBookmarkUrl, verifyCoverImage } from '../services/linkValidationService.js'
import api from '../../../lib/axios.js'
import { formatText } from '../../../lib/text.js'

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
  const t = formatText
  const [previewLoading, setPreviewLoading] = useState(false)
  const [checkingLink, setCheckingLink] = useState(false)
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
    validationSchema: link ? editLinkSchema : linkSchema,
    onSubmit: async (values, helpers) => {
      setCheckingLink(true)
      helpers.setStatus('')

      const bookmark = {
        ...values,
        title: values.title.trim(),
        url: values.url.trim(),
        description: values.description.trim(),
        coverImageUrl: values.coverImageUrl.trim() || null,
        notes: values.notes.trim(),
        collectionId: values.collectionId || null,
      }

      try {
        try {
          await verifyBookmarkUrl(bookmark.url)
          if (bookmark.coverImageUrl) await verifyCoverImage(bookmark.coverImageUrl)
        } catch (error) {
          const field = error.field || 'url'
          helpers.setFieldTouched(field, true, false)
          helpers.setFieldError(field, error.message || 'This field could not be verified.')
          helpers.setStatus('The bookmark was not saved because its link or cover image could not be verified.')
          return
        }

        await onSave(bookmark)
      } catch {
        helpers.setStatus('The bookmark could not be saved. Please try again.')
      } finally {
        setCheckingLink(false)
        helpers.setSubmitting(false)
      }
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
      const response = await api.get('https://api.microlink.io/', { params: { url } })
      const result = response.data
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
          <h2 id="link-modal-title">{link ? t('Edit Bookmark') : t('Add Bookmark')}</h2>
          <button className="icon-button subtle" type="button" onClick={onClose} aria-label={t('Close dialog')}>
            <FiX />
          </button>
        </header>

        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="modal-body link-modal-body">
            <label className="field">
              <span>{t('URL')} <b>*</b></span>
              <div className="url-preview-row">
                <input
                  autoFocus
                  name="url"
                  type="url"
                  required
                  value={formik.values.url}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="https://example.com/article"
                  aria-invalid={Boolean(urlError)}
                />
                <button className="preview-button" type="button" onClick={fetchPreview} disabled={previewLoading || checkingLink}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      d="M6.42211 1.64033C6.47364 1.36444 6.71445 1.16444 6.99511 1.16444C7.27577 1.16444 7.51659 1.36444 7.56812 1.64033L8.18077 4.88018C8.26981 5.35158 8.63854 5.7203 9.10993 5.80935L12.3498 6.422C12.6257 6.47353 12.8257 6.71435 12.8257 6.99501C12.8257 7.27567 12.6257 7.51648 12.3498 7.56801L9.10993 8.18066C8.63854 8.26971 8.26981 8.63843 8.18077 9.10983L7.56812 12.3497C7.51659 12.6256 7.27577 12.8256 6.99511 12.8256C6.71445 12.8256 6.47364 12.6256 6.42211 12.3497L5.80946 9.10983C5.72041 8.63843 5.35169 8.26971 4.88029 8.18066L1.64044 7.56801C1.36455 7.51648 1.16455 7.27567 1.16455 6.99501C1.16455 6.71435 1.36455 6.47353 1.64044 6.422L4.88029 5.80935C5.35169 5.7203 5.72041 5.35158 5.80946 4.88018L6.42211 1.64033"
                      strokeWidth="1.16583"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      stroke="var(--lv-color-fe9a00)"
                    />
                    <path
                      d="M11.6582 1.16583V3.4975"
                      strokeWidth="1.16583"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      stroke="var(--lv-color-fe9a00)"
                    />
                    <path
                      d="M12.8243 2.33167H10.4927"
                      strokeWidth="1.16583"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      stroke="var(--lv-color-fe9a00)"
                    />
                    <path
                      d="M1.16602 11.6583C1.16602 12.3018 1.68841 12.8242 2.33185 12.8242C2.97529 12.8242 3.49768 12.3018 3.49768 11.6583C3.49768 11.0149 2.97529 10.4925 2.33185 10.4925C1.68841 10.4925 1.16602 11.0149 1.16602 11.6583H1.16602"
                      strokeWidth="1.16583"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      stroke="var(--lv-color-fe9a00)"
                    />
                  </svg>
                  {previewLoading ? t('Fetching...') : t('Fetch Preview')}
                </button>
              </div>
              {urlError && <small className="field-error">{t(urlError)}</small>}
              {formik.status && <small className="preview-status" role="status">{t(formik.status)}</small>}
            </label>

            <label className="field">
              <span>{t('Title')} <b>*</b></span>
              <input
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('Page title')}
                maxLength={80}
                aria-invalid={Boolean(titleError)}
              />
              {titleError && <small className="field-error">{t(titleError)}</small>}
            </label>

            <label className="field">
              <span>{t('Description')} {!link && <b>*</b>}</span>
              <textarea
                name="description"
                required={!link}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('Short summary...')}
                rows={2}
                maxLength={500}
                aria-invalid={Boolean(descriptionError)}
              />
              {descriptionError && <small className="field-error">{t(descriptionError)}</small>}
            </label>

            <label className="field">
              <span>{t('Cover Image URL')} {!link && <b>*</b>}</span>
              <input
                name="coverImageUrl"
                type="url"
                required={!link}
                value={formik.values.coverImageUrl}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="https://example.com/og-image.png"
                aria-invalid={Boolean(imageError)}
              />
              {imageError && <small className="field-error">{t(imageError)}</small>}
            </label>

            <label className="field">
              <span>{t('Collection')}</span>
              <select name="collectionId" value={formik.values.collectionId} onChange={formik.handleChange}>
                <option value="">{t('No collection')}</option>
                {collections.map((item) => (
                  <option value={item.id} key={item.id}>{item.name}</option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>{t('Notes')}</span>
              <textarea
                name="notes"
                value={formik.values.notes}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('Personal notes or key takeaways...')}
                rows={2}
                maxLength={2000}
              />
              <span className="field-foot">
                {notesError ? <small className="field-error">{t(notesError)}</small> : <small>{t('Optional')}</small>}
                <small>{formik.values.notes.length}/2,000</small>
              </span>
            </label>
          </div>

          <footer className="modal-footer">
            <button className="button button-secondary" type="button" onClick={onClose}>{t('Cancel')}</button>
            <button className="button button-primary" type="submit" disabled={formik.isSubmitting || checkingLink || previewLoading}>
              <FiCheck />
              {checkingLink ? t('Checking link...') : formik.isSubmitting ? t('Saving...') : t('Save Bookmark')}
            </button>
          </footer>
        </form>
      </section>
    </div>
  )
}
