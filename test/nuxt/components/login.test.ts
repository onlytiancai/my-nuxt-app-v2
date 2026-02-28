/**
 * 登录页面组件测试
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import Login from '~/pages/login.vue'

describe('登录页面', () => {
  beforeEach(() => {
    // 重置所有 mocks
    registerEndpoint('/api/auth/login', {
      method: 'POST',
      handler: () => ({
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          role: 'user',
        },
      }),
    })
  })

  it('渲染登录表单', async () => {
    const component = await mountSuspended(Login)

    expect(component.html()).toContain('欢迎回来')
    expect(component.html()).toContain('登录到您的账户')
    expect(component.html()).toContain('邮箱')
    expect(component.html()).toContain('密码')
  })

  it('显示 OAuth 登录选项', async () => {
    const component = await mountSuspended(Login)

    expect(component.html()).toContain('GitHub')
    expect(component.html()).toContain('Google')
  })

  it('密码输入框初始类型为 password', async () => {
    const component = await mountSuspended(Login)

    const passwordInput = component.find('input[type="password"]')
    expect(passwordInput.exists()).toBe(true)
  })

  it('密码切换按钮存在', async () => {
    const component = await mountSuspended(Login)

    expect(component.html()).toContain('eye-off')
  })

  it('包含跳转到注册页面的链接', async () => {
    const component = await mountSuspended(Login)

    expect(component.html()).toContain('/register')
    expect(component.html()).toContain('立即注册')
  })

  it('包含跳转到首页的链接', async () => {
    const component = await mountSuspended(Login)

    expect(component.html()).toContain('/')
    expect(component.html()).toContain('返回首页')
  })

  it('表单数据绑定正确', async () => {
    const component = await mountSuspended(Login)

    const vm = component.vm
    expect(vm.form.email).toBe('')
    expect(vm.form.password).toBe('')
  })

  it('登录按钮文本正确', async () => {
    const component = await mountSuspended(Login)

    const button = component.find('button[type="submit"]')
    expect(button.text()).toContain('登录')
  })
})
