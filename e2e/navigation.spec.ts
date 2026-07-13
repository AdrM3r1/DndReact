import { test, expect } from '@playwright/test'

test('can navigate to How To Play', async ({ page }) => {
  await page.goto('/principal')
  await page.click('text=Como Jugar')
  await expect(page).toHaveURL(/como-jugar/)
})

test('can navigate to Utilities', async ({ page }) => {
  await page.goto('/principal')
  await page.click('text=Herramientas')
  await expect(page).toHaveURL(/utilidades/)
})

test('login button opens modal', async ({ page }) => {
  await page.goto('/principal')
  const loginBtn = page.locator('text=Login')
  if (await loginBtn.isVisible()) {
    await loginBtn.click()
    await expect(page.locator('.modal')).toBeVisible()
  }
})
