import { useEffect } from 'react'
import AppRouter from './app/router.jsx'
import { useTranslation } from './i18n/translations.js'

export default function App() {
  const { language } = useTranslation()
  const direction = language === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = direction
  }, [language, direction])

  return (
    <div className="app-locale-root" lang={language} dir={direction}>
      <AppRouter />
    </div>
  )
}
