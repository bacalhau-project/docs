import posthog from 'posthog-js';
import {installActions} from './actions.mjs';
import config from '@generated/docusaurus.config';
import routes from '@generated/routes';
const knownRoutes = new Set();
function collectRoutes(items) {
  for (const route of items) {
    if (route.path && !/[:*]/.test(route.path)) knownRoutes.add(route.path.replace(/\/$/, '') || '/');
    if (route.routes) collectRoutes(route.routes);
  }
}
collectRoutes(routes);
import {createCollector} from './collector.mjs';
let collector;
let started = false;
export function getCollector() {
  if (typeof window === 'undefined') return null;
  if (!started) {
    started = true;
    collector = createCollector(posthog, window, config.customFields.posthogPublicKey, process.env.NODE_ENV === 'production', knownRoutes);
    if (collector) installActions(window, collector);
  }
  return collector;
}
export function onRouteDidUpdate() { getCollector()?.navigate(); }
