# AI-Powered i18n Example Usage

This document shows examples of how the new AI-powered i18n scripts work with Ollama and local language models.

## Prerequisites Setup

First, install and configure Ollama:

```bash
# Install Ollama (choose your platform)
# macOS: brew install ollama
# Linux: curl -fsSL https://ollama.ai/install.sh | sh
# Windows: Download from https://ollama.ai/download

# Start Ollama server
ollama serve

# Pull required models
ollama pull gpt-oss:20b    # Translation model (~12GB)
ollama pull gemma3:4b      # Validation model (~2.5GB)
```

Verify setup:
```bash
ollama list  # Should show both models
```

## Example 1: AI-Powered Language Creation

Create a complete Spanish translation automatically:

```bash
npm run i18n:ai-onboard es
```

**Output:**
```
🤖 Creating language "es" with AI-powered translations...
🔧 Initializing Ollama with gpt-oss:20b...
🔍 Checking Ollama connection and models...
✅ Ollama connection verified
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

Validate the quality of AI translations using gemma3:4b:

```bash
npm run i18n:ai-validate es
```

**Output:**
```
🤖 Starting AI-powered translation validation...
🔧 Initializing Ollama with gemma3:4b...
🔍 Checking Ollama connection and models...
✅ Ollama connection verified
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
# This works without Ollama running
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
# 1. Ensure Ollama is running and models are available
ollama serve &
ollama list

# 2. Create with AI
npm run i18n:ai-onboard de

# 3. Check status
npm run i18n:list

# 4. Validate quality
npm run i18n:ai-validate de

# 5. Review and manually adjust any flagged translations

# 6. Re-validate after manual changes
npm run i18n:ai-validate de

# 7. Add to i18n.ts and test
npm run test:run
npm run build
```

## Example 7: Model Management

```bash
# List available models
ollama list

# Pull specific model versions
ollama pull gpt-oss:20b
ollama pull gemma3:4b

# Remove models to free space
ollama rm old-model:tag

# Check model information
ollama show gpt-oss:20b
```

## Example 8: Performance Optimization

### Hardware Requirements
- **Minimum**: 8GB RAM, 20GB free disk space
- **Recommended**: 16GB+ RAM, 50GB+ free disk space
- **Optimal**: 32GB+ RAM, NVMe SSD

### Model Performance
```bash
# Time a translation request
time ollama generate -m gpt-oss:20b "Translate to Spanish: Hello World"

# Monitor resource usage
htop  # or Activity Monitor on macOS
```

### Custom Ollama Configuration
```bash
# Set custom host
export OLLAMA_HOST=http://gpu-server:11434

# Use GPU acceleration (if available)
export OLLAMA_GPU=1
```

## Example 9: Troubleshooting

### Common Issues and Solutions

#### Ollama Not Running
```bash
# Check if Ollama is running
curl http://localhost:11434/api/version

# Start Ollama if needed
ollama serve
```

#### Missing Models
```bash
# Error: model not found
npm run i18n:ai-onboard es
# Solution: Pull the model
ollama pull gpt-oss:20b
```

#### Disk Space Issues
```bash
# Check disk usage
df -h

# Clean up old models
ollama list
ollama rm unused-model:tag
```

#### Memory Issues
```bash
# Monitor memory usage
free -h  # Linux
vm_stat  # macOS

# Reduce concurrent operations if needed
# Use smaller batch sizes in scripts
```

## Key Features Demonstrated

1. **Local Processing**: All AI operations happen on your machine
2. **Context-Aware Translation**: AI considers the key path (e.g., "homepage.title") for context
3. **Variable Preservation**: Maintains `{{variable}}` interpolations exactly
4. **Quality Scoring**: Provides 0-100 scores with specific feedback using gemma3:4b
5. **Accessibility Focus**: Optimized for web UI and accessibility terminology
6. **Batch Processing**: Can handle multiple languages simultaneously
7. **Comprehensive Reporting**: Detailed JSON reports for tracking quality
8. **Fallback Options**: Works with or without AI capabilities
9. **Privacy**: All data stays local, no cloud dependencies

## Performance Notes

- **Translation Speed**: ~2-5 seconds per key (depends on hardware)
- **Cost**: No API costs, only local compute resources
- **Privacy**: All translation data stays on your machine
- **Scalability**: Limited by local hardware capabilities
- **Offline**: Works completely offline once models are downloaded

## Model Information

### gpt-oss:20b (Translation Model)
- **Purpose**: High-quality multilingual translations
- **Size**: ~20 billion parameters (~12GB disk space)
- **Strengths**: Excellent context understanding, maintains nuance
- **Use Case**: Primary translation tasks

### gemma3:4b (Validation Model)
- **Purpose**: Translation quality assessment and validation
- **Size**: ~4 billion parameters (~2.5GB disk space)  
- **Strengths**: Fast inference, good analytical capabilities
- **Use Case**: Quality scoring and feedback generation

This local AI integration provides enterprise-grade translation capabilities while maintaining complete data privacy and eliminating ongoing API costs.