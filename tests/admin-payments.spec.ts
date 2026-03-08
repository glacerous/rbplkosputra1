import { test, expect } from '@playwright/test';
import { loginAs } from './helpers/auth';

test.describe('Admin payments page', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin');
  });

  test('admin can navigate to /admin/payments and see heading', async ({ page }) => {
    await page.goto('/admin/payments');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: /pembayaran/i })).toBeVisible({ timeout: 10000 });
  });
});
