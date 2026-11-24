export function filterAndSortLinks(links, options = {}) {
  const {
    query = '',
    view = 'all',
    collectionId = null,
    sort = 'newest',
  } = options
  const normalizedQuery = String(query).trim().toLocaleLowerCase()

  const filtered = links.filter((link) => {
    if (view === 'favorites' && !link.favorite) return false
    if (collectionId && link.collectionId !== collectionId) return false

    if (!normalizedQuery) return true

    const searchable = [link.title, link.url, link.notes]
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase()

    return searchable.includes(normalizedQuery)
  })

  return [...filtered].sort((a, b) => {
    if (sort === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }

    if (sort === 'title-asc') {
      return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
    }

    if (sort === 'title-desc') {
      return b.title.localeCompare(a.title, undefined, { sensitivity: 'base' })
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

export function getCollectionCount(links, collectionId) {
  return links.filter((link) => link.collectionId === collectionId).length
}

export function getFaviconUrl(value) {
  try {
    const hostname = new URL(value).hostname
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=64`
  } catch {
    return ''
  }
}

export function formatRelativeDate(value) {
  const timestamp = new Date(value).getTime()
  if (!Number.isFinite(timestamp)) return ''

  const elapsedSeconds = Math.round((timestamp - Date.now()) / 1000)
  const units = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['week', 60 * 60 * 24 * 7],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
  ]

  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
  for (const [unit, seconds] of units) {
    if (Math.abs(elapsedSeconds) >= seconds) {
      return formatter.format(Math.round(elapsedSeconds / seconds), unit)
    }
  }

  return 'just now'
}
