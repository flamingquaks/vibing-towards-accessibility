#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BedrockTranslationService } from './bedrock-ai-service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const localesDir = path.join(projectRoot, 'src', 'locales');
const englishLocalePath = path.join(localesDir, 'en.json');

/**
 * AI-powered translation of JSON object using Bedrock Claude
 * @param {Object} obj - Object to translate
 * @param {string} targetLanguage - Target language code
 * @param {BedrockTranslationService} aiService - AI service instance
 * @param {string} keyPrefix - Current key path for context
 * @returns {Object} Translated object
 */
async function translateObject(obj, targetLanguage, aiService, keyPrefix = '') {
  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const currentKeyPath = keyPrefix ? `${keyPrefix}.${key}` : key;
    
    if (typeof value === 'string') {
      try {
        console.log(`  🔄 Translating: ${currentKeyPath}`);
        const translation = await aiService.translateText(value, targetLanguage, currentKeyPath);
        result[key] = translation;
        
        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`  ❌ Failed to translate ${currentKeyPath}: ${error.message}`);
        result[key] = `[TRANSLATION_FAILED] ${value}`;
      }
    } else if (typeof value === 'object' && value !== null) {
      result[key] = await translateObject(value, targetLanguage, aiService, currentKeyPath);
    } else {
      result[key] = value;
    }
  }
  
  return result;
}

/**
 * AI-powered language onboarding with automatic translation
 */
async function onboardLanguageWithAI(languageCode, skipAI = false) {
  if (!languageCode) {
    console.error('Error: Language code is required');
    console.log('Usage: npm run i18n:ai-onboard <language-code> [--skip-ai]');
    console.log('Example: npm run i18n:ai-onboard es');
    console.log('Example: npm run i18n:ai-onboard fr --skip-ai  # Creates placeholders only');
    process.exit(1);
  }

  // Validate language code format
  if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(languageCode)) {
    console.error('Error: Language code should be in format "xx" or "xx-YY" (e.g., "en", "es", "fr-CA")');
    process.exit(1);
  }

  const newLocalePath = path.join(localesDir, `${languageCode}.json`);

  // Check if language already exists
  if (fs.existsSync(newLocalePath)) {
    console.error(`Error: Language "${languageCode}" already exists at ${newLocalePath}`);
    console.log('Use "npm run i18n:ai-translate" to translate existing languages');
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
    
    let translations;
    
    if (skipAI) {
      console.log(`📝 Creating language "${languageCode}" with placeholders (AI translation skipped)...`);
      
      // Create placeholder translations (existing functionality)
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
      
      translations = createPlaceholderTranslations(englishTranslations);
    } else {
      console.log(`🤖 Creating language "${languageCode}" with AI-powered translations...`);
      console.log('🔧 Initializing AWS Bedrock with Claude 4 Sonnet...');
      
      const aiService = new BedrockTranslationService();
      
      // Check AWS credentials
      console.log('🔍 Checking AWS credentials...');
      const hasCredentials = await aiService.checkCredentials();
      
      if (!hasCredentials) {
        console.error('❌ AWS credentials not found or invalid.');
        console.log('');
        console.log('Please configure your AWS credentials using one of these methods:');
        console.log('1. Environment variables:');
        console.log('   export AWS_ACCESS_KEY_ID=your_access_key');
        console.log('   export AWS_SECRET_ACCESS_KEY=your_secret_key');
        console.log('   export AWS_REGION=us-east-1');
        console.log('');
        console.log('2. AWS credentials file (~/.aws/credentials)');
        console.log('3. IAM roles (if running on AWS)');
        console.log('');
        console.log('Required permissions: bedrock:InvokeModel');
        console.log('');
        console.log('To create placeholders instead, use: npm run i18n:ai-onboard ' + languageCode + ' --skip-ai');
        process.exit(1);
      }
      
      console.log('✅ AWS credentials verified');
      console.log('🚀 Starting AI translation process...');
      console.log('');
      
      // Translate using AI
      translations = await translateObject(englishTranslations, languageCode, aiService);
      
      console.log('');
      console.log('🎉 AI translation completed!');
    }
    
    // Write new locale file
    fs.writeFileSync(newLocalePath, JSON.stringify(translations, null, 2) + '\n');
    
    console.log(`✅ Successfully created language "${languageCode}"`);
    console.log(`📁 Created: ${newLocalePath}`);
    
    if (skipAI) {
      console.log(`📝 Next steps:`);
      console.log(`   1. Translate the placeholder values in ${languageCode}.json`);
      console.log(`   2. Or use: npm run i18n:ai-translate ${languageCode}`);
    } else {
      console.log(`📝 Next steps:`);
      console.log(`   1. Review the AI translations in ${languageCode}.json`);
      console.log(`   2. Use: npm run i18n:ai-validate ${languageCode} to validate quality`);
    }
    
    console.log(`   3. Add the language to src/i18n.ts imports and resources`);
    console.log(`   4. Run tests with: npm run test:run`);
    
  } catch (error) {
    console.error('Error creating language:', error.message);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const languageCode = args.find(arg => !arg.startsWith('--'));
const skipAI = args.includes('--skip-ai');

onboardLanguageWithAI(languageCode, skipAI);