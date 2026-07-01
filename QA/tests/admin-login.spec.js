import { test, expect } from '@playwright/test';

test('Admin login', async ({ page }) => {
  await page.goto('/admin-login');

  await page.locator('input[type="text"]').fill('admin');
  await page.locator('input[type="password"]').fill('admin123');

  await page.getByRole('button', { name: /sign in/i }).click();

  await expect(page).toHaveURL(/admin\/dashboard/);
});