import { test, expect } from '@playwright/test';
import { loginAs } from './helpers/auth';

test.describe('Admin attendance page', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin');
  });

  test('admin can navigate to /admin/attendance and see heading', async ({ page }) => {
    await page.goto('/admin/attendance');
    await page.waitForLoadState('networkidle');
    await expect(
      page.getByRole('heading', { name: /kehadiran/i }),
    ).toBeVisible({ timeout: 10000 });
  });
});
