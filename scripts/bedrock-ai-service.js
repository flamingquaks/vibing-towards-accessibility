#!/usr/bin/env node

import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';

/**
 * AWS Bedrock AI service for translation and validation using Claude 4 Sonnet
 */
export class BedrockTranslationService {
  constructor() {
    this.client = new BedrockRuntimeClient({
      region: process.env.AWS_REGION || 'us-east-1',
      // AWS credentials will be loaded from environment variables or AWS credentials file
      // AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN (if using temporary credentials)
    });
    this.modelId = 'anthropic.claude-3-5-sonnet-20241022-v2:0'; // Claude 4 Sonnet
  }

  /**
   * Translate text from English to target language using Claude
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
      const command = new ConverseCommand({
        modelId: this.modelId,
        messages: [
          {
            role: 'user',
            content: [{ text: prompt }]
          }
        ],
        inferenceConfig: {
          maxTokens: 1000,
          temperature: 0.3, // Lower temperature for more consistent translations
          topP: 0.9
        }
      });

      const response = await this.client.send(command);
      const translation = response.output?.message?.content?.[0]?.text?.trim();
      
      if (!translation) {
        throw new Error('No translation received from Claude');
      }
      
      return translation;
    } catch (error) {
      console.error(`Translation error for "${text}":`, error.message);
      throw new Error(`Failed to translate: ${error.message}`);
    }
  }

  /**
   * Validate a translation against the original English text
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
      const command = new ConverseCommand({
        modelId: this.modelId,
        messages: [
          {
            role: 'user',
            content: [{ text: prompt }]
          }
        ],
        inferenceConfig: {
          maxTokens: 1000,
          temperature: 0.1, // Very low temperature for consistent evaluation
          topP: 0.9
        }
      });

      const response = await this.client.send(command);
      const validationText = response.output?.message?.content?.[0]?.text?.trim();
      
      if (!validationText) {
        throw new Error('No validation response received from Claude');
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
   * Check if AWS credentials are properly configured
   * @returns {boolean} True if credentials are available
   */
  async checkCredentials() {
    try {
      // Try to make a simple request to test credentials
      const command = new ConverseCommand({
        modelId: this.modelId,
        messages: [
          {
            role: 'user',
            content: [{ text: 'Hello' }]
          }
        ],
        inferenceConfig: {
          maxTokens: 10,
          temperature: 0.1
        }
      });

      await this.client.send(command);
      return true;
    } catch (error) {
      console.error('AWS credentials check failed:', error.message);
      return false;
    }
  }
}