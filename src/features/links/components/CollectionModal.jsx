import { useState } from 'react'
import { FiFolderPlus, FiX } from 'react-icons/fi'

const colors = ['#647fe9', '#9b70db', '#e2a34b', '#2eaa87', '#e47787', '#4c9ab8']

export default function CollectionModal({ open, onClose, onSave }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState(colors[0])
  const [error, setError] = useState('')

  if (!open) return null

  const submit = (event) => {
    event.preventDefault()
    const result = onSave(name, color)
    if (result?.error) {
      setError(result.error)
      return
    }
    setName('')
    setColor(colors[0])
    setError('')
    onClose()
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className="modal-panel collection-modal" role="dialog" aria-modal="true" aria-labelledby="collection-modal-title">
        <header className="modal-header">
          <div className="modal-heading-icon"><FiFolderPlus /></div>
          <div className="modal-heading-copy">
            <h2 id="collection-modal-title">Create a collection</h2>
            <p>Group related bookmarks so they are easy to find.</p>
          </div>
          <button className="icon-button subtle" type="button" onClick={onClose} aria-label="Close dialog"><FiX /></button>
        </header>

        <form onSubmit={submit}>
          <div className="modal-body">
            <label className="field">
              <span>Collection name <b>*</b></span>
              <input
                autoFocus
                value={name}
                onChange={(event) => { setName(event.target.value); setError('') }}
                placeholder="e.g. Design inspiration"
                maxLength={32}
              />
              {error && <small className="field-error">{error}</small>}
            </label>
            <div className="field">
              <span>Choose a color</span>
              <div className="color-picker" role="group" aria-label="Collection color">
                {colors.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={color === item ? 'color-swatch selected' : 'color-swatch'}
                    style={{ '--swatch': item }}
                    onClick={() => setColor(item)}
                    aria-label={`Choose ${item}`}
                    aria-pressed={color === item}
                  />
                ))}
              </div>
            </div>
          </div>
          <footer className="modal-footer">
            <button className="button button-secondary" type="button" onClick={onClose}>Cancel</button>
            <button className="button button-primary" type="submit"><FiFolderPlus /> Create collection</button>
          </footer>
        </form>
      </section>
    </div>
  )
}
