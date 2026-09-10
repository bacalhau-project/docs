# Legacy logical-site analytics

One named direct PostHog SDK instance and one explicit Google Analytics destination (`G-2MDP3SDFL7`) serve the legacy website and its `/docs` section. The production hostname allowlist is constructed in `collector.mjs`. Corporate and preview hosts never initialize the collector.

`onRouteDidUpdate` owns initial and SPA pageviews. Automatic pageviews, pageleave, autocapture, replay, feature flags, surveys and exception capture are disabled. Bot filtering is disabled intentionally; `traffic_class` is a heuristic, not proof of human activity. Synthetic visits use `?analytics_test=1` (retained in session storage); staff set `localStorage.expanso_analytics_internal = 'true'`.

The preference panel explains memory-only measurement for unset/declined preferences. Accept enables `localStorage+cookie`; declining clears SDK persistent state and rotates identity. The preference itself is stored so a declined visitor is not asked on every page. Preferences can be reopened at any time. DNT remains respected by the SDK.

Events include sanitized static route paths, the actual host, logical site, consent/identity state, classification and schema version. Unknown paths are redacted. URLs omit queries and fragments; referrers are origin-only. UTM fields accept short campaign slugs only; email-like values and free text are rejected. A final property allowlist strips SDK enrichment and person properties, retaining the public ingestion token. Manual events are `code_copy` (copy-button activation, not clipboard success), `search_used` (length on input change, never query text), `page_not_found`, and `outbound_click` (destination hostname, exact allowlisted destination path or `[redacted]`, and fixed navigation/footer/content/other placement). Query strings, fragments, arbitrary path values and link text are never collected.

## Build and rollout

Set `POSTHOG_PUBLIC_KEY` to the project's public browser token. Never use a personal API key. Production builds fail without it. Main's GitHub Pages workflow reads the secret or repository variable of that name. PR checks use an explicit build-only placeholder; do not deploy that artifact.

The existing GTM container remains present. Before deployment, the parent must disable BOTH its old PostHog tag and GA pageview tags. The parent must also disable Enhanced Measurement on the Google stream (including browser-history pageviews, scroll, outbound clicks, site search, forms and downloads), so only this manual collector owns events. The parent owns Google configuration and deployment. This checkout has not been committed, pushed or deployed.

Local gates: `npm run test:analytics`, `npm run typecheck`, `POSTHOG_PUBLIC_KEY=phc_local_build_validation npm run build`, `npm run validate:site`, `npm run spell-check`, and `actionlint`. The SDK integration test blocks HTTP and verifies actual cookie/storage transitions and the scrubbed ingestion payload. Use Node 20, matching CI.

After deployment, verify real project receipt using a tagged initial/reload/SPA/back journey, accept then decline, both logical sites, and copy/search/outbound/404 actions. Confirm exactly one pageview per navigation after GTM removal. Local tests do not prove production receipt.

## Local gate follow-up

Spell-check now targets the existing source/document extensions plus `.mjs`, and confines Git ignore discovery to this checkout. This avoids inheriting the parent vault's scratch-directory exclusion. A temporary misspelling probe confirmed that new analytics modules are checked and cause a failing exit status.

The SDK test harness uses JSDOM 27.4.0, verified on Node 20.20.2, removing the deprecated encoding dependency. Install-script approvals are pinned to the reviewed installed versions of `core-js` and `fsevents`; scripts and checks are not disabled. Targeted dependency updates fix the available advisories, with `qs` pinned to 6.16.0 because its parents otherwise retain an affected version.

The upstream `image-size` 2.0.2 dependency has been removed and replaced by `tooling/image-metadata-adapter`, backed by maintained `probe-image-size` 7.4.0. The replacement accepts only bounded web-image formats and rejects the affected formats before parsing. Upstream advisory evidence is retained alongside the gate logs. npm audit now passes with zero findings; no advisory suppression or renamed copy of the vulnerable implementation is used.

## Google destination contract

The shared collector supplies the exact same sanitized page/action envelope to both destinations. Google uses a dedicated data layer, explicit `send_to`, `send_page_view: false`, a fixed page title and denied advertising consent. Unset/declined analytics consent selects denied analytics storage with an in-memory identifier; acceptance persists its identifier in local storage and a host-only cookie. Revocation rotates identity and clears this integration's cookies. Test/internal flags accompany every event; these events enable Google debug mode and use a separate traffic type. DNT prevents Google script loading. The UI names both analytics providers.

Local tests verify generated Google commands and shared routing with all network access disabled. Google receipt and Google-controlled automatic behavior still require parent-side production verification after disabling old tags and Enhanced Measurement.

Run `node scripts/run-local-gates.mjs <evidence-directory>` on Node 20 to retain complete logs for install, analytics, image metadata, typecheck, spelling, build, site validation, workflow syntax, diff checks, audit, install-script review and the expected missing-key failure. Protected legacy names are redacted from logs.
