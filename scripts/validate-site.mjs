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
