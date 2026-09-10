import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM, CookieJar} from 'jsdom';
import {createCollector, hosts} from './collector.mjs';
import {createGoogleAdapter, googleDestination} from './google.mjs';
const commands = win => (win.legacyAnalyticsLayer || []).map(args => [...args]);
const events = win => commands(win).filter(args => args[0] === 'event');
function setup(consent, extra = '') {
  const dom = new JSDOM('<head><title>private email in title</title></head>', {url: 'https://' + hosts[0] + '/?utm_source=launch&utm_term=private%40example.org&analytics_test=1' + extra});
  if (consent) dom.window.localStorage.setItem('expanso_analytics_consent', consent);
  const captured = [];
  const sdk = {legacyAnalytics: {capture: (name, properties) => captured.push([name, properties]), set_config() {}, reset() {}, persistence: {clear() {}}, sessionPersistence: {clear() {}}}, init() {}};
  const collector = createCollector(sdk, dom.window, 'phc_test', true, new Set(['/', '/docs']));
  return {dom, win: dom.window, collector, captured};
}
test('same initial, SPA and back pageview owner feeds only the explicit GA destination', () => {
  const {dom, win, collector, captured} = setup();
  collector.navigate(); collector.navigate();
  win.history.pushState({}, '', '/docs/'); collector.navigate();
  win.history.pushState({}, '', '/'); collector.navigate();
  win.history.pushState({}, '', '/#anchor'); collector.navigate();
  const views = events(win).filter(args => args[1] === 'page_view');
  assert.equal(views.length, 3);
  assert.equal(captured.filter(args => args[0] === '$pageview').length, 3);
  assert.deepEqual(views.map(args => args[2].site_id), ['legacy_website', 'legacy_docs', 'legacy_website']);
  assert.ok(views.every(args => args[2].send_to === googleDestination));
  assert.equal(commands(win).filter(args => args[0] === 'config').length, 1);
  assert.equal(commands(win).find(args => args[0] === 'config')[2].send_page_view, false);
  assert.equal(win.document.querySelectorAll('script').length, 1);
  assert.ok(win.document.querySelector('script').src.endsWith('id=G-2MDP3SDFL7&l=legacyAnalyticsLayer'));
  dom.window.close();
});
test('GA uses denied storage for unset/declined and rotates and removes persistent identity on revocation', () => {
  for (const initial of [undefined, 'denied']) {
    const {dom, win, collector} = setup(initial);
    collector.navigate();
    assert.equal(commands(win)[0][0], 'consent');
    assert.equal(commands(win)[0][2].analytics_storage, 'denied');
    assert.equal(win.document.cookie, '');
    assert.equal(win.localStorage.getItem('expanso_legacy_ga_client'), null);
    assert.equal(events(win)[0][2].identity_mode, 'ephemeral');
    const initialId = commands(win).find(args => args[0] === 'config')[2].client_id;
    collector.setConsent('granted');
    const persistentId = win.localStorage.getItem('expanso_legacy_ga_client');
    assert.ok(persistentId && persistentId !== initialId);
    assert.ok(win.document.cookie.includes(persistentId));
    win.document.cookie = 'expanso_legacy_ga_2MDP3SDFL7=old; Path=/; Secure';
    collector.setConsent('denied');
    assert.equal(win.document.cookie, '');
    assert.equal(win.localStorage.getItem('expanso_legacy_ga_client'), null);
    const configs = commands(win).filter(args => args[0] === 'config');
    assert.notEqual(configs.at(-1)[2].client_id, persistentId);
    assert.equal(events(win).filter(args => args[1] === 'page_view').length, 1);
    const updates = commands(win).filter(args => args[0] === 'consent' && args[1] === 'update');
    assert.deepEqual(updates.map(args => args[2].analytics_storage), ['granted', 'denied']);
    assert.ok(updates.every(args => args[2].ad_storage === 'denied' && args[2].ad_user_data === 'denied' && args[2].ad_personalization === 'denied'));
    dom.window.close();
  }
});
test('consented GA identifier survives reload through its cookie; ephemeral identifiers do not', () => {
  const jar = new CookieJar();
  const properties = {$current_url: 'https://' + hosts[0] + '/', site_id: 'legacy_website', consent_state: 'granted'};
  const one = new JSDOM('', {url: properties.$current_url, cookieJar: jar});
  createGoogleAdapter(one.window, 'granted').capture('$pageview', properties);
  const first = commands(one.window).find(args => args[0] === 'config')[2].client_id;
  const two = new JSDOM('', {url: properties.$current_url, cookieJar: jar});
  createGoogleAdapter(two.window, 'granted').capture('$pageview', properties);
  assert.equal(commands(two.window).find(args => args[0] === 'config')[2].client_id, first);
  const three = new JSDOM('', {url: properties.$current_url, cookieJar: jar});
  createGoogleAdapter(three.window, 'denied').capture('$pageview', {...properties, consent_state: 'denied'});
  assert.notEqual(commands(three.window).find(args => args[0] === 'config')[2].client_id, first);
  assert.equal(three.window.document.cookie, '');
  for (const dom of [one, two, three]) dom.window.close();
});
test('GA receives sanitized routes and safe actions with matching synthetic/internal metadata', () => {
  const {dom, win, collector, captured} = setup();
  win.localStorage.setItem('expanso_analytics_internal', 'true');
  collector.navigate();
  collector.capture('search_used', {search_length: 12, raw_query: 'private@example.org'});
  win.history.pushState({}, '', '/docs/private-person?q=private#secret'); collector.navigate();
  collector.capture('outbound_click', {destination_host: 'example.org', destination_path: '[redacted]', link_placement: 'content', raw_code: 'private code'});
  collector.capture('$autocapture', {raw_query: 'secret'});
  const payloads = events(win).map(args => args[2]);
  assert.ok(payloads.every(p => p.analytics_test && p.is_internal && p.debug_mode && p.traffic_type === 'internal'));
  assert.ok(payloads.every(p => p.campaign_source === 'launch' && !p.campaign_term));
  assert.equal(payloads.at(-1).page_location, 'https://' + hosts[0] + '/[redacted]');
  assert.ok(!JSON.stringify(commands(win)).includes('private'));
  assert.equal(payloads.length, captured.length);
  assert.equal(events(win)[1][2].search_length, 12);
  for (const property of ['destination_host', 'destination_path', 'link_placement']) {
    assert.equal(payloads.at(-1)[property], captured.at(-1)[1][property]);
    assert.ok(payloads.at(-1)[property]);
  }
  dom.window.close();
});
test('nonproduction hosts and DNT never load the Google destination', () => {
  const dom = new JSDOM('', {url: 'https://expanso.io/'});
  assert.equal(createCollector({}, dom.window, 'phc_test', true), null);
  assert.equal(dom.window.document.querySelector('script'), null);
  Object.defineProperty(dom.window.navigator, 'doNotTrack', {value: '1'});
  createGoogleAdapter(dom.window, 'granted').capture('$pageview', {});
  assert.equal(dom.window.document.querySelector('script'), null);
  assert.equal(dom.window.document.cookie, '');
  dom.window.close();
});
test('blocked storage remains ephemeral and query test tagging survives SPA navigation in memory', () => {
  const dom = new JSDOM('', {url: 'https://' + hosts[0] + '/?analytics_test=1'});
  Object.defineProperty(dom.window, 'localStorage', {get() { throw new Error('Storage disabled'); }});
  Object.defineProperty(dom.window, 'sessionStorage', {get() { throw new Error('Storage disabled'); }});
  const sdk = {legacyAnalytics: {capture() {}}, init() {}};
  const collector = createCollector(sdk, dom.window, 'phc_test', true, new Set(['/', '/docs']));
  collector.navigate();
  dom.window.history.pushState({}, '', '/docs/'); collector.navigate();
  assert.ok(events(dom.window).every(args => args[2].analytics_test && args[2].identity_mode === 'ephemeral'));
  assert.equal(dom.window.document.cookie, '');
  dom.window.close();
});
test('ordinary GA traffic omits debug_mode entirely instead of sending false', () => {
  const dom = new JSDOM('', {url: 'https://' + hosts[0] + '/'});
  createGoogleAdapter(dom.window, 'denied').capture('$pageview', {
    $current_url: dom.window.location.origin + '/', $referrer: 'https://search.example',
    site_id: 'legacy_website', consent_state: 'denied', analytics_test: false, is_internal: false,
  });
  const payload = events(dom.window)[0][2];
  assert.equal(Object.hasOwn(payload, 'debug_mode'), false);
  assert.equal(payload.page_referrer, 'https://search.example');
  assert.equal(payload.traffic_type, 'external');
  dom.window.close();
});
