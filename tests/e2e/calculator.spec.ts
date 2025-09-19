import { test, expect } from '@playwright/test';

test.describe('Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculator');
  });

  test('should perform basic calculations', async ({ page }) => {
    // Check initial state
    await expect(page.getByText('Moves: 0')).toBeVisible();
    await expect(page.getByText('No calculations yet')).toBeVisible();
    
    // Perform 5 + 3 = 8
    await page.getByRole('button', { name: '5 button' }).click();
    await page.getByRole('button', { name: '+ button' }).click();
    await page.getByRole('button', { name: '3 button' }).click();
    await page.getByRole('button', { name: '= button' }).click();
    
    // Check result
    await expect(page.locator('[aria-label*="Current value"]')).toContainText('8');
    
    // Check history
    await expect(page.getByText('5 + 3')).toBeVisible();
  });

  test('should clear display with AC button', async ({ page }) => {
    // Enter some numbers
    await page.getByRole('button', { name: '1 button' }).click();
    await page.getByRole('button', { name: '2 button' }).click();
    await page.getByRole('button', { name: '3 button' }).click();
    
    // Clear
    await page.getByRole('button', { name: 'AC button' }).click();
    
    // Check display is cleared
    await expect(page.locator('[aria-label*="Current value"]')).toContainText('0');
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Test that buttons are focusable
    await page.getByRole('button', { name: '5 button' }).focus();
    await expect(page.getByRole('button', { name: '5 button' })).toBeFocused();
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter'); // Should click the focused button
  });
});