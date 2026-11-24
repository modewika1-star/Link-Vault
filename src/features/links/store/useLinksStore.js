import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { COLLECTION_COLORS } from '../constants/collectionColors.js'

const defaultCollections = [
  { id: 'col-frontend', name: 'Frontend & React', color: COLLECTION_COLORS[0], createdAt: '2026-11-18T09:00:00.000Z' },
  { id: 'col-ai', name: 'AI & Tools', color: COLLECTION_COLORS[1], createdAt: '2026-11-19T09:00:00.000Z' },
  { id: 'col-reading', name: 'Reading List', color: COLLECTION_COLORS[2], createdAt: '2026-11-20T09:00:00.000Z' },
]

const demoLinks = [
  {
    id: 'demo-react',
    title: 'React – The Library for Web and Native User Interfaces',
    url: 'https://react.dev/',
    description: 'React lets you build user interfaces out of individual pieces called components.',
    notes: '',
    thumbnail: '/assets/figma/react-reference.png',
    collectionId: 'col-frontend',
    favorite: true,
    createdAt: '2026-11-24T10:00:00.000Z',
    updatedAt: '2026-11-24T10:00:00.000Z',
    isSample: true,
  },
  {
    id: 'demo-tailwind',
    title: 'Tailwind CSS - Rapidly build modern websites without ever leaving your HTML',
    url: 'https://tailwindcss.com/',
    description: 'A utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90.',
    notes: '',
    thumbnail: '/assets/figma/tailwind-reference.png',
    collectionId: 'col-frontend',
    favorite: true,
    createdAt: '2026-11-23T10:00:00.000Z',
    updatedAt: '2026-11-23T10:00:00.000Z',
    isSample: true,
  },
  {
    id: 'demo-vite',
    title: 'Vite | Next Generation Frontend Tooling',
    url: 'https://vite.dev/',
    description: 'Instant server start, lightning fast HMR, and rich features for modern web projects.',
    notes: '',
    collectionId: 'col-frontend',
    favorite: false,
    createdAt: '2026-11-22T10:00:00.000Z',
    updatedAt: '2026-11-22T10:00:00.000Z',
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
    createdAt: '2026-11-21T10:00:00.000Z',
    updatedAt: '2026-11-21T10:00:00.000Z',
    isSample: true,
  },
  {
    id: 'demo-huggingface',
    title: 'Hugging Face – Models',
    url: 'https://huggingface.co/',
    description: 'Discover, download, and test thousands of open-source machine learning models and datasets.',
    notes: '',
    thumbnail: '/assets/figma/huggingface-logo.svg',
    collectionId: 'col-ai',
    favorite: true,
    createdAt: '2026-11-19T10:00:00.000Z',
    updatedAt: '2026-11-19T10:00:00.000Z',
    isSample: true,
  },
  {
    id: 'demo-openai',
    title: 'OpenAI Platform Documentation',
    url: 'https://platform.openai.com/docs/',
    description: 'Explore developer resources, tutorials, API docs, and dynamic examples to get the most out of OpenAI.',
    notes: '',
    collectionId: 'col-ai',
    favorite: false,
    createdAt: '2026-11-20T10:00:00.000Z',
    updatedAt: '2026-11-20T10:00:00.000Z',
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
    createdAt: '2026-11-18T10:00:00.000Z',
    updatedAt: '2026-11-18T10:00:00.000Z',
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
    notes: typeof item.description === 'string' ? String(item.notes || '').trim().slice(0, 2000) : '',
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

      addCollection: (name, color = COLLECTION_COLORS[0]) => {
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

      deleteCollections: (ids) => {
        const selected = new Set(ids)
        set((state) => ({
          collections: state.collections.filter((item) => !selected.has(item.id)),
          links: state.links.map((link) =>
            selected.has(link.collectionId) ? { ...link, collectionId: null, updatedAt: now() } : link,
          ),
        }))
      },

    }),
    {
      name: 'link-vault:links',
      version: 6,
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

        const sampleMetadata = {
          'demo-react': {
            oldTitle: 'React',
            title: 'React – The Library for Web and Native User Interfaces',
            description: 'React lets you build user interfaces out of individual pieces called components.',
            createdAt: '2026-11-24T10:00:00.000Z',
          },
          'demo-tailwind': {
            oldTitle: 'Tailwind CSS',
            title: 'Tailwind CSS - Rapidly build modern websites without ever leaving your HTML',
            description: 'A utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90.',
            createdAt: '2026-11-23T10:00:00.000Z',
          },
          'demo-vite': {
            oldTitle: 'Vite',
            title: 'Vite | Next Generation Frontend Tooling',
            description: 'Instant server start, lightning fast HMR, and rich features for modern web projects.',
            createdAt: '2026-11-22T10:00:00.000Z',
          },
          'demo-lucide': {
            oldTitle: 'Lucide Icons',
            title: 'Lucide Icons',
            description: 'Beautiful & consistent icon toolkit made by the community. Open-source and lightweight.',
            createdAt: '2026-11-21T10:00:00.000Z',
          },
          'demo-openai': {
            oldTitle: 'OpenAI Platform',
            title: 'OpenAI Platform Documentation',
            description: 'Explore developer resources, tutorials, API docs, and dynamic examples to get the most out of OpenAI.',
            createdAt: '2026-11-20T10:00:00.000Z',
          },
          'demo-huggingface': {
            oldTitle: 'Hugging Face',
            title: 'Hugging Face – Models',
            description: 'Discover, download, and test thousands of open-source machine learning models and datasets.',
            createdAt: '2026-11-19T10:00:00.000Z',
          },
          'demo-reading': {
            oldTitle: 'A Complete Guide to Flexbox',
            title: 'Patterns of Distributed Systems',
            description: 'A catalog of common architectural patterns for building reliable distributed systems.',
            createdAt: '2026-11-18T10:00:00.000Z',
          },
        }

        const alignedSamples = sourceLinks.map((item) => {
          if (!item?.isSample) return item
          const id = item.id === 'demo-mdn' && item.title === 'MDN Web Docs' ? 'demo-lucide' : item.id
          const metadata = sampleMetadata[id]
          if (!metadata || ![metadata.oldTitle, metadata.title].includes(item.title)) return item
          return {
            ...item,
            id,
            title: metadata.title,
            description: metadata.description,
            notes: '',
            createdAt: metadata.createdAt,
            updatedAt: metadata.createdAt,
          }
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
