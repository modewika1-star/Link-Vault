import { useEffect, useMemo, useState } from 'react'
import {
  FiX, FiSun, FiMoon, FiGrid, FiList, FiMonitor, FiLayout,
  FiBookmark, FiFolder, FiEdit2, FiTrash2, FiPlus, FiCheck,
  FiArrowLeft, FiLayers, FiSearch, FiLink2, FiSave,
} from 'react-icons/fi'
import './SettingsModal.css'

export default function SettingsModal({
  open,
  onClose,
  theme,
  onThemeChange,
  viewMode,
  onViewModeChange,
  links = [],
  collections = [],
  onAddBookmark,
  onEditBookmark,
  onDeleteBookmarks,
  onDeleteCollections,
  onRenameCollection,
  onCreateCollection,
  onSetCollectionLinks,
}) {
  const [section, setSection] = useState('home')
  const [search, setSearch] = useState('')
  const [selectedLinks, setSelectedLinks] = useState([])
  const [selectedCollections, setSelectedCollections] = useState([])
  const [collectionLinksId, setCollectionLinksId] = useState(null)
  const [collectionLinkSelection, setCollectionLinkSelection] = useState([])
  const [editingCollectionId, setEditingCollectionId] = useState(null)
  const [editingCollectionName, setEditingCollectionName] = useState('')
  const [newCollectionName, setNewCollectionName] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (collectionLinksId) setCollectionLinksId(null)
        else if (section !== 'home') setSection('home')
        else onClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose, section, collectionLinksId])

  useEffect(() => {
    if (open) {
      setSection('home')
      setSearch('')
      setSelectedLinks([])
      setSelectedCollections([])
      setCollectionLinksId(null)
      setNotice('')
      setEditingCollectionId(null)
    }
  }, [open])

  const filteredLinks = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return links
    return links.filter((link) =>
      [link.title, link.url, link.description, link.notes].filter(Boolean).join(' ').toLowerCase().includes(query),
    )
  }, [links, search])

  const toggleId = (list, id, setter) => {
    setter(list.includes(id) ? list.filter((value) => value !== id) : [...list, id])
  }

  const toggleAllLinks = () => {
    const visibleIds = filteredLinks.map((link) => link.id)
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedLinks.includes(id))
    setSelectedLinks(allSelected
      ? selectedLinks.filter((id) => !visibleIds.includes(id))
      : [...new Set([...selectedLinks, ...visibleIds])])
  }

  const toggleAllCollections = () => {
    const allIds = collections.map((item) => item.id)
    const allSelected = allIds.length > 0 && allIds.every((id) => selectedCollections.includes(id))
    setSelectedCollections(allSelected
      ? selectedCollections.filter((id) => !allIds.includes(id))
      : [...new Set([...selectedCollections, ...allIds])])
  }

  const deleteSelectedLinks = () => {
    if (!selectedLinks.length) return
    if (!window.confirm(`Delete ${selectedLinks.length} selected bookmark(s)? This cannot be undone.`)) return
    onDeleteBookmarks?.(selectedLinks)
    setSelectedLinks([])
    setNotice('Selected bookmarks deleted.')
  }

  const deleteSelectedCollections = () => {
    if (!selectedCollections.length) return
    if (!window.confirm(`Delete ${selectedCollections.length} selected collection(s)? Their bookmarks will remain in your vault as uncategorized.`)) return
    onDeleteCollections?.(selectedCollections)
    setSelectedCollections([])
    setNotice('Selected collections deleted. Their bookmarks were kept.')
  }

  const beginRename = (collection) => {
    setEditingCollectionId(collection.id)
    setEditingCollectionName(collection.name)
    setNotice('')
  }

  const saveRename = (id) => {
    const result = onRenameCollection?.(id, editingCollectionName)
    if (result?.error) {
      setNotice(result.error)
      return
    }
    setEditingCollectionId(null)
    setEditingCollectionName('')
    setNotice('Collection name updated.')
  }

  const createCollection = (event) => {
    event.preventDefault()
    const result = onCreateCollection?.(newCollectionName, '#9b70db')
    if (result?.error) {
      setNotice(result.error)
      return
    }
    setNewCollectionName('')
    setNotice('Collection created.')
  }

  const openCollectionLinks = (collection) => {
    setCollectionLinksId(collection.id)
    setCollectionLinkSelection(links.filter((link) => link.collectionId === collection.id).map((link) => link.id))
    setNotice('')
  }

  const saveCollectionLinks = () => {
    onSetCollectionLinks?.(collectionLinksId, collectionLinkSelection)
    setCollectionLinksId(null)
    setNotice('Collection links updated.')
  }

  if (!open) return null

  const currentCollection = collections.find((item) => item.id === collectionLinksId)

  return (
    <div className="modal-backdrop settings-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className="settings-panel settings-manager-panel" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <header className="settings-header">
          <div className="settings-header-copy">
            {section !== 'home' && (
              <button className="settings-back-button" type="button" onClick={() => { setSection('home'); setCollectionLinksId(null); setNotice('') }}>
                <FiArrowLeft /> Settings
              </button>
            )}
            <span className="settings-eyebrow">WORKSPACE CONTROL</span>
            <h2 id="settings-title">
              {collectionLinksId ? `Manage links · ${currentCollection?.name || 'Collection'}`
                : section === 'bookmarks' ? 'Manage Bookmarks'
                  : section === 'collections' ? 'Manage Collections' : 'Settings'}
            </h2>
            <p>
              {collectionLinksId ? 'Choose which saved links belong to this collection.'
                : section === 'bookmarks' ? 'Edit, organize, or remove saved links.'
                  : section === 'collections' ? 'Rename collections, remove them, or organize their links.'
                    : 'Manage your library and personalize its appearance.'}
            </p>
          </div>
          <button className="icon-button subtle" type="button" onClick={onClose} aria-label="Close settings"><FiX /></button>
        </header>

        {section === 'home' && (
          <div className="settings-body settings-home-body">
            <div className="settings-manager-choices">
              <button type="button" className="settings-manager-choice" onClick={() => { setSection('bookmarks'); setNotice('') }}>
                <span className="settings-manager-choice-icon"><FiBookmark /></span>
                <span><strong>Manage Bookmarks</strong><small>{links.length} saved links · Edit, add, or delete</small></span>
                <FiArrowLeft className="settings-choice-arrow" />
              </button>
              <button type="button" className="settings-manager-choice" onClick={() => { setSection('collections'); setNotice('') }}>
                <span className="settings-manager-choice-icon"><FiFolder /></span>
                <span><strong>Manage Collections</strong><small>{collections.length} collections · Rename, delete, or add links</small></span>
                <FiArrowLeft className="settings-choice-arrow" />
              </button>
            </div>

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
          </div>
        )}

        {section === 'bookmarks' && !collectionLinksId && (
          <div className="settings-body manager-body">
            <div className="manager-toolbar">
              <label className="manager-search"><FiSearch /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search bookmarks..." /></label>
              <button className="button button-secondary" type="button" onClick={onAddBookmark}><FiPlus /> Add Bookmark</button>
            </div>
            <div className="manager-selection-row">
              <label><input type="checkbox" checked={filteredLinks.length > 0 && filteredLinks.every((link) => selectedLinks.includes(link.id))} onChange={toggleAllLinks} /> Select all ({filteredLinks.length})</label>
              <button className="manager-danger-button" type="button" disabled={!selectedLinks.length} onClick={deleteSelectedLinks}><FiTrash2 /> Delete selected ({selectedLinks.length})</button>
            </div>
            <div className="manager-list">
              {filteredLinks.map((link) => (
                <div className="manager-list-row" key={link.id}>
                  <input type="checkbox" checked={selectedLinks.includes(link.id)} onChange={() => toggleId(selectedLinks, link.id, setSelectedLinks)} aria-label={`Select ${link.title}`} />
                  <span className="manager-row-icon"><FiLink2 /></span>
                  <span className="manager-row-copy"><strong>{link.title}</strong><small>{link.url}</small></span>
                  <button className="manager-icon-action" type="button" onClick={() => onEditBookmark?.(link)} aria-label={`Edit ${link.title}`} title="Edit"><FiEdit2 /></button>
                </div>
              ))}
              {filteredLinks.length === 0 && <p className="manager-empty">No bookmarks match your search.</p>}
            </div>
          </div>
        )}

        {section === 'collections' && !collectionLinksId && (
          <div className="settings-body manager-body">
            <form className="manager-create-row" onSubmit={createCollection}>
              <input value={newCollectionName} onChange={(event) => { setNewCollectionName(event.target.value); setNotice('') }} maxLength={32} placeholder="New collection name..." aria-label="New collection name" />
              <button className="button button-primary" type="submit" disabled={!newCollectionName.trim()}><FiPlus /> Create</button>
            </form>
            <div className="manager-selection-row">
              <label><input type="checkbox" checked={collections.length > 0 && collections.every((item) => selectedCollections.includes(item.id))} onChange={toggleAllCollections} /> Select all ({collections.length})</label>
              <button className="manager-danger-button" type="button" disabled={!selectedCollections.length} onClick={deleteSelectedCollections}><FiTrash2 /> Delete selected ({selectedCollections.length})</button>
            </div>
            <div className="manager-list">
              {collections.map((collection) => (
                <div className="manager-collection-row" key={collection.id}>
                  <input type="checkbox" checked={selectedCollections.includes(collection.id)} onChange={() => toggleId(selectedCollections, collection.id, setSelectedCollections)} aria-label={`Select ${collection.name}`} />
                  <span className="manager-collection-dot" style={{ '--collection-color': collection.color }} />
                  {editingCollectionId === collection.id ? (
                    <input className="manager-rename-input" value={editingCollectionName} onChange={(event) => setEditingCollectionName(event.target.value)} autoFocus />
                  ) : (
                    <span className="manager-row-copy"><strong>{collection.name}</strong><small>{links.filter((link) => link.collectionId === collection.id).length} bookmarks</small></span>
                  )}
                  {editingCollectionId === collection.id ? (
                    <button className="manager-icon-action" type="button" onClick={() => saveRename(collection.id)} aria-label="Save collection name"><FiSave /></button>
                  ) : (
                    <button className="manager-icon-action" type="button" onClick={() => beginRename(collection)} aria-label={`Rename ${collection.name}`} title="Rename"><FiEdit2 /></button>
                  )}
                  <button className="manager-text-action" type="button" onClick={() => openCollectionLinks(collection)}><FiLayers /> Manage links</button>
                </div>
              ))}
              {collections.length === 0 && <p className="manager-empty">No collections yet. Create one above.</p>}
            </div>
          </div>
        )}

        {collectionLinksId && currentCollection && (
          <div className="settings-body manager-body">
            <div className="manager-selection-row">
              <label><input type="checkbox" checked={links.length > 0 && links.every((link) => collectionLinkSelection.includes(link.id))} onChange={() => setCollectionLinkSelection(collectionLinkSelection.length === links.length ? [] : links.map((link) => link.id))} /> Select all bookmarks</label>
              <span className="manager-selected-count">{collectionLinkSelection.length} selected</span>
            </div>
            <div className="manager-list">
              {links.map((link) => (
                <label className="manager-list-row manager-link-select-row" key={link.id}>
                  <input type="checkbox" checked={collectionLinkSelection.includes(link.id)} onChange={() => toggleId(collectionLinkSelection, link.id, setCollectionLinkSelection)} />
                  <span className="manager-row-icon"><FiLink2 /></span>
                  <span className="manager-row-copy"><strong>{link.title}</strong><small>{link.url}</small></span>
                  {link.collectionId === currentCollection.id && <span className="manager-current-tag">In collection</span>}
                </label>
              ))}
              {links.length === 0 && <p className="manager-empty">Add bookmarks to your vault first.</p>}
            </div>
            <div className="manager-inline-actions">
              <button className="button button-secondary" type="button" onClick={() => setCollectionLinksId(null)}>Cancel</button>
              <button className="button button-primary" type="button" onClick={saveCollectionLinks}><FiCheck /> Save links</button>
            </div>
          </div>
        )}

        {notice && <div className="settings-notice" role="status">{notice}</div>}
        {section === 'home' && (
          <div className="settings-info-note">Settings and saved library data are stored in this browser.</div>
        )}
        <footer className="settings-footer">
          <button className="button button-secondary" type="button" onClick={onClose}>Close</button>
        </footer>
      </section>
    </div>
  )
}
