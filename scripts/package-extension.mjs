#!/usr/bin/env node

import { execFileSync } from 'node:child_process'
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = join(__dirname, '..')
const RELEASE_DIR = join(ROOT, 'release')
const PACKAGE_DIR = join(RELEASE_DIR, 'extension')
const REPORT_PATH = join(RELEASE_DIR, 'extension-size-report.json')

const DEFAULT_MAX_BYTES = 550000

function parseArgs(argv) {
  const args = {
    minifyRuntime: false,
    maxBytes: DEFAULT_MAX_BYTES,
  }

  for (const raw of argv) {
    if (raw === '--minify-runtime') {
      args.minifyRuntime = true
      continue
    }
    if (raw.startsWith('--max-bytes=')) {
      const value = Number(raw.slice('--max-bytes='.length))
      if (!Number.isFinite(value) || value <= 0) {
        throw new Error(`Invalid --max-bytes value: ${raw}`)
      }
      args.maxBytes = Math.floor(value)
      continue
    }
    throw new Error(`Unknown argument: ${raw}`)
  }
  return args
}

function ensureDir(path) {
  mkdirSync(path, { recursive: true })
}

function toPosix(relPath) {
  return relPath.split(sep).join('/')
}

function listFilesRecursively(dir) {
  const out = []
  const entries = readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...listFilesRecursively(fullPath))
      continue
    }
    if (entry.isFile()) out.push(fullPath)
  }
  return out
}

function copyFileFromRoot(relPath) {
  const src = join(ROOT, relPath)
  const dst = join(PACKAGE_DIR, relPath)
  ensureDir(dirname(dst))
  cpSync(src, dst)
}

function copyDirFromRoot(relPath) {
  const src = join(ROOT, relPath)
  const dst = join(PACKAGE_DIR, relPath)
  ensureDir(dirname(dst))
  cpSync(src, dst, { recursive: true })
}

function minifyRuntimeFile(sourceRelPath, mapRelPath) {
  const source = join(ROOT, sourceRelPath)
  const target = join(PACKAGE_DIR, sourceRelPath)
  ensureDir(dirname(target))

  const esbuildBin = join(ROOT, 'app', 'node_modules', '.bin', 'esbuild')
  if (!existsSync(esbuildBin)) {
    throw new Error(
      'Missing app/node_modules/.bin/esbuild. Run npm install in app/ or use package:extension without --minify-runtime.'
    )
  }

  execFileSync(
    esbuildBin,
    [source, '--minify', '--sourcemap', `--outfile=${target}`],
    { stdio: 'pipe' }
  )

  if (mapRelPath) {
    const mapTarget = join(PACKAGE_DIR, mapRelPath)
    if (!existsSync(mapTarget)) {
      throw new Error(`Expected source map not found: ${mapRelPath}`)
    }
  }
}

function main() {
  const { minifyRuntime, maxBytes } = parseArgs(process.argv.slice(2))

  const manifestPath = join(ROOT, 'manifest.json')
  if (!existsSync(manifestPath)) throw new Error('Missing manifest.json')
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))

  const popupRel = String(manifest?.action?.default_popup || '')
  if (!popupRel) {
    throw new Error('manifest.action.default_popup is required')
  }
  const popupSourcePath = join(ROOT, popupRel)
  if (!existsSync(popupSourcePath)) {
    throw new Error(`Missing popup build output: ${popupRel}. Run npm run build:extension first.`)
  }

  rmSync(PACKAGE_DIR, { recursive: true, force: true })
  ensureDir(PACKAGE_DIR)
  ensureDir(RELEASE_DIR)

  copyFileFromRoot('manifest.json')
  copyDirFromRoot('_locales')
  copyDirFromRoot('icons')
  copyDirFromRoot('shared')
  copyDirFromRoot('app/dist-extension')

  if (minifyRuntime) {
    minifyRuntimeFile('background.js', 'background.js.map')
    minifyRuntimeFile('content.js', 'content.js.map')
  } else {
    copyFileFromRoot('background.js')
    copyFileFromRoot('content.js')
  }

  const popupInPackage = join(PACKAGE_DIR, popupRel)
  if (!existsSync(popupInPackage)) {
    throw new Error(`Packaged popup is missing: ${popupRel}`)
  }

  const allFiles = listFilesRecursively(PACKAGE_DIR)
  const entries = allFiles
    .map((filePath) => {
      const rel = toPosix(relative(PACKAGE_DIR, filePath))
      const bytes = statSync(filePath).size
      return { path: rel, bytes }
    })
    .sort((a, b) => b.bytes - a.bytes)

  const forbidden = entries.filter(({ path }) =>
    /(^|\/)(index\.html|vite\.svg|main\.js|screenshot(?:-dark|-light)?\.png)$/.test(path)
  )
  if (forbidden.length > 0) {
    const bad = forbidden.map((item) => item.path).join(', ')
    throw new Error(`Forbidden files detected in package: ${bad}`)
  }

  const totalBytes = entries.reduce((sum, item) => sum + item.bytes, 0)
  const overBudget = totalBytes > maxBytes

  const report = {
    generatedAt: new Date().toISOString(),
    version: manifest.version,
    packageDir: relative(ROOT, PACKAGE_DIR),
    totalBytes,
    totalKB: Number((totalBytes / 1024).toFixed(2)),
    maxBytes,
    withinBudget: !overBudget,
    minifyRuntime,
    files: entries,
  }

  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + '\n', 'utf8')

  const fileListPath = join(RELEASE_DIR, 'extension-filelist.txt')
  const lines = entries.map((entry) => `${entry.bytes.toString().padStart(7, ' ')}  ${entry.path}`)
  writeFileSync(fileListPath, lines.join('\n') + '\n', 'utf8')

  const zipPath = join(RELEASE_DIR, `sendol-extension-v${manifest.version}.zip`)
  try {
    rmSync(zipPath, { force: true })
    execFileSync('zip', ['-rq', zipPath, '.'], { cwd: PACKAGE_DIR, stdio: 'ignore' })
    console.log(`[package:extension] zip created: ${relative(ROOT, zipPath)}`)
  } catch {
    console.warn('[package:extension] zip command unavailable, skipped zip creation')
  }

  console.log(`[package:extension] output dir: ${relative(ROOT, PACKAGE_DIR)}`)
  console.log(`[package:extension] total size: ${totalBytes} bytes`)
  console.log(`[package:extension] budget: ${maxBytes} bytes`)
  console.log(`[package:extension] report: ${relative(ROOT, REPORT_PATH)}`)
  console.log('[package:extension] largest files:')
  for (const item of entries.slice(0, 12)) {
    console.log(`  ${item.bytes.toString().padStart(7, ' ')}  ${item.path}`)
  }

  if (overBudget) {
    throw new Error(
      `Package size ${totalBytes} exceeds limit ${maxBytes}. See release/extension-size-report.json`
    )
  }
}

main()
