#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const localesDir = path.join(projectRoot, 'src', 'locales');
const englishLocalePath = path.join(localesDir, 'en.json');

/**
 * Creates a placeholder translation object by recursively replacing all string values
 * with a placeholder indicating the key needs translation
 */
function createPlaceholderTranslations(obj, keyPrefix = '') {
  if (typeof obj === 'string') {
    return `[${keyPrefix}] - TRANSLATE: ${obj}`;
  }
  
  if (Array.isArray(obj)) {
    return obj.map((item, index) => createPlaceholderTranslations(item, `${keyPrefix}[${index}]`));
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      const newKeyPrefix = keyPrefix ? `${keyPrefix}.${key}` : key;
      result[key] = createPlaceholderTranslations(value, newKeyPrefix);
    }
    return result;
  }
  
  return obj;
}

/**
 * Onboard a new language by creating a new locale file with placeholder translations
 */
function onboardLanguage(languageCode) {
  if (!languageCode) {
    console.error('Error: Language code is required');
    console.log('Usage: npm run i18n:onboard <language-code>');
    console.log('Example: npm run i18n:onboard es');
    process.exit(1);
  }

  // Validate language code format (basic validation)
  if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(languageCode)) {
    console.error('Error: Language code should be in format "xx" or "xx-YY" (e.g., "en", "es", "fr-CA")');
    process.exit(1);
  }

  const newLocalePath = path.join(localesDir, `${languageCode}.json`);

  // Check if language already exists
  if (fs.existsSync(newLocalePath)) {
    console.error(`Error: Language "${languageCode}" already exists at ${newLocalePath}`);
    console.log('Use "npm run i18n:update" to update existing languages');
    process.exit(1);
  }

  // Check if English locale exists
  if (!fs.existsSync(englishLocalePath)) {
    console.error(`Error: English locale file not found at ${englishLocalePath}`);
    process.exit(1);
  }

  try {
    // Read English translations
    const englishTranslations = JSON.parse(fs.readFileSync(englishLocalePath, 'utf8'));
    
    // Create placeholder translations
    const placeholderTranslations = createPlaceholderTranslations(englishTranslations);
    
    // Write new locale file
    fs.writeFileSync(newLocalePath, JSON.stringify(placeholderTranslations, null, 2) + '\n');
    
    console.log(`✅ Successfully onboarded language "${languageCode}"`);
    console.log(`📁 Created: ${newLocalePath}`);
    console.log(`📝 Next steps:`);
    console.log(`   1. Translate the placeholder values in ${languageCode}.json`);
    console.log(`   2. Add the language to src/i18n.ts imports and resources`);
    console.log(`   3. Run tests with: npm run test:run`);
    
  } catch (error) {
    console.error('Error onboarding language:', error.message);
    process.exit(1);
  }
}

// Get language code from command line arguments
const languageCode = process.argv[2];
onboardLanguage(languageCode);