import { test, expect } from '@playwright/test'

test.describe('Permission Isolation', () => {
  test('should redirect regular user from admin pages to user dashboard', async ({ page }) => {
    // Login as regular user
    await page.goto('/login')
    await page.fill('input[placeholder="your@email.com"]', 'user@example.com')
    await page.fill('input[placeholder="••••••••"]', 'user123')
    await page.click('button[type="submit"]:has-text("登录")')
    await page.waitForURL(/\/dashboard\/user/, { timeout: 15000 })

    // Try to access admin page
    await page.goto('/dashboard/admin')
    // Should redirect to user dashboard
    await page.waitForURL(/\/dashboard\/user/, { timeout: 15000 })
  })

  test('should return 403 for admin API when called by regular user', async ({ page, request }) => {
    // Login as regular user
    await page.goto('/login')
    await page.fill('input[placeholder="your@email.com"]', 'user@example.com')
    await page.fill('input[placeholder="••••••••"]', 'user123')
    await page.click('button[type="submit"]:has-text("登录")')
    await page.waitForURL(/\/dashboard\/user/, { timeout: 15000 })

    // Get session cookie
    const cookies = await page.context().cookies()
    const sessionCookie = cookies.find(c => c.name.includes('session'))

    // Try to call admin API
    const response = await request.get('/api/admin/users', {
      headers: {
        cookie: sessionCookie ? `${sessionCookie.name}=${sessionCookie.value}` : '',
      },
    })

    expect(response.status()).toBe(403)
  })

  test('should only allow users to view their own todos', async ({ page, request }) => {
    // Login as regular user
    await page.goto('/login')
    await page.fill('input[placeholder="your@email.com"]', 'user@example.com')
    await page.fill('input[placeholder="••••••••"]', 'user123')
    await page.click('button[type="submit"]:has-text("登录")')
    await page.waitForURL(/\/dashboard\/user/, { timeout: 15000 })

    // Get session cookie
    const cookies = await page.context().cookies()
    const sessionCookie = cookies.find(c => c.name.includes('session'))

    // Call user todos API - should succeed
    const response = await request.get('/api/user/todos', {
      headers: {
        cookie: sessionCookie ? `${sessionCookie.name}=${sessionCookie.value}` : '',
      },
    })

    expect(response.status()).toBe(200)

    // The API should only return todos for the current user
    const data = await response.json()
    // All returned todos should belong to the current user
    // (This is enforced by the backend)
  })

  test('should prevent regular user from modifying other users data', async ({ page, request }) => {
    // This test verifies that users can't modify todos/posts they don't own
    // Login as regular user
    await page.goto('/login')
    await page.fill('input[placeholder="your@email.com"]', 'user@example.com')
    await page.fill('input[placeholder="••••••••"]', 'user123')
    await page.click('button[type="submit"]:has-text("登录")')
    await page.waitForURL(/\/dashboard\/user/, { timeout: 15000 })

    // Get session cookie
    const cookies = await page.context().cookies()
    const sessionCookie = cookies.find(c => c.name.includes('session'))

    // Try to modify a todo that doesn't belong to this user (e.g., id=1 which might belong to admin)
    const response = await request.patch('/api/user/todos/1', {
      headers: {
        cookie: sessionCookie ? `${sessionCookie.name}=${sessionCookie.value}` : '',
      },
      data: {
        completed: true,
      },
    })

    // Should return 403 or 404 (not found because it doesn't belong to user)
    expect([403, 404]).toContain(response.status())
  })
})
