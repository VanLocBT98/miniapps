import { expect, test } from '@playwright/test'

test('landing page renders SSR shell', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByRole('heading', { name: /Portal for independent SSR projects/i }),
  ).toBeVisible()
  await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible()
})

test('login and open dashboard', async ({ page }) => {
  await page.goto('/login')
  // Wait until client handlers are attached (avoids native form GET before hydrate).
  await expect(page.locator('form[data-hydrated="true"]')).toBeVisible({
    timeout: 30_000,
  })
  await page.getByLabel('Email').fill('admin@example.com')
  await page.getByLabel('Password').fill('admin')
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page).toHaveURL(/\/dashboard(?:\/|$)/, { timeout: 30_000 })
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({
    timeout: 30_000,
  })
})
