import '@testing-library/jest-dom';
import { afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Mock localStorage for tests
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: () => 'en',
    setItem: () => {},
    removeItem: () => {},
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
            'rainbowGenerator.addRainbow': 'Add Rainbow',
            'rainbowGenerator.startAuto': 'Start Auto',
            'rainbowGenerator.stopAuto': 'Stop Auto',
            'rainbowGenerator.clearRainbows': 'Clear All',
            'rainbowGenerator.instructions': 'Click anywhere on the canvas or use the buttons above to create colorful bouncing rainbows!',
            'rainbowGenerator.rainbowPlayground': 'Rainbow playground - click to add rainbows',
            'rainbowGenerator.emptyState': 'Click here or use the buttons above to create bouncing rainbows!',
            'rainbowGenerator.rainbowsActive': 'Rainbows active: {{count}}',
            'rainbowGenerator.status': 'Status: {{status}}',
            'rainbowGenerator.autoGenerating': 'Auto-generating',
            'rainbowGenerator.manualMode': 'Manual mode',
            'arcadeGame.title': '🐍 Snake Game',
            'arcadeGame.score': 'Score:',
            'arcadeGame.highScore': 'High Score:',
            'arcadeGame.length': 'Length:',
            'arcadeGame.gameBoard': 'Snake game board',
            'arcadeGame.startGame': '▶️ Start Game',
            'arcadeGame.playAgain': '🔄 Play Again',
            'arcadeGame.pause': '⏸️ Pause',
            'arcadeGame.reset': '🔄 Reset',
            'arcadeGame.moveUp': 'Move up',
            'arcadeGame.moveDown': 'Move down',
            'arcadeGame.moveLeft': 'Move left',
            'arcadeGame.moveRight': 'Move right',
            'arcadeGame.howToPlay': 'How to Play:',
            'arcadeGame.instructions.movement': 'Use arrow keys or WASD to move',
            'arcadeGame.instructions.eat': 'Eat the red food to grow and score points',
            'arcadeGame.instructions.avoid': "Don't hit the walls or yourself",
            'arcadeGame.instructions.pause': 'Press Space to pause/start',
            'arcadeGame.instructions.speed': 'Game gets faster as you score more!',
            'solitaire.title': 'Solitaire',
            'solitaire.moves': 'Moves: {{count}}',
            'solitaire.newGame': 'New Game',
            'solitaire.winMessage': '🎉 Congratulations! You won in {{moves}} moves! 🎉',
            'solitaire.stockPile': 'Stock pile - click to draw cards',
            'solitaire.wastePile': 'Waste pile',
            'solitaire.foundation': 'Foundation {{suit}}',
            'solitaire.tableau': 'Tableau pile {{index}}',
            'solitaire.cardLabel': '{{rank}} of {{suit}}',
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
            'layout.backToHome': 'Return to home page',
            'layout.home': 'Home',
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