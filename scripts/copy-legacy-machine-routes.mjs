import { copyFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const buildDirectory = new URL('../build/', import.meta.url)
const legacyDocsDirectory = new URL('../build/docs/', import.meta.url)
const machineFiles = ['robots.txt', 'sitemap.xml', 'llms.txt']

await mkdir(legacyDocsDirectory, { recursive: true })

await Promise.all(
  machineFiles.map((filename) =>
    copyFile(
      new URL(filename, buildDirectory),
      new URL(filename, legacyDocsDirectory),
    ),
  ),
)

console.log(
  `Copied ${machineFiles.map((filename) => join('docs', filename)).join(', ')}`,
)
