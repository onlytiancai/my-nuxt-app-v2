import { test, expect } from '@playwright/test'

test.describe('Admin Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login')
    await page.fill('input[type="email"]', 'admin@example.com')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard\/admin/)
  })

  test('should access admin dashboard', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('管理后台')
  })

  test('should access users management page', async ({ page }) => {
    await page.goto('/dashboard/admin/users')
    await expect(page.locator('h1')).toContainText('用户管理')
    await expect(page.locator('table')).toBeVisible()
  })

  test('should view user list', async ({ page }) => {
    await page.goto('/dashboard/admin/users')
    // Should show at least the admin user
    await expect(page.locator('tbody')).toContainText('admin@example.com')
  })

  test('should search users', async ({ page }) => {
    await page.goto('/dashboard/admin/users')
    await page.fill('input[placeholder*="搜索"]', 'user@example.com')
    await page.press('input[placeholder*="搜索"]', 'Enter')
    // Should filter results
    await expect(page.locator('tbody')).toContainText('user@example.com')
  })

  test('should access posts management page', async ({ page }) => {
    await page.goto('/dashboard/admin/posts')
    await expect(page.locator('h1')).toContainText('帖子管理')
  })
})
