import { access, readFile, readdir, stat, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const sitemapPath = join(root, 'build', 'sitemap.xml')

async function firstExisting(paths) {
  for (const path of paths) {
    try {
      await access(join(root, path))
      return path
    } catch {
      // Try the next source-file convention.
    }
  }
  return null
}

async function sourceForPath(pathname) {
  const path = pathname.replace(/^\/+|\/+$/g, '')
  if (!path) return 'src/pages/index.tsx'
  if (path === 'blog') return 'docusaurus.config.ts'

  const candidates = []
  if (path === 'docs') {
    candidates.push('docs/README.md')
  } else if (path.startsWith('docs/')) {
    const suffix = path.slice('docs/'.length)
    candidates.push(
      `docs/${suffix}.md`,
      `docs/${suffix}.mdx`,
      `docs/${suffix}/README.md`,
      `docs/${suffix}/README.mdx`,
    )
    const aliases = {
      'engines': 'components/engines',
      'publishers': 'components/publishers',
      'sources': 'components/sources',
      'references/faq': 'references/help-and-faq/faqs',
      'references/glossary': 'references/help-and-faq/glossary',
      'references/troubleshooting': 'references/help-and-faq/troubleshooting',
    }
    const alias = aliases[suffix]
    if (alias) {
      candidates.push(
        `docs/${alias}.md`,
        `docs/${alias}.mdx`,
        `docs/${alias}/README.md`,
        `docs/${alias}/README.mdx`,
      )
    }
    for (const [routePrefix, sourcePrefix] of [
      ['engines/', 'components/engines/'],
      ['publishers/', 'components/publishers/'],
      ['sources/', 'components/sources/'],
    ]) {
      if (suffix.startsWith(routePrefix)) {
        const aliasPath = `${sourcePrefix}${suffix.slice(routePrefix.length)}`
        candidates.push(`docs/${aliasPath}.md`, `docs/${aliasPath}.mdx`)
      }
    }
  } else if (path.startsWith('community/')) {
    const suffix = path.slice('community/'.length)
    candidates.push(
      `content/community/${suffix}.md`,
      `content/community/${suffix}.mdx`,
      `content/community/${suffix}/README.md`,
      `content/community/${suffix}/README.mdx`,
    )
    if (suffix.startsWith('roadmap-and-release-notes/')) {
      const slug = suffix.slice('roadmap-and-release-notes/'.length).replace(/\/$/, '')
      const entries = await readdir(join(root, 'content/community/roadmap-and-release-notes'))
      const releaseNote = entries.find((entry) => entry.endsWith(`-${slug}.md`))
      if (releaseNote) candidates.push(`content/community/roadmap-and-release-notes/${releaseNote}`)
    }
  } else if (path.startsWith('use-cases/')) {
    const suffix = path.slice('use-cases/'.length)
    candidates.push(
      `content/use-cases/use-cases/${suffix}.md`,
      `content/use-cases/use-cases/${suffix}.mdx`,
    )
  } else if (path === 'use-cases') {
    candidates.push('content/use-cases/use-cases/README.mdx')
  } else if (path.startsWith('integrations/')) {
    const suffix = path.slice('integrations/'.length)
    candidates.push(
      `content/use-cases/integrations/${suffix}.md`,
      `content/use-cases/integrations/${suffix}.mdx`,
    )
  }

  return firstExisting(candidates)
}

async function lastModified(path) {
  const result = spawnSync('git', ['log', '-1', '--format=%as', '--', path], {
    cwd: root,
    encoding: 'utf8',
  })
  const gitDate = result.status === 0 ? result.stdout.trim() : ''
  if (gitDate) return gitDate

  // New files have no Git history until the PR is committed. Their filesystem
  // modification date is the best available source date during local builds.
  return (await stat(join(root, path))).mtime.toISOString().slice(0, 10)
}

const sitemap = await readFile(sitemapPath, 'utf8')
const urls = [...sitemap.matchAll(/<url>([\s\S]*?)<loc>([^<]+)<\/loc>[\s\S]*?<\/url>/g)]
const replacements = await Promise.all(
  urls.map(async (match) => {
    const url = new URL(match[2])
    const source = await sourceForPath(url.pathname)
    if (!source) {
      throw new Error(`No source file mapped for sitemap URL: ${url.pathname}`)
    }
    const date = await lastModified(source)
    if (!date) {
      throw new Error(`No Git modification date available for: ${source}`)
    }
    return [match[0], match[0].replace('</loc>', `</loc><lastmod>${date}</lastmod>`)]
  }),
)

let updated = sitemap
for (const [original, replacement] of replacements) {
  updated = updated.replace(original, replacement)
}

await writeFile(sitemapPath, updated)
