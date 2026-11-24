import { useEffect, useState } from 'react'
import {
  FiExternalLink,
  FiMoreHorizontal,
  FiEdit2,
  FiTrash2,
  FiCopy,
  FiStar,
  FiGlobe,
} from 'react-icons/fi'
import { formatRelativeDate, getFaviconUrl } from '../utils/linkUtils.js'

export default function LinkCard({ link, collection, onFavorite, onEdit, onDelete, onCopy }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [faviconFailed, setFaviconFailed] = useState(false)
  const [thumbnailFailed, setThumbnailFailed] = useState(false)
  const favicon = getFaviconUrl(link.url)
  const thumbnail = link.thumbnail && !thumbnailFailed ? link.thumbnail : ''
  const imageSource = favicon && !faviconFailed ? favicon : ''

  useEffect(() => {
    setFaviconFailed(false)
    setThumbnailFailed(false)
  }, [link.url, link.thumbnail])

  let hostname = link.url
  try {
    hostname = new URL(link.url).hostname.replace(/^www\./, '')
  } catch {
    // The form validates URLs before they reach the card.
  }

  return (
    <article className={link.favorite ? 'bookmark-card is-favorite' : 'bookmark-card'}>
      <div className="bookmark-card-top">
        <a className="bookmark-domain-icon" href={link.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${link.title}`}>
          {imageSource ? (
            <img src={imageSource} alt="" loading="lazy" onError={() => setFaviconFailed(true)} />
          ) : (
            <FiGlobe aria-hidden="true" />
          )}
        </a>

        <div className="bookmark-card-actions">
          <button
            type="button"
            className={link.favorite ? 'icon-button favorite-active' : 'icon-button'}
            onClick={() => onFavorite(link.id)}
            aria-label={link.favorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={link.favorite}
            title={link.favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <FiStar />
          </button>
          <div className="card-menu-wrap">
            <button
              type="button"
              className="icon-button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label={`More actions for ${link.title}`}
              aria-expanded={menuOpen}
              title="More actions"
            >
              <FiMoreHorizontal />
            </button>
            {menuOpen && (
              <>
                <button className="menu-dismiss" type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} />
                <div className="card-menu" role="menu">
                  <button type="button" role="menuitem" onClick={() => { setMenuOpen(false); onCopy(link.url) }}>
                    <FiCopy /> Copy link
                  </button>
                  <button type="button" role="menuitem" onClick={() => { setMenuOpen(false); onEdit(link) }}>
                    <FiEdit2 /> Edit bookmark
                  </button>
                  <button className="danger-menu-item" type="button" role="menuitem" onClick={() => { setMenuOpen(false); onDelete(link) }}>
                    <FiTrash2 /> Delete bookmark
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bookmark-card-copy">
        <div className="bookmark-meta-line">
          <span>{hostname}</span>
          <span className="meta-dot" />
          <span>{formatRelativeDate(link.createdAt)}</span>
        </div>
        <h3 className="bookmark-title">
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            {link.title}
            <FiExternalLink aria-hidden="true" />
          </a>
        </h3>
        <p className={link.notes ? 'bookmark-description' : 'bookmark-description is-empty'}>
          {link.notes || 'No notes added yet.'}
        </p>
      </div>

      <footer className="bookmark-card-footer">
        {collection ? (
          <span className="collection-tag">
            <span className="collection-dot" style={{ '--collection-color': collection.color }} />
            {collection.name}
          </span>
        ) : (
          <span className="collection-tag is-muted">Uncategorized</span>
        )}
        <button className="text-action" type="button" onClick={() => onEdit(link)}>Edit</button>
      </footer>
    </article>
  )
}
