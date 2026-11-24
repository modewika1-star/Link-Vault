import test from 'node:test'
import assert from 'node:assert/strict'
import { translate } from '../src/i18n/translations.js'

test('translates interface labels into Arabic', () => {
  assert.equal(translate('Settings', 'ar'), 'الإعدادات')
  assert.equal(translate('All Bookmarks', 'ar'), 'كل الروابط المحفوظة')
})

test('interpolates values in translated messages', () => {
  assert.equal(
    translate('Delete "{title}" from your vault?', 'ar', { title: 'React' }),
    'هل تريد حذف "React" من مكتبتك؟',
  )
})

test('keeps English and unknown messages unchanged', () => {
  assert.equal(translate('Settings', 'en'), 'Settings')
  assert.equal(translate('User supplied text', 'ar'), 'User supplied text')
})
