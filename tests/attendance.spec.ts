import { test, expect } from '@playwright/test';
import { loginAs } from './helpers/auth';

test.describe('Attendance (cleaner)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'cleaner');
  });

  test('cleaner sees CleanerDashboardView on home page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // CleanerDashboardView shows attendance link
    await expect(page.getByRole('link', { name: /absen/i })).toBeVisible({ timeout: 10000 });
  });

  test('cleaner can navigate to /attendance and see the form', async ({ page }) => {
    await page.goto('/attendance');
    await expect(page.getByRole('heading', { name: /absensi/i })).toBeVisible();
  });

  test('cleaner can submit PRESENT attendance and see success message', async ({ page }) => {
    await page.goto('/attendance');
    // PRESENT is selected by default
    await page.getByRole('button', { name: /simpan absensi/i }).click();
    await expect(page.getByText(/berhasil/i)).toBeVisible({ timeout: 10000 });
  });
});
