import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('homepage should be accessible', async ({ page }) => {
    await page.goto('/');
    
    // Check semantic structure
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();
    
    // Check all app links have proper aria-labels
    const links = page.getByRole('link');
    const linkCount = await links.count();
    
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const ariaLabel = await link.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    }
    
    // Check icons are hidden from screen readers
    const icons = page.locator('.app-icon');
    const iconCount = await icons.count();
    
    for (let i = 0; i < iconCount; i++) {
      const icon = icons.nth(i);
      const ariaHidden = await icon.getAttribute('aria-hidden');
      expect(ariaHidden).toBe('true');
    }
  });

  test('calculator should be accessible', async ({ page }) => {
    await page.goto('/calculator');
    
    // Check display has proper labeling
    await expect(page.locator('[aria-label*="Current value"]')).toBeVisible();
    
    // Check history section has proper labeling
    await expect(page.locator('[aria-label="Calculation history"]')).toBeVisible();
    
    // Check all buttons have accessible names
    const buttons = page.getByRole('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const accessibleName = await button.getAttribute('aria-label') || await button.textContent();
      expect(accessibleName).toBeTruthy();
    }
  });

  test('rainbow generator should be accessible', async ({ page }) => {
    await page.goto('/rainbows');
    
    // Check playground has proper role and labeling
    const playground = page.getByRole('application', { name: 'Rainbow playground - click to add rainbows' });
    await expect(playground).toBeVisible();
    
    // Check playground is focusable
    const tabIndex = await playground.getAttribute('tabindex');
    expect(tabIndex).toBe('0');
    
    // Check buttons have proper labeling
    await expect(page.getByRole('button', { name: 'Add a single rainbow' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start generating rainbows automatically' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Clear all rainbows' })).toBeVisible();
  });

  test('arcade game should be accessible', async ({ page }) => {
    await page.goto('/arcade');
    
    // Check game board has proper role
    await expect(page.getByRole('application', { name: 'Snake game board' })).toBeVisible();
    
    // Check all control buttons have proper labels
    await expect(page.getByRole('button', { name: 'Move up' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Move down' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Move left' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Move right' })).toBeVisible();
    
    // Check instructions are in a list structure
    await expect(page.getByRole('list')).toBeVisible();
    const listItems = page.getByRole('listitem');
    expect(await listItems.count()).toBe(5);
  });

  test('navigation should be keyboard accessible', async ({ page }) => {
    await page.goto('/');
    
    // Test keyboard navigation to apps
    await page.keyboard.press('Tab'); // Should focus first app link
    await page.keyboard.press('Enter'); // Should navigate to app
    
    // Should have navigated to an app page
    await expect(page.getByRole('navigation')).toBeVisible();
    
    // Test navigation back to home
    await page.getByRole('link', { name: /Return to home page/ }).focus();
    await page.keyboard.press('Enter');
    
    // Should be back on home page
    await expect(page.getByRole('heading', { name: 'Accessible App Suite' })).toBeVisible();
  });

  test('should support screen reader navigation patterns', async ({ page }) => {
    await page.goto('/');
    
    // Check heading hierarchy
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();
    
    const h2s = page.getByRole('heading', { level: 2 });
    expect(await h2s.count()).toBe(4); // One for each app
    
    // Check landmark structure
    await expect(page.getByRole('main')).toBeVisible();
    
    // Navigate to a sub-page and check structure
    await page.getByRole('link', { name: /Open Calculator/ }).click();
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();
  });
});