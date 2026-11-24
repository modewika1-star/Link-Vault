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

    const searchable = [link.title, link.url, link.description, link.notes]
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
