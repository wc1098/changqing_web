import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('can go on homepage', async ({ page }) => {
    await page.goto('http://localhost:3000/zh')

    await expect(page).toHaveTitle(/东方视野影业/)

    const heading = page.locator('h1').first()

    await expect(heading).toContainText('让中国精品短剧')
  })
})
