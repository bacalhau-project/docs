// The single production-only switch for every third-party analytics tag:
// the Scarf pixel, Google Tag Manager (and everything its container fires),
// the direct PostHog SDK and its Google Analytics adapter, and Algolia search
// insights. Only the live-site build job in .github/workflows/main.yml sets
// it, so PR checks, preview builds and local builds emit none of them.
import {fileURLToPath} from 'node:url'

export const PRODUCTION_ANALYTICS_ENV = 'BACALHAU_PRODUCTION_ANALYTICS'

export function productionAnalyticsEnabled(env = process.env) {
  return env[PRODUCTION_ANALYTICS_ENV] === 'true'
}

// Vendor hosts that must never appear anywhere in a non-production build.
// GTM-fired vendors are listed even though the repository never names them,
// so a future direct integration cannot slip past the gate unnoticed.
export const ANALYTICS_HOSTS = [
  'static.scarf.sh',
  'googletagmanager.com',
  'google-analytics.com',
  'googleadservices.com',
  'googlesyndication.com',
  'doubleclick.net',
  'web.t.expanso.io',
  'posthog.com',
  'clarity.ms',
  'px.ads.linkedin.com',
  'snap.licdn.com',
  'hs-scripts.com',
  'hs-analytics.net',
  'hs-banner.com',
  'hsforms.net',
  'hscollectedforms.net',
  'hubspot.com',
  'lfeeder.com',
  'leadfeeder.com',
  'analytics.ahrefs.com',
  'insights.algolia.io',
]

// Vendor identifiers that only a production build may carry.
export const ANALYTICS_IDS = ['GTM-M4ZC5QX7', 'G-2MDP3SDFL7']

export const ANALYTICS_MARKERS = [...ANALYTICS_HOSTS, ...ANALYTICS_IDS]

// src/analytics/client.js pulls in posthog-js and the Google adapter. In a
// non-production build the bundler swaps it for the no-op module below, so
// those bytes never ship; in production nothing is swapped and the bundle is
// byte-identical to one built without this plugin.
export const CLIENT_MODULE_PATTERN = /[\\/]src[\\/]analytics[\\/]client\.js$/

export const DISABLED_CLIENT_MODULE = fileURLToPath(
  new URL('../src/analytics/client-disabled.js', import.meta.url),
)

export default function productionAnalyticsPlugin(_context, {env = process.env} = {}) {
  const enabled = productionAnalyticsEnabled(env)

  return {
    name: 'production-analytics',
    configureWebpack(config, _isServer, {currentBundler}) {
      // The persistent bundler cache does not notice module replacements
      // (webpack/webpack#13627), so each switch state gets its own cache
      // version; otherwise a production build after a non-production one in
      // the same checkout would ship the no-op client. Output bytes are unaffected.
      const version = config.cache?.version

      const cache = version === undefined
        ? {}
        : {cache: {type: config.cache.type, version: `${version}-analytics-${enabled ? 'on' : 'off'}`}}

      if (enabled) return cache

      const {NormalModuleReplacementPlugin} = currentBundler.instance

      return {
        ...cache,
        plugins: [new NormalModuleReplacementPlugin(CLIENT_MODULE_PATTERN, DISABLED_CLIENT_MODULE)],
      }
    },
  }
}
