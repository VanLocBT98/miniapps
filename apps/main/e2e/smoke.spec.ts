import { expect, test } from '@playwright/test'

test('landing page renders SSR shell', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /SSR Micro Frontend host/i })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible()
})

test('login and open dashboard', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill('admin@example.com')
  await page.getByLabel('Password').fill('admin')
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({
    timeout: 15_000,
  })
})
