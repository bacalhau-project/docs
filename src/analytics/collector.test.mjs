import test from 'node:test';
import assert from 'node:assert/strict';
import {createCollector, hosts, siteId, safePath, safeUrl, attribution, classify, scrub, persistence} from './collector.mjs';
const storage = () => { const data = new Map(); return {getItem: key => data.get(key), setItem: (key, value) => data.set(key, value)}; };
function setup(consent) {
  const calls = [];
  const win = {location: new URL('https://' + hosts[0] + '/?utm_source=qa&analytics_test=1'), localStorage: storage(), sessionStorage: storage(), document: {referrer: 'https://example.org/private?q=email'}, navigator: {userAgent: 'Chrome/120.0 Linux'}, innerWidth: 1080, innerHeight: 600, screen: {width: 1080}};
  if (consent) win.localStorage.setItem('expanso_analytics_consent', consent);
  const instance = {capture: (...args) => calls.push(args), set_config: args => calls.push(['config', args]), reset: value => calls.push(['reset', value]), persistence: {clear: () => calls.push(['clear'])}, sessionPersistence: {clear: () => calls.push(['clearSession'])}};
  const sdk = {legacyAnalytics: instance, init: (key, config) => {sdk.config = config;}};
  return {sdk, win, calls, collector: createCollector(sdk, win, 'phc_test', true, undefined, () => ({capture() {}}))};
}
test('production allowlist and logical routes', () => {
  const {sdk, win} = setup();
  assert.equal(createCollector(sdk, win, 'key', false), null);
  win.location = new URL('https://expanso.io/docs');
  assert.equal(createCollector(sdk, win, 'key', true), null);
  assert.equal(siteId('/docs'), 'legacy_docs');
  assert.equal(siteId('/docs/quick-start'), 'legacy_docs');
  assert.equal(siteId('/docs-other'), 'legacy_website');
});
test('exactly one initial and one per SPA/back navigation; hash excluded', () => {
  const {collector, win, calls, sdk} = setup();
  collector.navigate(); collector.navigate();
  win.location.hash = '#section'; collector.navigate();
  win.location.pathname = '/docs/'; collector.navigate(); collector.navigate();
  win.location.pathname = '/'; collector.navigate();
  assert.equal(calls.length, 3);
  assert.deepEqual(calls.map(call => call[1].site_id), ['legacy_website', 'legacy_docs', 'legacy_website']);
  assert.equal(sdk.config.capture_pageview, false);
  assert.equal(sdk.config.opt_out_useragent_filter, true);
  assert.equal(sdk.config.disable_session_recording, true);
});
test('consent startup, accept, revoke cleanup and no extra pageview', () => {
  for (const state of ['unset', 'denied', 'granted']) {
    const {collector, sdk, calls} = setup(state);
    assert.equal(sdk.config.persistence, persistence(state));
    collector.navigate();
    assert.equal(calls[0][1].identity_mode, state === 'granted' ? 'persistent' : 'ephemeral');
  }
  const {collector, calls, win} = setup();
  collector.setConsent('granted');
  assert.equal(win.localStorage.getItem('expanso_analytics_consent'), 'granted');
  calls.length = 0;
  collector.setConsent('denied');
  assert.deepEqual(calls.slice(0, 4), [['clear'], ['clearSession'], ['config', {persistence: 'memory'}], ['reset', true]]);
  assert.equal(calls[4][1].consent_state, 'denied');
  assert.equal(calls[4][1].identity_mode, 'ephemeral');
  assert.equal(calls.filter(call => call[0] === '$pageview').length, 0);
});
test('sanitize URLs and allowlisted attribution, reject automatic properties and events', () => {
  assert.equal(safeUrl('https://example.org/docs/?email=person@example.org#secret'), 'https://example.org/docs/');
  assert.equal(safeUrl('mailto:person@example.org'), '');
  assert.equal(safePath('/search/person%40example.org/123456789'), '/search/[redacted]/[redacted]');
  assert.deepEqual(attribution('?utm_source=newsletter&utm_term=person%40example.org&email=private&utm_campaign=launch-2026'), {utm_source: 'newsletter', utm_campaign: 'launch-2026'});
  assert.deepEqual(scrub({event: '$pageview', properties: {$current_url: 'https://example.org/?secret=yes', $initial_current_url: 'secret', $set: {email: 'private'}, raw_code: 'secret'}}).properties, {$current_url: 'https://example.org/'});
  assert.equal(scrub({event: '$autocapture', properties: {}}), null);
});
test('narrow versioned automation class and explicit test/internal flags', () => {
  const {win, collector, calls} = setup();
  win.navigator.userAgent = 'Mozilla Linux Chrome/116.0';
  assert.equal(classify(win), 'suspected_automation');
  win.innerHeight = 601; assert.equal(classify(win), 'browser_unclassified');
  win.navigator.userAgent = 'Googlebot'; assert.equal(classify(win), 'known_automation');
  win.localStorage.setItem('expanso_analytics_internal', 'true');
  win.location.search = '';
  collector.navigate();
  assert.equal(calls[0][1].analytics_test, true);
  assert.equal(calls[0][1].is_internal, true);
  assert.equal(calls[0][1].utm_source, 'qa');
});
test('unknown routes redact arbitrary path text while retaining logical site', () => {
  const {sdk, win, calls} = setup();
  win.location.pathname = '/docs/private-person-name';
  const collector = createCollector(sdk, win, 'key', true, new Set(['/docs']), () => ({capture() {}}));
  collector.navigate();
  assert.equal(calls[0][1].$pathname, '/[redacted]');
  assert.equal(calls[0][1].site_id, 'legacy_docs');
  assert.equal(calls[0][1].$current_url, 'https://' + hosts[0] + '/[redacted]');
});
