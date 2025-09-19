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

### E2E Tests
```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
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

## Test Results

Current test status:
- ✅ **54 Unit Tests Passing** 
- ✅ **Build Validation Passing**
- 📋 **E2E Tests Ready** (requires Playwright browser installation)

## Continuous Integration

The test suite is designed to run in CI environments:
- Unit tests run on every commit
- E2E tests can be configured for deployment validation
- Build verification ensures production readiness

## Development Workflow

1. **Before making changes**: Run `npm run test:run` to ensure baseline
2. **During development**: Use `npm run test` for watch mode
3. **Before committing**: Run full test suite including build verification
4. **For UI changes**: Run relevant E2E tests to validate user flows

This comprehensive test suite ensures the accessibility app suite maintains high quality and accessibility standards.