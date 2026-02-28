import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should register a new user and login', async ({ page }) => {
    const timestamp = Date.now()
    const email = `test_${timestamp}@example.com`
    const password = 'testpassword123'

    // Register
    await page.goto('/register')
    await page.fill('input[placeholder="your@email.com"]', email)
    await page.fill('input[placeholder="至少 6 个字符"]', password)
    await page.fill('input[placeholder="您的用户名"]', 'Test User')
    await page.click('button[type="submit"]:has-text("创建账户")')

    // Should redirect to dashboard or login
    await page.waitForURL(/\/dashboard|\/login/, { timeout: 15000 })

    // Login with the newly created account
    await page.goto('/login')
    await page.fill('input[placeholder="your@email.com"]', email)
    await page.fill('input[placeholder="••••••••"]', password)
    await page.click('button[type="submit"]:has-text("登录")')

    // Should redirect to dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 15000 })
    await expect(page.locator('body')).toContainText('Dashboard', { timeout: 10000 })
  })

  test('should login with admin account', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[placeholder="your@email.com"]', 'admin@example.com')
    await page.fill('input[placeholder="••••••••"]', 'admin123')
    await page.click('button[type="submit"]:has-text("登录")')

    // Should redirect to admin dashboard
    await page.waitForURL(/\/dashboard\/admin/, { timeout: 15000 })
    await expect(page.locator('body')).toContainText('Admin', { timeout: 10000 })
  })

  test('should login with user account', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[placeholder="your@email.com"]', 'user@example.com')
    await page.fill('input[placeholder="••••••••"]', 'user123')
    await page.click('button[type="submit"]:has-text("登录")')

    // Should redirect to user dashboard
    await page.waitForURL(/\/dashboard\/user/, { timeout: 15000 })
    await expect(page.locator('body')).toContainText('Dashboard', { timeout: 10000 })
  })
})
