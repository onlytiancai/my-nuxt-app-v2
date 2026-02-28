import { test, expect } from '@playwright/test'

test.describe('App Basics', () => {
  test('should render the home page', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('欢迎来到我的应用')
  })
})
