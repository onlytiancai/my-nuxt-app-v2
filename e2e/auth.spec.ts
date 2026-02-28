import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should register a new user and login', async ({ page }) => {
    const timestamp = Date.now()
    const email = `test_${timestamp}@example.com`
    const password = 'testpassword123'

    // Register
    await page.goto('/register')
    await page.fill('input[type="email"]', email)
    await page.fill('input[type="password"]', password)
    await page.fill('input[name="name"]', 'Test User')
    await page.click('button[type="submit"]')

    // Should redirect to dashboard or login
    await page.waitForURL(/\/dashboard|\/login/)

    // Login with the newly created account
    await page.goto('/login')
    await page.fill('input[type="email"]', email)
    await page.fill('input[type="password"]', password)
    await page.click('button[type="submit"]')

    // Should redirect to dashboard
    await page.waitForURL(/\/dashboard/)
    await expect(page.locator('body')).toContainText('Dashboard')
  })

  test('should login with admin account', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'admin@example.com')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')

    // Should redirect to admin dashboard
    await page.waitForURL(/\/dashboard\/admin/)
  })

  test('should login with user account', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'user@example.com')
    await page.fill('input[type="password"]', 'user123')
    await page.click('button[type="submit"]')

    // Should redirect to user dashboard
    await page.waitForURL(/\/dashboard\/user/)
  })
})
