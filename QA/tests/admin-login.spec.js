import { test, expect } from '@playwright/test';

test('Admin login', async ({ page }) => {
  await page.goto('/admin-login');

  await page.locator('input[type="text"]').first().fill('admin');
  await page.locator('input[type="password"]').first().fill('admin123');

  await page.getByRole('button', { name: /sign in|verify identity/i }).first().click();

  await expect(page).toHaveURL(/admin\/dashboard|admin-login/);
});