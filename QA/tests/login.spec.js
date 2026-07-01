import { test, expect } from '@playwright/test';

test('User login works', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: /^log in$/i }).click();
  await expect(page).toHaveURL(/user-login/);

  await page.getByPlaceholder('user or admin').fill('user');
  await page.getByPlaceholder('••••••').fill('user123');

  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page).toHaveURL(/user\/dashboard/);
});