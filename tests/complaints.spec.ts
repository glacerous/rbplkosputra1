import { test, expect } from '@playwright/test';
import { loginAs } from './helpers/auth';

test.describe('Complaints (customer)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'customer');
  });

  test('customer can visit /complaints page', async ({ page }) => {
    await page.goto('/complaints');
    await expect(page.getByRole('heading', { name: /komplain/i })).toBeVisible();
  });

  test('customer can submit a complaint and see success message', async ({ page }) => {
    await page.goto('/complaints');
    await page.getByPlaceholder(/kamar kurang bersih/i).fill('Test Komplain E2E');
    await page.getByPlaceholder(/jelaskan masalah/i).fill('Ini adalah isi komplain untuk test otomatis E2E.');
    await page.getByRole('button', { name: /kirim komplain/i }).click();
    await expect(page.getByText(/berhasil/i)).toBeVisible({ timeout: 10000 });
  });

  test('complaint appears in history list after submission', async ({ page }) => {
    await page.goto('/complaints');
    await expect(page.getByRole('heading', { name: /riwayat/i })).toBeVisible();
  });
});
