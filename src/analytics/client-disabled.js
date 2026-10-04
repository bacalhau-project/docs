// Stands in for client.js in non-production builds (plugins/production-analytics.mjs),
// so posthog-js and the Google Analytics adapter are never bundled there.
export function getCollector() { return null; }

export function onRouteDidUpdate() {}
