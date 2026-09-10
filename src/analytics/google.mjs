export const googleDestination = 'G-2MDP3SDFL7';
const identityKey = 'expanso_legacy_ga_client';
const layerName = 'legacyAnalyticsLayer';
const eventNames = new Set(['$pageview', 'analytics_consent_updated', 'code_copy', 'search_used', 'page_not_found', 'outbound_click']);
const sessionPropertyNames = ['site_id', 'site_host', 'environment', 'analytics_schema_version', 'consent_state', 'identity_mode', 'analytics_test', 'is_internal', 'traffic_class', 'classification_version'];
const propertyNames = [...sessionPropertyNames, 'search_length', 'result_count', 'destination_host', 'destination_path', 'link_placement'];
const consentSettings = state => ({analytics_storage: state === 'granted' ? 'granted' : 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'});
function getIdentity(win) {
  try {
    let stored;
    try { stored = win.localStorage.getItem(identityKey); } catch { /* Fall back to the consented cookie. */ }
    const value = stored || win.document.cookie.split('; ').find(part => part.startsWith(identityKey + '='))?.split('=')[1];
    return /^[0-9a-f-]{36}$/.test(value || '') ? value : null;
  } catch { return null; }
}
function forgetIdentity(win) {
  try { win.localStorage.removeItem(identityKey); } catch { /* Storage can be unavailable. */ }
  for (const cookie of win.document.cookie.split(';')) {
    const name = cookie.trim().split('=')[0];
    if (name.startsWith('expanso_legacy_ga')) win.document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax; Secure`;
  }
}
function saveIdentity(win, identity) {
  try { win.localStorage.setItem(identityKey, identity); } catch { /* Cookie is the fallback. */ }
  win.document.cookie = `${identityKey}=${identity}; Max-Age=31536000; Path=/; SameSite=Lax; Secure`;
}
// The collector supplies its final sanitized properties; this adapter never reads
// document.title, location.href, search text, clipboard text, or link text.
export function createGoogleAdapter(win, initialConsent) {
  if (win.navigator.doNotTrack === '1' || win.doNotTrack === '1') return {capture() {}};
  let state = initialConsent;
  let identity = (state === 'granted' && getIdentity(win)) || win.crypto.randomUUID();
  if (state === 'granted') saveIdentity(win, identity);
  else forgetIdentity(win);
  win[layerName] = win[layerName] || [];
  function gtag() { win[layerName].push(arguments); }
  gtag('consent', 'default', consentSettings(state));
  gtag('set', 'ads_data_redaction', true);
  gtag('set', 'url_passthrough', false);
  gtag('js', new Date());
  let initialized = false;
  function sessionContext(properties) {
    return {
      ...Object.fromEntries(sessionPropertyNames.filter(key => properties[key] !== undefined).map(key => [key, properties[key]])),
      ...(properties.analytics_test || properties.is_internal ? {debug_mode: true} : {}),
      traffic_type: properties.is_internal ? 'internal' : properties.analytics_test ? 'analytics_test' : 'external',
    };
  }
  function configuration(properties) {
    return {
      ...sessionContext(properties),
      send_page_view: false, client_id: identity, cookie_prefix: 'expanso_legacy', cookie_domain: 'none',
      allow_google_signals: false, allow_ad_personalization_signals: false,
      page_location: properties.$current_url, page_referrer: properties.$referrer || '',
      page_title: properties.site_id === 'legacy_docs' ? 'Legacy documentation' : 'Legacy website',
    };
  }
  return {
    capture(event, properties) {
      if (!eventNames.has(event)) return;
      if (properties.consent_state !== state) {
        state = properties.consent_state;
        forgetIdentity(win);
        identity = win.crypto.randomUUID();
        if (state === 'granted') saveIdentity(win, identity);
        gtag('consent', 'update', consentSettings(state));
        if (initialized) gtag('config', googleDestination, configuration(properties));
      }
      if (!initialized) {
        initialized = true;
        gtag('config', googleDestination, configuration(properties));
        const script = win.document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${googleDestination}&l=${layerName}`;
        script.referrerPolicy = 'no-referrer';
        win.document.head.appendChild(script);
      }
      const metadata = Object.fromEntries(propertyNames.filter(key => properties[key] !== undefined).map(key => [key, properties[key]]));
      for (const [utm, ga] of [['utm_source', 'campaign_source'], ['utm_medium', 'campaign_medium'], ['utm_campaign', 'campaign_name'], ['utm_content', 'campaign_content'], ['utm_term', 'campaign_term']]) {
        if (properties[utm]) metadata[ga] = properties[utm];
      }
      gtag('event', event === '$pageview' ? 'page_view' : event, {
        ...metadata, send_to: googleDestination, page_location: properties.$current_url,
        page_referrer: properties.$referrer || '',
        page_title: properties.site_id === 'legacy_docs' ? 'Legacy documentation' : 'Legacy website',
        ...sessionContext(properties),
      });
    },
  };
}
