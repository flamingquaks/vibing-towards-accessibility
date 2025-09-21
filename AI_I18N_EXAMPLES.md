# AI-Powered i18n Example Usage

This document shows examples of how the new AI-powered i18n scripts work with Amazon Bedrock and Claude 4 Sonnet.

## Prerequisites Setup

First, configure your AWS credentials:

```bash
# Option 1: Environment variables
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_REGION=us-east-1

# Option 2: AWS CLI
aws configure
```

Ensure you have access to Claude 4 Sonnet in AWS Bedrock console and the required IAM permissions.

## Example 1: AI-Powered Language Creation

Create a complete Spanish translation automatically:

```bash
npm run i18n:ai-onboard es
```

**Output:**
```
🤖 Creating language "es" with AI-powered translations...
🔧 Initializing AWS Bedrock with Claude 4 Sonnet...
🔍 Checking AWS credentials...
✅ AWS credentials verified
🚀 Starting AI translation process...

  🔄 Translating: homepage.title
  🔄 Translating: homepage.subtitle
  🔄 Translating: homepage.apps.documentation.title
  🔄 Translating: homepage.apps.documentation.description
  ... (continues for all 134 keys)

🎉 AI translation completed!
✅ Successfully created language "es"
📁 Created: /home/runner/work/vibing-towards-accessibility/vibing-towards-accessibility/src/locales/es.json
```

The resulting file contains proper Spanish translations:

```json
{
  "homepage": {
    "title": "Suite de Aplicaciones Accesibles",
    "subtitle": "Una colección de aplicaciones accesibles y divertidas",
    "apps": {
      "documentation": {
        "title": "Documentación",
        "description": "Guía completa sobre características de accesibilidad y uso"
      }
    }
  }
}
```

## Example 2: Translation Validation

Validate the quality of AI translations:

```bash
npm run i18n:ai-validate es
```

**Output:**
```
🤖 Starting AI-powered translation validation...
🔧 Initializing AWS Bedrock with Claude 4 Sonnet...
✅ AWS credentials verified
🚀 Starting validation process...

📝 Validating es...
  🔍 Validating: homepage.title
    ✅ Score: 95/100 - Excellent translation maintaining accessibility focus
  🔍 Validating: homepage.subtitle
    ✅ Score: 92/100 - Good translation with proper tone
  🔍 Validating: calculator.buttons.number
    ❌ Score: 65/100 - Variable interpolation could be clearer

📊 es Validation Summary:
   Total validated: 134
   ✅ Passed: 128
   ❌ Failed: 6
   📈 Success rate: 95.5%

🎉 Validation completed for 1 language(s)!
📄 Detailed report saved to: i18n-validation-report.json
```

## Example 3: Translating Placeholders

If you have existing placeholder content, translate it with AI:

```bash
npm run i18n:ai-translate es
```

**Before (placeholders):**
```json
{
  "newFeature": {
    "title": "[newFeature.title] - TRANSLATE: New Accessibility Feature",
    "description": "[newFeature.description] - TRANSLATE: Enhanced screen reader support"
  }
}
```

**After AI translation:**
```json
{
  "newFeature": {
    "title": "Nueva Función de Accesibilidad",
    "description": "Soporte mejorado para lectores de pantalla"
  }
}
```

## Example 4: Validation Report Analysis

The validation report provides detailed feedback:

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "totalLanguages": 1,
  "languages": {
    "es": {
      "totalValidated": 134,
      "passedValidation": 128,
      "failedValidation": 6,
      "issues": [
        {
          "key": "calculator.buttons.number",
          "score": 65,
          "issues": ["Variable interpolation could be clearer"],
          "suggestions": ["Consider: 'Número {{number}}' instead of current translation"],
          "original": "Number {{number}}",
          "translation": "{{number}} Número"
        }
      ]
    }
  }
}
```

## Example 5: Fallback Mode

Create placeholders when AI is not available:

```bash
# This works without AWS credentials
npm run i18n:ai-onboard fr --skip-ai
```

**Output:**
```
📝 Creating language "fr" with placeholders (AI translation skipped)...
✅ Successfully created language "fr"
📝 Next steps:
   1. Translate the placeholder values in fr.json
   2. Or use: npm run i18n:ai-translate fr
```

## Example 6: Complete Workflow

Full workflow from creation to validation:

```bash
# 1. Create with AI
npm run i18n:ai-onboard de

# 2. Check status
npm run i18n:list

# 3. Validate quality
npm run i18n:ai-validate de

# 4. Review and manually adjust any flagged translations

# 5. Re-validate after manual changes
npm run i18n:ai-validate de

# 6. Add to i18n.ts and test
npm run test:run
npm run build
```

## Key Features Demonstrated

1. **Context-Aware Translation**: AI considers the key path (e.g., "homepage.title") for context
2. **Variable Preservation**: Maintains `{{variable}}` interpolations exactly
3. **Quality Scoring**: Provides 0-100 scores with specific feedback
4. **Accessibility Focus**: Optimized for web UI and accessibility terminology
5. **Batch Processing**: Can handle multiple languages simultaneously
6. **Comprehensive Reporting**: Detailed JSON reports for tracking quality
7. **Fallback Options**: Works with or without AI capabilities

## Performance Notes

- **Translation Speed**: ~0.5-1 second per key (with rate limiting)
- **Cost Optimization**: Uses efficient prompting to minimize token usage
- **Quality Consistency**: Low temperature settings ensure consistent results
- **Error Recovery**: Continues processing even if individual translations fail

This AI integration transforms i18n from a manual, time-intensive process into an automated, high-quality workflow that maintains the human oversight necessary for cultural and contextual accuracy.