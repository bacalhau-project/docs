import type { RedirectItem } from '@docusaurus/plugin-client-redirects/lib/types'

const redirects: RedirectItem[] = []

const createRedirects = (existingPath: string): string[] | undefined => {
  if (existingPath.includes('/docs/basic-usage/')) {
    return [existingPath.replace('/basic-usage/', '/getting-started/basic-usage/')]
  }
  if (existingPath.includes('/docs/common-workflows/')) {
    return [existingPath.replace('/common-workflows/', '/getting-started/common-workflows/')]
  }
  return undefined
}

export { redirects, createRedirects }
