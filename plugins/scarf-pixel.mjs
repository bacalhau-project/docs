// Scarf visit-counting pixel, emitted as plain HTML at the end of <body>.
// Only the production GitHub Pages build in .github/workflows/main.yml sets
// the flag, so PR checks, previews and local builds never contact Scarf.
export const SCARF_PIXEL_ENV = 'BACALHAU_SCARF_PIXEL'

// src and referrerpolicy are exactly as Scarf issued them; do not reformat.
export const SCARF_PIXEL_SRC =
  'https://static.scarf.sh/a.png?x-pxid=b6a4d900-0e5d-432f-864d-4a926c580621'

// position:absolute keeps the 0x0 image out of flow; an in-flow inline image
// would still open a line box and add height below the footer.
export const SCARF_PIXEL_TAG =
  `<img referrerpolicy="no-referrer-when-downgrade" src="${SCARF_PIXEL_SRC}" ` +
  'alt="" width="0" height="0" aria-hidden="true" ' +
  'style="position:absolute;width:0;height:0;border:0" />'

export function scarfPixelEnabled(env = process.env) {
  return env[SCARF_PIXEL_ENV] === 'true'
}

export default function scarfPixelPlugin(_context, {env = process.env} = {}) {
  const enabled = scarfPixelEnabled(env)

  return {
    name: 'scarf-pixel',
    injectHtmlTags() {
      return enabled ? {postBodyTags: [SCARF_PIXEL_TAG]} : {}
    },
  }
}
