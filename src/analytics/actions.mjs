// Only fixed event names and bounded action metadata cross this boundary.
const knownDestinations = new Set([
  'https://expanso.io/',
  'https://blog.bacalhau.org/',
  'https://github.com/bacalhau-project/bacalhau',
  'https://bit.ly/bacalhau-project-slack',
  'https://twitter.com/BacalhauProject',
  'https://www.linkedin.com/showcase/bacalhau-project/posts',
]);
function outboundProperties(url, link) {
  return {
    destination_host: url.hostname,
    destination_path: knownDestinations.has(url.origin + url.pathname) ? url.pathname : '[redacted]',
    link_placement: link.closest('footer') ? 'footer' : link.closest('nav') ? 'navigation' : link.closest('main') ? 'content' : 'other',
  };
}
export function installActions(win, collector) {
  const click = event => {
    const target = event.target instanceof win.Element ? event.target : null;
    if (target?.closest('.theme-code-block button[aria-label="Copy code to clipboard"]')) collector.capture('code_copy');
    const link = target?.closest('a[href]');
    if (link) {
      const url = new URL(link.href, win.location.href);
      if (/^https?:$/.test(url.protocol) && url.hostname !== win.location.hostname) collector.capture('outbound_click', outboundProperties(url, link));
    }
  };
  const change = event => {
    const target = event.target;
    if (target instanceof win.HTMLInputElement && (target.type === 'search' || target.classList.contains('DocSearch-Input'))) collector.capture('search_used', {search_length: Math.min(target.value.length, 1000)});
  };
  win.document.addEventListener('click', click);
  win.document.addEventListener('change', change);
  return () => { win.document.removeEventListener('click', click); win.document.removeEventListener('change', change); };
}
