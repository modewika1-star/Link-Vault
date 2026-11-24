import { useEffect } from 'react'
import { useFormik } from 'formik'
import {
  FiBookmark,
  FiCheck,
  FiStar,
  FiX,
} from 'react-icons/fi'
import linkSchema from '../validation/linkSchema'

const emptyValues = {
  title: '',
  url: '',
  notes: '',
  collectionId: '',
  favorite: false,
}

export default function LinkModal({ open, link, collections, onClose, onSave }) {
  const formik = useFormik({
    initialValues: link
      ? {
          title: link.title || '',
          url: link.url || '',
          notes: link.notes || '',
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

  if (!open) return null

  const titleError = formik.touched.title && formik.errors.title
  const urlError = formik.touched.url && formik.errors.url
  const notesError = formik.touched.notes && formik.errors.notes

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="link-modal-title">
        <header className="modal-header">
          <div className="modal-heading-icon"><FiBookmark /></div>
          <div className="modal-heading-copy">
            <h2 id="link-modal-title">{link ? 'Edit bookmark' : 'Add a bookmark'}</h2>
            <p>{link ? 'Keep this bookmark up to date.' : 'Save a useful page to your personal vault.'}</p>
          </div>
          <button className="icon-button subtle" type="button" onClick={onClose} aria-label="Close dialog">
            <FiX />
          </button>
        </header>

        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="modal-body">
            <label className="field">
              <span>Title <b>*</b></span>
              <input
                autoFocus
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. React documentation"
                maxLength={80}
                aria-invalid={Boolean(titleError)}
              />
              {titleError && <small className="field-error">{titleError}</small>}
            </label>

            <label className="field">
              <span>Website URL <b>*</b></span>
              <input
                name="url"
                type="url"
                value={formik.values.url}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="https://example.com"
                aria-invalid={Boolean(urlError)}
              />
              {urlError && <small className="field-error">{urlError}</small>}
            </label>

            <label className="field">
              <span>Collection</span>
              <select name="collectionId" value={formik.values.collectionId} onChange={formik.handleChange}>
                <option value="">Uncategorized</option>
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
                placeholder="Add a short note so you remember why this link matters..."
                rows={3}
                maxLength={2000}
              />
              <span className="field-foot">
                {notesError ? <small className="field-error">{notesError}</small> : <small>Optional · Up to 2,000 characters</small>}
                <small>{formik.values.notes.length}/2,000</small>
              </span>
            </label>

            <label className="favorite-option">
              <input
                type="checkbox"
                name="favorite"
                checked={formik.values.favorite}
                onChange={formik.handleChange}
              />
              <span className="favorite-option-icon"><FiStar /></span>
              <span>
                <strong>Save as a favorite</strong>
                <small>Keep this bookmark close in your Favorites view.</small>
              </span>
              <FiCheck className="favorite-option-check" />
            </label>
          </div>

          <footer className="modal-footer">
            <button className="button button-secondary" type="button" onClick={onClose}>Cancel</button>
            <button className="button button-primary" type="submit" disabled={formik.isSubmitting}>
              <FiCheck />
              {formik.isSubmitting ? 'Saving...' : link ? 'Save changes' : 'Add bookmark'}
            </button>
          </footer>
        </form>
      </section>
    </div>
  )
}
