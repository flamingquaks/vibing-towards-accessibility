#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { OllamaTranslationService } from './ollama-ai-service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const localesDir = path.join(projectRoot, 'src', 'locales');
const englishLocalePath = path.join(localesDir, 'en.json');

async function translatePlaceholders(obj, targetLanguage, aiService, keyPrefix = '') {
  const result = { ...obj };
  let translatedCount = 0;
  
  for (const [key, value] of Object.entries(obj)) {
    const currentKeyPath = keyPrefix ? `${keyPrefix}.${key}` : key;
    
    if (typeof value === 'string') {
      // Check if this is a placeholder that needs translation
      if (value.includes('TRANSLATE:') || value.includes('TRANSLATION_FAILED')) {
        try {
          console.log(`  🔄 Translating: ${currentKeyPath}`);
          
          // Extract original text from placeholder
          let originalText = value;
          if (value.includes('TRANSLATE:')) {
            originalText = value.split('TRANSLATE:')[1].trim();
          } else if (value.includes('TRANSLATION_FAILED')) {
            originalText = value.replace('[TRANSLATION_FAILED]', '').trim();
          }
          
          const translation = await aiService.translateText(originalText, targetLanguage, currentKeyPath);
          result[key] = translation;
          translatedCount++;
          
          // Small delay to avoid overwhelming the API
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`  ❌ Failed to translate ${currentKeyPath}: ${error.message}`);
          // Keep the original placeholder
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      const translationResult = await translatePlaceholders(value, targetLanguage, aiService, currentKeyPath);
      result[key] = translationResult.result;
      translatedCount += translationResult.translatedCount;
    }
  }
  
  return { result, translatedCount };
}

/**
 * AI-powered translation of existing languages
 */
async function translateLanguageWithAI(languageCode = null) {
  // Check if English locale exists
  if (!fs.existsSync(englishLocalePath)) {
    console.error(`Error: English locale file not found at ${englishLocalePath}`);
    process.exit(1);
  }

  try {
    // Get target languages to translate
    let targetLanguages = [];
    
    if (languageCode) {
      const targetPath = path.join(localesDir, `${languageCode}.json`);
      if (!fs.existsSync(targetPath)) {
        console.error(`Error: Language "${languageCode}" not found at ${targetPath}`);
        console.log('Available languages:');
        const availableLanguages = fs.readdirSync(localesDir)
          .filter(file => file.endsWith('.json') && file !== 'en.json')
          .map(file => file.replace('.json', ''));
        if (availableLanguages.length > 0) {
          console.log('  ' + availableLanguages.join(', '));
        } else {
          console.log('  No languages available. Use "npm run i18n:ai-onboard <language-code>" to create one.');
        }
        process.exit(1);
      }
      targetLanguages = [languageCode];
    } else {
      // Get all non-English language files
      targetLanguages = fs.readdirSync(localesDir)
        .filter(file => file.endsWith('.json') && file !== 'en.json')
        .map(file => file.replace('.json', ''));
    }

    if (targetLanguages.length === 0) {
      console.log('No language files found to translate.');
      console.log('Use "npm run i18n:ai-onboard <language-code>" to create a new language.');
      return;
    }

    console.log('🤖 Starting AI-powered translation process...');
    console.log('🔧 Initializing Ollama with gpt-oss:20b...');
    
    const aiService = new OllamaTranslationService();
    
    // Check Ollama connection and models
    console.log('🔍 Checking Ollama connection and models...');
    const hasConnection = await aiService.checkConnection();
    
    if (!hasConnection) {
      console.error('❌ Ollama not accessible or required models not found.');
      console.log('');
      console.log('Please ensure:');
      console.log('1. Ollama is running: ollama serve');
      console.log('2. Required models are available:');
      console.log('   ollama pull gpt-oss:20b    # Translation model');
      console.log('   ollama pull gemma3:4b      # Validation model');
      console.log('');
      console.log('Or set OLLAMA_HOST environment variable if running remotely');
      process.exit(1);
    }
    
    console.log('✅ Ollama connection verified');
    console.log('🚀 Starting translation process...');
    console.log('');

    let totalTranslated = 0;
    
    for (const targetLang of targetLanguages) {
      const localePath = path.join(localesDir, `${targetLang}.json`);
      
      console.log(`📝 Translating ${targetLang}...`);
      
      // Read existing translations
      const existingTranslations = JSON.parse(fs.readFileSync(localePath, 'utf8'));
      
      // Translate placeholders using AI
      const { result: updatedTranslations, translatedCount } = await translatePlaceholders(
        existingTranslations, 
        targetLang, 
        aiService
      );
      
      if (translatedCount > 0) {
        // Write updated translations
        fs.writeFileSync(localePath, JSON.stringify(updatedTranslations, null, 2) + '\n');
        console.log(`  ✅ Translated ${translatedCount} placeholder(s) in ${targetLang}`);
        totalTranslated += translatedCount;
      } else {
        console.log(`  ✨ ${targetLang} has no placeholders to translate`);
      }
      console.log('');
    }

    if (totalTranslated > 0) {
      console.log(`🎉 Successfully translated ${totalTranslated} placeholder(s) across ${targetLanguages.length} language(s)`);
      console.log(`📝 Next steps:`);
      console.log(`   1. Review the AI translations in the language files`);
      console.log(`   2. Use: npm run i18n:ai-validate to validate translation quality`);
      console.log(`   3. Run tests with: npm run test:run`);
    } else {
      console.log('✨ All language files are already fully translated!');
    }
    
  } catch (error) {
    console.error('Error translating languages:', error.message);
    process.exit(1);
  }
}

// Get specific language code from command line arguments (optional)
const languageCode = process.argv[2];
translateLanguageWithAI(languageCode);