import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const defaultCollections = [
  { id: 'col-frontend', name: 'Frontend & React', color: '#647fe9', createdAt: '2026-11-18T09:00:00.000Z' },
  { id: 'col-ai', name: 'AI & Tools', color: '#9b70db', createdAt: '2026-11-19T09:00:00.000Z' },
  { id: 'col-reading', name: 'Reading List', color: '#e2a34b', createdAt: '2026-11-20T09:00:00.000Z' },
]

const demoLinks = [
  {
    id: 'demo-react',
    title: 'React',
    url: 'https://react.dev/',
    description: 'React lets you build user interfaces out of individual pieces called components.',
    notes: '',
    thumbnail: '/assets/figma/react-reference.png',
    collectionId: 'col-frontend',
    favorite: true,
    createdAt: '2026-11-20T10:00:00.000Z',
    updatedAt: '2026-11-20T10:00:00.000Z',
    isSample: true,
  },
  {
    id: 'demo-tailwind',
    title: 'Tailwind CSS',
    url: 'https://tailwindcss.com/',
    description: 'A utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90.',
    notes: '',
    thumbnail: '/assets/figma/tailwind-reference.png',
    collectionId: 'col-frontend',
    favorite: true,
    createdAt: '2026-11-19T10:00:00.000Z',
    updatedAt: '2026-11-19T10:00:00.000Z',
    isSample: true,
  },
  {
    id: 'demo-vite',
    title: 'Vite',
    url: 'https://vite.dev/',
    description: 'Instant server start, lightning fast HMR, and rich features for modern web projects.',
    notes: '',
    collectionId: 'col-frontend',
    favorite: false,
    createdAt: '2026-11-18T10:00:00.000Z',
    updatedAt: '2026-11-18T10:00:00.000Z',
    isSample: true,
  },
  {
    id: 'demo-lucide',
    title: 'Lucide Icons',
    url: 'https://lucide.dev/',
    description: 'Beautiful & consistent icon toolkit made by the community. Open-source and lightweight.',
    notes: '',
    collectionId: 'col-frontend',
    favorite: false,
    createdAt: '2026-11-17T10:00:00.000Z',
    updatedAt: '2026-11-17T10:00:00.000Z',
    isSample: true,
  },
  {
    id: 'demo-huggingface',
    title: 'Hugging Face',
    url: 'https://huggingface.co/',
    description: 'Discover, download, and test thousands of open-source machine learning models and datasets.',
    notes: '',
    thumbnail: '/assets/figma/huggingface-logo.svg',
    collectionId: 'col-ai',
    favorite: true,
    createdAt: '2026-11-22T10:00:00.000Z',
    updatedAt: '2026-11-22T10:00:00.000Z',
    isSample: true,
  },
  {
    id: 'demo-openai',
    title: 'OpenAI Platform',
    url: 'https://platform.openai.com/docs/',
    description: 'Explore developer resources, tutorials, API docs, and dynamic examples to get the most out of OpenAI.',
    notes: '',
    collectionId: 'col-ai',
    favorite: false,
    createdAt: '2026-11-21T10:00:00.000Z',
    updatedAt: '2026-11-21T10:00:00.000Z',
    isSample: true,
  },
  {
    id: 'demo-reading',
    title: 'Patterns of Distributed Systems',
    url: 'https://martinfowler.com/articles/patterns-of-distributed-systems/',
    description: 'A catalog of common architectural patterns for building reliable distributed systems.',
    notes: '',
    collectionId: 'col-reading',
    favorite: false,
    createdAt: '2026-11-16T10:00:00.000Z',
    updatedAt: '2026-11-16T10:00:00.000Z',
    isSample: true,
  },
]

const makeId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `link-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const now = () => new Date().toISOString()
const normalizeName = (value) => String(value || '').trim().toLocaleLowerCase()

function isSafeUrl(value) {
  try {
    const parsed = new URL(value)
    return ['http:', 'https:'].includes(parsed.protocol) && Boolean(parsed.hostname)
  } catch {
    return false
  }
}

function normalizeImportedLink(item, collectionId) {
  if (!item || typeof item !== 'object') return null
  const title = String(item.title || '').trim().slice(0, 80)
  const url = String(item.url || '').trim()
  if (!title || !isSafeUrl(url)) return null

  return {
    id: makeId(),
    title,
    url,
    notes: String(item.notes || '').trim().slice(0, 2000),
    description: String(item.description || item.notes || '').trim().slice(0, 500),
    coverImageUrl: typeof item.coverImageUrl === 'string' && isSafeUrl(item.coverImageUrl) ? item.coverImageUrl : null,
    thumbnail: typeof item.thumbnail === 'string' && item.thumbnail.startsWith('/assets/figma/')
      ? item.thumbnail
      : null,
    collectionId,
    favorite: Boolean(item.favorite),
    createdAt: Number.isNaN(Date.parse(item.createdAt)) ? now() : item.createdAt,
    updatedAt: now(),
  }
}

function sanitizePersistedLink(item, allowedCollectionIds) {
  if (!item || typeof item !== 'object') return null
  const title = String(item.title || '').trim().slice(0, 80)
  const url = String(item.url || '').trim()
  if (!title || !isSafeUrl(url)) return null

  const sampleThumbnails = {
    'demo-react': '/assets/figma/react-reference.png',
    'demo-tailwind': '/assets/figma/tailwind-reference.png',
    'demo-huggingface': '/assets/figma/huggingface-logo.svg',
  }
  const thumbnail = typeof item.thumbnail === 'string' && item.thumbnail.startsWith('/assets/figma/')
    ? item.thumbnail
    : sampleThumbnails[item.id] || null

  return {
    ...item,
    id: typeof item.id === 'string' && item.id ? item.id : makeId(),
    title,
    url,
    notes: String(item.notes || '').trim().slice(0, 2000),
    description: String(item.description || item.notes || '').trim().slice(0, 500),
    coverImageUrl: typeof item.coverImageUrl === 'string' && isSafeUrl(item.coverImageUrl) ? item.coverImageUrl : null,
    thumbnail,
    collectionId: allowedCollectionIds.has(item.collectionId) ? item.collectionId : null,
    favorite: Boolean(item.favorite),
    createdAt: Number.isNaN(Date.parse(item.createdAt)) ? now() : item.createdAt,
    updatedAt: Number.isNaN(Date.parse(item.updatedAt)) ? now() : item.updatedAt,
  }
}

const useLinksStore = create(
  persist(
    (set, get) => ({
      links: demoLinks,
      collections: defaultCollections,

      addLink: (payload) => {
        const timestamp = now()
        const link = {
          id: makeId(),
          title: payload.title.trim(),
          url: payload.url.trim(),
          notes: (payload.notes || '').trim(),
          description: (payload.description || '').trim().slice(0, 500),
          coverImageUrl: payload.coverImageUrl || null,
          collectionId: payload.collectionId || null,
          favorite: Boolean(payload.favorite),
          createdAt: timestamp,
          updatedAt: timestamp,
        }
        set((state) => ({ links: [link, ...state.links] }))
        return link
      },

      updateLink: (id, payload) =>
        set((state) => ({
          links: state.links.map((link) =>
            link.id === id
              ? {
                  ...link,
                  ...payload,
                  title: payload.title.trim(),
                  url: payload.url.trim(),
                  notes: (payload.notes || '').trim(),
                  description: (payload.description || '').trim().slice(0, 500),
                  coverImageUrl: payload.coverImageUrl || null,
                  collectionId: payload.collectionId || null,
                  favorite: Boolean(payload.favorite),
                  updatedAt: now(),
                }
              : link,
          ),
        })),

      removeLink: (id) =>
        set((state) => ({ links: state.links.filter((link) => link.id !== id) })),

      removeLinks: (ids) => {
        const selected = new Set(ids)
        set((state) => ({ links: state.links.filter((link) => !selected.has(link.id)) }))
      },

      setCollectionLinks: (collectionId, linkIds) => {
        const selected = new Set(linkIds)
        set((state) => ({
          links: state.links.map((link) => {
            if (selected.has(link.id)) return { ...link, collectionId, updatedAt: now() }
            if (link.collectionId === collectionId) return { ...link, collectionId: null, updatedAt: now() }
            return link
          }),
        }))
      },

      toggleFavorite: (id) =>
        set((state) => ({
          links: state.links.map((link) =>
            link.id === id ? { ...link, favorite: !link.favorite, updatedAt: now() } : link,
          ),
        })),

      addCollection: (name, color = '#647fe9') => {
        const normalized = normalizeName(name)
        if (!normalized) return { error: 'Enter a collection name.' }
        if (get().collections.some((item) => normalizeName(item.name) === normalized)) {
          return { error: 'A collection with this name already exists.' }
        }
        const collection = { id: makeId(), name: name.trim().slice(0, 32), color, createdAt: now() }
        set((state) => ({ collections: [...state.collections, collection] }))
        return { collection }
      },

      renameCollection: (id, name) => {
        const normalized = normalizeName(name)
        if (!normalized) return { error: 'Enter a collection name.' }
        if (get().collections.some((item) => item.id !== id && normalizeName(item.name) === normalized)) {
          return { error: 'A collection with this name already exists.' }
        }
        set((state) => ({
          collections: state.collections.map((item) =>
            item.id === id ? { ...item, name: name.trim().slice(0, 32) } : item,
          ),
        }))
        return { success: true }
      },

      deleteCollection: (id) =>
        set((state) => ({
          collections: state.collections.filter((item) => item.id !== id),
          links: state.links.map((link) =>
            link.collectionId === id ? { ...link, collectionId: null } : link,
          ),
        })),

      deleteCollections: (ids) => {
        const selected = new Set(ids)
        set((state) => ({
          collections: state.collections.filter((item) => !selected.has(item.id)),
          links: state.links.map((link) =>
            selected.has(link.collectionId) ? { ...link, collectionId: null, updatedAt: now() } : link,
          ),
        }))
      },

      importBackup: (backup) => {
        if (!backup || !Array.isArray(backup.links)) {
          return { error: 'This file is not a valid Link Vault backup.' }
        }

        const currentCollections = get().collections
        const incomingCollections = Array.isArray(backup.collections) ? backup.collections : []
        const mergedCollections = [...currentCollections]
        const collectionMap = new Map()

        for (const item of incomingCollections) {
          if (!item || typeof item.name !== 'string') continue
          const existing = mergedCollections.find(
            (collection) => normalizeName(collection.name) === normalizeName(item.name),
          )
          if (existing) {
            collectionMap.set(item.id, existing.id)
          } else {
            const created = {
              id: makeId(),
              name: item.name.trim().slice(0, 32) || 'Imported collection',
              color: /^#[0-9a-f]{6}$/i.test(item.color || '') ? item.color : '#647fe9',
              createdAt: now(),
            }
            mergedCollections.push(created)
            collectionMap.set(item.id, created.id)
          }
        }

        const existingUrls = new Set(
          get().links.map((link) => {
            try { return new URL(link.url).href } catch { return link.url }
          }),
        )
        const imported = backup.links
          .map((item) => {
            const collectionId = collectionMap.get(item?.collectionId) || null
            return normalizeImportedLink(item, collectionId)
          })
          .filter(Boolean)
          .filter((link) => {
            const key = new URL(link.url).href
            if (existingUrls.has(key)) return false
            existingUrls.add(key)
            return true
          })

        set((state) => ({
          collections: mergedCollections,
          links: [...imported, ...state.links],
        }))

        return { importedCount: imported.length }
      },

      exportBackup: () => ({
        app: 'Link Vault',
        version: 1,
        exportedAt: now(),
        collections: get().collections,
        links: get().links,
      }),
    }),
    {
      name: 'link-vault:links',
      version: 5,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        links: state.links,
        collections: state.collections,
      }),
      migrate: (persistedState) => {
        const collections = Array.isArray(persistedState?.collections)
          ? persistedState.collections
          : defaultCollections
        const legacyLinks = Array.isArray(persistedState?.links) ? persistedState.links : []
        const sourceLinks = legacyLinks.length > 0
          ? legacyLinks
          : Array.isArray(persistedState?.collections)
            ? []
            : demoLinks
        const allowedCollectionIds = new Set(collections.map((item) => item.id))

        const alignedSamples = sourceLinks.map((item) => {
          if (!item?.isSample) return item
          if (item.id === 'demo-mdn' && item.title === 'MDN Web Docs') {
            return {
              ...item,
              id: 'demo-lucide',
              title: 'Lucide Icons',
              url: 'https://lucide.dev/',
              description: 'Beautiful & consistent icon toolkit made by the community. Open-source and lightweight.',
              notes: '',
            }
          }
          if (item.id === 'demo-reading' && item.title === 'A Complete Guide to Flexbox') {
            return {
              ...item,
              title: 'Patterns of Distributed Systems',
              url: 'https://martinfowler.com/articles/patterns-of-distributed-systems/',
              description: 'A catalog of common architectural patterns for building reliable distributed systems.',
              notes: '',
            }
          }
          return item
        })

        return {
          links: alignedSamples
            .map((item) => sanitizePersistedLink(item, allowedCollectionIds))
            .filter(Boolean),
          collections,
        }
      },
    },
  ),
)

export default useLinksStore
