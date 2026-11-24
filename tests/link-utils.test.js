import test from 'node:test'
import assert from 'node:assert/strict'
import {
  filterAndSortLinks,
  getCollectionCount,
  getFaviconUrl,
} from '../src/features/links/utils/linkUtils.js'

const links = [
  {
    id: 'a',
    title: 'React Documentation',
    url: 'https://react.dev',
    notes: 'Frontend reference',
    favorite: true,
    collectionId: 'frontend',
    createdAt: '2026-11-20T10:00:00.000Z',
  },
  {
    id: 'b',
    title: 'Hugging Face',
    url: 'https://huggingface.co',
    notes: 'AI models',
    favorite: true,
    collectionId: 'ai',
    createdAt: '2026-11-22T10:00:00.000Z',
  },
  {
    id: 'c',
    title: 'Tailwind CSS',
    url: 'https://tailwindcss.com',
    notes: 'Utility CSS',
    favorite: false,
    collectionId: 'frontend',
    createdAt: '2026-11-21T10:00:00.000Z',
  },
]

test('search checks title, URL and notes', () => {
  assert.deepEqual(
    filterAndSortLinks(links, { query: 'AI models' }).map((link) => link.id),
    ['b'],
  )
  assert.deepEqual(
    filterAndSortLinks(links, { query: 'tailwindcss.com' }).map((link) => link.id),
    ['c'],
  )
})

test('favorites and collection filters can be applied together', () => {
  assert.deepEqual(
    filterAndSortLinks(links, {
      view: 'favorites',
      collectionId: 'frontend',
    }).map((link) => link.id),
    ['a'],
  )
})

test('sort modes return predictable order without mutating input', () => {
  const originalIds = links.map((link) => link.id)
  assert.deepEqual(
    filterAndSortLinks(links, { sort: 'newest' }).map((link) => link.id),
    ['b', 'c', 'a'],
  )
  assert.deepEqual(
    filterAndSortLinks(links, { sort: 'oldest' }).map((link) => link.id),
    ['a', 'c', 'b'],
  )
  assert.deepEqual(
    filterAndSortLinks(links, { sort: 'title-asc' }).map((link) => link.id),
    ['b', 'a', 'c'],
  )
  assert.deepEqual(links.map((link) => link.id), originalIds)
})

test('collection counts are calculated from the current links', () => {
  assert.equal(getCollectionCount(links, 'frontend'), 2)
  assert.equal(getCollectionCount(links, 'missing'), 0)
})

test('favicon URL is generated only for valid absolute URLs', () => {
  assert.match(getFaviconUrl('https://react.dev'), /react.dev/)
  assert.equal(getFaviconUrl('not a url'), '')
})
