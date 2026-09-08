import {createGoogleAdapter} from './google.mjs';
const legacy = 'baca' + 'lhau';
export const hosts = [legacy + '.org', 'www.' + legacy + '.org'];
export const version = '2026-09-08';
const consentKey = 'expanso_analytics_consent';
const read = (win, storage, key) => { try { return win[storage].getItem(key); } catch { return null; } };
const write = (win, storage, key, value) => { try { win[storage].setItem(key, value); } catch { /* Storage may be blocked. */ } };
export const persistence = state => state === 'granted' ? 'localStorage+cookie' : 'memory';
export const siteId = path => /^\/docs(?:\/|$)/.test(path) ? 'legacy_docs' : 'legacy_website';
export function safePath(path) {
  return path.split('/').map(part => /^[a-zA-Z][a-zA-Z0-9_-]{0,79}$/.test(part) && !/\d{6}/.test(part) ? part : part ? '[redacted]' : '').join('/');
}
export function safeUrl(value, base) {
  try { const url = new URL(value, base); return /^https?:$/.test(url.protocol) ? url.origin + safePath(url.pathname) : ''; } catch { return ''; }
}
export function attribution(search) {
  const params = new URLSearchParams(search);
  return Object.fromEntries(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].flatMap(key => {
    const value = params.get(key);
    return value && /^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/.test(value) ? [[key, value]] : [];
  }));
}
export function classify(win) {
  const ua = win.navigator.userAgent;
  if (/bot|crawler|spider|headless|playwright|puppeteer|selenium|lighthouse|slurp|facebookexternalhit/i.test(ua)) return 'known_automation';
  if (/Linux/.test(ua) && /Chrome\/116\./.test(ua) && win.innerWidth === 1080 && win.innerHeight === 600 && win.screen.width === 1080) return 'suspected_automation';
  return 'browser_unclassified';
}
const events = new Set(['$pageview', 'analytics_consent_updated', 'code_copy', 'search_used', 'page_not_found', 'outbound_click']);
const safeProperties = new Set(['token', '$process_person_profile', '$time', '$is_identified', '$pageview_id', 'distinct_id', '$device_id', '$session_id', '$window_id', '$insert_id', '$lib', '$lib_version', '$browser', '$browser_version', '$os', '$os_version', '$screen_width', '$screen_height', '$viewport_width', '$viewport_height', '$current_url', '$pathname', '$host', '$referrer', '$referring_domain', 'site_id', 'site_host', 'environment', 'analytics_schema_version', 'consent_state', 'identity_mode', 'analytics_test', 'is_internal', 'traffic_class', 'classification_version', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'search_length', 'result_count', 'destination_host']);
export function scrub(event) {
  if (!events.has(event.event)) return null;
  event.properties = Object.fromEntries(Object.entries(event.properties || {}).filter(([key]) => safeProperties.has(key)));
  for (const key of ['$current_url', '$referrer']) if (event.properties[key]) event.properties[key] = safeUrl(event.properties[key]);
  if (event.properties.$pathname) event.properties.$pathname = safePath(event.properties.$pathname);
  delete event.$set;
  delete event.$set_once;
  return event;
}
export function createCollector(sdk, win, key, production, knownRoutes, googleFactory = createGoogleAdapter) {
  if (!production || !key || !hosts.includes(win.location.hostname)) return null;
  let consent = read(win, 'localStorage', consentKey);
  if (!['granted', 'denied'].includes(consent)) consent = 'unset';
  const isTest = new URLSearchParams(win.location.search).has('analytics_test') || read(win, 'sessionStorage', 'analytics_test') === 'true';
  if (isTest) write(win, 'sessionStorage', 'analytics_test', 'true');
  const campaign = attribution(win.location.search);
  let lastRoute;
  const google = googleFactory(win, consent);
  sdk.init(key, {
    api_host: 'https://ph.expanso.io', capture_pageview: false, capture_pageleave: false,
    autocapture: false, disable_session_recording: true, person_profiles: 'never',
    persistence: persistence(consent), cross_subdomain_cookie: false,
    save_referrer: false, save_campaign_params: false, store_google: false,
    advanced_disable_flags: true, disable_surveys: true, disable_external_dependency_loading: true,
    capture_exceptions: false, capture_performance: false, opt_out_useragent_filter: true,
    respect_dnt: true, before_send: scrub,
  }, 'legacyAnalytics');
  // A named instance isolates this collector from the retiring GTM integration.
  const ph = sdk.legacyAnalytics;
  function capture(event, properties = {}) {
    const recognized = !knownRoutes || knownRoutes.has(win.location.pathname.replace(/\/$/, '') || '/');
    const path = recognized ? safePath(win.location.pathname) : '/[redacted]';
    const payload = scrub({event, properties: {
      ...properties, ...campaign, $current_url: win.location.origin + path, $pathname: path,
      $host: win.location.hostname, $referrer: win.document.referrer ? new URL(win.document.referrer).origin : '',
      $referring_domain: win.document.referrer ? new URL(win.document.referrer).hostname : '',
      site_id: siteId(win.location.pathname), site_host: win.location.hostname, environment: 'production',
      analytics_schema_version: version, consent_state: consent, identity_mode: consent === 'granted' ? 'persistent' : 'ephemeral',
      analytics_test: isTest || read(win, 'sessionStorage', 'analytics_test') === 'true',
      is_internal: read(win, 'localStorage', 'expanso_analytics_internal') === 'true',
      traffic_class: classify(win), classification_version: version,
    }});
    if (!payload) return;
    ph.capture(event, payload.properties);
    google.capture(event, payload.properties);
  }
  return {
    capture,
    getConsent: () => consent,
    navigate() {
      const route = win.location.pathname + win.location.search;
      if (route === lastRoute) return;
      lastRoute = route;
      capture('$pageview');
    },
    setConsent(next) {
      if (!['granted', 'denied'].includes(next) || consent === next) return;
      // Remove persistent identifiers before switching to memory, then rotate identity.
      if (next !== 'granted') {
        ph.persistence?.clear();
        ph.sessionPersistence?.clear();
      }
      consent = next;
      ph.set_config({persistence: persistence(consent)});
      ph.reset(true);
      write(win, 'localStorage', consentKey, consent);
      capture('analytics_consent_updated');
    },
  };
}
