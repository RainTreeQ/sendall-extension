#!/usr/bin/env node

import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = join(__dirname, '..')
const esbuildBin = join(ROOT, 'app', 'node_modules', '.bin', 'esbuild')
const source = join(ROOT, 'src', 'content', 'index.js')
const output = join(ROOT, 'content.js')

if (!existsSync(esbuildBin)) {
  throw new Error('Missing app/node_modules/.bin/esbuild. Run npm install in app/')
}

execFileSync(esbuildBin, [source, '--bundle', '--format=iife', `--outfile=${output}`], {
  stdio: 'inherit',
})

console.log('[build:content] Built content.js')
