import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiBookmark,
  FiCheck,
  FiChevronDown,
  FiCloud,
  FiDownload,
  FiFolder,
  FiGrid,
  FiHeart,
  FiList,
  FiLogIn,
  FiLogOut,
  FiMenu,
  FiMoon,
  FiPlus,
  FiSearch,
  FiSettings,
  FiSliders,
  FiStar,
  FiSun,
  FiUpload,
  FiUser,
  FiUserPlus,
  FiX,
} from 'react-icons/fi'
import LinkCard from '../features/links/components/LinkCard.jsx'
import LinkModal from '../features/links/components/LinkModal.jsx'
import CollectionModal from '../features/links/components/CollectionModal.jsx'
import useLinksStore from '../features/links/store/useLinksStore.js'
import useDemoAuthStore from '../features/auth/store/useDemoAuthStore.js'
import usePreferencesStore from '../features/settings/store/usePreferencesStore.js'
import SettingsModal from '../features/settings/components/SettingsModal.jsx'
import FigmaIcon from '../components/FigmaIcon.jsx'
import { filterAndSortLinks, getCollectionCount } from '../features/links/utils/linkUtils.js'
import './HomePage.css'

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'title-asc', label: 'Title A–Z' },
  { value: 'title-desc', label: 'Title Z–A' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const user = useDemoAuthStore((state) => state.user)
  const theme = usePreferencesStore((state) => state.theme)
  const toggleTheme = usePreferencesStore((state) => state.toggleTheme)
  const viewMode = usePreferencesStore((state) => state.viewMode)
  const setViewMode = usePreferencesStore((state) => state.setViewMode)
  const links = useLinksStore((state) => state.links)
  const collections = useLinksStore((state) => state.collections)
  const addLink = useLinksStore((state) => state.addLink)
  const updateLink = useLinksStore((state) => state.updateLink)
  const removeLink = useLinksStore((state) => state.removeLink)
  const toggleFavorite = useLinksStore((state) => state.toggleFavorite)
  const addCollection = useLinksStore((state) => state.addCollection)
  const renameCollection = useLinksStore((state) => state.renameCollection)
  const removeLinks = useLinksStore((state) => state.removeLinks)
  const deleteCollections = useLinksStore((state) => state.deleteCollections)
  const setCollectionLinks = useLinksStore((state) => state.setCollectionLinks)
  const exportBackup = useLinksStore((state) => state.exportBackup)
  const importBackup = useLinksStore((state) => state.importBackup)

  const [view, setView] = useState('all')
  const [activeCollectionId, setActiveCollectionId] = useState(null)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('newest')
  const [linkModalOpen, setLinkModalOpen] = useState(false)
  const [editingLink, setEditingLink] = useState(null)
  const [collectionModalOpen, setCollectionModalOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const [toast, setToast] = useState('')
  const toastTimer = useRef(null)
  const importInput = useRef(null)
  const searchInput = useRef(null)

  const activeCollection = collections.find((item) => item.id === activeCollectionId) || null
  const visibleLinks = useMemo(
    () => filterAndSortLinks(links, {
      query,
      view: view === 'favorites' ? 'favorites' : 'all',
      collectionId: view === 'collection' ? activeCollectionId : null,
      sort,
    }),
    [links, query, view, activeCollectionId, sort],
  )

  const favoriteCount = useMemo(() => links.filter((link) => link.favorite).length, [links])
  const pageTitle = view === 'favorites'
    ? 'Favorites'
    : view === 'collection'
      ? activeCollection?.name || 'Collection'
      : 'All Bookmarks'
  const pageDescription = view === 'favorites'
    ? 'The bookmarks you have saved for quick access.'
    : view === 'collection'
      ? 'Everything saved in this collection, in one place.'
      : 'A quiet place for everything worth keeping.'

  useEffect(() => () => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
  }, [])

  useEffect(() => {
    const handleSearchShortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchInput.current?.focus()
      }
    }
    window.addEventListener('keydown', handleSearchShortcut)
    return () => window.removeEventListener('keydown', handleSearchShortcut)
  }, [])

  useEffect(() => {
    if (view === 'collection' && !activeCollection) {
      setView('all')
      setActiveCollectionId(null)
    }
  }, [view, activeCollection])

  const notify = (message) => {
    setToast(message)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 2800)
  }

  const selectView = (nextView, collectionId = null) => {
    setView(nextView)
    setActiveCollectionId(collectionId)
    setMobileSidebarOpen(false)
  }

  const openNewLink = () => {
    setEditingLink(null)
    setLinkModalOpen(true)
  }

  const openEditLink = (link) => {
    setEditingLink(link)
    setLinkModalOpen(true)
  }

  const saveLink = (values) => {
    if (editingLink) {
      updateLink(editingLink.id, values)
      notify('Bookmark updated successfully.')
    } else {
      addLink(values)
      notify('Bookmark added to your vault.')
    }
    setLinkModalOpen(false)
    setEditingLink(null)
  }

  const deleteLink = (link) => {
    const confirmed = window.confirm(`Delete "${link.title}" from your vault?`)
    if (!confirmed) return
    removeLink(link.id)
    notify('Bookmark deleted.')
  }

  const createCollection = (name, color) => {
    const result = addCollection(name, color)
    if (result.error) return result
    selectView('collection', result.collection.id)
    notify('Collection created.')
    return result
  }

  const handleManagerDeleteBookmarks = (ids) => {
    removeLinks(ids)
    notify(`${ids.length} bookmark(s) deleted.`)
  }

  const handleManagerDeleteCollections = (ids) => {
    deleteCollections(ids)
    if (ids.includes(activeCollectionId)) selectView('all')
    notify(`${ids.length} collection(s) deleted. Their bookmarks were kept.`)
  }

  const handleManagerRenameCollection = (id, name) => {
    const result = renameCollection(id, name)
    if (result.error) notify(result.error)
    else notify('Collection renamed.')
    return result
  }

  const handleManagerCreateCollection = (name, color) => {
    const result = addCollection(name, color)
    if (!result.error) notify('Collection created.')
    return result
  }

  const handleSetCollectionLinks = (collectionId, linkIds) => {
    setCollectionLinks(collectionId, linkIds)
    notify('Collection links updated.')
  }

  const handleExport = () => {
    const backup = exportBackup()
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `link-vault-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setToolsOpen(false)
    notify('Your backup file is ready.')
  }

  const handleImport = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const parsed = JSON.parse(await file.text())
      const result = importBackup(parsed)
      if (result.error) {
        notify(result.error)
      } else {
        notify(`${result.importedCount} bookmark(s) imported.`)
      }
    } catch {
      notify('Could not read this backup. Choose a valid Link Vault JSON file.')
    } finally {
      event.target.value = ''
      setToolsOpen(false)
    }
  }

  const headingCount = query
    ? `${visibleLinks.length} result${visibleLinks.length === 1 ? '' : 's'}`
    : `${visibleLinks.length} bookmark${visibleLinks.length === 1 ? '' : 's'}`

  return (
    <div className="app-shell" data-theme={theme}>
      <button
        type="button"
        className={mobileSidebarOpen ? 'mobile-sidebar-backdrop is-open' : 'mobile-sidebar-backdrop'}
        aria-label="Close navigation"
        onClick={() => setMobileSidebarOpen(false)}
      />

      <aside className={mobileSidebarOpen ? 'sidebar is-open' : 'sidebar'}>
        <div className="sidebar-brand">
          <a className="brand-link" href="/" onClick={(event) => { event.preventDefault(); selectView('all') }}>
            <span className="brand-mark"><FigmaIcon name="brand-mark" fallback={<FiBookmark />} className="figma-icon" /></span>
            <span>LinkVault</span>
          </a>
        </div>

        <section className="sidebar-account" aria-label="Account">
          <div className="sidebar-account-avatar">
            {user ? user.fullName.slice(0, 1).toUpperCase() : <FiUser />}
          </div>
          <div className="sidebar-account-copy">
            <strong>{user ? user.fullName : 'Guest workspace'}</strong>
            <span>{user ? user.email : 'Browsing without an account'}</span>
            {user ? (
              <button className="account-action signout-action" type="button" onClick={() => navigate('/logout')}>
                <FiLogOut /> Sign out
              </button>
            ) : (
              <div className="account-action-row">
                <button className="account-action primary-account-action" type="button" onClick={() => navigate('/login')}>
                  <FiLogIn /> Sign in
                </button>
                <button className="account-action" type="button" onClick={() => navigate('/register')}>
                  <FiUserPlus /> Create account
                </button>
              </div>
            )}
          </div>
        </section>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <section className="nav-section">
            <div className="nav-section-heading">Smart Views</div>
            <button
              className={view === 'all' ? 'nav-item is-active' : 'nav-item'}
              type="button"
              onClick={() => selectView('all')}
            >
              <span className="nav-item-label"><FigmaIcon name="all-bookmarks" fallback={<FiBookmark />} className="figma-icon" /> All Bookmarks</span>
              <span className="nav-count">{links.length}</span>
            </button>
            <button
              className={view === 'favorites' ? 'nav-item is-active' : 'nav-item'}
              type="button"
              onClick={() => selectView('favorites')}
            >
              <span className="nav-item-label"><FigmaIcon name="favorites" fallback={<FiHeart />} className="figma-icon" /> Favorites</span>
              <span className="nav-count">{favoriteCount}</span>
            </button>
          </section>

          <section className="nav-section collections-section">
            <div className="nav-section-title-row">
              <div className="nav-section-heading">Collections</div>
              <button className="new-collection-button" type="button" onClick={() => setCollectionModalOpen(true)}>
                <FigmaIcon name="new-collection" fallback={<FiPlus />} className="figma-icon" /> New
              </button>
            </div>

            <div className="collection-nav-list">
              {collections.map((collection) => (
                <div className="collection-nav-row" key={collection.id}>
                  <button
                    className={view === 'collection' && activeCollectionId === collection.id ? 'nav-item collection-nav-item is-active' : 'nav-item collection-nav-item'}
                    type="button"
                    onClick={() => selectView('collection', collection.id)}
                  >
                    <span className="nav-item-label">
                      <FigmaIcon name="collection-folder" fallback={<FiFolder className="collection-folder-icon" style={{ color: collection.color }} />} className="figma-icon collection-folder-icon" />
                      <span className="collection-name">{collection.name}</span>
                    </span>
                    <span className="nav-count">{getCollectionCount(links, collection.id)}</span>
                  </button>
                </div>
              ))}
              {collections.length === 0 && (
                <p className="sidebar-empty">No collections yet. Create one to organize your bookmarks.</p>
              )}
            </div>
          </section>
        </nav>

        <div className="sidebar-bottom">
          <button className="settings-nav-button" type="button" onClick={() => setSettingsOpen(true)}>
            <FiSettings />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu-button icon-button" type="button" onClick={() => setMobileSidebarOpen(true)} aria-label="Open navigation">
            <FiMenu />
          </button>

          <label className="search-box">
            <FigmaIcon name="search" fallback={<FiSearch />} className="figma-icon" />
            <input
              ref={searchInput}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search titles, URLs, notes..."
              aria-label="Search titles, URLs, and notes"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="search-clear"><FiX /></button>
            )}
            <kbd>Ctrl K</kbd>
          </label>

          <div className="topbar-actions">
            <label className="sort-control">
              <FiSliders />
              <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort bookmarks">
                {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
              <FiChevronDown className="sort-chevron" />
            </label>

            <div className="display-mode-control" role="group" aria-label="Bookmark display mode">
              <button type="button" className={viewMode === 'grid' ? 'display-mode-button is-active' : 'display-mode-button'} onClick={() => setViewMode('grid')} aria-label="Grid view" aria-pressed={viewMode === 'grid'} title="Grid view">
                <FiGrid />
              </button>
              <button type="button" className={viewMode === 'list' ? 'display-mode-button is-active' : 'display-mode-button'} onClick={() => setViewMode('list')} aria-label="List view" aria-pressed={viewMode === 'list'} title="List view">
                <FiList />
              </button>
            </div>

            <button className="icon-button theme-toggle-button" type="button" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} title={theme === 'dark' ? 'Light theme' : 'Dark theme'}>
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>

            <div className="tools-menu-wrap">
              <button className="icon-button tools-button" type="button" onClick={() => setToolsOpen((value) => !value)} aria-label="Backup and restore" aria-expanded={toolsOpen} title="Backup and restore">
                <FiCloud />
              </button>
              {toolsOpen && (
                <>
                  <button type="button" className="menu-dismiss" aria-label="Close menu" onClick={() => setToolsOpen(false)} />
                  <div className="tools-menu">
                    <div className="tools-menu-heading">Your data</div>
                    <button type="button" onClick={handleExport}><FiDownload /> Export backup</button>
                    <button type="button" onClick={() => importInput.current?.click()}><FiUpload /> Import backup</button>
                    <input ref={importInput} type="file" accept="application/json,.json" hidden onChange={handleImport} />
                    <p>Backups include your bookmarks and collections.</p>
                  </div>
                </>
              )}
            </div>

            <button className="button button-primary add-bookmark-button" type="button" onClick={openNewLink}>
              <FiPlus /> <span>Add Bookmark</span>
            </button>
          </div>
        </header>

        <div className="page-content">
          <div className="page-heading-row">
            <div>
              <div className="page-eyebrow">YOUR LIBRARY</div>
              <h1>{pageTitle}</h1>
              <p>{pageDescription}</p>
            </div>
            <div className="page-heading-meta">
              <span className="bookmark-total">{headingCount}</span>
              <span className="heading-divider" />
              <span className="sort-description">Sorted by {sortOptions.find((item) => item.value === sort)?.label}</span>
            </div>
          </div>

          {visibleLinks.length === 0 ? (
            <section className="empty-state">
              <span className="empty-state-icon">{query ? <FiSearch /> : view === 'favorites' ? <FiStar /> : <FiBookmark />}</span>
              <h2>{query ? 'No bookmarks found' : view === 'favorites' ? 'No favorites yet' : 'Your vault is ready'}</h2>
              <p>
                {query
                  ? 'Try another search term or clear your search.'
                  : view === 'favorites'
                    ? 'Tap the star on any bookmark to keep it close.'
                    : 'Add your first bookmark and start building your personal library.'}
              </p>
              {query ? (
                <button className="button button-secondary" type="button" onClick={() => setQuery('')}>Clear search</button>
              ) : (
                <button className="button button-primary" type="button" onClick={openNewLink}><FiPlus /> Add bookmark</button>
              )}
            </section>
          ) : (
            <section className={viewMode === 'list' ? 'bookmark-grid is-list' : 'bookmark-grid'} aria-label="Saved bookmarks">
              {visibleLinks.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  collection={collections.find((item) => item.id === link.collectionId)}
                  onFavorite={toggleFavorite}
                  onEdit={openEditLink}
                  onDelete={deleteLink}
                />
              ))}
            </section>
          )}

          <footer className="content-footer">
            <span>LinkVault · Personal bookmark workspace</span>
            <button className="footer-action" type="button" onClick={handleExport}><FiDownload /> Export your vault</button>
          </footer>
        </div>
      </main>

      <LinkModal
        open={linkModalOpen}
        link={editingLink}
        collections={collections}
        onClose={() => { setLinkModalOpen(false); setEditingLink(null) }}
        onSave={saveLink}
      />
      <CollectionModal
        open={collectionModalOpen}
        onClose={() => setCollectionModalOpen(false)}
        onSave={createCollection}
      />
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        theme={theme}
        onThemeChange={usePreferencesStore.getState().setTheme}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        links={links}
        collections={collections}
        onAddBookmark={() => { setSettingsOpen(false); openNewLink() }}
        onEditBookmark={(link) => { setSettingsOpen(false); openEditLink(link) }}
        onDeleteBookmarks={handleManagerDeleteBookmarks}
        onDeleteCollections={handleManagerDeleteCollections}
        onRenameCollection={handleManagerRenameCollection}
        onCreateCollection={handleManagerCreateCollection}
        onSetCollectionLinks={handleSetCollectionLinks}
      />

      {toast && <div className="toast-message" role="status"><FiCheck /> {toast}</div>}
    </div>
  )
}
