#!/usr/bin/env node

/**
 * Quick diagnostic tool for debugging platform issues
 * Usage: node scripts/diagnose.mjs <platform>
 * Example: node scripts/diagnose.mjs chatgpt
 */

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SELECTORS_PATH = join(ROOT, 'selectors.json');

const args = process.argv.slice(2);
const platform = args[0];

if (!platform) {
  console.error('Usage: node scripts/diagnose.mjs <platform>');
  console.error('Example: node scripts/diagnose.mjs chatgpt');
  process.exit(1);
}

const selectors = JSON.parse(fs.readFileSync(SELECTORS_PATH, 'utf8'));

if (!selectors[platform]) {
  console.error(`❌ Platform '${platform}' not found in selectors.json`);
  console.log('\nAvailable platforms:');
  Object.keys(selectors).forEach(p => console.log(`  - ${p}`));
  process.exit(1);
}

const config = selectors[platform];

console.log(`\n🔍 Diagnostic Report for: ${platform}\n`);
console.log('═'.repeat(60));

console.log('\n📥 Input Field Selectors:');
if (config.findInput.length === 0) {
  console.log('  ⚠️  No input selectors defined');
} else {
  config.findInput.forEach((sel, i) => {
    console.log(`  ${i + 1}. ${sel}`);
  });
}

console.log('\n📤 Send Button Selectors:');
if (config.findSendBtn.length === 0) {
  console.log('  ⚠️  No send button selectors defined (will use heuristics)');
} else {
  config.findSendBtn.forEach((sel, i) => {
    console.log(`  ${i + 1}. ${sel}`);
  });
}

console.log('\n🧪 Testing Instructions:');
console.log('═'.repeat(60));
console.log('\n1. Open the platform in your browser');
console.log('2. Open DevTools (F12)');
console.log('3. Go to Console tab');
console.log('4. Test each selector:\n');

console.log('// Test input selectors:');
config.findInput.forEach((sel, i) => {
  console.log(`document.querySelector('${sel.replace(/'/g, "\\'")}') // Selector ${i + 1}`);
});

if (config.findSendBtn.length > 0) {
  console.log('\n// Test send button selectors:');
  config.findSendBtn.forEach((sel, i) => {
    console.log(`document.querySelector('${sel.replace(/'/g, "\\'")}') // Selector ${i + 1}`);
  });
}

console.log('\n// Test heuristic fallback:');
console.log(`document.querySelectorAll('textarea, div[contenteditable="true"]')`);
console.log(`document.querySelectorAll('button:not([disabled])')`);

console.log('\n💡 Tips:');
console.log('═'.repeat(60));
console.log('- If a selector returns null, it needs updating');
console.log('- Selectors are tried in order (first match wins)');
console.log('- Right-click element → Copy → Copy selector');
console.log('- Update selectors.json and run: npm run validate:selectors');
console.log('- Push to cloud repo for instant user updates\n');
