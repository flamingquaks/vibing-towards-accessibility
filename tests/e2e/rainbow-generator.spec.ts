import { test, expect } from '@playwright/test';

test.describe('Rainbow Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/rainbows');
  });

  test('should create and clear rainbows', async ({ page }) => {
    // Check initial state
    await expect(page.getByText('Rainbows active: 0')).toBeVisible();
    await expect(page.getByText('Status: Manual mode')).toBeVisible();
    
    // Add a rainbow
    await page.getByRole('button', { name: 'Add Rainbow' }).click();
    await expect(page.getByText('Rainbows active: 1')).toBeVisible();
    
    // Add another rainbow
    await page.getByRole('button', { name: 'Add Rainbow' }).click();
    await expect(page.getByText('Rainbows active: 2')).toBeVisible();
    
    // Clear all rainbows
    await page.getByRole('button', { name: 'Clear All' }).click();
    await expect(page.getByText('Rainbows active: 0')).toBeVisible();
    await expect(page.getByText('Click here or use the buttons above to create bouncing rainbows!')).toBeVisible();
  });

  test('should add rainbow by clicking playground', async ({ page }) => {
    const playground = page.getByRole('application', { name: 'Rainbow playground - click to add rainbows' });
    
    // Click on the playground
    await playground.click();
    await expect(page.getByText('Rainbows active: 1')).toBeVisible();
  });

  test('should support keyboard interaction', async ({ page }) => {
    const playground = page.getByRole('application', { name: 'Rainbow playground - click to add rainbows' });
    
    // Focus and press Enter
    await playground.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByText('Rainbows active: 1')).toBeVisible();
    
    // Press Space
    await page.keyboard.press('Space');
    await expect(page.getByText('Rainbows active: 2')).toBeVisible();
  });

  test('should toggle auto-generation mode', async ({ page }) => {
    // Start auto-generation
    await page.getByRole('button', { name: 'Start Auto' }).click();
    await expect(page.getByText('Status: Auto-generating')).toBeVisible();
    
    // Stop auto-generation
    await page.getByRole('button', { name: 'Stop Auto' }).click();
    await expect(page.getByText('Status: Manual mode')).toBeVisible();
  });
});