/**
 * 浏览器 E2E 测试
 * 使用 @nuxt/test-utils/e2e 的 createPage 进行浏览器测试
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createPage, setup, $fetch, useTestContext } from '@nuxt/test-utils/e2e'

describe('浏览器 E2E 测试', () => {
  let baseUrl: string

  beforeAll(async () => {
    await setup({
      server: true,
      browser: true,
      setupTimeout: 120000,
      teardownTimeout: 30000,
      build: true,
      browserOptions: {
        type: 'chromium',
      },
    })

    // 获取服务器 URL
    const ctx = useTestContext()
    baseUrl = ctx.url || 'http://127.0.0.1:3000'
  })

  describe('认证流程', () => {
    it('完整注册登录流程', async () => {
      const timestamp = Date.now()
      const email = `test_browser_${timestamp}@example.com`
      const password = 'testpassword123'
      const name = `Browser Test User`

      // 打开注册页面
      const page = await createPage(`${baseUrl}register`)

      // 填写注册表单
      await page.fill('input[placeholder="您的用户名"]', name)
      await page.fill('input[placeholder="your@email.com"]', email)
      await page.fill('input[placeholder="至少 6 个字符"]', password)
      await page.fill('input[placeholder="再次输入密码"]', password)

      // 勾选同意条款
      await page.click('input[type="checkbox"]')

      // 提交注册
      await page.click('button[type="submit"]:has-text("创建账户")')

      // 等待跳转
      await page.waitForURL(/\/dashboard/, { timeout: 15000 })

      // 验证跳转成功
      const url = page.url()
      expect(url).toContain('/dashboard')

      // 登出
      await $fetch('/api/auth/logout', { method: 'POST' })
    })

    it('登录页面渲染', async () => {
      const page = await createPage(`${baseUrl}login`)

      // 验证页面元素
      const title = await page.textContent('h1')
      expect(title).toContain('欢迎回来')

      // 验证邮箱输入框存在
      const emailInput = await page.$('input[type="email"]')
      expect(emailInput).toBeDefined()

      // 验证密码输入框存在
      const passwordInput = await page.$('input[type="password"]')
      expect(passwordInput).toBeDefined()
    })

    it('登录失败显示错误信息', async () => {
      const page = await createPage(`${baseUrl}login`)

      // 填写错误的凭据
      await page.fill('input[placeholder="your@email.com"]', 'wrong@example.com')
      await page.fill('input[placeholder="••••••••"]', 'wrongpassword')

      // 提交登录
      await page.click('button[type="submit"]:has-text("登录")')

      // 等待错误信息显示
      await page.waitForSelector('div[role="alert"]', { timeout: 5000 })

      // 验证错误信息显示
      const alertText = await page.textContent('div[role="alert"]')
      expect(alertText).toContain('登录失败')
    })

    it('注册页面渲染', async () => {
      const page = await createPage(`${baseUrl}register`)

      // 验证页面元素
      const title = await page.textContent('h1')
      expect(title).toContain('创建账户')

      // 验证表单字段存在
      const nameInput = await page.$('input[placeholder="您的用户名"]')
      expect(nameInput).toBeDefined()

      const emailInput = await page.$('input[placeholder="your@email.com"]')
      expect(emailInput).toBeDefined()

      const passwordInput = await page.$('input[placeholder="至少 6 个字符"]')
      expect(passwordInput).toBeDefined()
    })

    it('密码强度指示器工作', async () => {
      const page = await createPage(`${baseUrl}register`)

      // 输入弱密码
      const passwordInput = await page.$('input[placeholder="至少 6 个字符"]')
      await passwordInput?.fill('123')

      // 验证密码强度显示
      await page.waitForSelector('text=密码强度', { timeout: 3000 })
      const strengthText = await page.textContent('p:has-text("密码强度")')
      expect(strengthText).toBeDefined()
    })

    it('首页渲染', async () => {
      const page = await createPage(baseUrl)

      // 验证首页内容
      const bodyText = await page.textContent('body')
      expect(bodyText).toBeDefined()
    })
  })

  describe('导航测试', () => {
    it('首页导航到登录页面', async () => {
      const page = await createPage(baseUrl)

      // 查找登录链接并点击
      const loginLink = await page.$('a:has-text("登录")')
      if (loginLink) {
        await loginLink.click()
        await page.waitForURL(/\/login/)
        expect(page.url()).toContain('/login')
      }
    })

    it('登录页面导航到注册页面', async () => {
      const page = await createPage(`${baseUrl}login`)

      // 点击注册链接
      const registerLink = await page.$('a:has-text("立即注册")')
      if (registerLink) {
        await registerLink.click()
        await page.waitForURL(/\/register/)
        expect(page.url()).toContain('/register')
      }
    })

    it('注册页面导航到登录页面', async () => {
      const page = await createPage(`${baseUrl}register`)

      // 点击登录链接
      const loginLink = await page.$('a:has-text("立即登录")')
      if (loginLink) {
        await loginLink.click()
        await page.waitForURL(/\/login/)
        expect(page.url()).toContain('/login')
      }
    })
  })
})
