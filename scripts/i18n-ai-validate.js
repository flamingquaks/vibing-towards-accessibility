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

async function validateTranslations(englishObj, translatedObj, targetLanguage, aiService, keyPrefix = '') {
  const results = {
    totalValidated: 0,
    passedValidation: 0,
    failedValidation: 0,
    issues: [],
    suggestions: []
  };
  
  for (const [key, englishValue] of Object.entries(englishObj)) {
    const currentKeyPath = keyPrefix ? `${keyPrefix}.${key}` : key;
    const translatedValue = translatedObj[key];
    
    if (typeof englishValue === 'string' && typeof translatedValue === 'string') {
      // Skip placeholder texts
      if (translatedValue.includes('TRANSLATE:') || translatedValue.includes('TRANSLATION_FAILED')) {
        continue;
      }
      
      try {
        console.log(`  🔍 Validating: ${currentKeyPath}`);
        
        const validation = await aiService.validateTranslation(
          englishValue, 
          translatedValue, 
          targetLanguage, 
          currentKeyPath
        );
        
        results.totalValidated++;
        
        if (validation.isValid && validation.score >= 70) {
          results.passedValidation++;
          console.log(`    ✅ Score: ${validation.score}/100 - ${validation.summary}`);
        } else {
          results.failedValidation++;
          console.log(`    ❌ Score: ${validation.score}/100 - ${validation.summary}`);
          
          results.issues.push({
            key: currentKeyPath,
            score: validation.score,
            issues: validation.issues,
            suggestions: validation.suggestions,
            original: englishValue,
            translation: translatedValue
          });
        }
        
        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`  ❌ Failed to validate ${currentKeyPath}: ${error.message}`);
        results.issues.push({
          key: currentKeyPath,
          score: 0,
          issues: [`Validation failed: ${error.message}`],
          suggestions: [],
          original: englishValue,
          translation: translatedValue
        });
      }
    } else if (typeof englishValue === 'object' && englishValue !== null && 
               typeof translatedValue === 'object' && translatedValue !== null) {
      const nestedResults = await validateTranslations(
        englishValue, 
        translatedValue, 
        targetLanguage, 
        aiService, 
        currentKeyPath
      );
      
      results.totalValidated += nestedResults.totalValidated;
      results.passedValidation += nestedResults.passedValidation;
      results.failedValidation += nestedResults.failedValidation;
      results.issues.push(...nestedResults.issues);
      results.suggestions.push(...nestedResults.suggestions);
    }
  }
  
  return results;
}

/**
 * AI-powered validation of translation quality
 */
async function validateLanguageWithAI(languageCode = null) {
  // Check if English locale exists
  if (!fs.existsSync(englishLocalePath)) {
    console.error(`Error: English locale file not found at ${englishLocalePath}`);
    process.exit(1);
  }

  try {
    // Get target languages to validate
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
      console.log('No language files found to validate.');
      console.log('Use "npm run i18n:ai-onboard <language-code>" to create a new language.');
      return;
    }

    console.log('🤖 Starting AI-powered translation validation...');
    console.log('🔧 Initializing Ollama with gemma3:4b...');
    
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
    console.log('🚀 Starting validation process...');
    console.log('');

    // Read English translations
    const englishTranslations = JSON.parse(fs.readFileSync(englishLocalePath, 'utf8'));
    
    const allResults = {};
    
    for (const targetLang of targetLanguages) {
      const localePath = path.join(localesDir, `${targetLang}.json`);
      
      console.log(`📝 Validating ${targetLang}...`);
      
      // Read translations to validate
      const translations = JSON.parse(fs.readFileSync(localePath, 'utf8'));
      
      // Validate translations using AI
      const results = await validateTranslations(
        englishTranslations, 
        translations, 
        targetLang, 
        aiService
      );
      
      allResults[targetLang] = results;
      
      console.log('');
      console.log(`📊 ${targetLang} Validation Summary:`);
      console.log(`   Total validated: ${results.totalValidated}`);
      console.log(`   ✅ Passed: ${results.passedValidation}`);
      console.log(`   ❌ Failed: ${results.failedValidation}`);
      
      if (results.totalValidated > 0) {
        const successRate = ((results.passedValidation / results.totalValidated) * 100).toFixed(1);
        console.log(`   📈 Success rate: ${successRate}%`);
      }
      
      if (results.issues.length > 0) {
        console.log(`\n   🔍 Issues found:`);
        results.issues.slice(0, 5).forEach(issue => { // Show first 5 issues
          console.log(`     • ${issue.key} (Score: ${issue.score}/100)`);
          if (issue.issues.length > 0) {
            console.log(`       Issues: ${issue.issues.join(', ')}`);
          }
          if (issue.suggestions.length > 0) {
            console.log(`       Suggestions: ${issue.suggestions.join(', ')}`);
          }
        });
        
        if (results.issues.length > 5) {
          console.log(`     ... and ${results.issues.length - 5} more issues`);
        }
      }
      
      console.log('');
    }

    // Generate validation report
    const reportPath = path.join(projectRoot, 'i18n-validation-report.json');
    const report = {
      timestamp: new Date().toISOString(),
      totalLanguages: targetLanguages.length,
      languages: allResults,
      summary: {
        totalValidated: Object.values(allResults).reduce((sum, r) => sum + r.totalValidated, 0),
        totalPassed: Object.values(allResults).reduce((sum, r) => sum + r.passedValidation, 0),
        totalFailed: Object.values(allResults).reduce((sum, r) => sum + r.failedValidation, 0),
        totalIssues: Object.values(allResults).reduce((sum, r) => sum + r.issues.length, 0)
      }
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`🎉 Validation completed for ${targetLanguages.length} language(s)!`);
    console.log(`📄 Detailed report saved to: ${reportPath}`);
    
    if (report.summary.totalFailed > 0) {
      console.log(`⚠️  ${report.summary.totalFailed} translation(s) need attention`);
      console.log(`📝 Next steps:`);
      console.log(`   1. Review the validation report for specific issues`);
      console.log(`   2. Update problematic translations manually`);
      console.log(`   3. Re-run validation to verify improvements`);
    } else {
      console.log(`✨ All translations passed validation!`);
    }
    
  } catch (error) {
    console.error('Error validating translations:', error.message);
    process.exit(1);
  }
}

// Get specific language code from command line arguments (optional)
const languageCode = process.argv[2];
validateLanguageWithAI(languageCode);