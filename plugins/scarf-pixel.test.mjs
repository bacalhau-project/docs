import assert from 'node:assert/strict'
import test from 'node:test'
import scarfPixelPlugin, {SCARF_PIXEL_TAG} from './scarf-pixel.mjs'
import {PRODUCTION_ANALYTICS_ENV} from './production-analytics.mjs'

const issued =
  '<img referrerpolicy="no-referrer-when-downgrade" ' +
  'src="https://static.scarf.sh/a.png?x-pxid=b6a4d900-0e5d-432f-864d-4a926c580621"'

test('emits nothing without the production-analytics switch', () => {
  for (const env of [{}, {[PRODUCTION_ANALYTICS_ENV]: ''}, {[PRODUCTION_ANALYTICS_ENV]: '1'}, {[PRODUCTION_ANALYTICS_ENV]: 'false'}, {BACALHAU_SCARF_PIXEL: 'true'}]) {
    assert.deepEqual(scarfPixelPlugin({}, {env}).injectHtmlTags(), {})
  }
})

test('emits the Scarf-issued tag at the end of body with the production-analytics switch', () => {
  const tags = scarfPixelPlugin({}, {env: {[PRODUCTION_ANALYTICS_ENV]: 'true'}}).injectHtmlTags()
  assert.deepEqual(tags, {postBodyTags: [SCARF_PIXEL_TAG]})
  assert.ok(SCARF_PIXEL_TAG.startsWith(issued))

  for (const attribute of ['alt=""', 'width="0"', 'height="0"', 'aria-hidden="true"', 'position:absolute']) {
    assert.ok(SCARF_PIXEL_TAG.includes(attribute), attribute)
  }

  assert.doesNotMatch(SCARF_PIXEL_TAG, /<script/i)
})
