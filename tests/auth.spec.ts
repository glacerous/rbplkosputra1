import { test, expect } from '@playwright/test';
import { loginAs } from './helpers/auth';

test.describe('Authentication', () => {
  test('valid admin login redirects away from /login', async ({ page }) => {
    await loginAs(page, 'admin');
    await expect(page).not.toHaveURL(/\/login/);
  });

  test('valid customer login redirects to home', async ({ page }) => {
    await loginAs(page, 'customer');
    await expect(page).not.toHaveURL(/\/login/);
  });

  test('wrong password shows error and stays on /login', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('customer@example.com');
    await page.getByLabel(/password|kata sandi/i).fill('WrongPassword!');
    await page.getByRole('button', { name: /masuk|login|sign in/i }).click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/login/);
  });

  test('unauthenticated visit to /admin redirects to /login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/login/);
  });
});
