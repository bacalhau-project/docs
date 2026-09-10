import {JSDOM} from 'jsdom'
import {socialImage} from '../src/seo/metadata.mjs'
import { readdir, readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const buildDirectory = join(root, 'build')

async function filesRecursively(path) {
  const entries = await readdir(path, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const entryPath = join(path, entry.name)
    if (entry.isDirectory()) files.push(...(await filesRecursively(entryPath)))
    else if (entry.isFile()) files.push(entryPath)
  }
  return files
}

async function requireFile(path) {
  try {
    await stat(path)
  } catch {
    throw new Error(`Missing required site artifact: ${path}`)
  }
}

for (const path of [
  join(buildDirectory, 'llms.txt'),
  join(buildDirectory, 'llms-full.txt'),
  join(buildDirectory, 'sitemap.xml'),
  join(buildDirectory, 'robots.txt'),
  join(buildDirectory, '.well-known', 'mcp.json'),
  join(buildDirectory, 'docs', 'llms.txt'),
  join(buildDirectory, 'docs', 'llms-full.txt'),
  join(buildDirectory, 'docs', 'sitemap.xml'),
  join(buildDirectory, 'docs', 'robots.txt'),
]) {
  await requireFile(path)
}

const sitemap = await readFile(join(buildDirectory, 'sitemap.xml'), 'utf8')
const sitemapUrls = [...sitemap.matchAll(/<url>[\s\S]*?<loc>[^<]+<\/loc><lastmod>[^<]+<\/lastmod>[\s\S]*?<\/url>/g)]
if (sitemapUrls.length < 100) {
  throw new Error(`Expected at least 100 sitemap URLs with lastmod; found ${sitemapUrls.length}`)
}

if (sitemap.includes('<loc>https://bacalhau.org/blog/</loc>')) throw new Error('Redirected blog must not appear in sitemap')
const blogRedirect = new JSDOM(await readFile(join(buildDirectory, 'blog', 'index.html'), 'utf8')).window.document
if (blogRedirect.querySelector('link[rel="canonical"]')?.href !== 'https://blog.bacalhau.org/' || !blogRedirect.querySelector('meta[http-equiv="refresh"]')?.content.includes('https://blog.bacalhau.org/')) throw new Error('Missing project blog redirect')

// Independently pin the approved historical aliases and their content successors.
const historicalAliases = [
  ['/docs/v.1.3.0/references/api/jobs', '/docs/api/jobs/'],
  ['/docs/v.1.3.0/references/api/index', '/docs/api/'],
  ['/docs/dev/api/nodes', '/docs/api/nodes/'],
  ['/docs/v.1.3.0/setting-up/running-node/job-selection', '/docs/guides/selection-policy/'],
  ['/docs/v.1.3.0/setting-up/jobs/state', '/docs/specifications/other/state/'],
  ['/docs/v.1.3.1/references/other-specifications/publishers/ipfs', '/docs/publishers/ipfs/'],
  ['/docs/category/publishers', '/docs/publishers/'],
  ['/docs/v.1.3.0/references/cli-reference/cli/job/index-7', '/docs/cli/job/run/'],
  ['/docs/v.1.3.0/references/cli-reference/cli/job/index-8', '/docs/cli/job/stop/'],
  ['/docs/references/cli-reference/cli/config/set', '/docs/cli/config/set/'],
  ['/docs/references/jobs/job/task/network', '/docs/specifications/job/network/'],
  ['/docs/documentation/v1.6.x/references/jobs/job/constraint', '/docs/specifications/job/constraint/'],
  ['/docs/v.1.3.2-1/setting-up/workload-onboarding/container/docker-workload-onboarding', '/docs/references/developers/workload-onboarding/docker/'],
  ['/docs/getting-started/wasm-workload-onboarding', '/docs/references/developers/workload-onboarding/wasm/'],
  ['/docs/documentation/v.1.5.0/integrations/lilypad', '/integrations/lilypad/'],
]
for (const [alias, target] of historicalAliases) {
  if (alias + '/' === target) throw new Error('Historical alias redirects to itself: ' + alias)
  const aliasDocument = new JSDOM(await readFile(join(buildDirectory, alias, 'index.html'), 'utf8')).window.document
  const canonical = aliasDocument.querySelector('link[rel="canonical"]')?.getAttribute('href')
  const refresh = aliasDocument.querySelector('meta[http-equiv="refresh"]')?.content
  if (canonical !== target || refresh !== '0; url=' + target) throw new Error('Incorrect historical redirect: ' + alias)
  if (sitemap.includes('<loc>https://bacalhau.org' + alias + '/</loc>') || sitemap.includes('<loc>https://bacalhau.org' + alias + '</loc>')) throw new Error('Historical alias appears in sitemap: ' + alias)
  const targetDocument = new JSDOM(await readFile(join(buildDirectory, target, 'index.html'), 'utf8')).window.document
  if (targetDocument.querySelector('meta[http-equiv="refresh"]') || targetDocument.querySelector('link[rel="canonical"]')?.href !== 'https://bacalhau.org' + target || !targetDocument.querySelector('h1')) throw new Error('Historical redirect target is not a canonical content page: ' + target)
}
console.log('Validated ' + historicalAliases.length + ' exact historical redirects to canonical content pages.')

const htmlFiles = (await filesRecursively(buildDirectory)).filter((path) =>
  path.endsWith('.html'),
)
for (const path of htmlFiles) {
  const html = await readFile(path, 'utf8')
  if (!html.includes('rel="canonical"')) {
    throw new Error(`Missing canonical URL: ${path}`)
  }
  if (html.includes('docs.expanso.io')) {
    throw new Error(`Unexpected Expanso canonical/reference: ${path}`)
  }
}

for (const route of [
  'compute-over-data-comparison',
  'compute-over-data-architecture',
  'edge-orchestration-buyers-guide',
  'data-locality-and-sovereignty',
]) {
  const html = await readFile(join(buildDirectory, 'docs', 'guides', route, 'index.html'), 'utf8')
  const document = new JSDOM(html).window.document
  for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
    const schemas = [JSON.parse(script.textContent)].flat()
    for (const schema of schemas.filter(value => value['@type'] === 'BreadcrumbList')) {
      for (const item of schema.itemListElement) {
        if (item.item) await requireFile(join(buildDirectory, new URL(item.item).pathname, 'index.html'))
      }
    }
  }
  for (const schema of ['TechArticle', 'FAQPage', 'BreadcrumbList']) {
    if (!html.includes(`\"@type\":\"${schema}\"`)) {
      throw new Error(`Missing ${schema} JSON-LD on ${route}`)
    }
  }
}

const installation = await readFile(join(root, 'docs', 'getting-started', 'installation.mdx'), 'utf8')
if (!installation.includes('https://get.bacalhau.org/install.sh')) {
  throw new Error('Installation guide does not use the canonical install endpoint')
}

console.log(`Validated ${htmlFiles.length} HTML files and ${sitemapUrls.length} sitemap URLs.`)

const cards = JSON.parse(await readFile(join(buildDirectory, 'img/social/manifest.json'), 'utf8'))
if (cards.length !== sitemapUrls.length) throw new Error('Social card coverage differs from sitemap')
for (const card of cards) {
  const document = new JSDOM(await readFile(join(buildDirectory, card.path, 'index.html'), 'utf8')).window.document
  for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
    const nodes = document.querySelectorAll(selector)
    if (nodes.length !== 1 || new URL(nodes[0].content).pathname !== socialImage(card.path)) throw new Error('Incorrect social image metadata: ' + card.path)
  }
  for (const selector of ['meta[property="og:image:alt"]', 'meta[name="twitter:image:alt"]']) {
    if (!document.querySelector(selector)?.content) throw new Error('Missing social image alt: ' + card.path)
  }
  const png = await readFile(join(buildDirectory, card.image))
  if (png.subarray(1,4).toString() !== 'PNG' || png.readUInt32BE(16) !== 1200 || png.readUInt32BE(20) !== 630) throw new Error('Invalid social PNG: ' + card.path)
  if (/^(Blog|Description:|Compute Node|Release Highlights)$/.test(document.querySelector('meta[name="description"]')?.content || '')) throw new Error('Placeholder description: ' + card.path)
}
console.log('Validated ' + cards.length + ' unique social PNGs, metadata and descriptions.')

const icon = await readFile(join(buildDirectory, 'favicon.ico'))
const originalIcon = await readFile(join(root, 'static/img/favicon.png'))
if (icon.readUInt16LE(2) !== 1 || icon.readUInt16LE(4) !== 1 || icon.readUInt32LE(18) !== 22 || !icon.subarray(22).equals(originalIcon)) throw new Error('Invalid canonical favicon asset')

for (const file of htmlFiles) {
  const document = new JSDOM(await readFile(file, 'utf8')).window.document
  for (const node of document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]')) {
    const url = new URL(node.content)
    await requireFile(join(buildDirectory, decodeURIComponent(url.pathname)))
  }
}
console.log('All HTML social image references resolve, including excluded and error pages.')
