import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiCheck, FiBookmark } from 'react-icons/fi'
import useDemoAuthStore from '../features/auth/store/useDemoAuthStore.js'
import usePreferencesStore from '../features/settings/store/usePreferencesStore.js'
import './AuthPage.css'

export default function LogoutPage() {
  const signOut = useDemoAuthStore((state) => state.signOut)
  const theme = usePreferencesStore((state) => state.theme)

  useEffect(() => {
    signOut()
  }, [signOut])

  return (
    <main className="auth-page" data-theme={theme}>
      <section className="auth-shell logout-shell">
        <div className="auth-side-panel">
          <Link className="auth-brand" to="/">
            <span className="auth-brand-mark"><FiBookmark /></span>
            <span>LinkVault</span>
          </Link>
          <div className="auth-side-copy">
            <span className="auth-side-eyebrow">SESSION ENDED</span>
            <h1>Your library will be here when you return.</h1>
            <p>This demo session has been cleared from this browser.</p>
          </div>
          <div className="auth-side-foot">LinkVault · Personal workspace</div>
        </div>
        <div className="auth-form-panel logout-content">
          <div className="auth-success-icon"><FiCheck /></div>
          <span className="auth-overline">SIGNED OUT</span>
          <h2>You are signed out</h2>
          <p>Your bookmarks and collections remain saved in this browser. Only the demo profile session was ended.</p>
          <Link className="auth-primary-link" to="/">Return to library</Link>
        </div>
      </section>
    </main>
  )
}
