import { test, expect } from '@playwright/test';

test.describe('Solitaire', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/solitaire');
  });

  test('should display game interface correctly', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Solitaire' })).toBeVisible();
    await expect(page.getByText('Moves: 0')).toBeVisible();
    await expect(page.getByRole('button', { name: 'New Game' })).toBeVisible();
  });

  test('should reset game with New Game button', async ({ page }) => {
    await page.getByRole('button', { name: 'New Game' }).click();
    await expect(page.getByText('Moves: 0')).toBeVisible();
  });

  test('should have game board structure', async ({ page }) => {
    // Check that main game areas are present
    await expect(page.locator('.solitaire-board')).toBeVisible();
    await expect(page.locator('.top-area')).toBeVisible();
    await expect(page.locator('.tableau')).toBeVisible();
  });

  test('should not show win message initially', async ({ page }) => {
    await expect(page.getByText(/🎉.*Congratulations.*🎉/)).not.toBeVisible();
  });

  test('should have proper heading structure', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('button', { name: 'New Game' })).toBeVisible();
  });
});