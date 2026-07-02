import { test, expect } from '@playwright/test';

test('User login works', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: /log in|sign up/i }).first().click();
  await expect(page).toHaveURL(/user-login/);

  await page.locator('input[type="text"]').first().fill('user');
  await page.locator('input[type="password"]').first().fill('user123');

  await page.getByRole('button', { name: /sign in|create account|reset password|verify identity/i }).first().click();
  await expect(page).toHaveURL(/user-login|\/$/);
});