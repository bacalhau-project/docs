export function socialImage(pathname) {
  return `/img/social/${pathname.replace(/^\/+|\/+$/g, '').replaceAll('/', '--') || 'home'}.png`;
}

export function semanticTitle(title, pathname) {
  if (pathname.startsWith('/docs/cli/') && pathname.split('/').filter(Boolean).length > 2) {
    return `${pathname.split('/').filter(Boolean).slice(2).join(' ')} — CLI reference`;
  }
  if (pathname.startsWith('/docs/specifications/job/') && pathname !== '/docs/specifications/job/') {
    return `${title} — Job specification`;
  }
  return title;
}
