import { test, expect } from '@playwright/test';

test.describe('Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculator');
  });

  test('should perform basic calculations', async ({ page }) => {
    // Check initial state
    await expect(page.getByText('No calculations yet')).toBeVisible();
    
    // Perform 5 + 3 = 8
    await page.getByRole('button', { name: 'Number 5' }).click();
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByRole('button', { name: 'Number 3' }).click();
    await page.getByRole('button', { name: 'Equals' }).click();
    
    // Check result
    await expect(page.locator('[aria-label*="Display:"]')).toContainText('8');
    
    // Check history
    await expect(page.getByText('5 + 3')).toBeVisible();
  });

  test('should clear display with AC button', async ({ page }) => {
    // Enter some numbers
    await page.getByRole('button', { name: 'Number 1' }).click();
    await page.getByRole('button', { name: 'Number 2' }).click();
    await page.getByRole('button', { name: 'Number 3' }).click();
    
    // Clear
    await page.getByRole('button', { name: 'Clear all' }).click();
    
    // Check display is cleared
    await expect(page.locator('[aria-label*="Display:"]')).toContainText('0');
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Test that buttons are focusable
    await page.getByRole('button', { name: 'Number 5' }).focus();
    await expect(page.getByRole('button', { name: 'Number 5' })).toBeFocused();
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter'); // Should click the focused button
  });
});