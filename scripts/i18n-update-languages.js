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
 * Recursively merges missing keys from English into the target language object
 * @param {Object} englishObj - The English translations object (source)
 * @param {Object} targetObj - The target language object to update
 * @param {string} keyPrefix - Current key path for logging
 * @returns {Object} - Updated target object with missing keys added
 */
function mergeTranslations(englishObj, targetObj, keyPrefix = '') {
  const result = { ...targetObj };
  let addedCount = 0;

  for (const [key, englishValue] of Object.entries(englishObj)) {
    const currentKeyPath = keyPrefix ? `${keyPrefix}.${key}` : key;
    
    if (!(key in result)) {
      // Key is missing in target language, add it with placeholder
      if (typeof englishValue === 'string') {
        result[key] = `[${currentKeyPath}] - TRANSLATE: ${englishValue}`;
        console.log(`  + Added missing key: ${currentKeyPath}`);
        addedCount++;
      } else if (typeof englishValue === 'object' && englishValue !== null) {
        const mergeResult = mergeTranslations(englishValue, {}, currentKeyPath);
        result[key] = mergeResult.result;
        addedCount += mergeResult.addedCount;
      } else {
        result[key] = englishValue;
        addedCount++;
      }
    } else if (typeof englishValue === 'object' && englishValue !== null && typeof result[key] === 'object' && result[key] !== null) {
      // Both are objects, merge recursively
      const mergeResult = mergeTranslations(englishValue, result[key], currentKeyPath);
      result[key] = mergeResult.result;
      addedCount += mergeResult.addedCount;
    }
    // If key exists and is not an object, keep the existing translation
  }

  return { result, addedCount };
}

/**
 * Update existing language files with missing keys from English
 */
function updateLanguages(specificLanguage = null) {
  // Check if English locale exists
  if (!fs.existsSync(englishLocalePath)) {
    console.error(`Error: English locale file not found at ${englishLocalePath}`);
    process.exit(1);
  }

  try {
    // Read English translations
    const englishTranslations = JSON.parse(fs.readFileSync(englishLocalePath, 'utf8'));
    
    // Get all locale files
    const localeFiles = fs.readdirSync(localesDir)
      .filter(file => file.endsWith('.json') && file !== 'en.json')
      .filter(file => specificLanguage ? file === `${specificLanguage}.json` : true);

    if (localeFiles.length === 0) {
      if (specificLanguage) {
        console.error(`Error: Language "${specificLanguage}" not found. Available languages:`);
        const availableLanguages = fs.readdirSync(localesDir)
          .filter(file => file.endsWith('.json') && file !== 'en.json')
          .map(file => file.replace('.json', ''));
        if (availableLanguages.length > 0) {
          console.log('  ' + availableLanguages.join(', '));
        } else {
          console.log('  No languages available. Use "npm run i18n:onboard <language-code>" to create one.');
        }
      } else {
        console.log('No language files found to update.');
        console.log('Use "npm run i18n:onboard <language-code>" to create a new language.');
      }
      return;
    }

    console.log('🔄 Updating language files with missing keys from English...\n');

    let totalUpdated = 0;
    
    for (const localeFile of localeFiles) {
      const languageCode = localeFile.replace('.json', '');
      const localePath = path.join(localesDir, localeFile);
      
      console.log(`📝 Updating ${languageCode}...`);
      
      // Read existing translations
      const existingTranslations = JSON.parse(fs.readFileSync(localePath, 'utf8'));
      
      // Merge with English translations
      const { result: updatedTranslations, addedCount } = mergeTranslations(englishTranslations, existingTranslations);
      
      if (addedCount > 0) {
        // Write updated translations
        fs.writeFileSync(localePath, JSON.stringify(updatedTranslations, null, 2) + '\n');
        console.log(`  ✅ Added ${addedCount} missing key(s) to ${languageCode}`);
        totalUpdated++;
      } else {
        console.log(`  ✨ ${languageCode} is already up to date`);
      }
      console.log('');
    }

    if (totalUpdated > 0) {
      console.log(`🎉 Successfully updated ${totalUpdated} language file(s)`);
      console.log(`📝 Next steps:`);
      console.log(`   1. Translate the new placeholder values in updated files`);
      console.log(`   2. Run tests with: npm run test:run`);
    } else {
      console.log('✨ All language files are up to date!');
    }
    
  } catch (error) {
    console.error('Error updating languages:', error.message);
    process.exit(1);
  }
}

// Get specific language code from command line arguments (optional)
const specificLanguage = process.argv[2];
updateLanguages(specificLanguage);