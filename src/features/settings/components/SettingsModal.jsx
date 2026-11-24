import { useEffect } from 'react'
import { FiX, FiSun, FiMoon, FiGrid, FiList, FiMonitor, FiLayout } from 'react-icons/fi'
import './SettingsModal.css'

export default function SettingsModal({
  open,
  onClose,
  theme,
  onThemeChange,
  viewMode,
  onViewModeChange,
}) {
  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-backdrop settings-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className="settings-panel" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <header className="settings-header">
          <div>
            <span className="settings-eyebrow">PREFERENCES</span>
            <h2 id="settings-title">Settings</h2>
            <p>Make your LinkVault workspace feel right.</p>
          </div>
          <button className="icon-button subtle" type="button" onClick={onClose} aria-label="Close settings"><FiX /></button>
        </header>

        <div className="settings-body">
          <section className="settings-section">
            <div className="settings-section-heading">
              <span className="settings-section-icon"><FiMonitor /></span>
              <span><strong>Appearance</strong><small>Choose the workspace color theme.</small></span>
            </div>
            <div className="settings-choice-grid">
              <button type="button" className={theme === 'light' ? 'settings-choice is-selected' : 'settings-choice'} onClick={() => onThemeChange('light')} aria-pressed={theme === 'light'}>
                <span className="settings-choice-preview light-preview"><FiSun /></span>
                <span>Light</span>
                {theme === 'light' && <b>Selected</b>}
              </button>
              <button type="button" className={theme === 'dark' ? 'settings-choice is-selected' : 'settings-choice'} onClick={() => onThemeChange('dark')} aria-pressed={theme === 'dark'}>
                <span className="settings-choice-preview dark-preview"><FiMoon /></span>
                <span>Dark</span>
                {theme === 'dark' && <b>Selected</b>}
              </button>
            </div>
          </section>

          <section className="settings-section">
            <div className="settings-section-heading">
              <span className="settings-section-icon"><FiLayout /></span>
              <span><strong>Bookmark layout</strong><small>Choose how your saved links are displayed.</small></span>
            </div>
            <div className="settings-choice-grid">
              <button type="button" className={viewMode === 'grid' ? 'settings-choice is-selected' : 'settings-choice'} onClick={() => onViewModeChange('grid')} aria-pressed={viewMode === 'grid'}>
                <span className="settings-choice-preview layout-preview"><FiGrid /></span>
                <span>Grid view</span>
                {viewMode === 'grid' && <b>Selected</b>}
              </button>
              <button type="button" className={viewMode === 'list' ? 'settings-choice is-selected' : 'settings-choice'} onClick={() => onViewModeChange('list')} aria-pressed={viewMode === 'list'}>
                <span className="settings-choice-preview layout-preview"><FiList /></span>
                <span>List view</span>
                {viewMode === 'list' && <b>Selected</b>}
              </button>
            </div>
          </section>

          <div className="settings-info-note">
            Settings are saved in this browser. Appearance and layout changes do not alter your bookmarks.
          </div>
        </div>

        <footer className="settings-footer">
          <button className="button button-primary" type="button" onClick={onClose}>Done</button>
        </footer>
      </section>
    </div>
  )
}
