#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const localesDir = path.join(projectRoot, 'src', 'locales');

/**
 * List all available languages and their status
 */
function listLanguages() {
  if (!fs.existsSync(localesDir)) {
    console.error(`Error: Locales directory not found at ${localesDir}`);
    process.exit(1);
  }

  try {
    const localeFiles = fs.readdirSync(localesDir)
      .filter(file => file.endsWith('.json'))
      .sort();

    if (localeFiles.length === 0) {
      console.log('📂 No language files found in locales directory');
      return;
    }

    console.log('🌍 Available Languages:');
    console.log('');

    for (const file of localeFiles) {
      const languageCode = file.replace('.json', '');
      const filePath = path.join(localesDir, file);
      const stats = fs.statSync(filePath);
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      // Count total keys (recursively)
      const keyCount = countKeys(content);
      
      // Count untranslated keys
      const untranslatedCount = countUntranslatedKeys(content);
      
      const status = languageCode === 'en' ? '🇺🇸 (Source)' : 
                    untranslatedCount === 0 ? '✅ Complete' : 
                    `⏳ ${keyCount - untranslatedCount}/${keyCount} translated`;
      
      console.log(`  ${languageCode.padEnd(6)} ${status}`);
      console.log(`         📁 ${file}`);
      console.log(`         📊 ${keyCount} keys total`);
      if (untranslatedCount > 0 && languageCode !== 'en') {
        console.log(`         🔄 ${untranslatedCount} keys need translation`);
      }
      console.log('');
    }

    console.log('📝 Commands:');
    console.log('  npm run i18n:onboard <code>  - Create new language');
    console.log('  npm run i18n:update [code]   - Update existing language(s)');
    console.log('  npm run i18n:list           - Show this list');

  } catch (error) {
    console.error('Error listing languages:', error.message);
    process.exit(1);
  }
}

/**
 * Recursively count all keys in an object
 */
function countKeys(obj) {
  let count = 0;
  for (const value of Object.values(obj)) {
    if (typeof value === 'string') {
      count++;
    } else if (typeof value === 'object' && value !== null) {
      count += countKeys(value);
    }
  }
  return count;
}

/**
 * Recursively count untranslated keys (those that contain "TRANSLATE:")
 */
function countUntranslatedKeys(obj) {
  let count = 0;
  for (const value of Object.values(obj)) {
    if (typeof value === 'string' && value.includes('TRANSLATE:')) {
      count++;
    } else if (typeof value === 'object' && value !== null) {
      count += countUntranslatedKeys(value);
    }
  }
  return count;
}

listLanguages();