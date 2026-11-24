import test from 'node:test'
import assert from 'node:assert/strict'
import { formatText } from '../src/lib/text.js'

test('keeps the single English interface copy unchanged', () => {
  assert.equal(formatText('Settings'), 'Settings')
})

test('interpolates dynamic values in interface copy', () => {
  assert.equal(formatText('Delete {count} bookmarks?', { count: 3 }), 'Delete 3 bookmarks?')
})

test('leaves missing interpolation values untouched', () => {
  assert.equal(formatText('Welcome, {name}'), 'Welcome, {name}')
})
