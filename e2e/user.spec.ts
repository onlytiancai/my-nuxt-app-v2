import { test, expect } from '@playwright/test'

test.describe('User Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Login as regular user
    await page.goto('/login')
    await page.fill('input[type="email"]', 'user@example.com')
    await page.fill('input[type="password"]', 'user123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard\/user/)
  })

  test('should access user dashboard', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('欢迎')
  })

  test('should access todos page', async ({ page }) => {
    await page.goto('/dashboard/user/todos')
    await expect(page.locator('h1')).toContainText('待办事项')
  })

  test('should create a new todo', async ({ page }) => {
    await page.goto('/dashboard/user/todos')
    const todoTitle = `Test Todo ${Date.now()}`
    await page.fill('input[placeholder*="添加"]', todoTitle)
    await page.press('input[placeholder*="添加"]', 'Enter')
    await expect(page.locator('body')).toContainText(todoTitle)
  })

  test('should toggle todo completion', async ({ page }) => {
    await page.goto('/dashboard/user/todos')
    // Find and click a checkbox
    const checkbox = page.locator('input[type="checkbox"]').first()
    await checkbox.check()
    // Should mark as completed
  })

  test('should delete a todo', async ({ page }) => {
    await page.goto('/dashboard/user/todos')
    const deleteButton = page.locator('button:has-text("删除")').first()
    if (await deleteButton.isVisible()) {
      await deleteButton.click()
    }
  })

  test('should access posts page', async ({ page }) => {
    await page.goto('/dashboard/user/posts')
    await expect(page.locator('h1')).toContainText('我的帖子')
  })

  test('should create a new post', async ({ page }) => {
    await page.goto('/dashboard/user/posts')
    const postTitle = `Test Post ${Date.now()}`
    await page.fill('input[placeholder*="标题"]', postTitle)
    await page.fill('textarea[placeholder*="内容"]', 'Test content')
    await page.click('button:has-text("创建帖子")')
    await expect(page.locator('body')).toContainText(postTitle)
  })

  test('should access profile page', async ({ page }) => {
    await page.goto('/dashboard/user/profile')
    await expect(page.locator('h1')).toContainText('已连接的登录方式')
  })
})
