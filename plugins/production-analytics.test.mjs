import assert from 'node:assert/strict'
import test from 'node:test'
import productionAnalyticsPlugin, {
  ANALYTICS_HOSTS,
  ANALYTICS_IDS,
  CLIENT_MODULE_PATTERN,
  DISABLED_CLIENT_MODULE,
  PRODUCTION_ANALYTICS_ENV,
  productionAnalyticsEnabled,
} from './production-analytics.mjs'

class FakeReplacementPlugin {
  constructor(pattern, replacement) { this.pattern = pattern; this.replacement = replacement }
}

const bundler = {currentBundler: {name: 'webpack', instance: {NormalModuleReplacementPlugin: FakeReplacementPlugin}}}

test('only the exact string "true" enables production analytics', () => {
  assert.equal(productionAnalyticsEnabled({[PRODUCTION_ANALYTICS_ENV]: 'true'}), true)

  for (const env of [{}, {[PRODUCTION_ANALYTICS_ENV]: ''}, {[PRODUCTION_ANALYTICS_ENV]: '1'}, {[PRODUCTION_ANALYTICS_ENV]: 'TRUE'}, {BACALHAU_SCARF_PIXEL: 'true'}]) {
    assert.equal(productionAnalyticsEnabled(env), false)
  }
})

const cachedConfig = {cache: {type: 'filesystem', version: 'docusaurus-abc'}}

test('a production build only separates its persistent cache and keeps every module', () => {
  const plugin = productionAnalyticsPlugin({}, {env: {[PRODUCTION_ANALYTICS_ENV]: 'true'}})
  assert.equal(plugin.name, 'production-analytics')
  assert.deepEqual(plugin.configureWebpack(cachedConfig, false, bundler), {cache: {type: 'filesystem', version: 'docusaurus-abc-analytics-on'}})
  assert.deepEqual(plugin.configureWebpack({}, false, bundler), {})
  assert.deepEqual(plugin.configureWebpack({cache: true}, false, bundler), {})
})

test('a non-production build swaps the analytics client for the no-op module', async () => {
  const plugin = productionAnalyticsPlugin({}, {env: {}})
  const {cache, plugins} = plugin.configureWebpack(cachedConfig, false, bundler)
  assert.deepEqual(cache, {type: 'filesystem', version: 'docusaurus-abc-analytics-off'})
  assert.equal(plugins.length, 1)
  assert.equal(Object.keys(plugin.configureWebpack({}, false, bundler)).join(), 'plugins')
  assert.equal(plugins[0].pattern, CLIENT_MODULE_PATTERN)
  assert.equal(plugins[0].replacement, DISABLED_CLIENT_MODULE)

  assert.match('/site/src/analytics/client.js', CLIENT_MODULE_PATTERN)
  assert.match('C:\\site\\src\\analytics\\client.js', CLIENT_MODULE_PATTERN)
  assert.doesNotMatch('/site/src/analytics/client-disabled.js', CLIENT_MODULE_PATTERN)
  assert.doesNotMatch('/site/src/analytics/collector.mjs', CLIENT_MODULE_PATTERN)

  const stub = await import(DISABLED_CLIENT_MODULE)
  assert.equal(stub.getCollector(), null)
  assert.equal(stub.onRouteDidUpdate(), undefined)
  assert.deepEqual(Object.keys(stub).sort(), ['getCollector', 'onRouteDidUpdate'])
})

test('the marker list names every vendor the site or its tag manager can fire', () => {
  for (const host of ['static.scarf.sh', 'googletagmanager.com', 'google-analytics.com', 'web.t.expanso.io', 'posthog.com', 'clarity.ms', 'px.ads.linkedin.com', 'hs-scripts.com', 'lfeeder.com', 'analytics.ahrefs.com', 'googleadservices.com', 'insights.algolia.io']) {
    assert.ok(ANALYTICS_HOSTS.includes(host), host)
  }

  assert.deepEqual(ANALYTICS_IDS, ['GTM-M4ZC5QX7', 'G-2MDP3SDFL7'])
})
