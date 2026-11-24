import { useFormik } from 'formik'
import { FiPlus } from 'react-icons/fi'
import linkSchema from '../validation/linkSchema'
import { useTranslation } from '../../../i18n/translations.js'

const fieldClass =
  'w-full rounded-control border border-line bg-surface px-4 py-3 text-sm text-ink outline-none transition focus:border-brand'

export default function LinkForm({ onAdd }) {
  const { t } = useTranslation()
  const formik = useFormik({
    initialValues: {
      title: '',
      url: '',
    },
    validationSchema: linkSchema,
    onSubmit: (values, helpers) => {
      onAdd({
        id: crypto.randomUUID(),
        title: values.title.trim(),
        url: values.url.trim(),
        createdAt: new Date().toISOString(),
      })

      helpers.resetForm()
    },
  })

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="grid gap-4 rounded-panel border border-line bg-surface p-card shadow-card sm:grid-cols-[1fr_1.4fr_auto]"
    >
      <div>
        <label htmlFor="title" className="mb-2 block text-sm font-medium">
          {t('Link title')}
        </label>
        <input
          id="title"
          type="text"
          placeholder={t('My favorite website')}
          className={fieldClass}
          {...formik.getFieldProps('title')}
        />
        {formik.touched.title && formik.errors.title && (
          <p className="mt-1 text-xs text-danger">{t(formik.errors.title)}</p>
        )}
      </div>

      <div>
        <label htmlFor="url" className="mb-2 block text-sm font-medium">
          {t('Website URL')}
        </label>
        <input
          id="url"
          type="url"
          placeholder="https://example.com"
          className={fieldClass}
          {...formik.getFieldProps('url')}
        />
        {formik.touched.url && formik.errors.url && (
          <p className="mt-1 text-xs text-danger">{t(formik.errors.url)}</p>
        )}
      </div>

      <div className="flex items-end">
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-control bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover sm:w-auto"
        >
          <FiPlus aria-hidden="true" />
          {t('Add link')}
        </button>
      </div>
    </form>
  )
}
