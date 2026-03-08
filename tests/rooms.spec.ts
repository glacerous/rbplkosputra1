import { test, expect } from '@playwright/test';

test.describe('Rooms page', () => {
  test('unauthenticated user can browse /rooms', async ({ page }) => {
    await page.goto('/rooms');
    await expect(page).toHaveURL(/\/rooms/);
  });

  test('room list page loads without error', async ({ page }) => {
    await page.goto('/rooms');
    // Wait for page to settle
    await page.waitForLoadState('networkidle');
    // No 500 error — page body should contain content
    const body = await page.locator('body').textContent();
    expect(body).not.toContain('Internal Server Error');
  });
});
