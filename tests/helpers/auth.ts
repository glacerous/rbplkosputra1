import { Page } from '@playwright/test';

export const CREDENTIALS = {
  admin: { email: 'admin@example.com', password: 'Admin123!' },
  customer: { email: 'customer@example.com', password: 'Customer123!' },
  cleaner: { email: 'cleaner@example.com', password: 'Cleaner123!' },
};

export async function loginAs(page: Page, role: keyof typeof CREDENTIALS) {
  const { email, password } = CREDENTIALS[role];
  await page.goto('/login');
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password|kata sandi/i).fill(password);
  await page.getByRole('button', { name: /masuk|login|sign in/i }).click();
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });
}
