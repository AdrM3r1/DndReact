import { test, expect } from '@playwright/test'

test('homepage loads with title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Iris|DnD|DndReact/i)
})

test('navigation links are visible', async ({ page }) => {
  await page.goto('/principal')
  await expect(page.locator('text=Home')).toBeVisible()
  await expect(page.locator('text=Informacion')).toBeVisible()
})

test('404 page shows for unknown routes', async ({ page }) => {
  await page.goto('/nonexistent-route-12345')
  await expect(page.locator('text=404')).toBeVisible()
})
