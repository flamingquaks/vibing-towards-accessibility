import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between pages correctly', async ({ page }) => {
    // Start on home page
    await page.goto('/');

    await expect(page.getByText('Accessible App Suite')).toBeVisible();

    // Test basic navigation: go to calculator and back
    await page.getByRole('link', { name: /Open Calculator: A calculator/ }).click();
    await expect(page.getByRole('heading', { name: 'Calculator' })).toBeVisible();

    // Navigate back to home
    await page.getByRole('link', { name: /Return to home page/ }).click();
    // Wait for home page to load
    await expect(page.getByRole('link', { name: /Open Calculator: A calculator/ })).toBeVisible();

    // Test another navigation to ensure router works correctly
    await page.getByRole('link', { name: /Open Rainbow Generator: Create bouncing/ }).click();
    await expect(page.getByRole('heading', { name: 'Rainbow Generator' })).toBeVisible();
  });

  test('should have proper page titles', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Vibing Towards Accessibility/);

    await page.getByRole('link', { name: /Open Calculator: A calculator/ }).click();
    await expect(page).toHaveTitle(/Vibing Towards Accessibility/);
  });
});