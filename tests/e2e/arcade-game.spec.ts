import { test, expect } from '@playwright/test';

test.describe('Arcade Game (Snake)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/arcade');
  });

  test('should display game interface correctly', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '🐍 Snake Game' })).toBeVisible();
    await expect(page.getByText('Score:', { exact: true })).toBeVisible();
    await expect(page.getByText('Length:')).toBeVisible();
    await expect(page.getByRole('button', { name: '▶️ Start Game' })).toBeVisible();
    await expect(page.getByRole('button', { name: '🔄 Reset' })).toBeVisible();
  });

  test('should have disabled control buttons initially', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Move up' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Move down' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Move left' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Move right' })).toBeDisabled();
  });

  test('should enable controls when game starts', async ({ page }) => {
    await page.getByRole('button', { name: '▶️ Start Game' }).click();
    
    await expect(page.getByRole('button', { name: 'Move up' })).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Move down' })).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Move left' })).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Move right' })).toBeEnabled();
    
    await expect(page.getByRole('button', { name: '⏸️ Pause' })).toBeVisible();
  });

  test('should reset game state', async ({ page }) => {
    // Start game
    await page.getByRole('button', { name: '▶️ Start Game' }).click();
    await expect(page.getByRole('button', { name: '⏸️ Pause' })).toBeVisible();
    
    // Reset game
    await page.getByRole('button', { name: '🔄 Reset' }).click();
    await expect(page.getByRole('button', { name: '▶️ Start Game' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Move up' })).toBeDisabled();
  });

  test('should display game instructions', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'How to Play:' })).toBeVisible();
    await expect(page.getByText('Use arrow keys or WASD to move')).toBeVisible();
    await expect(page.getByText('Eat the red food to grow and score points')).toBeVisible();
    await expect(page.getByText("Don't hit the walls or yourself")).toBeVisible();
    await expect(page.getByText('Press Space to pause/start')).toBeVisible();
    await expect(page.getByText('Game gets faster as you score more!')).toBeVisible();
  });

  test('should support keyboard controls', async ({ page }) => {
    await page.getByRole('button', { name: '▶️ Start Game' }).click();
    
    // Test keyboard controls (should not throw errors)
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('w');
    await page.keyboard.press('s');
    await page.keyboard.press('a');
    await page.keyboard.press('d');
    
    // Test pause with space
    await page.keyboard.press('Space');
    await expect(page.getByRole('button', { name: '▶️ Start Game' })).toBeVisible();
  });
});