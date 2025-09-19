import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between pages correctly', async ({ page }) => {
    // Start on home page
    await page.goto('/');
    
    await expect(page.getByRole('heading', { name: 'Accessible App Suite' })).toBeVisible();
    
    // Navigate to Calculator
    await page.getByRole('link', { name: /Open Calculator/ }).click();
    await expect(page.getByRole('heading', { name: 'Calculator' })).toBeVisible();
    
    // Navigate back to home
    await page.getByRole('link', { name: /Return to home page/ }).click();
    await expect(page.getByRole('heading', { name: 'Accessible App Suite' })).toBeVisible();
    
    // Navigate to Rainbow Generator
    await page.getByRole('link', { name: /Open Rainbow Generator/ }).click();
    await expect(page.getByRole('heading', { name: 'Rainbow Generator' })).toBeVisible();
    
    // Navigate back to home
    await page.getByRole('link', { name: /Return to home page/ }).click();
    await expect(page.getByRole('heading', { name: 'Accessible App Suite' })).toBeVisible();
    
    // Navigate to Solitaire
    await page.getByRole('link', { name: /Open Solitaire/ }).click();
    await expect(page.getByRole('heading', { name: 'Solitaire' })).toBeVisible();
    
    // Navigate back to home
    await page.getByRole('link', { name: /Return to home page/ }).click();
    await expect(page.getByRole('heading', { name: 'Accessible App Suite' })).toBeVisible();
    
    // Navigate to Arcade Game
    await page.getByRole('link', { name: /Open Arcade Game/ }).click();
    await expect(page.getByRole('heading', { name: '🐍 Snake Game' })).toBeVisible();
  });

  test('should have proper page titles', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Vite \+ React \+ TS/);
    
    await page.getByRole('link', { name: /Open Calculator/ }).click();
    await expect(page).toHaveTitle(/Vite \+ React \+ TS/);
  });
});