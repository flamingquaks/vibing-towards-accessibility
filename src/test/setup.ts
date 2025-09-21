import '@testing-library/jest-dom';
import { afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Mock localStorage for tests
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(() => 'en'),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
  writable: true,
});

// Initialize i18n for tests
beforeAll(async () => {
  await i18n
    .use(initReactI18next)
    .init({
      lng: 'en',
      fallbackLng: 'en',
      debug: false,
      interpolation: {
        escapeValue: false,
      },
      resources: {
        en: {
          translation: {
            'calculator.title': 'Calculator',
            'calculator.display': 'Display',
            'calculator.calculationTape': 'Calculation Tape',
            'calculator.noHistory': 'No calculations yet',
            'calculator.buttons.clear': 'Clear all',
            'calculator.buttons.clearEntry': 'Clear entry',
            'calculator.buttons.clearText': 'AC',
            'calculator.buttons.clearEntryText': 'CE',
            'calculator.buttons.divide': 'Divide',
            'calculator.buttons.multiply': 'Multiply',
            'calculator.buttons.subtract': 'Subtract',
            'calculator.buttons.add': 'Add',
            'calculator.buttons.equals': 'Equals',
            'calculator.buttons.decimal': 'Decimal point',
            'calculator.buttons.number': 'Number {{number}}',
            'rainbowGenerator.title': 'Rainbow Generator',
            'rainbowGenerator.addButton': 'Add a single rainbow',
            'rainbowGenerator.autoButton': 'Start generating rainbows automatically',
            'rainbowGenerator.clearButton': 'Clear all rainbows',
            'rainbowGenerator.playground': 'Playground for creating rainbows',
            'rainbowGenerator.instructions': 'Click anywhere in the area below to create a rainbow, or use the buttons above!',
            'rainbowGenerator.count': 'Rainbows active: {{count}}',
            'rainbowGenerator.status': 'Status: {{status}}',
            'arcadeGame.title': 'Arcade Game',
            'arcadeGame.score': 'Score:',
            'arcadeGame.highScore': 'High Score:',
            'arcadeGame.length': 'Length:',
            'arcadeGame.gameBoard': 'Game board',
            'arcadeGame.moveUp': 'Move up',
            'arcadeGame.moveDown': 'Move down',
            'arcadeGame.moveLeft': 'Move left',
            'arcadeGame.moveRight': 'Move right',
            'solitaire.title': 'Solitaire',
            'homepage.title': 'Accessible App Suite',
            'homepage.subtitle': 'A collection of accessible and fun applications',
            'homepage.apps.documentation.title': 'Documentation',
            'homepage.apps.documentation.description': 'Complete guide to accessibility features and usage',
            'homepage.apps.calculator.title': 'Calculator',
            'homepage.apps.calculator.description': 'A calculator with ticker tape style display',
            'homepage.apps.rainbows.title': 'Rainbow Generator',
            'homepage.apps.rainbows.description': 'Create bouncing rainbows across the page',
            'homepage.apps.solitaire.title': 'Solitaire',
            'homepage.apps.solitaire.description': 'Classic card game of Solitaire',
            'homepage.apps.arcade.title': 'Arcade Game',
            'homepage.apps.arcade.description': 'Simple arcade-style game',
            'homepage.openApp': 'Open {{title}}: {{description}}',
            'nav.home': 'Home',
            'nav.documentation': 'Documentation',
            'nav.calculator': 'Calculator',
            'nav.rainbows': 'Rainbow Generator',
            'nav.solitaire': 'Solitaire',
            'nav.arcade': 'Arcade Game',
          },
        },
      },
    });
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});