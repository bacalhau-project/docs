import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const outputDirectory = join(root, 'static', 'llms')

const collections = {
  'getting-started': ['docs/getting-started'],
  cli: ['docs/cli'],
  api: ['docs/api'],
  concepts: ['docs/README.md', 'docs/overview', 'docs/components'],
  other: [
    'docs/basics',
    'docs/guides',
    'docs/references',
    'docs/specifications',
    'content/use-cases',
  ],
}

const titles = {
  'getting-started': 'Getting Started with Bacalhau',
  cli: 'Bacalhau CLI Reference',
  api: 'Bacalhau API Reference',
  concepts: 'Bacalhau Concepts and Architecture',
  other: 'Additional Bacalhau Documentation',
}

async function markdownFiles(path) {
  const absolutePath = join(root, path)
  const entries = await readdir(absolutePath, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const entryPath = join(path, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await markdownFiles(entryPath)))
    } else if (entry.isFile() && /\.(md|mdx)$/.test(entry.name)) {
      files.push(entryPath)
    }
  }

  return files
}

async function filesFor(paths) {
  const files = []
  for (const path of paths) {
    if (/\.(md|mdx)$/.test(path)) {
      files.push(path)
    } else {
      files.push(...(await markdownFiles(path)))
    }
  }
  return files.sort()
}

function renderSource(source) {
  return source
    .replace(/^---\s*[\s\S]*?---\s*/, '')
    .replace(/^import .*$/gm, '')
    .replace(/^export .*$/gm, '')
    .replace(/<\/?(Tabs|TabItem)[^>]*>/g, '')
    .replace(/\t/g, '  ')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

async function renderCollection(name, paths) {
  const files = await filesFor(paths)
  const sections = await Promise.all(
    files.map(async (path) => {
      const source = await readFile(join(root, path), 'utf8')
      const rendered = renderSource(source)
      return `## ${relative(root, join(root, path))}\n\n${rendered}`
    }),
  )

  return `# ${titles[name]}\n\n${sections.join('\n\n')}`.trim() + '\n'
}

await mkdir(outputDirectory, { recursive: true })

const renderedCollections = {}
for (const [name, paths] of Object.entries(collections)) {
  const rendered = await renderCollection(name, paths)
  renderedCollections[name] = rendered
  await writeFile(join(outputDirectory, `${name}.txt`), rendered)
}

const fullDocument = [
  '# Bacalhau Documentation',
  '',
  '> Canonical, generated text representation of the Bacalhau documentation.',
  '',
  ...Object.values(renderedCollections),
].join('\n')

await writeFile(join(root, 'static', 'llms-full.txt'), fullDocument)
