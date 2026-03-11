#!/usr/bin/env node

/**
 * Validate selectors.json structure and test selectors against live platforms
 * Usage: node scripts/validate-selectors.mjs
 */

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SELECTORS_PATH = join(ROOT, 'selectors.json');

const REQUIRED_PLATFORMS = [
  'chatgpt', 'claude', 'gemini', 'grok', 'deepseek',
  'doubao', 'qianwen', 'yuanbao', 'kimi'
];

function validateStructure() {
  console.log('📋 Validating selectors.json structure...\n');
  
  if (!fs.existsSync(SELECTORS_PATH)) {
    console.error('❌ selectors.json not found!');
    process.exit(1);
  }

  let selectors;
  try {
    selectors = JSON.parse(fs.readFileSync(SELECTORS_PATH, 'utf8'));
  } catch (err) {
    console.error('❌ Invalid JSON:', err.message);
    process.exit(1);
  }

  let hasErrors = false;

  // Check all required platforms exist
  for (const platform of REQUIRED_PLATFORMS) {
    if (!selectors[platform]) {
      console.error(`❌ Missing platform: ${platform}`);
      hasErrors = true;
      continue;
    }

    const config = selectors[platform];
    
    // Check structure
    if (!Array.isArray(config.findInput)) {
      console.error(`❌ ${platform}.findInput must be an array`);
      hasErrors = true;
    }
    
    if (!Array.isArray(config.findSendBtn)) {
      console.error(`❌ ${platform}.findSendBtn must be an array`);
      hasErrors = true;
    }

    // Check selectors are strings
    if (config.findInput && !config.findInput.every(s => typeof s === 'string')) {
      console.error(`❌ ${platform}.findInput contains non-string values`);
      hasErrors = true;
    }

    if (config.findSendBtn && !config.findSendBtn.every(s => typeof s === 'string')) {
      console.error(`❌ ${platform}.findSendBtn contains non-string values`);
      hasErrors = true;
    }

    // Validate CSS selector syntax (basic check)
    const allSelectors = [...(config.findInput || []), ...(config.findSendBtn || [])];
    for (const selector of allSelectors) {
      // Basic validation - check for common issues
      if (selector.includes('  ')) {
        console.warn(`⚠️  ${platform}: Selector has double spaces: "${selector}"`);
      }
      if (selector.startsWith(' ') || selector.endsWith(' ')) {
        console.warn(`⚠️  ${platform}: Selector has leading/trailing spaces: "${selector}"`);
      }
    }

    if (!hasErrors) {
      console.log(`✅ ${platform}: ${config.findInput.length} input selectors, ${config.findSendBtn.length} button selectors`);
    }
  }

  if (hasErrors) {
    console.error('\n❌ Validation failed!');
    process.exit(1);
  }

  console.log('\n✅ All validations passed!');
  console.log(`\n📊 Summary:`);
  console.log(`   Platforms: ${REQUIRED_PLATFORMS.length}`);
  console.log(`   Total selectors: ${Object.values(selectors).reduce((sum, p) => sum + p.findInput.length + p.findSendBtn.length, 0)}`);
}

validateStructure();
