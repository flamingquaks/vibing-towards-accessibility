# Testing Guide

This project includes a comprehensive test suite with both unit tests and end-to-end (E2E) tests.

## Test Structure

### Unit Tests
- **Framework**: Vitest with React Testing Library
- **Location**: `src/test/`
- **Coverage**: Tests for all major components including HomePage, Layout, Calculator, RainbowGenerator, ArcadeGame, and Solitaire

### E2E Tests  
- **Framework**: Playwright
- **Location**: `tests/e2e/`
- **Coverage**: Navigation flows, user interactions, and accessibility testing

## Running Tests

### Unit Tests
```bash
# Run all unit tests
npm run test:run

# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui
```

### 🧪 Accessibility Testing Commands

```bash
# Run WCAG compliance checks (critical issues only)
npm run wcag

# Run full semgrep accessibility linting  
npm run lint:semgrep

# Run all linting (ESLint + semgrep)
npm run lint:all

# Run E2E accessibility tests
npm run test:e2e
```

## Test Coverage

### HomePage Tests (`src/test/HomePage.test.tsx`)
- Renders main heading and description
- Validates all app tiles with correct links
- Checks accessibility attributes
- Verifies proper heading hierarchy

### Layout Tests (`src/test/Layout.test.tsx`)
- Navigation visibility based on route
- Semantic structure validation
- Accessibility label verification

### Calculator Tests (`src/test/Calculator.test.tsx`)
- Basic arithmetic operations (+, -, ×, ÷)
- Display functionality and number input
- History tracking
- Accessibility features
- Clear operations (AC, CE)
- Decimal number support

### Rainbow Generator Tests (`src/test/RainbowGenerator.test.tsx`)
- Rainbow creation and management
- Auto-generation mode toggle
- Playground interaction (click and keyboard)
- Count tracking
- Accessibility compliance

### Arcade Game Tests (`src/test/ArcadeGame.test.tsx`)
- Game interface rendering
- Control button states
- Game statistics display
- Accessibility attributes
- Instruction display

### Solitaire Tests (`src/test/Solitaire.test.tsx`)
- Game board structure
- New game functionality
- Move counter
- Game area rendering
- Accessibility structure

## E2E Test Coverage

### Navigation (`tests/e2e/navigation.spec.ts`)
- Page-to-page navigation
- Home button functionality
- Route validation

### Calculator E2E (`tests/e2e/calculator.spec.ts`)
- End-to-end calculation workflows
- History functionality
- Keyboard navigation

### Rainbow Generator E2E (`tests/e2e/rainbow-generator.spec.ts`)
- Interactive rainbow creation
- Mode switching
- Playground interactions

### Arcade Game E2E (`tests/e2e/arcade-game.spec.ts`)
- Game start/stop/reset flows
- Control interactions
- Keyboard support

### Solitaire E2E (`tests/e2e/solitaire.spec.ts`)
- Game interface validation
- New game functionality

### Accessibility E2E (`tests/e2e/accessibility.spec.ts`)
- ARIA compliance
- Keyboard navigation
- Screen reader support
- Semantic structure validation

## Test Configuration

### Vitest Configuration (`vite.config.ts`)
- Jest DOM matchers enabled
- JSDOM environment for React components
- Test setup file for global configurations
- E2E test exclusion

### Playwright Configuration (`playwright.config.ts`)
- Chromium browser testing
- Local development server integration
- Test retry and timeout settings
- HTML reporting

## Accessibility Testing

The test suite includes comprehensive accessibility validation:

- **ARIA Labels**: Ensures all interactive elements have proper labels
- **Keyboard Navigation**: Validates tab order and keyboard interactions
- **Semantic Structure**: Checks heading hierarchy and landmark usage
- **Screen Reader Support**: Verifies content is accessible to assistive technologies
- **WCAG 2.1 AA Compliance**: Automated static analysis with semgrep rules
- **Real-time Validation**: Continuous accessibility testing in CI/CD pipeline

## Test Results

Current test status:
- ✅ **54 Unit Tests Passing** 
- ✅ **Build Validation Passing**
- ✅ **E2E Tests Ready** 
- ✅ **CI/CD Pipeline Active**

## Continuous Integration & Deployment

### 🤖 Automated GitHub Actions

The repository includes comprehensive CI/CD workflows:

#### 📋 Available Workflows
1. **CI - Unit Tests** (`.github/workflows/unit-tests.yml`)
   - Runs on every push and PR
   - Tests Node.js 18.x and 20.x
   - Validates linting, unit tests, and build

2. **CI - E2E Tests** (`.github/workflows/e2e-tests.yml`)
   - Runs Playwright tests for user workflows
   - Validates accessibility compliance
   - Generates comprehensive reports

3. **PR Quality Check** (`.github/workflows/pr-quality-check.yml`)
   - Runs on pull requests
   - Provides automated feedback
   - Includes coverage reporting

4. **Full Test Suite** (`.github/workflows/full-test-suite.yml`)
   - Daily scheduled runs
   - Cross-platform matrix testing (Ubuntu, Windows, macOS)
   - Comprehensive accessibility audits

### 🎯 Quality Gates

All pull requests must pass:
- ✅ ESLint validation (0 errors)
- ✅ Semgrep WCAG compliance (0 critical issues)
- ✅ Semgrep accessibility linting
- ✅ 54 unit tests passing
- ✅ TypeScript compilation
- ✅ Production build successful
- ✅ E2E accessibility tests
- ✅ Coverage requirements

### 📊 Automated Reporting

- Test coverage reports uploaded as artifacts
- Playwright HTML reports for E2E test results
- Automated PR comments with test summaries
- Cross-platform compatibility validation

## Development Workflow

1. **Before making changes**: Run `npm run test:run` to ensure baseline
2. **During development**: Use `npm run test` for watch mode
3. **Before committing**: GitHub Actions will validate automatically
4. **Pull requests**: Automated quality checks provide instant feedback
5. **Deployment**: Only successful builds can be merged

This comprehensive test suite ensures the accessibility app suite maintains high quality and accessibility standards.