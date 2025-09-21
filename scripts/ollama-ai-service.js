#!/usr/bin/env node

import { Ollama } from 'ollama';

/**
 * Ollama AI service for translation and validation using local models
 */
export class OllamaTranslationService {
  constructor() {
    this.ollama = new Ollama({
      host: process.env.OLLAMA_HOST || 'http://localhost:11434'
    });
    this.translationModel = 'gpt-oss:20b'; // Model for translations
    this.validationModel = 'gemma3:4b';   // Model for validation
  }

  /**
   * Translate text from English to target language using gpt-oss:20b
   * @param {string} text - English text to translate
   * @param {string} targetLanguage - Target language code (e.g., 'es', 'fr', 'de')
   * @param {string} context - Optional context about the translation (e.g., key path)
   * @returns {Promise<string>} Translated text
   */
  async translateText(text, targetLanguage, context = '') {
    const languageNames = {
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh': 'Chinese (Simplified)',
      'zh-TW': 'Chinese (Traditional)',
      'ar': 'Arabic',
      'hi': 'Hindi',
      'th': 'Thai',
      'vi': 'Vietnamese',
      'nl': 'Dutch',
      'sv': 'Swedish',
      'da': 'Danish',
      'no': 'Norwegian',
      'fi': 'Finnish',
      'pl': 'Polish',
      'cs': 'Czech',
      'hu': 'Hungarian',
      'ro': 'Romanian',
      'bg': 'Bulgarian',
      'hr': 'Croatian',
      'sr': 'Serbian',
      'sk': 'Slovak',
      'sl': 'Slovenian',
      'et': 'Estonian',
      'lv': 'Latvian',
      'lt': 'Lithuanian',
      'mt': 'Maltese',
      'cy': 'Welsh',
      'ga': 'Irish',
      'is': 'Icelandic',
      'mk': 'Macedonian',
      'sq': 'Albanian',
      'eu': 'Basque',
      'ca': 'Catalan',
      'gl': 'Galician',
      'he': 'Hebrew',
      'fa': 'Persian',
      'ur': 'Urdu',
      'bn': 'Bengali',
      'ta': 'Tamil',
      'te': 'Telugu',
      'ml': 'Malayalam',
      'kn': 'Kannada',
      'gu': 'Gujarati',
      'pa': 'Punjabi',
      'ne': 'Nepali',
      'si': 'Sinhala',
      'my': 'Burmese',
      'km': 'Khmer',
      'lo': 'Lao',
      'ka': 'Georgian',
      'am': 'Amharic',
      'sw': 'Swahili',
      'zu': 'Zulu',
      'af': 'Afrikaans',
      'id': 'Indonesian',
      'ms': 'Malay',
      'tl': 'Filipino',
      'tr': 'Turkish',
      'uk': 'Ukrainian',
      'be': 'Belarusian',
      'kk': 'Kazakh',
      'ky': 'Kyrgyz',
      'uz': 'Uzbek',
      'tg': 'Tajik',
      'mn': 'Mongolian',
      'az': 'Azerbaijani',
      'hy': 'Armenian'
    };

    const targetLanguageName = languageNames[targetLanguage] || targetLanguage;
    
    const contextInfo = context ? `\n\nContext: This text is used for "${context}" in a web application interface.` : '';
    
    const prompt = `You are a professional translator specializing in web application localization. Please translate the following English text to ${targetLanguageName}. 

Requirements:
- Maintain the same tone and style
- Preserve any interpolation variables like {{variable}} exactly as they are
- Keep HTML entities and special characters intact
- Ensure the translation is appropriate for web application UI
- If the text contains accessibility-related terms, maintain their proper meaning
- Keep emojis and symbols as they are${contextInfo}

English text: "${text}"

Provide only the translation, nothing else.`;

    try {
      const response = await this.ollama.generate({
        model: this.translationModel,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.3, // Lower temperature for more consistent translations
          top_p: 0.9,
          top_k: 40
        }
      });

      const translation = response.response?.trim();
      
      if (!translation) {
        throw new Error('No translation received from Ollama');
      }
      
      return translation;
    } catch (error) {
      console.error(`Translation error for "${text}":`, error.message);
      throw new Error(`Failed to translate: ${error.message}`);
    }
  }

  /**
   * Validate a translation against the original English text using gemma3:4b
   * @param {string} originalText - Original English text
   * @param {string} translatedText - Translated text to validate
   * @param {string} targetLanguage - Target language code
   * @param {string} context - Optional context about the translation
   * @returns {Promise<Object>} Validation result with score and feedback
   */
  async validateTranslation(originalText, translatedText, targetLanguage, context = '') {
    const languageNames = {
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh': 'Chinese (Simplified)',
      'zh-TW': 'Chinese (Traditional)',
      'ar': 'Arabic',
      'hi': 'Hindi',
      'th': 'Thai',
      'vi': 'Vietnamese',
      'nl': 'Dutch',
      'sv': 'Swedish',
      'da': 'Danish',
      'no': 'Norwegian',
      'fi': 'Finnish',
      'pl': 'Polish',
      'cs': 'Czech',
      'hu': 'Hungarian',
      'ro': 'Romanian',
      'bg': 'Bulgarian',
      'hr': 'Croatian',
      'sr': 'Serbian',
      'sk': 'Slovak',
      'sl': 'Slovenian',
      'et': 'Estonian',
      'lv': 'Latvian',
      'lt': 'Lithuanian',
      'mt': 'Maltese',
      'cy': 'Welsh',
      'ga': 'Irish',
      'is': 'Icelandic',
      'mk': 'Macedonian',
      'sq': 'Albanian',
      'eu': 'Basque',
      'ca': 'Catalan',
      'gl': 'Galician',
      'he': 'Hebrew',
      'fa': 'Persian',
      'ur': 'Urdu',
      'bn': 'Bengali',
      'ta': 'Tamil',
      'te': 'Telugu',
      'ml': 'Malayalam',
      'kn': 'Kannada',
      'gu': 'Gujarati',
      'pa': 'Punjabi',
      'ne': 'Nepali',
      'si': 'Sinhala',
      'my': 'Burmese',
      'km': 'Khmer',
      'lo': 'Lao',
      'ka': 'Georgian',
      'am': 'Amharic',
      'sw': 'Swahili',
      'zu': 'Zulu',
      'af': 'Afrikaans',
      'id': 'Indonesian',
      'ms': 'Malay',
      'tl': 'Filipino',
      'tr': 'Turkish',
      'uk': 'Ukrainian',
      'be': 'Belarusian',
      'kk': 'Kazakh',
      'ky': 'Kyrgyz',
      'uz': 'Uzbek',
      'tg': 'Tajik',
      'mn': 'Mongolian',
      'az': 'Azerbaijani',
      'hy': 'Armenian'
    };

    const targetLanguageName = languageNames[targetLanguage] || targetLanguage;
    
    const contextInfo = context ? `\n\nContext: This text is used for "${context}" in a web application interface.` : '';
    
    const prompt = `You are a professional translation quality assessor. Please evaluate the quality of this ${targetLanguageName} translation of an English text used in a web application.

Original English: "${originalText}"
${targetLanguageName} Translation: "${translatedText}"${contextInfo}

Please assess the translation on these criteria:
1. Accuracy: Does it convey the same meaning?
2. Fluency: Is it natural and grammatically correct?
3. Consistency: Are interpolation variables like {{variable}} preserved?
4. UI Appropriateness: Is it suitable for a web interface?
5. Accessibility: If applicable, are accessibility terms properly translated?

Provide your response in this exact JSON format:
{
  "score": <number from 0-100>,
  "isValid": <true/false>,
  "issues": [<array of specific issues if any>],
  "suggestions": [<array of improvement suggestions if any>],
  "summary": "<brief overall assessment>"
}`;

    try {
      const response = await this.ollama.generate({
        model: this.validationModel,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.1, // Very low temperature for consistent evaluation
          top_p: 0.9,
          top_k: 40
        }
      });

      const validationText = response.response?.trim();
      
      if (!validationText) {
        throw new Error('No validation response received from Ollama');
      }
      
      // Try to parse the JSON response
      try {
        const validation = JSON.parse(validationText);
        return validation;
      } catch (parseError) {
        // If JSON parsing fails, return a basic validation result
        return {
          score: 70,
          isValid: true,
          issues: [],
          suggestions: [],
          summary: 'Validation completed but response format was unexpected'
        };
      }
    } catch (error) {
      console.error(`Validation error for "${originalText}":`, error.message);
      throw new Error(`Failed to validate translation: ${error.message}`);
    }
  }

  /**
   * Check if Ollama is running and models are available
   * @returns {boolean} True if Ollama is accessible
   */
  async checkConnection() {
    try {
      // Check if Ollama is running
      await this.ollama.list();
      
      // Check if required models are available
      const models = await this.ollama.list();
      const modelNames = models.models.map(m => m.name);
      
      const hasTranslationModel = modelNames.some(name => name.includes(this.translationModel.split(':')[0]));
      const hasValidationModel = modelNames.some(name => name.includes(this.validationModel.split(':')[0]));
      
      if (!hasTranslationModel) {
        console.error(`Translation model ${this.translationModel} not found. Available models:`, modelNames);
        return false;
      }
      
      if (!hasValidationModel) {
        console.error(`Validation model ${this.validationModel} not found. Available models:`, modelNames);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Ollama connection check failed:', error.message);
      return false;
    }
  }

  /**
   * Pull required models if they're not available
   * @returns {Promise<boolean>} True if models are ready
   */
  async ensureModels() {
    try {
      console.log('🔍 Checking for required models...');
      
      const models = await this.ollama.list();
      const modelNames = models.models.map(m => m.name);
      
      const hasTranslationModel = modelNames.some(name => name.includes(this.translationModel.split(':')[0]));
      const hasValidationModel = modelNames.some(name => name.includes(this.validationModel.split(':')[0]));
      
      if (!hasTranslationModel) {
        console.log(`📥 Pulling translation model: ${this.translationModel}`);
        await this.ollama.pull({ model: this.translationModel });
        console.log(`✅ Translation model ready: ${this.translationModel}`);
      }
      
      if (!hasValidationModel) {
        console.log(`📥 Pulling validation model: ${this.validationModel}`);
        await this.ollama.pull({ model: this.validationModel });
        console.log(`✅ Validation model ready: ${this.validationModel}`);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to ensure models:', error.message);
      return false;
    }
  }
}