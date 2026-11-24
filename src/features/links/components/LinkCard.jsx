import { useEffect, useState } from 'react'
import {
  FiExternalLink,
  FiEdit2,
  FiTrash2,
  FiHeart,
  FiGlobe,
  FiBookmark,
} from 'react-icons/fi'
import { formatRelativeDate } from '../utils/linkUtils.js'

export default function LinkCard({ link, collection, onFavorite, onEdit, onDelete }) {
  const [imageFailed, setImageFailed] = useState(false)
  const imageUrl = link.coverImageUrl || link.thumbnail || ''
  const description = link.description || link.notes || ''

  useEffect(() => {
    setImageFailed(false)
  }, [imageUrl])

  let hostname = link.url
  try {
    hostname = new URL(link.url).hostname.replace(/^www\./, '')
  } catch {
    // The form validates URLs before they reach the card.
  }

  return (
    <article className={link.favorite ? 'bookmark-card is-favorite' : 'bookmark-card'}>
      <a
        className={imageUrl && !imageFailed ? 'bookmark-card-image has-image' : 'bookmark-card-image'}
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${link.title}`}
      >
        {imageUrl && !imageFailed ? (
          <img src={imageUrl} alt="" loading="lazy" onError={() => setImageFailed(true)} />
        ) : (
          <span className="bookmark-image-placeholder"><FiBookmark /></span>
        )}
      </a>

      <div className="bookmark-card-copy">
        <div className="bookmark-meta-line">
          <span className="bookmark-domain"><FiGlobe /> {hostname}</span>
          <span className="meta-dot" />
          <span>{formatRelativeDate(link.createdAt)}</span>
        </div>
        <h3 className="bookmark-title">
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            {link.title}
            <FiExternalLink aria-hidden="true" />
          </a>
        </h3>
        <p className={description ? 'bookmark-description' : 'bookmark-description is-empty'}>
          {description || 'No description added yet.'}
        </p>
      </div>

      <footer className="bookmark-card-footer">
        {collection ? (
          <span className="collection-tag" style={{ '--collection-color': collection.color }}>
            <span className="collection-dot" />
            {collection.name}
          </span>
        ) : (
          <span className="collection-tag is-muted">Uncategorized</span>
        )}
        <div className="bookmark-card-actions" aria-label={`Actions for ${link.title}`}>
          <button
            type="button"
            className={link.favorite ? 'bookmark-action favorite-active' : 'bookmark-action'}
            onClick={() => onFavorite(link.id)}
            aria-label={link.favorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={link.favorite}
            title={link.favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <FiHeart />
          </button>
          <button className="bookmark-action" type="button" onClick={() => onEdit(link)} aria-label={`Edit ${link.title}`} title="Edit bookmark">
            <FiEdit2 />
          </button>
          <button className="bookmark-action delete-action" type="button" onClick={() => onDelete(link)} aria-label={`Delete ${link.title}`} title="Delete bookmark">
            <FiTrash2 />
          </button>
        </div>
      </footer>
    </article>
  )
}
