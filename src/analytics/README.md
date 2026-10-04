# Legacy logical-site analytics

One named direct PostHog SDK instance and one explicit Google Analytics destination (`G-2MDP3SDFL7`) serve the legacy website and its `/docs` section. The production hostname allowlist is constructed in `collector.mjs`. Corporate and preview hosts never initialize the collector.

`onRouteDidUpdate` owns initial and SPA pageviews. Automatic pageviews, pageleave, autocapture, replay, feature flags, surveys and exception capture are disabled. Bot filtering is disabled intentionally; `traffic_class` is a heuristic, not proof of human activity. Synthetic visits use `?analytics_test=1` (retained in session storage); staff set `localStorage.expanso_analytics_internal = 'true'`.

The preference panel explains memory-only measurement for unset/declined preferences. Accept enables `localStorage+cookie`; declining clears SDK persistent state and rotates identity. The preference itself is stored so a declined visitor is not asked on every page. Preferences can be reopened at any time. DNT remains respected by the SDK.

Events include sanitized static route paths, the actual host, logical site, consent/identity state, classification and schema version. Unknown paths are redacted. URLs omit queries and fragments; referrers are origin-only. UTM fields accept short campaign slugs only; email-like values and free text are rejected. A final property allowlist strips SDK enrichment and person properties, retaining the public ingestion token. Manual events are `code_copy` (copy-button activation, not clipboard success), `search_used` (length on input change, never query text), `page_not_found`, and `outbound_click` (destination hostname, exact allowlisted destination path or `[redacted]`, and fixed navigation/footer/content/other placement). Query strings, fragments, arbitrary path values and link text are never collected.

## Build and rollout

Set `POSTHOG_PUBLIC_KEY` to the project's public browser token. Never use a personal API key. Production-analytics builds fail without it. Main's GitHub Pages workflow reads the secret or repository variable of that name. The PR analytics gate builds the production variant with an explicit build-only placeholder; do not deploy that artifact.

The existing GTM container remains present. Before deployment, the parent must disable BOTH its old PostHog tag and GA pageview tags. The parent must also disable Enhanced Measurement on the Google stream (including browser-history pageviews, scroll, outbound clicks, site search, forms and downloads), so only this manual collector owns events. The parent owns Google configuration and deployment. This checkout has not been committed, pushed or deployed.

Local gates: `npm run test:analytics`, `npm run test:plugins`, `npm run typecheck`, `npm run build`, `npm run validate:site`, the same build and validation with `BACALHAU_PRODUCTION_ANALYTICS=true POSTHOG_PUBLIC_KEY=phc_local_build_validation`, `npm run spell-check`, and `actionlint`. The SDK integration test blocks HTTP and verifies actual cookie/storage transitions and the scrubbed ingestion payload. Use Node 20, matching CI.

After deployment, verify real project receipt using a tagged initial/reload/SPA/back journey, accept then decline, both logical sites, and copy/search/outbound/404 actions. Confirm exactly one pageview per navigation after GTM removal. Local tests do not prove production receipt.

## Local gate follow-up

Spell-check now targets the existing source/document extensions plus `.mjs`, and confines Git ignore discovery to this checkout. This avoids inheriting the parent vault's scratch-directory exclusion. A temporary misspelling probe confirmed that new analytics modules are checked and cause a failing exit status.

The SDK test harness uses JSDOM 27.4.0, verified on Node 20.20.2, removing the deprecated encoding dependency. Install-script approvals are pinned to the reviewed installed versions of `core-js` and `fsevents`; scripts and checks are not disabled. Targeted dependency updates fix the available advisories, with `qs` pinned to 6.16.0 because its parents otherwise retain an affected version.

The upstream `image-size` 2.0.2 dependency has been removed and replaced by `tooling/image-metadata-adapter`, backed by maintained `probe-image-size` 7.4.0. The replacement accepts only bounded web-image formats and rejects the affected formats before parsing. Upstream advisory evidence is retained alongside the gate logs. npm audit now passes with zero findings; no advisory suppression or renamed copy of the vulnerable implementation is used.

## Google destination contract

The shared collector supplies the exact same sanitized page/action envelope to both destinations. Google uses a dedicated data layer, explicit `send_to`, `send_page_view: false`, a fixed page title and denied advertising consent. Unset/declined analytics consent selects denied analytics storage with an in-memory identifier; acceptance persists its identifier in local storage and a host-only cookie. Revocation rotates identity and clears this integration's cookies. Test/internal flags accompany every event; these events enable Google debug mode and use a separate traffic type. DNT prevents Google script loading. The UI names both analytics providers.

Local tests verify generated Google commands and shared routing with all network access disabled. Google receipt and Google-controlled automatic behavior still require parent-side production verification after disabling old tags and Enhanced Measurement.

Run `node scripts/run-local-gates.mjs <evidence-directory>` on Node 20 to retain complete logs for install, analytics, image metadata, plugin tests, typecheck, spelling, the non-production and production-analytics builds with their site validation, workflow syntax, diff checks, audit, install-script review and the expected missing-key failure. Protected legacy names are redacted from logs.

## Production-only analytics switch

Every third-party analytics tag hangs off one environment variable, `BACALHAU_PRODUCTION_ANALYTICS=true`, read by `plugins/production-analytics.mjs`. Only the `build` job in `.github/workflows/main.yml`, which produces the live GitHub Pages site, sets it. PR checks, preview builds, the dev server and local builds never do, so their browsers contact no analytics service. The switch was introduced because roughly 99% of Scarf events were the sites' own automated test browsers.

With the switch on, the build is byte-identical to the previous production build: the Google Tag Manager container `GTM-M4ZC5QX7` (and everything it fires: Clarity, LinkedIn, HubSpot, Leadfeeder, Ahrefs, Google Ads) is emitted on every page by the preset, the Scarf pixel is appended to `<body>`, the direct PostHog SDK and its Google Analytics adapter are bundled from `client.js`, and Algolia DocSearch insights are enabled. With it off, the preset receives no `googleTagManager` option, the Scarf plugin emits nothing, DocSearch insights are off, `customFields.posthogPublicKey` is empty and the key is not required, and the bundler replaces `src/analytics/client.js` with `client-disabled.js`, a no-op module, so `posthog-js`, the PostHog proxy host and the Google Analytics loader never reach the bundle. No client JavaScript was added for this; the swap happens at build time through `NormalModuleReplacementPlugin`.

`npm run test:plugins` covers both plugins. `npm run validate:site` enforces the gate on the built output: a flagged build must carry the GTM loader and noscript frame plus the Scarf pixel on every rendered page and the PostHog/Google Analytics client in a bundle; an unflagged build must not mention any host or identifier in `ANALYTICS_MARKERS` anywhere. The `Analytics Gate` job in `.github/workflows/pr-checks.yml` runs both variants on every pull request; the production variant is only inspected on disk, never served.

Tests that exercise tracking (`sdk.test.mjs`, `google.test.mjs`) run against the modules with every HTTP transport stubbed, so nothing reaches PostHog or Google from CI. For a browser-level check of a built site, serve the production variant locally and abort requests to every analytics host at the network layer (for example `agent-browser network route "**/googletagmanager.com/**" --abort`) before loading pages.

## Scarf visit pixel

`plugins/scarf-pixel.mjs` appends the Scarf-issued `<img>` pixel to the end of `<body>` on every rendered page. It is plain HTML with no client JavaScript, so it counts full page loads, not client-side route changes. It is not gated on the analytics preference: the pixel is cookie-free and sends only what any image request carries (IP address, user agent and, through `referrerpolicy`, the page URL). The preference panel discloses this for all visitors. Like every other tag it ships only when `BACALHAU_PRODUCTION_ANALYTICS=true`.
